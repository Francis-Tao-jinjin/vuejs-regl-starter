import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import { mat4, type vec3 } from "gl-matrix";
import _REGL from "regl";
import primitiveSphere from 'primitive-sphere';

export type GLPointLightProps = {
  fbo: _REGL.Framebuffer2D,
  ambientLight: vec3,
  diffuseLight: vec3,
  translate: vec3,
  radius: number,
  
  positions: vec3[],
  normals: vec3[],
  cells: vec3[],
}

const sphereMesh = primitiveSphere(1, { segments: 16 });

export function batchDrawPointLights(tick: number, props: {fbo: _REGL.Framebuffer2D}, drawCmd: _REGL.DrawCommand<_REGL.DefaultContext, {}>) {
  //
  // First we place out the point lights
  //
  const pointLights: any = [];

  // There's lots of magic numbers below, and they were simply chosen because
  // they make it looks good. There's no deeper meaning behind them.
  function makeRose (args: any) {
    var N = args.N // the number of points.
    var n = args.n // See the wikipedia article for a definition of n and d.
    var d = args.d // See the wikipedia article for a definition of n and d.
    var v = args.v // how fast the points traverse on the curve.
    var R = args.R // the radius of the rose curve.
    var s = args.s // use this parameter to spread out the points on the rose curve.
    var seed = args.seed // random seed
    var i = 0

    for (var j = 0; j < N; ++j) {
      var theta = s * 2 * Math.PI * i * (1.0 / (N))
      theta += tick * 0.01

      i = j + seed

      var a = 0.8

      var r = ((Math.abs(23232 * i * i + 100212) % 255) / 255) * 0.8452
      var g = ((Math.abs(32278 * i + 213) % 255) / 255) * 0.8523
      var b = ((Math.abs(3112 * i * i * i + 2137 + i) % 255) / 255) * 0.8523

      var rad = ((Math.abs(3112 * i * i * i + 2137 + i * i + 232 * i) % 255) / 255) * 0.9 * 30.0 + 30.0
      // See the wikipedia article for a definition of n and d.
      var k = n / d
      pointLights.push({
        radius: rad,
        translate: [R * Math.cos(k * theta * v) * Math.cos(theta * v), 20.9, R * Math.cos(k * theta * v) * Math.sin(theta * v)],
        ambientLight: [a * r, a * g, a * b],
        diffuseLight: [r, g, b],
        fbo: props.fbo,
      })
    }
  }

  // We make the point lights move on rose curves. This looks rather cool.
  // https://en.wikipedia.org/wiki/Rose_(mathematics)
  makeRose({ N: 1, n: 3, d: 1, v: 0.4, R: 300, seed: 0, s: 1 })
  // makeRose({ N: 20, n: 7, d: 4, v: 0.6, R: 350, seed: 3000, s: 1 })
  // makeRose({ N: 20, n: 10, d: 6, v: 0.7, R: 350, seed: 30000, s: 1 })
  // makeRose({ N: 40, n: 7, d: 9, v: 0.7, R: 450, seed: 60000, s: 10 })

  //
  // Next, we draw all point lights as spheres.
  //
  drawCmd(pointLights)
}

export default function glPointLight (regl: REGL, loader: REGLLoader) {
  const prop = safeProp<GLPointLightProps>(regl);
  return regl({
    frag: `
    precision mediump float;
    varying vec2 uv;
    varying vec4 vPosition;

    uniform vec3 ambientLight;
    uniform vec3 diffuseLight;

    uniform float lightRadius;
    uniform vec3 lightPosition;

    uniform sampler2D albedoTex, normalTex, positionTex;

    void main() {
      // get screen-space position of light sphere
      // (remember to do perspective division.)
      vec2 uv = (vPosition.xy / vPosition.w ) * 0.5 + 0.5;
      
      vec3 albedo = texture2D(albedoTex, uv).xyz;
      vec3 n = texture2D(normalTex, uv).xyz;
      vec4 position = texture2D(positionTex, uv);

      vec3 toLightVector = position.xyz - lightPosition;
      float lightDist = length(toLightVector);
      vec3 l = -toLightVector / lightDist;

      // fake z-test
      float ztest = step(0.0, lightRadius - lightDist);

      float attenuation = (1.0 - lightDist / lightRadius);

      vec3 ambient = ambientLight * albedo;
      vec3 diffuse = diffuseLight * albedo * clamp(dot(n, l) , 0.0, 1.0 );
      
      gl_FragColor = vec4((ambient + diffuse) * ztest * attenuation, 1.0);
    }
    `,
    vert: `
    precision mediump float;
    uniform mat4 projection, view, model;
    attribute vec3 position;

    varying vec4 vPosition;

    void main() {
      vec4 pos = projection * view * model * vec4(position, 1);
      vPosition = pos;
      gl_Position = pos;
    }
    `,
    uniforms: {
      albedoTex: prop('fbo')('color' as any)('0').prop,
      normalTex:  prop('fbo')('color' as any)('1').prop,
      positionTex: prop('fbo')('color' as any)('2').prop,
      ambientLight: prop('ambientLight').prop,
      diffuseLight: prop('diffuseLight').prop,
      lightPosition: prop('translate').prop,
      lightRadius: prop('radius').prop,
      model: (_, props: GLPointLightProps, batchId) => {
        const m = mat4.create();
        mat4.translate(m, m, props.translate)
        var r = props.radius
        mat4.scale(m, m, [r, r, r])
        return m;
      },
    },
    attributes: {
      position: sphereMesh.positions,
      normal: sphereMesh.normals,
    },
    elements: sphereMesh.cells,
    depth: { enable: false },
    blend: {
      enable: true,
      func: {
        src: 'one',
        dst: 'one'
      }
    },
    cull: {
      enable: true
    },
    // frontFace: 'cw',
  });
}