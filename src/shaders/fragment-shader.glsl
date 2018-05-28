varying vec2 vUv;

uniform float uTime;
uniform vec2 uDim;
uniform sampler2D uTex;

void main() {
  vec4 pixel = texture2D(uTex, vUv);

  vec2 st = gl_FragCoord.xy / uDim;
  vec2 uv = st;

  vec4 final = vec4(0, 0, 0, 1);
  if (uTime == 0.0) final = vec4(vUv, 0.0, 1);

  if (pixel.g != 0.0) {
    vec2 st = gl_FragCoord.xy / uDim;
  	vec2 uv = st;
  	uv *= vUv * st;
    // uv *= st + vUv + 0.1;
    // uv *= vUv / st;
    // final *= final.rrbb;
    final += texture2D(uTex, -(uv / vUv) + (st / vUv.gr) * vUv - uv);
  	final += texture2D(uTex, (st / vUv) * uv.gr * (vUv - uv) * -uv + uv / vUv / (1.0 / uv.gr));
    // final += texture2D(uTex, uv - vUv.gr / st.gr);
    // final += texture2D(uTex, uv.gr / vUv.gr * st / (1.0 / vUv));
    // final += texture2D(uTex, uv - vUv.gr);
    final += texture2D(uTex, vUv.gr / st / (1.0 / st) * vUv.gr);
    final += texture2D(uTex, vUv.gr - (1.0 / final.rb));
    // final += texture2D(uTex, vUv.gr * (vUv.gr / -st.gr));
    final += texture2D(uTex, -fract(vUv.gr) * (-vUv.gr * st.gr));
    final /= 1.05;
    // final -= texture2D(uTex, -(uv / vUv.gr) + (st.rr / -vUv.gr) * -vUv - (uv.gr / st.gr));
    // final.r /= pixel.r - vUv.r;
    // final.g /= pixel.b / vUv.g;
    // final.b /= pixel.g / vUv.g;
  }

  gl_FragColor = final;
}
