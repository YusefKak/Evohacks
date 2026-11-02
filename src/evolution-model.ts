/** Shared geometry keeps the WebGL and low-power experiences in sync. */
export const ROWS = 96;
export const COUNT = ROWS * 2;
const TAU = Math.PI * 2;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
export const forms = Array.from({length: 5}, () => new Float32Array(COUNT * 3));
for (let i = 0; i < COUNT; i++) {
  const row = Math.floor(i / 2), strand = i % 2, u = row / (ROWS - 1);
  const a = u * Math.PI * 3.65 + strand * Math.PI, y = (u - .5) * 7;
  forms[0].set([Math.cos(a) * 1.08, y, Math.sin(a) * 1.08], i * 3);
  // The two backbones peel apart before folding into a toroidal knot.
  forms[1].set([Math.cos(a + Math.sin(u * TAU) * .65) * (1.15 + .45 * Math.sin(u * Math.PI)) + (strand ? .55 : -.55), y * .78, Math.sin(a) * 1.45], i * 3);
  const k = u * TAU, r = 1.7 + .58 * Math.cos(3 * k + strand * .4);
  forms[2].set([r * Math.cos(2 * k), r * Math.sin(2 * k), .95 * Math.sin(3 * k) + (strand ? .18 : -.18)], i * 3);
  // Even sphere sampling; fixed identities allow genuinely continuous morphs.
  const phi = Math.acos(1 - 2 * (i + .5) / COUNT), theta = i * 2.39996323;
  forms[3].set([2.6 * Math.sin(phi) * Math.cos(theta), 2.6 * Math.cos(phi), 2.6 * Math.sin(phi) * Math.sin(theta)], i * 3);
  const orbit = u * TAU, phase = orbit * 3 + strand * Math.PI;
  const radius = 2.15 + .45 * Math.cos(phase);
  forms[4].set([radius * Math.cos(orbit), radius * Math.sin(orbit), .65 * Math.sin(phase)], i * 3);
}
export const bonds: number[] = [];
for (let i = 0; i < COUNT; i++) {
  if (i + 2 < COUNT) bonds.push(i, i + 2);
  if (!(i % 2)) bonds.push(i, i + 1);
}
export const links: number[] = [];
for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) {
  let d = 0;
  for (let c = 0; c < 3; c++) d += (forms[3][i * 3 + c] - forms[3][j * 3 + c]) ** 2;
  if (d < 1.7) links.push(i, j);
}
export function sample(progress: number, out: Float32Array) {
  const p = clamp(progress, 0, 4), stage = Math.min(3, Math.floor(p)), t = smooth(p - stage);
  for (let i = 0; i < out.length; i++) out[i] = forms[stage][i] * (1 - t) + forms[stage + 1][i] * t;
}
export function stageProgress(tops: number[], y: number) {
  let p = 0;
  for (let i = 0; i < tops.length - 1; i++) if (y >= tops[i]) p = i + clamp((y - tops[i]) / Math.max(1, tops[i + 1] - tops[i]));
  return clamp(p, 0, 4);
}
