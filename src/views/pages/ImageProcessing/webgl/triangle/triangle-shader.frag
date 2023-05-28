#version 300 es

precision mediump float;

uniform vec4 u_color;
in vec2 v_texCoord;

out vec4 outColor;

void main() {
  outColor = vec4(v_texCoord, 0.0, 1.0);
  // outColor = u_color;
}