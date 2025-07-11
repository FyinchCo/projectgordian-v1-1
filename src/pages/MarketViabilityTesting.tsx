
import { MarketViabilityTester } from "@/components/testing/MarketViabilityTester";
import { AdminGate } from "@/components/AdminGate";

const MarketViabilityTesting = () => {
  return (
    <AdminGate>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Market Viability Testing
            </h1>
            <p className="text-gray-600">
              Validate AI performance on real-world, high-value questions that customers pay to solve
            </p>
          </div>
          
          <MarketViabilityTester />
        </div>
      </div>
    </AdminGate>
  );
};

export default MarketViabilityTesting;
