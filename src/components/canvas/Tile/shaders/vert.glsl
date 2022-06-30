#define WORLD_SIZE 30.0

varying vec2 vSt;
varying vec3 vPos;

void main() {
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  vec2 st = modelPos.xz;
  st += (WORLD_SIZE * 0.5);
  st /= WORLD_SIZE;

  gl_Position = projectionMatrix * viewMatrix * modelPos;
  vPos = modelPos.xyz;
  vPos.xz += (WORLD_SIZE * 0.5);
  vPos.xz /= WORLD_SIZE;

  vSt = st;
}