#version 300 es

precision highp float;

in vec2 vUv;
out vec4 FragColor;

uniform sampler2D tex;
uniform vec2 screenSize;
uniform float time;

void main() {
    vec2 gb = texture(tex, vUv).gb;
    float r = texture(tex, vUv - vec2(1./screenSize.x, 0.)).r;
    FragColor = vec4(r, gb, 1.);
}