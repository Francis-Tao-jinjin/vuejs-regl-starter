import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import type { vec4 } from "gl-matrix";
import _REGL from "regl";
import vertShader from "./quad-shader.vert?raw";
import fragShader from "./quad-shader.frag?raw";

export type GLRectangleProps = {
  positions: number[],
  color: vec4,
  texture: _REGL.Texture2D|_REGL.Framebuffer2D,
  kernel: number[],
  kernelWeight: number,
}

export default function glRectangle(regl: REGL, loader: REGLLoader) {

  const prop = safeProp<GLRectangleProps>(regl);
  return regl({
    vert: vertShader,
    frag: fragShader,
    attributes:{
      a_position: prop('positions').prop,
    },
    uniforms: {
      u_color: prop('color').prop,
      u_texture: prop('texture').prop,
      u_kernel: prop('kernel').prop,
      u_kernelWeight: prop('kernelWeight').prop,
    },
    count: 6,
    depth: { enable: false },
  });
}