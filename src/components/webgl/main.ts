import { type REGL,  type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import _REGL from 'regl';
import type { Camera } from "../camera";
import type { Mesh } from "../mesh";
import glOutPutBuffer from "./outputGBuffer";
import glPointLight, { batchDrawPointLights } from "./pointLight";
import gldirectLight from "./directLight";

export type GLMainProps = {
  camera: Camera;
  fbo: _REGL.Framebuffer2D;
  bunnyMesh: Mesh,
  planeMesh: Mesh,
  bunnyConfig: any,
  planeConfig: any,
};

function main(regl: REGL, loader: REGLLoader) {

  const drawOutputGbuffer = loader.require(glOutPutBuffer);
  const drawPointLight = loader.require(glPointLight);
  const drawDirectLight = loader.require(gldirectLight);

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

  function drawMain(props: GLMainProps) {
    setup(props, (ctx) => {
      drawOutputGbuffer({fbo: props.fbo}, () => {
        regl.clear({
          // color: [0, 150/255, 136/255, 1],
          color: [0, 0, 0, 255],
          depth: 1,
        });

        props.bunnyMesh.draw(props.bunnyConfig);
        props.planeMesh.draw(props.planeConfig);
      })
      // console.log(ctx);
      drawDirectLight({fbo: props.fbo});
      batchDrawPointLights(ctx.tick, {fbo: props.fbo}, drawPointLight);
    });
  }

  return drawMain;
}

export default main;