
export function gen2DRectPositions(x:number, y:number, w:number, h:number) {
  var x1 = x;
  var x2 = x + w;
  var y1 = y;
  var y2 = y + h;
  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ];
}