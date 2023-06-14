import { vec2, vec4, mat3 } from "gl-matrix";
import { gen2DRectPositions } from "@/utils/gen-rect-pos";

export class RectMesh {
  public translation: vec2 = [0, 0];
  public rotation: vec2 = [0, 1];
  public scale: vec2 = [1, 1];

  public transformMat = mat3.create();
  
  public color = [Math.random(), Math.random(), Math.random(), 1] as vec4;

  public positions: number[] = [
    ...gen2DRectPositions(0, 0, 30, 150),
    ...gen2DRectPositions(30, 0, 70, 30),
    ...gen2DRectPositions(30, 60, 33, 30),
  ];
  public count: number;

  constructor() {
    this.count = this.positions.length / 2;
  }
}