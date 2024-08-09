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
    // The projected coordinates using the light source camera's
    // projection and view matrix. These are projected in the vertex shader.
    vec3 projCoords = vLightUv.xyz / vLightUv.w;
    // Convert to screen space
    projCoords = projCoords * 0.5 + 0.5;

    // Loop around the area and average to soften the shadows
    #define SHADOW_MAP_SAMPLES 7
    float shadow = 0.;
    float totalWeight = 0.;
    for (int x = -SHADOW_MAP_SAMPLES; x < SHADOW_MAP_SAMPLES; x++) {
        for (int y = -SHADOW_MAP_SAMPLES; y < SHADOW_MAP_SAMPLES; y++) {
            float r2 = float(x * x + y * y);
            float R2 = float(SHADOW_MAP_SAMPLES * SHADOW_MAP_SAMPLES);

            // Create a circle blur kernel
            if (r2 > R2) continue;

            // give less weight to more distant fragments
            float distWeight = 1. - (r2 / R2);

            float currentDepth = projCoords.z;
            vec2 offset = vec2(x, y) * 0.005;

            // Sample from the depth map using the projected coordinates
            float closestDepth = texture(shadowMap, projCoords.xy + offset).r;
            bool inShadow = currentDepth - 0.0004 > closestDepth;

            shadow += (inShadow ? 0.4 : 1.0) * distWeight; 
            totalWeight += distWeight;
        }
    }
    shadow /= totalWeight;

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

    final *= shadow();
    
    FragColor = vec4(final, 1.);
}