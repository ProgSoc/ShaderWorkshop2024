#version 300 es

precision highp float;

in vec2 vUv;
out vec4 FragColor;

uniform sampler2D tex;
uniform sampler2D bloom;
uniform vec2 screenSize;
uniform float time;

vec3 reinhardExtended(vec3 x) {
    const float L_white = 3.;
    return (x * (1.0 + x / (L_white * L_white))) / (1.0 + x);
}

void main() {
    vec3 bloomSample = texture(bloom, vUv).rgb;
    vec3 col = texture(tex, vUv).rgb + bloomSample * 0.8;

    FragColor = vec4(reinhardExtended(col) * 1.5, 1.);
}