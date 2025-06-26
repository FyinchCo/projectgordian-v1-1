
export const formatActionPlan = (text: string): string => {
  // Convert paragraphs to bullet points and improve formatting
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  let formattedPlan = '';
  let currentSection = '';
  let inList = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if it's a section header (contains numbers like 1., 2., etc. or keywords)
    if (trimmedLine.match(/^\d+\./) || 
        trimmedLine.toLowerCase().includes('step') ||
        trimmedLine.toLowerCase().includes('phase') ||
        trimmedLine.toLowerCase().includes('stage')) {
      
      if (inList) {
        formattedPlan += '\n';
        inList = false;
      }
      formattedPlan += `\n**${trimmedLine}**\n`;
      currentSection = trimmedLine.toLowerCase();
      
    } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
      // Already a bullet point
      formattedPlan += `${trimmedLine}\n`;
      inList = true;
      
    } else if (trimmedLine.length > 20 && !trimmedLine.endsWith(':')) {
      // Convert regular sentences to bullet points
      formattedPlan += `${trimmedLine}\n\n`;
      
    } else if (trimmedLine.endsWith(':')) {
      // Sub-header
      formattedPlan += `\n*${trimmedLine}*\n`;
      
    } else if (trimmedLine.length > 0) {
      formattedPlan += `${trimmedLine}\n`;
    }
  }
  
  return formattedPlan.trim();
};
