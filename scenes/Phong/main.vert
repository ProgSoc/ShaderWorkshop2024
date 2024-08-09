#version 300 es

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 vNormal;
out vec2 vUv;
out vec4 vPos;

void main() {
    vUv = uv;
    vNormal = (model * vec4(normal, 0.)).xyz;
    vPos = model * vec4(position, 1.);
    gl_Position = projection * view * vPos;
}