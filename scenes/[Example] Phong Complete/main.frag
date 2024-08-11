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
    ambient = texture(surface, vUv).rgb;

    // The direction of the sun (our L vector)
    vec3 sun = vec3(sin(time), -1, cos(time));

    vec3 normal = normalize(vNormal);

    // Add the normal map
    normal += normalize(texture(nmap, vUv).xyz * 2. - 1.) * 0.8;
    
    normal = normalize(normal);

    // The angle between the sun and the surface normal
    float angle = clamp(-dot(normal, normalize(sun)), 0., 1.);
    float diffuseBrightness = angle;

    // Normally we would import this as a uniform
    vec3 cameraPosition = vec3(0., 0., 10.);

    vec3 viewDirection = normalize(vPos.xyz - cameraPosition);
    // Find angle of reflection
    vec3 reflectionDirection = normalize(2. * dot(normal, sun) * normal - sun);
    // Final angle between camera and angle of reflection
    float specularAngle = clamp(dot(viewDirection, reflectionDirection), 0., 1.);
    // Raise to a power to make it smaller and covnert to white vec3
    vec3 specular = vec3(pow(specularAngle, 25.));
    specular *= texture(spec, vUv).r;

    // Find the fresnel
    float F0 = 0.1;
    float F = F0 + (1. - F0) * pow((1. - max(-dot(normal, viewDirection), 0.)), 4.);

    float edgeLighting = (F - F0) * 7.;

    // Add the specular to the final colour
    vec3 final = mix(ambient * diffuseBrightness, ambient, 0.05)
        + specular * F * 20.
        + edgeLighting;
    FragColor = vec4(final, 1.);
}