
import { CompressionFormats } from './compression/types.ts';
import { processCompressionWithOpenAI } from './compression/compressionProcessor.ts';

export { CompressionFormats };

export async function generateCompressionFormats(
  insight: string,
  synthesisResult: any,
  originalQuestion: string,
  compressionSettings?: any,
  outputType?: string
): Promise<CompressionFormats> {
  return await processCompressionWithOpenAI(insight, originalQuestion, compressionSettings, outputType);
}
