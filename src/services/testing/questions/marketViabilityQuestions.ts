
import { TestQuestion } from '../types';

// Real-world questions that actual customers would pay to solve
export const marketViabilityQuestions: TestQuestion[] = [
  // BUSINESS STRATEGY (High-stakes decisions)
  {
    id: 'market-biz-01',
    question: 'Our SaaS company is losing customers to cheaper competitors, but our product is technically superior. Should we cut prices, double down on premium positioning, or pivot our value proposition entirely?',
    domain: 'business-strategy',
    expectedOutcomes: ['strategic-clarity', 'competitive-positioning', 'pricing-strategy'],
    difficulty: 'expert',
    category: 'business',
    marketSegment: 'Business Strategy',
    customerValue: 'High',
    typicalCost: '$5000-25000',
    realWorldContext: 'Executive strategy decision with $10M+ revenue impact'
  },
  
  {
    id: 'market-biz-02', 
    question: 'We have $2M to invest in either AI automation, international expansion, or acquiring a smaller competitor. Each option has compelling arguments. How do we make this decision systematically?',
    domain: 'capital-allocation',
    expectedOutcomes: ['investment-framework', 'risk-assessment', 'decision-criteria'],
    difficulty: 'expert',
    category: 'business',
    marketSegment: 'Business Strategy',
    customerValue: 'High',
    typicalCost: '$10000-50000',
    realWorldContext: 'C-suite capital allocation with major strategic implications'
  },

  // PRODUCT DEVELOPMENT (Innovation challenges)
  {
    id: 'market-prod-01',
    question: 'Our mobile app has great features but terrible user retention. Users love it initially but stop using it after 2 weeks. We have conflicting data on why this happens. What is the real problem and how do we fix it?',
    domain: 'product-optimization',
    expectedOutcomes: ['user-behavior-insights', 'retention-strategy', 'product-roadmap'],
    difficulty: 'hard',
    category: 'business',
    marketSegment: 'Product Development',
    customerValue: 'Medium-High',
    typicalCost: '$3000-15000',
    realWorldContext: 'Product team facing retention crisis affecting growth metrics'
  },

  {
    id: 'market-prod-02',
    question: 'We need to choose between building an AI chatbot, a recommendation engine, or automated customer segmentation as our next major feature. Our engineering team is split, our sales team wants all three, and our data suggests different priorities. How do we decide?',
    domain: 'feature-prioritization',
    expectedOutcomes: ['feature-ranking', 'roi-analysis', 'development-strategy'],
    difficulty: 'hard',
    category: 'technical',
    marketSegment: 'Product Development',
    customerValue: 'Medium-High',
    typicalCost: '$2000-10000',
    realWorldContext: 'Product roadmap decision affecting 6-month development cycle'
  },

  // PERSONAL DECISIONS (Life-changing choices)
  {
    id: 'market-pers-01',
    question: 'I have a stable $150K corporate job but a startup opportunity that could be worth millions or nothing. I have a mortgage, two kids, and my spouse is nervous. The startup timeline conflicts with my daughter\'s senior year. How do I make this decision?',
    domain: 'life-strategy',
    expectedOutcomes: ['decision-framework', 'risk-analysis', 'family-impact-assessment'],
    difficulty: 'expert',
    category: 'philosophical',
    marketSegment: 'Personal Decisions',
    customerValue: 'High',
    typicalCost: '$500-2500',
    realWorldContext: 'Life-altering career decision affecting family stability'
  },

  {
    id: 'market-pers-02',
    question: 'I\'m 45, burned out in tech, and want to become a therapist. This means 3-4 years of school, significant debt, and starting over financially. My family thinks I\'m having a midlife crisis. Is this wise or foolish?',
    domain: 'career-transition',
    expectedOutcomes: ['career-analysis', 'financial-planning', 'life-fulfillment-strategy'],
    difficulty: 'hard',
    category: 'philosophical',
    marketSegment: 'Personal Decisions',
    customerValue: 'Medium-High',
    typicalCost: '$300-1500',
    realWorldContext: 'Major career pivot with financial and family implications'
  },

  // RESEARCH & ANALYSIS (Academic/Professional)
  {
    id: 'market-research-01',
    question: 'I\'m researching the societal impact of remote work on urban development patterns. The data is contradictory - some cities are thriving, others declining, and the causes seem multifaceted. How do I synthesize this into a coherent analysis?',
    domain: 'research-synthesis',
    expectedOutcomes: ['pattern-identification', 'causal-analysis', 'research-framework'],
    difficulty: 'expert',
    category: 'social',
    marketSegment: 'Research & Analysis',
    customerValue: 'Medium',
    typicalCost: '$1000-5000',
    realWorldContext: 'Academic/policy research with publication implications'
  },

  {
    id: 'market-research-02',
    question: 'We\'re analyzing customer churn across 50+ variables in our dataset. Traditional analysis shows correlations but not causation. Machine learning models are accurate but not interpretable. How do we find the real drivers of churn?',
    domain: 'data-analysis',
    expectedOutcomes: ['causal-inference', 'interpretable-insights', 'actionable-recommendations'],
    difficulty: 'expert',
    category: 'technical',
    marketSegment: 'Research & Analysis',
    customerValue: 'High',
    typicalCost: '$2000-12000',
    realWorldContext: 'Business intelligence analysis for retention strategy'
  },

  // INVESTMENT DECISIONS (Financial complexity)
  {
    id: 'market-invest-01',
    question: 'I have $500K to invest. Traditional advice says index funds, but inflation is high, markets are volatile, real estate seems overpriced, and crypto is unpredictable. I need growth but can\'t afford major losses. What\'s the right strategy?',
    domain: 'investment-strategy',
    expectedOutcomes: ['portfolio-optimization', 'risk-management', 'market-analysis'],
    difficulty: 'expert',
    category: 'business',
    marketSegment: 'Investment Decisions',
    customerValue: 'High',
    typicalCost: '$1000-5000',
    realWorldContext: 'Personal wealth management with significant financial stakes'
  },

  {
    id: 'market-invest-02',
    question: 'Our fund is considering a $10M investment in a promising but risky biotech startup. The science is solid but regulatory approval is uncertain, the team is inexperienced, and competitors are emerging. How do we evaluate this opportunity?',
    domain: 'venture-capital',
    expectedOutcomes: ['investment-analysis', 'due-diligence-framework', 'risk-assessment'],
    difficulty: 'expert',
    category: 'business',
    marketSegment: 'Investment Decisions',
    customerValue: 'High',
    typicalCost: '$5000-25000',
    realWorldContext: 'Institutional investment decision with fiduciary responsibility'
  },

  // CRISIS MANAGEMENT (High-pressure situations)
  {
    id: 'market-crisis-01',
    question: 'Our company just discovered a data breach affecting 100K customers. Legal wants minimal disclosure, PR wants transparency, engineering needs time to fix it, and customers are already asking questions on social media. What do we do in the next 24 hours?',
    domain: 'crisis-management',
    expectedOutcomes: ['crisis-response-plan', 'stakeholder-communication', 'damage-mitigation'],
    difficulty: 'expert',
    category: 'business',
    marketSegment: 'Crisis Management',
    customerValue: 'Critical',
    typicalCost: '$2000-15000',
    realWorldContext: 'Active crisis requiring immediate strategic response'
  }
];

// Helper function to get questions by segment
export const getQuestionsBySegment = (segment: string): TestQuestion[] => {
  return marketViabilityQuestions.filter(q => q.marketSegment === segment);
};

// Helper function to get high-value questions (typically cost $5K+)
export const getHighValueQuestions = (): TestQuestion[] => {
  return marketViabilityQuestions.filter(q => 
    q.typicalCost && parseInt(q.typicalCost.split('-')[1].replace(/\D/g, '')) >= 5000
  );
};

export const getMarketViabilityStats = () => ({
  totalQuestions: marketViabilityQuestions.length,
  segments: [...new Set(marketViabilityQuestions.map(q => q.marketSegment))],
  highValueCount: getHighValueQuestions().length,
  averageValue: 'Medium-High',
  realWorldApplicability: '100%'
});
