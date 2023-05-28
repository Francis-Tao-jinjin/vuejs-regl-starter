import { type REGL,  type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import _REGL from 'regl';
import type { Camera } from "../../../../components/camera";
import type { Mesh } from "../../../../components/mesh";

import glTriangle from "./triangle/triangle";
import glRectangle, { type GLRectangleProps} from "./quad/rect";
import glImgProcess, { type GLImgProcessProps } from './pingPong/img-process';

import { gen2DRectPositions } from "@/utils/gen-rect-pos";
import { ConvolutionKernel, KernelNames, type KernelName, ConvolutionKernelWeights } from "@/utils/convmatrix";
import type { vec4 } from "gl-matrix";

export type GLMainProps = {
  camera: Camera;
  // fbo: _REGL.Framebuffer2D;
  texture: _REGL.Texture2D,
  convKernel: KernelName;
  convKernelArr: KernelName[];
  fbos: _REGL.Framebuffer2D[];
};

function main(regl: REGL, loader: REGLLoader) {

  // const drawOutputGbuffer = loader.require(glOutPutBuffer);
  // const drawPointLight = loader.require(glPointLight);
  // const drawDirectLight = loader.require(gldirectLight);

  const drawTriangle = loader.require(glTriangle);
  const drawRect = loader.require(glRectangle);
  const darwImgProcess = loader.require(glImgProcess);

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

  const rectColor = [Math.random(), Math.random(), Math.random(), 1] as vec4;
  const rectPos = gen2DRectPositions(0, 0, 1, 1);

  function drawMain(props: GLMainProps) {

    const kernel = ConvolutionKernel[props.convKernel];
    const kernelWeight = ConvolutionKernelWeights[props.convKernel];

    const processKernels = props.convKernelArr.map((kernelName) => ConvolutionKernel[kernelName]);
    const processKernelWeights = props.convKernelArr.map((kernelName) => ConvolutionKernelWeights[kernelName])

    setup(props, ({tick}) => {
      regl.clear({
        color: [0, 150/255, 136/255, 1],
        // color: [0, 0, 0, 255],
        depth: 1,
      });
      for (let i = 0; i < processKernels.length; i++) {
        const inputTexture = i === 0 ? props.texture : props.fbos[(i + 1) % 2];
        props.fbos[i % 2].use(() => {
          darwImgProcess({
            fullscreen: 1,
            texture: inputTexture,
            positions: rectPos,
            color: rectColor,
            kernel: processKernels[i % 2],
            kernelWeight: processKernelWeights[i % 2],
          } as GLImgProcessProps);
        });
      }
 
      // props.fbos[0].use(() => {
      //   darwImgProcess({
      //     fullscreen: 1,
      //     texture: props.texture,
      //     positions: rectPos,
      //     color: rectColor,
      //     kernel: processKernels[0],
      //     kernelWeight: processKernelWeights[0],
      //   } as GLImgProcessProps);
      // });
      // props.fbos[1].use(() => {
      //   darwImgProcess({
      //     fullscreen: 1,
      //     texture: props.fbos[0],
      //     positions: rectPos,
      //     color: rectColor,
      //     kernel: processKernels[1],
      //     kernelWeight: processKernelWeights[1],
      //   } as GLImgProcessProps);
      // });

      darwImgProcess({
        flipY: 1,
        texture: processKernels.length ? props.fbos[(processKernels.length + 1) % 2] : props.texture,
        positions: rectPos,
        color: rectColor,
        kernel: kernel,
        kernelWeight: kernelWeight,
      } as GLImgProcessProps);

      // drawRect({
      //   texture: props.texture,
      //   positions: gen2DRectPositions(0, 0, 1, 1),
      //   color: rectColor,
      //   kernel: kernel,
      //   kernelWeight: kernelWeight,
      // } as GLRectangleProps);
    });
  }

  return drawMain;
}

export default main;