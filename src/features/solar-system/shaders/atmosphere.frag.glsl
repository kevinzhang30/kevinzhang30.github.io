uniform vec3 uColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  float fresnel = 1.0 - dot(vNormal, vViewDir);
  fresnel = pow(fresnel, 3.0) * uIntensity;

  gl_FragColor = vec4(uColor, fresnel);
}
