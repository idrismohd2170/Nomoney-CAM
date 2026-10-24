// One-pass WebGL film renderer, shared by the viewfinder and by capture. Reads makeParams() output.
// Order: sharpen, tone curve, colour cube, grain, vignette, flash falloff, dust/leak (screen), frame.
// shortcut: no webglcontextlost handling, a lost context just stops rendering until the page reloads.
function createRenderer(canvas = document.createElement('canvas')) {
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, alpha: false });
  if (!gl) return { ok: false };

  const VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 v;
uniform sampler2D u_src, u_curve, u_lut, u_over;
uniform vec2 u_texel, u_res;
uniform float u_sharpen, u_vig, u_grain, u_grainSize, u_noise, u_frameW, u_frameR, u_frameB, u_flash;
uniform vec3 u_frameColor;

vec3 grade(vec3 c) {
  c = clamp(c, 0., 1.);
  float b = c.b * 15., b0 = floor(b), f = b - b0, b1 = min(b0 + 1., 15.);
  float x = c.r * 15. + .5, y = (c.g * 15. + .5) / 16.;
  return mix(texture2D(u_lut, vec2((b0 * 16. + x) / 256., y)).rgb,
             texture2D(u_lut, vec2((b1 * 16. + x) / 256., y)).rgb, f);
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + u_noise) * 43758.5453); }

void main() {
  vec3 c = texture2D(u_src, v).rgb;
  vec3 n = texture2D(u_src, v + vec2(u_texel.x, 0.)).rgb + texture2D(u_src, v - vec2(u_texel.x, 0.)).rgb
         + texture2D(u_src, v + vec2(0., u_texel.y)).rgb + texture2D(u_src, v - vec2(0., u_texel.y)).rgb;
  c = clamp(c + u_sharpen * (4. * c - n), 0., 1.);
  vec3 k = (c * 255. + .5) / 256.;
  c = vec3(texture2D(u_curve, vec2(k.r, .5)).r, texture2D(u_curve, vec2(k.g, .5)).g, texture2D(u_curve, vec2(k.b, .5)).b);
  c = grade(c);
  float l = dot(c, vec3(.299, .587, .114));
  c += (hash(floor(v * u_res / u_grainSize)) - .5) * u_grain * (1. - abs(l - .5) * 1.2);
  float d = distance(v, vec2(.5)) * 1.4142;
  c *= 1. - u_vig * d * d;
  c *= 1. + u_flash * (.35 - 1.1 * d * d);        // flash falloff, same formula as flashGain() in film-params.js
  vec3 o = texture2D(u_over, v).rgb;
  c = 1. - (1. - c) * (1. - o);                  // dust and light leak, screen blend
  if (u_frameW > 0.) {                            // frame: rounded window, short-side fractions
    float m = min(u_res.x, u_res.y), r = u_frameR * m;   // window with equal borders, plus u_frameB extra at the bottom (y is up)
    vec2 lo = vec2(u_frameW, u_frameW + u_frameB) * m, hi = u_res - vec2(u_frameW) * m;
    vec2 q = abs(v * u_res - (lo + hi) * .5) - ((hi - lo) * .5 - r);
    float sd = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
    c = mix(c, u_frameColor, smoothstep(0., 1.5, sd));
  }
  gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
}`;

  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return { ok: false, error: gl.getProgramInfoLog(prog) };
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = unit => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const [k, val] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, val);
    return t;
  };
  tex(0); tex(1); tex(2); tex(3);
  const u = name => gl.getUniformLocation(prog, name);
  gl.uniform1i(u('u_src'), 0); gl.uniform1i(u('u_curve'), 1); gl.uniform1i(u('u_lut'), 2); gl.uniform1i(u('u_over'), 3);
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  let tables = null, scratch = null;

  function render(src, p) {
    let sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
    const s = Math.min(1, max / Math.max(sw, sh));
    if (s < 1) { // source larger than the GPU allows: shrink once through a 2D canvas
      scratch = scratch || document.createElement('canvas');
      scratch.width = sw = Math.round(sw * s); scratch.height = sh = Math.round(sh * s);
      scratch.getContext('2d').drawImage(src, 0, 0, sw, sh);
      src = scratch;
    }
    if (canvas.width !== sw || canvas.height !== sh) { canvas.width = sw; canvas.height = sh; }
    gl.viewport(0, 0, sw, sh);

    if (tables !== p) { // curve and cube only change per shot, not per frame
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.activeTexture(gl.TEXTURE1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, p.curve);
      gl.activeTexture(gl.TEXTURE2);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, p.lut);
      gl.activeTexture(gl.TEXTURE3);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, p.overlay);
      tables = p;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);

    gl.uniform2f(u('u_texel'), 1 / sw, 1 / sh);
    gl.uniform2f(u('u_res'), sw, sh);
    gl.uniform1f(u('u_sharpen'), p.sharpen);
    gl.uniform1f(u('u_vig'), p.vignette);
    gl.uniform1f(u('u_grain'), p.grain);
    gl.uniform1f(u('u_grainSize'), p.grainSize);
    gl.uniform1f(u('u_noise'), p.noise);
    gl.uniform1f(u('u_frameW'), p.frame.width);
    gl.uniform1f(u('u_frameR'), p.frame.round);
    gl.uniform1f(u('u_frameB'), p.frame.bottom);
    gl.uniform1f(u('u_flash'), p.flash);
    gl.uniform3fv(u('u_frameColor'), p.frame.color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  return { ok: true, canvas, render };
}
