#version 300 es

in vec4 position;
out vec2 uvCoords;

void main(void) {
    uvCoords = (position.xy + 1.0)/2.0;
    gl_Position = position;
}
