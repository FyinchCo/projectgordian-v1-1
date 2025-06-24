
export interface DomainAnalysis {
  domainType: string;
  isPhilosophical: boolean;
  isBusiness: boolean;
  isTechnical: boolean;
  isCreative: boolean;
  isSocial: boolean;
  isComplex: boolean;
  complexityScore: number;
  controversyPotential: number;
}

export const analyzeDomain = (question: string): DomainAnalysis => {
  const lowerQ = question.toLowerCase();
  
  const isPhilosophical = /why|meaning|purpose|existence|consciousness|reality|truth|belief/.test(lowerQ);
  const isBusiness = /business|profit|market|strategy|company|revenue|cost|customer/.test(lowerQ);
  const isTechnical = /code|software|algorithm|system|technical|programming|data/.test(lowerQ);
  const isCreative = /creative|art|design|innovation|imagine|vision|dream/.test(lowerQ);
  const isSocial = /society|people|community|social|culture|relationship|group/.test(lowerQ);
  const isComplex = question.length > 200 || /complex|multiple|various|several|many|different/.test(lowerQ);
  
  let domainType = "General";
  
  if (isPhilosophical) {
    domainType = "Philosophy";
  } else if (isBusiness) {
    domainType = "Business";
  } else if (isTechnical) {
    domainType = "Technical";
  } else if (isCreative) {
    domainType = "Creative";
  } else if (isSocial) {
    domainType = "Social";
  }
  
  const complexityScore = isComplex ? 8 : 5;
  const controversyPotential = isPhilosophical || isSocial ? 7 : 4;
  
  return {
    domainType,
    isPhilosophical,
    isBusiness,
    isTechnical,
    isCreative,
    isSocial,
    isComplex,
    complexityScore,
    controversyPotential
  };
};
