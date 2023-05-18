import { type REGL, type REGLLoader, safeProp } from "@/utils/regl-utils/regl";
import _REGL from "regl";
import vertShader from "./glsl/outputGBuffer.vert?raw";
import fragShader from "./glsl/outputGBuffer.frag?raw";

type GLOutPutBufferProps = {
  fbo: _REGL.Framebuffer2D;
};

export default function glOutPutBuffer (regl: REGL, loader: REGLLoader) {
  
  const prop = safeProp<GLOutPutBufferProps>(regl);
  return regl({
    frag: fragShader,
    vert: vertShader,
    framebuffer: prop('fbo').prop,
  });
}