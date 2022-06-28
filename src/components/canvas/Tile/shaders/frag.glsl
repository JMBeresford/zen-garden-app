#define PI 3.14159265358979323846
#define SUN vec3(10.0, 50.0, 10.0)
#define S smoothstep

uniform vec3 uColor;
uniform vec3 uSunColor;
uniform sampler2D uNormalMap;
uniform float uAmbientFactor;
uniform float uDiffuseFactor;

varying vec2 vSt;
varying vec3 vPos;

void main() {
  vec3 normal = normalize(texture2D(uNormalMap, vSt).rgb);

  vec3 lightDir = SUN - vPos;
  float distance = length(lightDir);
  distance *= distance;
  lightDir = normalize(lightDir);

  float diffuse = max(dot(lightDir, normal), 0.0);
  
  vec3 color = uColor * uAmbientFactor + diffuse * uSunColor * uDiffuseFactor;
  
  // gamma correction
  color = pow(color, vec3(1.0 / 2.2));
  // #if defined(TONE_MAPPING)
  //   color = toneMapping(color);
  // #endif

  gl_FragColor = vec4(color, 1.0);
}