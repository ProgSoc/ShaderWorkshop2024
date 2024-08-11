#version 300 es

in vec4 position;
out vec2 vUv;

void main(void) {
    vUv = (position.xy + 1.0)/2.0;
    gl_Position = position;
}