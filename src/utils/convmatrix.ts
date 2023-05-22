export const ConvolutionKernel = {
  Identity: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  EdgeDetection: [1, 0, -1, 0, 0, 0, -1, 0, 1],
  Sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  BoxBlur: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  GaussianBlur: [1, 2, 1, 2, 4, 2, 1, 2, 1],
  Unsharpen: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
  Emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
  EdgeEnhance: [0, 0, 0, -1, 1, 0, 0, 0, 0],
  EdgeEnhanceMore: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  SobelHorizontal: [1, 0, -1, 2, 0, -2, 1, 0, -1],
  SobelVertical: [1, 2, 1, 0, 0, 0, -1, -2, -1],
  PrewittHorizontal: [1, 0, -1, 1, 0, -1, 1, 0, -1],
  PrewittVertical: [1, 1, 1, 0, 0, 0, -1, -1, -1],
  Laplacian: [0, 1, 0, 1, -4, 1, 0, 1, 0],
  Laplacian3: [1, 1, 1, 1, -8, 1, 1, 1, 1],
  Laplacian3OfGaussian: [0, 1, 1, 2, 4, 2, 1, 1, 0],
}

export const KernelNames = Object.keys(ConvolutionKernel) as (keyof typeof ConvolutionKernel)[];
export type KernelName = typeof KernelNames[number];

function calcKernelWeight(kernel: number[]): number {
  const val = kernel.reduce((prev, curr) => prev + curr, 0);
  return val <= 0 ? 1 : val;
}

function computeKernelWeight(kernel: number[]) {
  const weight = kernel.reduce(function(prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

export const ConvolutionKernelWeights: Record<KernelName, number> = {
  Identity: computeKernelWeight(ConvolutionKernel.Identity),
  EdgeDetection: computeKernelWeight(ConvolutionKernel.EdgeDetection),
  Sharpen: computeKernelWeight(ConvolutionKernel.Sharpen),
  BoxBlur: computeKernelWeight(ConvolutionKernel.BoxBlur),
  GaussianBlur: computeKernelWeight(ConvolutionKernel.GaussianBlur),
  Unsharpen: computeKernelWeight(ConvolutionKernel.Unsharpen),
  Emboss: computeKernelWeight(ConvolutionKernel.Emboss),
  EdgeEnhance: computeKernelWeight(ConvolutionKernel.EdgeEnhance),
  EdgeEnhanceMore: computeKernelWeight(ConvolutionKernel.EdgeEnhanceMore),
  SobelHorizontal: computeKernelWeight(ConvolutionKernel.SobelHorizontal),
  SobelVertical: computeKernelWeight(ConvolutionKernel.SobelVertical),
  PrewittHorizontal: computeKernelWeight(ConvolutionKernel.PrewittHorizontal),
  PrewittVertical: computeKernelWeight(ConvolutionKernel.PrewittVertical),
  Laplacian: computeKernelWeight(ConvolutionKernel.Laplacian),
  Laplacian3: computeKernelWeight(ConvolutionKernel.Laplacian3),
  Laplacian3OfGaussian: computeKernelWeight(ConvolutionKernel.Laplacian3OfGaussian),
}

