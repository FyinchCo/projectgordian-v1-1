
export const updateVisualProgress = async (
  startLayer: number,
  endLayer: number,
  onCurrentLayerChange: (layer: number) => void
): Promise<void> => {
  for (let layer = startLayer; layer <= endLayer; layer++) {
    onCurrentLayerChange(layer);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

export const createProgressToast = (
  chunkIndex: number,
  totalChunks: number,
  startLayer: number,
  endLayer: number
) => ({
  title: `Progress: ${chunkIndex + 1}/${totalChunks} Complete`,
  description: `Processed layers ${startLayer}-${endLayer}. Continuing with next chunk...`,
  variant: "default" as const,
});
