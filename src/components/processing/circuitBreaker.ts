
interface CircuitState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  successCount: number;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  halfOpenMaxAttempts: number;
}

export class CircuitBreaker {
  private circuits: Map<string, CircuitState> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig = {
    failureThreshold: 3,
    recoveryTimeout: 30000, // 30 seconds
    halfOpenMaxAttempts: 2
  }) {
    this.config = config;
  }

  async execute<T>(
    serviceKey: string, 
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const circuit = this.getCircuit(serviceKey);
    
    // Check if circuit is open and if we should try recovery
    if (circuit.state === 'OPEN') {
      if (Date.now() - circuit.lastFailureTime > this.config.recoveryTimeout) {
        circuit.state = 'HALF_OPEN';
        circuit.successCount = 0;
        console.log(`Circuit breaker ${serviceKey}: Moving to HALF_OPEN for recovery attempt`);
      } else {
        console.log(`Circuit breaker ${serviceKey}: OPEN - using fallback`);
        if (fallback) {
          return await fallback();
        }
        throw new Error(`Service ${serviceKey} is temporarily unavailable (circuit breaker OPEN)`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess(serviceKey);
      return result;
    } catch (error) {
      this.onFailure(serviceKey);
      
      // If we have a fallback and circuit is now open, use it
      if (circuit.state === 'OPEN' && fallback) {
        console.log(`Circuit breaker ${serviceKey}: Using fallback after failure`);
        return await fallback();
      }
      
      throw error;
    }
  }

  private getCircuit(serviceKey: string): CircuitState {
    if (!this.circuits.has(serviceKey)) {
      this.circuits.set(serviceKey, {
        state: 'CLOSED',
        failureCount: 0,
        lastFailureTime: 0,
        successCount: 0
      });
    }
    return this.circuits.get(serviceKey)!;
  }

  private onSuccess(serviceKey: string): void {
    const circuit = this.getCircuit(serviceKey);
    
    if (circuit.state === 'HALF_OPEN') {
      circuit.successCount++;
      if (circuit.successCount >= this.config.halfOpenMaxAttempts) {
        circuit.state = 'CLOSED';
        circuit.failureCount = 0;
        console.log(`Circuit breaker ${serviceKey}: Recovered - moving to CLOSED`);
      }
    } else if (circuit.state === 'CLOSED') {
      circuit.failureCount = Math.max(0, circuit.failureCount - 1);
    }
  }

  private onFailure(serviceKey: string): void {
    const circuit = this.getCircuit(serviceKey);
    circuit.failureCount++;
    circuit.lastFailureTime = Date.now();

    if (circuit.failureCount >= this.config.failureThreshold) {
      circuit.state = 'OPEN';
      console.log(`Circuit breaker ${serviceKey}: OPENED due to ${circuit.failureCount} failures`);
    }
  }

  getCircuitStatus(serviceKey: string): CircuitState & { healthScore: number } {
    const circuit = this.getCircuit(serviceKey);
    const healthScore = circuit.state === 'CLOSED' ? 1.0 : 
                       circuit.state === 'HALF_OPEN' ? 0.5 : 0.0;
    
    return { ...circuit, healthScore };
  }

  getAllCircuitStatus(): Record<string, CircuitState & { healthScore: number }> {
    const status: Record<string, CircuitState & { healthScore: number }> = {};
    for (const [key] of this.circuits) {
      status[key] = this.getCircuitStatus(key);
    }
    return status;
  }
}

export const systemCircuitBreaker = new CircuitBreaker();
