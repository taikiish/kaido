// Car specs for the walk-in block-out (metres, front = +z). Every lamp is dark paint, bumpers are smooth and unbroken, no plate, no recess, no badge.
import { buildCar, K } from './carloft.js';
const front = (p, n, S) => n.z > 0.45 && p.z > S.ZF - 0.3, rear = (p, n, S) => n.z < -0.4 && p.z < S.ZR + 0.3, side = n => Math.abs(n.x) > 0.5;
const disc = (p, ax, cx, cy, r) => Math.hypot(ax - cx, p.y - cy) < r;
const gapZ = (p, n, zs, y0, y1) => side(n) && p.y > y0 && p.y < y1 && zs.some(z => Math.abs(p.z - z) < 0.006);

// ---- R34-style two-door coupe: tall boxy three-box body, four round tail lamps, high rear wing ----
const R34 = { ZF: 2.3, ZR: -2.3, ZWF: 1.37, ZWR: -1.295, RT: 0.33, n: 7, col: [30, 70, 150],
  TOP: [[2.3, 0.45], [2.27, 0.62], [2.15, 0.71], [1.6, 0.8], [0.95, 0.88], [0.0, 0.9], [-1.2, 0.92], [-1.9, 0.95], [-2.2, 0.93], [-2.28, 0.8], [-2.3, 0.5]],
  WID: [[2.3, 0.62], [2.2, 0.82], [1.9, 0.885], [1.0, 0.89], [-1.0, 0.89], [-1.9, 0.885], [-2.2, 0.84], [-2.3, 0.7]],
  BOT: [[2.3, 0.3], [2.1, 0.17], [-2.1, 0.2], [-2.3, 0.35]],
  ROOF: [[0.95, 0.86], [0.45, 1.2], [0.1, 1.34], [-0.6, 1.35], [-1.0, 1.25], [-1.45, 0.98], [-1.6, 0.92]],
  gh: { hwb: 0.8, hwt: 0.6, n: 4.5 }, ws: [0.9, 0.12], rg: [-0.75, -1.5], bp: -0.3,
  detail: (p, n, ax, S) => {
    if (gapZ(p, n, [0.78, -0.42], 0.3, 0.9)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.62, 0.66, 0.34, 0.13, K.lens); h.lamp(1, 0, 0.66, 0.78, 0.09, K.grille); h.lamp(1, 0, 0.36, 1.1, 0.16, K.grille); h.lamp(1, 0.74, 0.37, 0.16, 0.12, K.grille);
    h.lamp(-1, 0.4, 0.76, 0.15, 0, K.tail, true); h.lamp(-1, 0.66, 0.76, 0.19, 0, K.tail, true);
    const y = h.top(-2.05) + 0.24; h.box(1.62, 0.04, 0.3, 0, y, -2.08, S.col).rotation.x = 0.08; for (const s of [-1, 1]) { h.box(0.05, 0.24, 0.2, s * 0.52, y - 0.12, -2.04, S.col); h.box(0.03, 0.1, 0.32, s * 0.81, y, -2.08, S.col); } } };

