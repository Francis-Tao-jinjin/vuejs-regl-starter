#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation, u_rotation, u_scale;

uniform mat3 u_matrix;

void main() {
  
  // vec2 scaledPosition = a_position * u_scale;
  // vec2 rotatedPosition = vec2(
  //   scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
  //   scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
  // );
  // vec2 position = rotatedPosition + u_translation;

  vec2 position = (u_matrix * vec3(a_position, 1)).xy;
  
  // 从像素坐标转换到 0.0 到 1.0
  vec2 pixelToOne = position / u_resolution;

  // 转换 0->1 为 0->2
  vec2 zeroToTwo = pixelToOne * 2.0;

  // 转换 0->2 为 -1->+1 (裁剪空间坐标)
  vec2 clipSpace = zeroToTwo - 1.0;
  
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}