#version 300 es

precision highp float;

uniform sampler2D tex;
uniform float time;
uniform vec2 resolution;

in vec2 uvCoords;
out vec4 FragColor;

void main() {
    vec3 col = vec3(0.);

    // Draw a solid colour
    // col += vec3(0.4, 0., 0.9);

    // Use a uniform
    // col.r += sin(time);
    // col.g += cos(time);

    // Use UV coords
    // col *= uvCoords.x;

    // Use a texture
    // vec2 uv = uvCoords;
    // uv.y = 1.0 - uv.y;
    // col += texture(tex, uv).rgb;

    // Output our colour to the screen
    FragColor = vec4(col, 1.);
}