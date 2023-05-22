import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import type { vec4 } from "gl-matrix";
import _REGL from "regl";
import vertShader from "./shader.vert?raw";
import fragShader from "./shader.frag?raw";

export type GLImgProcessProps = {
  flipY?: number,
  fullscreen?: number,
  color: vec4,
  positions: number[],
  texture: _REGL.Texture2D|_REGL.Framebuffer2D,
  kernel: number[],
  kernelWeight: number,
}

export default function glImgProcess(regl: REGL, loader: REGLLoader) {

  const prop = safeProp<GLImgProcessProps>(regl);
  return regl({
    vert: vertShader,
    frag: fragShader,
    attributes:{
      a_position: prop('positions').prop,
    },
    uniforms: {
      u_fullscreen: prop('fullscreen').prop ?? 0,
      u_flipY: prop('flipY').prop ?? 1,
      u_color: prop('color').prop,
      u_texture: prop('texture').prop,
      u_kernel: prop('kernel').prop,
      u_kernelWeight: prop('kernelWeight').prop,
    },
    count: 6,
    depth: { enable: false },
  });
}