import { vec3, mat4 } from 'gl-matrix';
import type REGL from 'regl';
import { getReglInstance } from './globals';
import { safeProp } from '@/utils/regl-utils/regl';

export type DrawMeshProps = {
  color: vec3,
  translate: vec3,
  scale: vec3 | number,
  yRotate?: number,
}

export class Mesh {
  public elements: vec3[];
  public position: vec3[];
  public normal: vec3[];

  public draw!: REGL.DrawCommand<REGL.DefaultContext, {}>;

  constructor(elements: vec3[], position: vec3[], normal: vec3[]) {
    this.elements = elements;
    this.position = position;
    this.normal = normal;
    
    const regl = getReglInstance();
    if (regl !== null){
      const prop = safeProp<DrawMeshProps>(regl);

      this.draw = regl({
        uniforms: {
          model: (_, props: DrawMeshProps) => {
            const m = mat4.create();
            mat4.translate(m, m, props.translate)
            var s = props.scale;
            if (typeof s === 'number') {
              mat4.scale(m, m, [s, s, s]);
            } else { // else, we assume an array
              mat4.scale(m, m, s);
            }
            if (typeof props.yRotate !== 'undefined') {
              mat4.rotateY(m, m, props.yRotate);
            }
            return m;
          },
          color: prop('color').prop,
        },
        attributes: {
          position: this.position,
          normal: this.normal,
        },
        elements: this.elements,
        cull: {
          enable: true,
        }
      });
    }
  }
}