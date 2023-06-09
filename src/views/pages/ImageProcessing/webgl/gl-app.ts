
import { type REGLLoader, createREGLCache } from '@/utils/regl-utils/regl';
import type REGL from 'regl';
import glMain, { type GLMainProps } from './main';
import { Camera } from '../../../../components/camera';
import { BoxMesh } from '../../../../components/primitives/box';
import { Mesh } from '../../../../components/mesh';
// import bunny from 'bunny';
// import nomals from 'angle-normals';
import type { KernelName } from '@/utils/convmatrix';

type GLAppOpts = {
  regl:createREGL.Regl;
  loader?:REGLLoader;
}

export class GLApp {
  private _regl: createREGL.Regl;
  private _reglLoader?: REGLLoader;

  private _glDraw: (props: GLMainProps) => void;
  private _isReglFrameRegistered = false;
  private _cancelFrame!:() => void;

  public camera: Camera;

  // public fbo: REGL.Framebuffer2D;
  public kernel: KernelName = 'Identity';

  public texture!: REGL.Texture2D;
  public fbos: REGL.Framebuffer2D[];
  public kernels: KernelName[] = [];

  public textureSize = 512;

  constructor(opts:GLAppOpts) {
    this._regl = opts.regl;
    console.log(this._regl.limits);
    if (opts.loader) {
      this._reglLoader = opts.loader;
    } else {
      this._reglLoader = createREGLCache(this._regl, true);
    }
    this._glDraw = this._reglLoader.require(glMain);
    this.camera = new Camera(this._regl._gl.canvas as HTMLCanvasElement);
    this.camera.ddistance = 4;
    this.camera.phi = 0.39269908169872414; 
    this.camera.theta = 0.7853981633974483; // Arccos(PI/4)

    this.fbos = (Array(2)).fill(0).map(() => this._regl.framebuffer(this.textureSize));

    // this.camera.setPosition([10, 10, 10]);
    // this.fbo = this._regl.framebuffer({
    //   colors: [
    //     this._regl.texture(),  // albedo
    //     this._regl.texture(), // normal
    //     this._regl.texture() // position
    //   ],
    //   depth: true,
    // });
  }

  public startReglFrame = () => {
    if (this._isReglFrameRegistered) {
      console.warn('ReglFrame already started, you should stop it before starting it again.');
      return;
    }
    this.camera.attachEventListener();

    const {cancel} = this._regl.frame(this.renderFrame);
    this._cancelFrame = cancel;
    this._isReglFrameRegistered = true;
  }

  public stopReglFrame = () => {
    if (this._cancelFrame && this._isReglFrameRegistered) {
      // clear the canvas
      this._regl.clear({ color: [1, 1, 1, 1], depth: 1 });
      this.camera.releaseEventListener();
      this._cancelFrame();
      this._isReglFrameRegistered = false;
      console.log('ReglFrame stopped.');
    } else {
      console.warn('ReglFrame already stopped, you should start it before stopping it.');
    }
  }

  public renderFrame = (context: REGL.DefaultContext) => {
    this.camera.updateCamera();
    // this.fbo.resize(context.viewportWidth, context.viewportHeight);
    this._glDraw({
      camera: this.camera,
      // fbo: this.fbo,
      texture: this.texture,
      convKernel: this.kernel,
      convKernelArr: this.kernels,
      fbos: this.fbos,
    });
  }
}