
import { type REGLLoader, createREGLCache } from '@/utils/regl-utils/regl';
import type REGL from 'regl';
import glMain, { type GLMainProps } from './webgl/main';
import { Camera } from './camera';
import { BoxMesh } from './primitives/box';
import { Mesh } from './mesh';
import bunny from 'bunny';
import nomals from 'angle-normals';

type GLAppOpts = {
  regl:createREGL.Regl;
  loader?:REGLLoader;
}

function negMod (x:number, n:number) {  // modulo that works for negative numbers
  return ((x % n) + n) % n
}

function genGeoConfig() {
  const S = 400 // plane size
  const T = 0.1 // plane thickness
  const C = [0.45, 0.45, 0.45] // plane color

  //
  // First we place out lots of bunnies.
  //
  const bunnies = [];
  const N_BUNNIES = 3 // number of bunnies.

  // There's lots of magic numbers below, and they were simply chosen because
  // they make it looks good. There's no deeper meaning behind them.
  for (let x = -N_BUNNIES; x <= +N_BUNNIES; x++) {
    for (let z = -N_BUNNIES; z <= +N_BUNNIES; z++) {
      // we use these two to generate pseudo-random numbers.
      const xs = x / (N_BUNNIES + 1)
      const zs = z / (N_BUNNIES + 1)

      // pseudo-random color
      const c = [
        ((Math.abs(3 * x + 5 * z + 100) % 10) / 10) * 0.64,
        ((Math.abs(64 * x + x * z + 23) % 13) / 13) * 0.67,
        ((Math.abs(143 * x * z + x * z * z + 19) % 11) / 11) * 0.65
      ]

      const A = S / 20 // max bunny displacement amount.
      // compute random bunny displacement
      const xd = (negMod(z * z * 231 + x * x * 343, 24) / 24) * 0.97 * A
      const zd = (negMod(z * x * 198 + x * x * z * 24, 25) / 25) * 0.987 * A

      // random bunny scale.
      const s = ((Math.abs(3024 * z + 5239 * x + 1321) % 50) / 50) * 3.4 + 0.9
      // random bunny rotation
      const r = ((Math.abs(9422 * z * x + 3731 * x * x + 2321) % 200) / 200) * 2 * Math.PI

      // translation
      const t = [xs * S / 2.0 + xd, -0.2, zs * S / 2.0 + zd]

      bunnies.push({scale: s, translate: t, color: c, yRotate: r})
    }
  }
  return {
    bunniesConfig: bunnies,
    planeConfig: {
      scale: [S, T, S],
      translate: [0.0, -.5, 0.0],
      color: C,
    },
  }
}

export class GLApp {
  private _regl: createREGL.Regl;
  private _reglLoader?: REGLLoader;

  private _glDraw: (props: GLMainProps) => void;
  private _isReglFrameRegistered = false;
  private _cancelFrame!:() => void;

  public camera: Camera;

  public fbo: REGL.Framebuffer2D;

  public bunnyMesh: Mesh;
  public planeMesh: Mesh;
  public bunnyConfig: any;
  public planeConfig: any;

  constructor(opts:GLAppOpts) {
    this._regl = opts.regl;
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

    // this.camera.setPosition([10, 10, 10]);
    this.fbo = this._regl.framebuffer({
      colors: [
        this._regl.texture({type: 'float'}),  // albedo
        this._regl.texture({type: 'float'}), // normal
        this._regl.texture({type: 'float'}) // position
      ],
      depth: true,
    });

    this.planeMesh = new BoxMesh();
    this.bunnyMesh = new Mesh(bunny.cells, bunny.positions, nomals(bunny.cells, bunny.positions));
    const { bunniesConfig, planeConfig } = genGeoConfig();
    this.bunnyConfig = bunniesConfig;
    this.planeConfig = planeConfig;
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
      this.camera.releaseEventListener();
      this._cancelFrame();
      this._isReglFrameRegistered = false;
    } else {
      console.warn('ReglFrame already stopped, you should start it before stopping it.');
    }
  }

  public renderFrame = (context: REGL.DefaultContext) => {
    this.camera.updateCamera();
    this.fbo.resize(context.viewportWidth, context.viewportHeight);
    this._glDraw({
      camera: this.camera,
      fbo: this.fbo,
      bunnyMesh: this.bunnyMesh,
      planeMesh: this.planeMesh,
      bunnyConfig: this.bunnyConfig,
      planeConfig: this.planeConfig,
    });
  }
}