// ---- AE86-style three-door hatchback: small, square, white over black, wide tail-lamp band ----
const AE86 = { ZF: 2.1, ZR: -2.1, ZWF: 1.27, ZWR: -1.13, RT: 0.29, n: 8, col: [230, 230, 224],
  TOP: [[2.1, 0.42], [2.08, 0.6], [2.0, 0.67], [1.0, 0.8], [0.85, 0.84], [0, 0.86], [-1.3, 0.88], [-1.95, 0.86], [-2.08, 0.8], [-2.1, 0.45]],
  WID: [[2.1, 0.62], [2.0, 0.78], [1.6, 0.81], [-1.6, 0.81], [-2.0, 0.79], [-2.1, 0.7]],
  BOT: [[2.1, 0.3], [1.9, 0.17], [-1.9, 0.19], [-2.1, 0.33]],
  ROOF: [[0.85, 0.82], [0.4, 1.15], [0.1, 1.31], [-0.7, 1.32], [-1.2, 1.2], [-1.9, 0.9], [-2.0, 0.86]],
  gh: { hwb: 0.74, hwt: 0.56, n: 5 }, ws: [0.8, 0.12], rg: [-0.85, -1.9], bp: -0.25, rgN: 0.15, wf: 0.19, wr: 0.19,
  detail: (p, n, ax, S) => {
    if (p.y < 0.41 && n.y > -0.6) return K.black;                                   // panda lower body and bumpers
    if (gapZ(p, n, [0.72, -0.35], 0.41, 0.86)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(-1, 0, 0.36, 1.6, 0.2, K.black); h.lamp(-1, 0.52, 0.68, 0.44, 0.15, K.tail); h.lamp(-1, 0, 0.68, 0.6, 0.15, K.black); h.lamp(1, 0, 0.58, 1.2, 0.05, K.grille); h.lamp(1, 0.55, 0.47, 0.36, 0.06, K.amber); } };

// ---- F40-style mid-engine wedge: low nose, wide rear, full-width wing on tall end plates, dark mesh rear panel ----
const F40 = { ZF: 2.18, ZR: -2.18, ZWF: 1.18, ZWR: -1.27, RT: 0.31, RTR: 0.34, n: 6, col: [176, 28, 24], wf: 0.24, wr: 0.33, ym: 0.42,
  TOP: [[2.18, 0.32], [2.15, 0.42], [1.9, 0.5], [1.2, 0.64], [0.75, 0.72], [0, 0.78], [-0.9, 0.9], [-1.9, 0.92], [-2.12, 0.9], [-2.18, 0.7], [-2.18, 0.4]],
  WID: [[2.18, 0.7], [2.0, 0.9], [1.2, 0.96], [0.3, 0.93], [-0.6, 0.985], [-1.9, 0.985], [-2.18, 0.93]],
  BOT: [[2.18, 0.24], [2.0, 0.13], [-2.0, 0.15], [-2.18, 0.3]],
  ROOF: [[0.75, 0.7], [0.3, 0.98], [0.0, 1.11], [-0.5, 1.125], [-0.75, 1.05], [-1.0, 0.93], [-1.2, 0.9]],
  gh: { hwb: 0.74, hwt: 0.55, n: 4 }, ws: [0.7, 0.05], rg: null, bp: -0.45, sideEnd: -0.5,
  detail: (p, n, ax, S) => {
    if (n.y > 0.6 && p.z < -0.98 && p.z > -1.85 && ax < 0.52 && (p.z * 9 - Math.floor(p.z * 9)) < 0.3) return K.gap;      // engine cover louvres
    if (side(n) && p.z < -0.5 && p.z > -0.85 && p.y > 0.42 && p.y < 0.62) return K.grille;                                   // side intake
    if (gapZ(p, n, [0.7, -0.45], 0.2, 0.78)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(-1, 0, 0.68, 1.7, 0.3, K.grille); h.lamp(-1, 0.48, 0.7, 0.15, 0, K.tail, true); h.lamp(-1, 0.7, 0.7, 0.17, 0, K.tail, true); h.lamp(1, 0, 0.26, 0.95, 0.1, K.grille); h.lamp(1, 0.66, 0.44, 0.32, 0.05, K.amber);
    for (const s of [-1, 1]) h.box(0.04, 0.3, 0.52, s * 0.94, 1.0, -1.93, S.col); h.box(1.92, 0.04, 0.3, 0, 1.14, -2.0, S.col);
    for (const x of [-0.09, 0, 0.09]) { const e = new h.THREE.Mesh(new h.THREE.CylinderGeometry(0.035, 0.035, 0.12, 14), h.std([70, 72, 74])); e.rotation.x = Math.PI / 2; e.position.set(x, 0.3, -2.2); car.add(e); } } };

// ---- Diablo-style wedge: very low, cab forward, flush closed pop-up lamps, wide flat tail ----
const DIABLO = { ZF: 2.23, ZR: -2.23, ZWF: 1.28, ZWR: -1.37, RT: 0.31, RTR: 0.34, n: 6, col: [124, 72, 142], wf: 0.24, wr: 0.34, ym: 0.4,
  TOP: [[2.23, 0.3], [2.2, 0.4], [1.9, 0.48], [1.3, 0.58], [1.0, 0.64], [0, 0.75], [-0.9, 0.9], [-1.9, 0.88], [-2.18, 0.82], [-2.23, 0.6], [-2.23, 0.35]],
  WID: [[2.23, 0.72], [2.05, 0.9], [1.3, 0.96], [0.2, 0.97], [-0.8, 1.02], [-1.9, 1.02], [-2.23, 0.95]],
  BOT: [[2.23, 0.22], [2.0, 0.12], [-2.0, 0.14], [-2.23, 0.28]],
  ROOF: [[1.0, 0.62], [0.5, 0.9], [0.1, 1.08], [-0.4, 1.105], [-0.8, 1.02], [-1.3, 0.92], [-1.6, 0.88]],
  gh: { hwb: 0.78, hwt: 0.56, n: 4 }, ws: [0.95, 0.15], rg: [-0.7, -1.5], bp: -0.35, rgN: 0.1,
  detail: (p, n, ax, S) => {
    if (n.y > 0.55 && p.z > 1.62 && p.z < 1.86 && ax > 0.46 && ax < 0.8 && (Math.abs(p.z - 1.62) < 0.008 || Math.abs(p.z - 1.86) < 0.008 || Math.abs(ax - 0.46) < 0.008 || Math.abs(ax - 0.8) < 0.008)) return K.gap;   // closed pop-up lamp lids
    if (side(n) && p.z < -0.5 && p.z > -0.95 && p.y > 0.45 && p.y < 0.7) return K.grille;
    if (gapZ(p, n, [0.85, -0.4], 0.2, 0.76)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.6, 0.39, 0.38, 0.05, K.amber); h.lamp(1, 0.5, 0.24, 0.44, 0.08, K.grille); h.lamp(-1, 0.6, 0.68, 0.56, 0.11, K.tail); h.lamp(-1, 0, 0.48, 1.5, 0.14, K.grille); } };

export const SPECS = { r34: R34, ae86: AE86, f40: F40, diablo: DIABLO };
export const buildSpec = k => buildCar(SPECS[k]);
