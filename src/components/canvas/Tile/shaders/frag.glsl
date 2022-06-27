#define PI 3.14159265358979323846

uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vPos;

void main() {
  vec3 color = uColor;
  
  // gamma correction
  color = pow(color, vec3(1.0 / 2.2));
  // #if defined(TONE_MAPPING)
  //   color = toneMapping(color);
  // #endif

  gl_FragColor = vec4(color, 1.0);
}