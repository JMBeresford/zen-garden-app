varying vec2 vUv;
varying vec3 vPos;

void main() {
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelPos;
  vUv = (uv - 0.5) * 2.0;
  vPos = modelPos.xyz;
}