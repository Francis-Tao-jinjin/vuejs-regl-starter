import { type Regl } from 'regl';

let reglInstance: Regl | null = null; 
export function setReglInstance(regl: Regl) {
  reglInstance = regl;
}

export function getReglInstance(): Regl {
  return reglInstance as Regl;
}