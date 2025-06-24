
import { useState } from "react";
import { OutputType } from "@/types/outputTypes";

export const useOutputType = (defaultType: OutputType = 'practical') => {
  const [outputType, setOutputType] = useState<OutputType>(defaultType);

  const handleOutputTypeChange = (newType: OutputType) => {
    console.log('Output type changed to:', newType);
    setOutputType(newType);
  };

  return {
    outputType,
    setOutputType: handleOutputTypeChange
  };
};
