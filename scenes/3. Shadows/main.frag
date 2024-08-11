#version 300 es

precision highp float;

in vec3 vNormal;
in vec2 vUv;
in vec4 vPos;
in vec4 vLightUv;

out vec4 FragColor;

uniform sampler2D shadowMap;
uniform float time;

float shadow() {
    vec3 projCoords = vLightUv.xyz / vLightUv.w;
    projCoords = projCoords * 0.5 + 0.5;

    float distanceToCamera = projCoords.z;
    vec2 shadowMapUv = projCoords.xy;

    float shadow = 1.0;

    // Caclulate shadows here 

    return shadow;
}

void main() {
    vec3 normal = normalize(vNormal);
    vec3 ambient = vec3(0.1, 0.2, 1);
    vec3 sun = vec3(-1, -1, -1);

    float angle = clamp(-dot(normalize(normal), normalize(sun)), 0., 1.);
    float diffuseBrightness = angle;

    vec3 cameraPosition = vec3(-8., 4., 8.);

    vec3 viewDirection = normalize(vPos.xyz - cameraPosition);
    vec3 reflectionDirection = normalize(2. * dot(normal, sun) * normal - sun);
    float specularAngle = clamp(dot(viewDirection, reflectionDirection), 0., 1.);
    vec3 specular = vec3(pow(specularAngle, 20.));

    float F0 = 0.2;
    float F = F0 + (1. - F0) * pow((1. - max(-dot(normal, viewDirection), 0.)), 3.);

    float edgeLighting = (F) * 0.3;

    vec3 final = mix((ambient) * diffuseBrightness, ambient, 0.1) 
        + specular * F * 3.
        + edgeLighting;

    // Multiply our brightness by our shadow.
    final *= shadow();
    
    FragColor = vec4(final, 1.);
}