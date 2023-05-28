#version 300 es

uniform vec2 u_resolution;
uniform int u_flipY;
uniform int u_fullscreen;

in vec2 a_position;
out vec2 v_texCoord;

void main() {
  vec2 pos = a_position;
  
  v_texCoord = a_position;
  if (u_flipY > 0) {
    v_texCoord.y = 1.0 - v_texCoord.y;
  }

  if (u_fullscreen > 0) {
    pos *= 2.0;
    pos -= 1.0;
  } else{
    pos -= 0.5;
    pos.x /= u_resolution.x / u_resolution.y;
  }
  gl_Position = vec4(pos, 0, 1);
}