#version 300 es

precision highp float;

in vec3 vNormal;
in vec2 vUv;
in vec4 vPos;
in vec4 vLightUv;

out vec4 FragColor;

uniform sampler2D shadowMap;
uniform float time;
uniform float luminescence;

const vec2 POINTS[40] = vec2[40](
    vec2(0.000990051, -0.003007094),
    vec2(-0.000124699, 0.003315218),
    vec2(0.001712557, 0.000415365),
    vec2(0.002514848, 0.003041686),
    vec2(-0.002349736, -0.000783624),
    vec2(-0.001370579, 0.002062981),
    vec2(0.001373379, 0.003419197),
    vec2(-0.001179321, 0.003723412),
    vec2(-0.002285928, -0.002286461),
    vec2(0.000306973, -0.002055179),
    vec2(0.003655244, -0.001288782),
    vec2(0.001477691, 0.002225642),
    vec2(-0.001244530, -0.002452241),
    vec2(0.001980564, -0.002840199),
    vec2(-0.001021806, -0.003385425),
    vec2(0.002000784, -0.001650893),
    vec2(-0.002935282, 0.002400964),
    vec2(0.000108187, -0.003785683),
    vec2(-0.003463092, -0.001757550),
    vec2(-0.003556619, 0.001592704),
    vec2(0.003134253, -0.002333775),
    vec2(0.002761301, -0.000362559),
    vec2(0.000620111, 0.002669101),
    vec2(-0.003471993, -0.000393066),
    vec2(0.001602658, -0.000647189),
    vec2(0.003328848, 0.000467706),
    vec2(0.000521518, 0.001691324),
    vec2(0.003948598, -0.000335557),
    vec2(-0.001999131, -0.003317322),
    vec2(-0.001105448, -0.000738117),
    vec2(0.000779644, 0.000617416),
    vec2(-0.000446806, 0.001169364),
    vec2(0.002158883, 0.001279607),
    vec2(0.003196582, 0.001677392),
    vec2(-0.001913467, 0.002899939),
    vec2(-0.000659530, -0.001666521),
    vec2(-0.000435939, 0.002330499),
    vec2(0.000121373, -0.000214649),
    vec2(-0.002595645, 0.001101108),
    vec2(-0.001507326, 0.000700297)
);

const float WEIGHTS[40] = float[40](
    0.023960586,
    0.023235443,
    0.029742593,
    0.020143132,
    0.027055608,
    0.027056410,
    0.021441741,
    0.020346669,
    0.023640361,
    0.028636611,
    0.020495248,
    0.026221779,
    0.025875592,
    0.022532431,
    0.022172127,
    0.026558637,
    0.020910102,
    0.020934559,
    0.020456715,
    0.020390173,
    0.020336843,
    0.025719282,
    0.025919053,
    0.022378141,
    0.029852482,
    0.023023120,
    0.029717342,
    0.020062905,
    0.020508455,
    0.031013100,
    0.031776135,
    0.031207329,
    0.026918276,
    0.021810251,
    0.022475018,
    0.029643409,
    0.027493747,
    0.032711381,
    0.025564165,
    0.030063048
);

const int POINTS_COUNT = 40;
const float RADIUS = 0.004000000;
const float TOTAL_WEIGHT = 1.000000000;

float shadow() {
    vec3 projCoords = vLightUv.xyz / vLightUv.w;
    projCoords = projCoords * 0.5 + 0.5;

    float shadow = 0.;
    for (int i = 0; i < POINTS_COUNT; i++) {
        vec2 p = POINTS[i];
        float w = WEIGHTS[i];

        float currentDepth = projCoords.z;
        vec2 offset = p * 5.;

        float closestDepth = texture(shadowMap, projCoords.xy + offset).r;
        bool inShadow = currentDepth - 0.0004 > closestDepth;

        shadow += (inShadow ? 0.4 : 1.0) * w; 
    }
    shadow /= TOTAL_WEIGHT;

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
    vec3 reflectionDirection = normalize(reflect(-sun, normal));
    float specularAngle = clamp(dot(viewDirection, reflectionDirection), 0., 1.);
    vec3 specular = vec3(pow(specularAngle, 20.));

    float F0 = 0.2;
    float F = F0 + (1. - F0) * pow((1. - max(-dot(normal, viewDirection), 0.)), 3.);

    float edgeLighting = (F) * 0.3;

    vec3 final = mix((ambient) * diffuseBrightness, ambient, 0.1) 
        + specular * F * 3.
        + edgeLighting;

    final *= shadow();

    final += luminescence;
    
    FragColor = vec4(final, 1.);
}

