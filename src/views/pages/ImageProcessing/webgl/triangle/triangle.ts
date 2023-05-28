import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import type { vec3, vec4 } from "gl-matrix";
import _REGL from "regl";
import vertShader from "./triangle-shader.vert?raw";
import fragShader from "./triangle-shader.frag?raw";

type GLTriangleProps = {
  positions: number[],
  color: vec4,
}

export default function glTriangle(regl: REGL, loader: REGLLoader) {

  const prop = safeProp<GLTriangleProps>(regl);
  return regl({
    vert: vertShader,
    frag: fragShader,
    attributes:{
      a_position: prop('positions').prop,
    },
    uniforms: {
      u_color: prop('color').prop,
    },
    count: 3,
    depth: { enable: false },
  });
}