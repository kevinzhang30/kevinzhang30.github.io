uniform sampler2D tDiffuse;
uniform vec2 uSunScreenPos;
uniform float uWeight;
uniform float uDecay;
uniform float uDensity;
uniform float uExposure;
uniform int uSamples;

varying vec2 vUv;

void main() {
  vec2 texCoord = vUv;
  vec2 deltaTexCoord = (texCoord - uSunScreenPos);
  deltaTexCoord *= 1.0 / float(uSamples) * uDensity;

  vec4 color = texture2D(tDiffuse, texCoord);
  float illuminationDecay = 1.0;

  for (int i = 0; i < 60; i++) {
    if (i >= uSamples) break;
    texCoord -= deltaTexCoord;
    vec4 sampleColor = texture2D(tDiffuse, texCoord);
    sampleColor *= illuminationDecay * uWeight;
    color += sampleColor;
    illuminationDecay *= uDecay;
  }

  gl_FragColor = color * uExposure;
}
