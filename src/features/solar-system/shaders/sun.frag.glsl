uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  // Map displacement to color ramp: deep orange → orange → yellow → white
  float t = vDisplacement * 0.5 + 0.5; // normalize to 0-1 range
  t = clamp(t, 0.0, 1.0);

  vec3 deepOrange = vec3(0.8, 0.2, 0.0);
  vec3 orange = vec3(1.0, 0.5, 0.0);
  vec3 yellow = vec3(1.0, 0.9, 0.3);
  vec3 white = vec3(1.0, 1.0, 0.9);

  vec3 color;
  if (t < 0.33) {
    color = mix(deepOrange, orange, t / 0.33);
  } else if (t < 0.66) {
    color = mix(orange, yellow, (t - 0.33) / 0.33);
  } else {
    color = mix(yellow, white, (t - 0.66) / 0.34);
  }

  // Add some pulsing emission
  float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
  color *= pulse;

  gl_FragColor = vec4(color * 1.0, 1.0);
}
