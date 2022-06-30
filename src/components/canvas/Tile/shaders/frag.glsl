#define PI 3.14159265358979323846
#define S smoothstep

uniform vec3 uColor;
uniform vec3 uSunColor;
uniform vec3 uSunPos;
uniform sampler2D uNoiseMap;
uniform float uAmbientFactor;
uniform float uDiffuseFactor;
uniform float uTime;

varying vec2 vSt;
varying vec3 vPos;

#pragma glslify: noise = require(glsl-noise/simplex/2d)

float calculateDiffuse(vec3 L, vec3 N) {
  return max(0.0, dot(L, N));
}

void main() {
  float noise = texture2D(uNoiseMap, vSt).r;

  vec3 col1 = uColor;
  vec3 col2 = mix(uColor, vec3(0.0), 0.075);

  vec3 albedo = mix(col1, col2, step(0.5 + sin(uTime * 0.5) * 0.065, noise));
  
  float diffuse = calculateDiffuse(normalize(uSunPos - vPos), vec3(0.0,1.0,0.0));

  vec3 color = uAmbientFactor * albedo + uDiffuseFactor * diffuse * uSunColor;

  // gamma correction
  // color = pow(color, vec3(1.0 / 2.2));
  #if defined(TONE_MAPPING)
    color = toneMapping(color);
  #endif

  gl_FragColor = vec4(color, 1.0);
}