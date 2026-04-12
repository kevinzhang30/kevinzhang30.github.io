uniform vec3 uColor;
uniform float uOpacity;

varying float vAlpha;

void main() {
  // Soft circular particle
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  float alpha = smoothstep(0.5, 0.1, dist) * uOpacity * vAlpha;

  gl_FragColor = vec4(uColor, alpha);
}
