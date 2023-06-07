#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
  vec2 position = a_position.xy + u_translation;
  
  // 从像素坐标转换到 0.0 到 1.0
  vec2 pixelToOne = position / u_resolution;

  // 转换 0->1 为 0->2
  vec2 zeroToTwo = pixelToOne * 2.0;

  // 转换 0->2 为 -1->+1 (裁剪空间坐标)
  vec2 clipSpace = zeroToTwo - 1.0;
  
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}