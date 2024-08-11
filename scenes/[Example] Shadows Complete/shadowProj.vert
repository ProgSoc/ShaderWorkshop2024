#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
    vec4 vPos = model * vec4(position, 1.);
    gl_Position = projection * view * vPos;
}