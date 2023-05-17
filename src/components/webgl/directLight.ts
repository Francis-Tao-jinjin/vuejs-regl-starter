import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import type { vec3 } from "gl-matrix";
import _REGL from "regl";

export type GLDirectLightProps = {
  fbo: _REGL.Framebuffer2D,
  ambientLight: vec3,
  diffuseLight: vec3,
}

export default function glDirectLight (regl: REGL, loader: REGLLoader) {
  const prop = safeProp<GLDirectLightProps>(regl);
  return regl({
    frag: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D albedoTex, normalTex;

    uniform vec3 ambientLight;
    uniform vec3 diffuseLight;
    uniform vec3 lightDir;

    void main() {
      vec3 albedo = texture2D(albedoTex, uv).xyz;
      vec3 n = texture2D(normalTex, uv).xyz;

      vec3 ambient = ambientLight * albedo;
      vec3 diffuse = diffuseLight * albedo * clamp(dot(n, lightDir) , 0.0, 1.0 );

      gl_FragColor = vec4(ambient + diffuse, 1.0);
    }
    `,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = 0.5 * (position + 1.0);
      gl_Position = vec4(position, 0, 1);
    }
    `,
    attributes: {
      // We implement the full-screen pass by using a full-screen triangle
      position: [ -4, -4, 4, -4, 0, 4 ]
    },
    uniforms: {
      albedoTex: prop('fbo')('color' as any)('0').prop,
      normalTex:  prop('fbo')('color' as any)('1').prop,
      ambientLight:  [0.3, 0.3, 0.3],
      diffuseLight: [0.7, 0.7, 0.7],
      lightDir: [0.39, 0.87, 0.29],
    },
    depth: { enable: false },
    count: 3,
  });
}