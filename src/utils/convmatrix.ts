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
  LaplacianOfGaussian: [0, 0, -1, 0, 0, -1, -2, -1, -1],
  Laplacian3: [1, 1, 1, 1, -8, 1, 1, 1, 1],
  Laplacian3OfGaussian: [0, 1, 1, 2, 4, 2, 1, 1, 0],
}

export const KernelNames = Object.keys(ConvolutionKernel) as (keyof typeof ConvolutionKernel)[];
export type KernelName = typeof KernelNames[number];

export const ConvolutionKernelWeights: Record<KernelName, number> = {
  Identity: 1,
  EdgeDetection: 1,
  Sharpen: 1,
  BoxBlur: 1 / 9,
  GaussianBlur: 1 / 16,
  Unsharpen: 1 / 9,
  Emboss: 1,
  EdgeEnhance: 1,
  EdgeEnhanceMore: 1,
  SobelHorizontal: 1,
  SobelVertical: 1,
  PrewittHorizontal: 1,
  PrewittVertical: 1,
  Laplacian: 1,
  LaplacianOfGaussian: 1,
  Laplacian3: 1,
  Laplacian3OfGaussian: 1,
}

