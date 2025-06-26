
import { useState, useEffect } from "react";
import { OutputType } from "@/types/outputTypes";

export const useOutputType = (defaultType: OutputType = 'practical') => {
  const [outputType, setOutputType] = useState<OutputType>(defaultType);

  // Load saved outputType on mount
  useEffect(() => {
    const savedOutputType = localStorage.getItem('genius-machine-output-type') as OutputType;
    if (savedOutputType) {
      setOutputType(savedOutputType);
    }
  }, []);

  const handleOutputTypeChange = (newType: OutputType) => {
    console.log('Output type changed to:', newType);
    setOutputType(newType);
    // Save to localStorage so Config page can read it
    localStorage.setItem('genius-machine-output-type', newType);
  };

  return {
    outputType,
    setOutputType: handleOutputTypeChange
  };
};
