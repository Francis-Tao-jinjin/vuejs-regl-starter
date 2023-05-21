import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import type { vec4 } from "gl-matrix";
import _REGL from "regl";
import vertShader from "./triangle-shader.vert?raw";
import fragShader from "./triangle-shader.frag?raw";

export type GLRectangleProps = {
  positions: number[],
  color: vec4,
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
    },
    count: 6,
    depth: { enable: false },
  });
}