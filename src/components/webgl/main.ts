import { type REGL,  type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import _REGL from 'regl';
import type { Camera } from "../camera";
import type { Mesh } from "../mesh";
// import glOutPutBuffer from "./outputGBuffer";
// import glPointLight, { batchDrawPointLights } from "./pointLight";
// import gldirectLight from "./directLight";

import glTriangle from "./triangle/triangle";
import glRectangle, { type GLRectangleProps} from "./triangle/rect";
import { gen2DRectPositions } from "@/utils/gen-rect-pos";

export type GLMainProps = {
  camera: Camera;
  fbo: _REGL.Framebuffer2D;
  bunnyMesh: Mesh,
  planeMesh: Mesh,
  bunnyConfig: any,
  planeConfig: any,
};

function main(regl: REGL, loader: REGLLoader) {

  // const drawOutputGbuffer = loader.require(glOutPutBuffer);
  // const drawPointLight = loader.require(glPointLight);
  // const drawDirectLight = loader.require(gldirectLight);

  const drawTriangle = loader.require(glTriangle);
  const drawRect = loader.require(glRectangle);

  const renderProps = safeProp<GLMainProps>(regl);
  const setup = <(props: any, body:(ctx: _REGL.DefaultContext) => void) => void>loader.cache(
    'main:setup',
    {
      uniforms: {
        eye: renderProps('camera')('eye').prop,
        cameraTarget: renderProps('camera')('target').prop,
        view: renderProps('camera')('view').prop,
        fixedView: renderProps('camera')('fixedView').prop,
        projection: renderProps('camera')('projection').prop,
        invView: renderProps('camera')('invView').prop,
        invProjection: renderProps('camera')('invProjection').prop,
        invViewProj: renderProps('camera')('invViewProjection').prop,
      }
    },
    true
  );

  // function drawMain(props: GLMainProps) {
  //   setup(props, (ctx) => {
  //     drawOutputGbuffer({fbo: props.fbo}, () => {
  //       regl.clear({
  //         // color: [0, 150/255, 136/255, 1],
  //         color: [0, 0, 0, 255],
  //         depth: 1,
  //       });

  //       props.bunnyMesh.draw(props.bunnyConfig);
  //       props.planeMesh.draw(props.planeConfig);
  //     })
  //     // console.log(ctx);
  //     drawDirectLight({fbo: props.fbo});
  //     batchDrawPointLights(ctx.tick, {fbo: props.fbo}, drawPointLight);
  //   });
  // }

  const rectConfig = [] as GLRectangleProps[];
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const w = Math.random() * 0.3;
    const h = Math.random() * 0.3;
    rectConfig.push({
      positions: gen2DRectPositions(x, y, w, h),
      color: [Math.random(), Math.random(), Math.random(), 1],
    });
  }
  
  function drawMain(props: GLMainProps) {
    setup(props, ({tick}) => {
      regl.clear({
        color: [0, 150/255, 136/255, 1],
        // color: [0, 0, 0, 255],
        depth: 1,
      });
      drawTriangle([{
        color: [1, 0, 0, 1],
        positions: [ -1, -1, 1, -1, -1, 1 ].map((v: number) => (Math.sin(tick * 0.01) * 0.5 + 0.5) * v),
      }, {
        color: [0.9, 0, 0.6, 1],
        positions: [ -1, -1, 1, -1, 0, 1 ].map((v: number) => (Math.sin(tick * 0.015) * 0.5 + 0.5) * v),
      }]);
      drawRect(rectConfig);
    });
  }

  return drawMain;
}

export default main;