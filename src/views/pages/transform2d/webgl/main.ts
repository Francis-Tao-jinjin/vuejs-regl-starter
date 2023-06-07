import { type REGL,  type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import _REGL from 'regl';
import type { Camera } from "../../../../components/camera";
import glRectangle from "./rectangle/rect";
import { gen2DRectPositions } from "@/utils/gen-rect-pos";
import type { vec2, vec4 } from "gl-matrix";

export type GLMainProps = {
  camera: Camera;
  translation: vec2;
};

function main(regl: REGL, loader: REGLLoader) {

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

  const rectColor = [Math.random(), Math.random(), Math.random(), 1] as vec4;
  const shapePos = [
    ...gen2DRectPositions(0, 0, 30, 150),
    ...gen2DRectPositions(30, 0, 70, 30),
    ...gen2DRectPositions(30, 60, 33, 30),
  ];

  function drawMain(props: GLMainProps) {
    setup(props, (ctx) => {
      regl.clear({
        color: [0, 150/255, 136/255, 1],
        // color: [0, 0, 0, 255],
        depth: 1,
      });

      drawRect({
        positions: shapePos,
        color: rectColor,
        count: shapePos.length / 2,
        translation: props.translation,
      });
    });
  }

  return drawMain;
};

export default main;