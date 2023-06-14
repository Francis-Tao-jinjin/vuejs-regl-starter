import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import type { vec2, vec4, mat3 } from "gl-matrix";
import _REGL from "regl";
import vertShader from "./rectangle-shader.vert?raw";
import fragShader from "./rectangle-shader.frag?raw";

export type GLRectangleProps = {
  positions: number[],
  color: vec4,
  count: number,
  translation: vec2,
  rotation: vec2,
  scale: vec2,
  transformMat: mat3,
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
      u_translation: prop('translation').prop,
      u_rotation: prop('rotation').prop,
      u_scale: prop('scale').prop,
      u_matrix: prop('transformMat').prop,
    },
    count: prop('count').prop,
    depth: { enable: false },
  });
}