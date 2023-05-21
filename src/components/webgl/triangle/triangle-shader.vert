#version 300 es

// in vec4 a_position;
in vec2 a_position;

void main() {
  // gl_Position = a_position;
  gl_Position = vec4(a_position * vec2(1.0, -1.0), 0, 1);
}