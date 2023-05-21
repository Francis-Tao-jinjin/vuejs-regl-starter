import { type REGL,  type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import _REGL from 'regl';
import type { Camera } from "../camera";
import type { Mesh } from "../mesh";
// import glOutPutBuffer from "./outputGBuffer";
// import glPointLight, { batchDrawPointLights } from "./pointLight";
// import gldirectLight from "./directLight";

import glTriangle from "./triangle/triangle";
import glRectangle, { type GLRectangleProps} from "./quad/rect";
import { gen2DRectPositions } from "@/utils/gen-rect-pos";
import { ConvolutionKernel, KernelNames, type KernelName, ConvolutionKernelWeights } from "@/utils/convmatrix";

export type GLMainProps = {
  camera: Camera;
  fbo: _REGL.Framebuffer2D;
  // bunnyMesh: Mesh,
  // planeMesh: Mesh,
  // bunnyConfig: any,
  // planeConfig: any,
  texture: _REGL.Texture2D,
  convKernel: number|KernelName;
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
        u_resolution: [regl.context('viewportWidth'), regl.context('viewportHeight')],
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

  const rectColor = [Math.random(), Math.random(), Math.random(), 1];
  
  function drawMain(props: GLMainProps) {

    const kernel = typeof props.convKernel === 'string' ? ConvolutionKernel[props.convKernel] : ConvolutionKernel[KernelNames[props.convKernel]];
    let kernelWeight = kernel.reduce((acc, cur) => acc + cur, 0);
    kernelWeight = kernelWeight <= 0 ? 1 : kernelWeight;

    setup(props, ({tick}) => {
      regl.clear({
        color: [0, 150/255, 136/255, 1],
        // color: [0, 0, 0, 255],
        depth: 1,
      });
      drawRect({
        texture: props.texture,
        positions: gen2DRectPositions(0, 0, 1, 1),
        color: rectColor,
        kernel: kernel,
        kernelWeight: kernelWeight,
      } as GLRectangleProps);
    });
  }

  return drawMain;
}

export default main;