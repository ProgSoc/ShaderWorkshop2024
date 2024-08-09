#version 300 es

precision highp float;

in vec3 vNormal;
in vec2 vUv;
in vec4 vPos;

out vec4 FragColor;

uniform sampler2D surface;
uniform sampler2D nmap;
uniform sampler2D spec;
uniform float time;

void main() {
    // The colour of the surface with no light on it
    vec3 ambient = vec3(1, 0.2, 0.3);

    // Normally we would import these as a uniforms
    vec3 cameraPosition = vec3(0., 0., 10.);
    vec3 sun = vec3(sin(time), -1, cos(time));

    vec3 viewDirection = normalize(vPos.xyz - cameraPosition);

    // Do shading here

    vec3 final = ambient;
    FragColor = vec4(final, 1.);
}