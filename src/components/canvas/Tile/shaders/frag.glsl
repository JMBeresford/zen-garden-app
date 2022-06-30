#define PI 3.14159265358979323846
#define S smoothstep
#define TOON_STEPS 2.0

uniform vec3 uColor;
uniform vec3 uSunColor;
uniform vec3 uSunPos;
uniform sampler2D uNormalMap;
uniform sampler2D uRoughnessMap;
uniform float uAmbientFactor;
uniform float uDiffuseFactor;
uniform float uRoughnessFactor;

varying vec2 vSt;
varying vec3 vPos;

#pragma glslify: noise = require(glsl-noise/simplex/2d)

void main() {
  vec3 normal = normalize(texture2D(uNormalMap, vSt).rgb);

  vec3 lightDir = uSunPos - vPos;
  float distance = length(lightDir);
  distance *= distance;
  lightDir = normalize(lightDir);

  float diffuse = max(dot(lightDir, normal), 0.0);
  // float specularFactor = 1.0 - texture2D(uRoughnessMap, vSt).r;

  // // hacky way to make the specular highlight more visible
  // vec3 cam = cameraPosition;
  // cam.z *= -1.0;

  // vec3 R = reflect(lightDir, normal);
  // vec3 V = normalize(cam - vPos);
  // float specular = pow(max(dot(R, V), 0.0), 5.0);

  float toon = sqrt(diffuse) * TOON_STEPS;
  toon = (floor(toon) + S(0.48, 0.52, fract(toon))) / TOON_STEPS;
  
  vec3 color = uColor * uAmbientFactor;
  color += toon * uSunColor;// * uDiffuseFactor;
  // color += specular * vec3(0.9, 0.8, 0.5) * specularFactor;
  
  // gamma correction
  // color = pow(color, vec3(1.0 / 2.2));
  #if defined(TONE_MAPPING)
    color = toneMapping(color);
  #endif

  gl_FragColor = vec4(color, 1.0);
}