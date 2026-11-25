// Car specs for the walk-in block-out (metres, front = +z). Every lamp is dark paint, bumpers are smooth and unbroken, no plate, no recess, no badge.
import { buildCar, K } from './carloft.js';
const front = (p, n, S) => n.z > 0.45 && p.z > S.ZF - 0.3, rear = (p, n, S) => n.z < -0.4 && p.z < S.ZR + 0.3, side = n => Math.abs(n.x) > 0.5;
const disc = (p, ax, cx, cy, r) => Math.hypot(ax - cx, p.y - cy) < r;
const gapZ = (p, n, zs, y0, y1) => side(n) && p.y > y0 && p.y < y1 && zs.some(z => Math.abs(p.z - z) < 0.006);

// ---- R34-style two-door coupe: tall boxy three-box body, four round tail lamps, high rear wing ----
const R34 = { ZF: 2.3, ZR: -2.3, ZWF: 1.37, ZWR: -1.295, RT: 0.33, n: 7, wi: 0.05, col: [30, 70, 150],
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
  gh: { hwb: 0.74, hwt: 0.56, n: 5 }, ws: [0.8, 0.12], rg: [-0.85, -1.9], bp: -0.25, rgN: 0.15, wf: 0.19, wr: 0.19, wi: 0.05,
  detail: (p, n, ax, S) => {
    if (p.y < 0.41 && n.y > -0.6) return K.black;                                   // panda lower body and bumpers
    if (gapZ(p, n, [0.72, -0.35], 0.41, 0.86)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(-1, 0, 0.36, 1.6, 0.2, K.black); h.lamp(-1, 0.52, 0.68, 0.44, 0.15, K.tail); h.lamp(-1, 0, 0.68, 0.6, 0.15, K.black); h.lamp(1, 0, 0.58, 1.2, 0.05, K.grille); h.lamp(1, 0.55, 0.47, 0.36, 0.06, K.amber); } };

// ---- F40-style mid-engine wedge: low nose, wide rear, full-width wing on tall end plates, dark mesh rear panel ----
const F40 = { ZF: 2.18, ZR: -2.18, ZWF: 1.18, ZWR: -1.27, RT: 0.31, RTR: 0.34, n: 6, col: [176, 28, 24], wf: 0.24, wr: 0.33, ym: 0.42, wi: 0.085,
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
const DIABLO = { ZF: 2.23, ZR: -2.23, ZWF: 1.28, ZWR: -1.37, RT: 0.31, RTR: 0.34, n: 6, col: [124, 72, 142], wf: 0.24, wr: 0.34, ym: 0.4, wi: 0.085,
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


// ================= v8 supercars (Nov 19): six new 80s/90s shapes, all lamps dark, no plate, no badge =================
const strakes = (p, n, z0, z1, y0, y1, k = 24) => side(n) && p.z < z0 && p.z > z1 && p.y > y0 && p.y < y1 && ((p.y * k) - Math.floor(p.y * k)) < 0.42;
// ---- sharp folded-paper wedge with a big rear wing (red) ----
const COUNT = { ...DIABLO, ZF: 2.07, ZR: -2.07, ZWF: 1.2, ZWR: -1.25, n: 10, col: [186, 26, 22], wf: 0.25, wr: 0.36,
  TOP: [[2.07, 0.3], [2.04, 0.38], [1.7, 0.47], [1.1, 0.58], [0.9, 0.62], [0, 0.72], [-0.8, 0.9], [-1.8, 0.9], [-2.03, 0.86], [-2.07, 0.6], [-2.07, 0.36]],
  WID: [[2.07, 0.74], [1.9, 0.9], [1.2, 0.95], [0.2, 0.96], [-0.7, 1.0], [-1.8, 1.0], [-2.07, 0.95]],
  BOT: [[2.07, 0.22], [1.9, 0.13], [-1.9, 0.15], [-2.07, 0.28]],
  ROOF: [[0.9, 0.6], [0.35, 0.92], [0.05, 1.05], [-0.4, 1.07], [-0.75, 0.98], [-1.1, 0.9], [-1.3, 0.88]],
  gh: { hwb: 0.74, hwt: 0.56, n: 6 }, ws: [0.85, 0.1], rg: null, bp: -0.3, sideEnd: -0.55,
  detail: (p, n, ax, S) => { if (side(n) && p.z < -0.45 && p.z > -1.0 && p.y > 0.5 && p.y < 0.82) return K.grille; if (gapZ(p, n, [0.8, -0.38], 0.2, 0.74)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.6, 0.36, 0.4, 0.06, K.amber); h.lamp(1, 0, 0.24, 1.0, 0.08, K.grille); h.lamp(-1, 0.58, 0.66, 0.5, 0.13, K.tail); h.lamp(-1, 0, 0.44, 1.4, 0.14, K.grille);
    h.box(1.86, 0.045, 0.34, 0, 1.2, -1.86, S.col); for (const s of [-1, 1]) h.box(0.05, 0.34, 0.3, s * 0.6, 1.04, -1.84, S.col); } };
// ---- wide flat-twelve coupe with long side strakes (white) ----
const TESTA = { ...DIABLO, ZF: 2.24, ZR: -2.24, ZWF: 1.3, ZWR: -1.25, n: 6, col: [226, 226, 220], wf: 0.24, wr: 0.36,
  TOP: [[2.24, 0.34], [2.2, 0.46], [1.9, 0.54], [1.2, 0.66], [0.85, 0.72], [0, 0.8], [-0.9, 0.9], [-1.9, 0.86], [-2.2, 0.8], [-2.24, 0.6], [-2.24, 0.38]],
  WID: [[2.24, 0.74], [2.05, 0.88], [1.2, 0.92], [0.3, 0.93], [-0.6, 0.99], [-1.9, 0.99], [-2.24, 0.94]],
  BOT: [[2.24, 0.24], [2.0, 0.13], [-2.0, 0.15], [-2.24, 0.3]],
  ROOF: [[0.85, 0.7], [0.4, 0.98], [0.05, 1.11], [-0.45, 1.13], [-0.8, 1.04], [-1.2, 0.92], [-1.5, 0.88]],
  gh: { hwb: 0.76, hwt: 0.56, n: 4 }, ws: [0.8, 0.12], rg: [-0.75, -1.4], bp: -0.3,
  detail: (p, n, ax, S) => { if (strakes(p, n, 0.55, -0.95, 0.36, 0.66)) return K.gap; if (gapZ(p, n, [0.75], 0.2, 0.78)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.62, 0.36, 0.4, 0.07, K.amber); h.lamp(1, 0, 0.26, 1.1, 0.1, K.grille); h.lamp(-1, 0, 0.62, 1.78, 0.17, K.grille); } };
// ---- cab-forward Japanese mid-engine coupe, long tail, wrap-around wing (yellow) ----
const NSX = { ...DIABLO, ZF: 2.2, ZR: -2.2, ZWF: 1.3, ZWR: -1.23, RT: 0.3, RTR: 0.32, n: 5, col: [222, 178, 38], wf: 0.22, wr: 0.26,
  TOP: [[2.2, 0.36], [2.16, 0.5], [1.9, 0.58], [1.25, 0.68], [1.0, 0.72], [0, 0.82], [-0.9, 0.9], [-1.9, 0.9], [-2.15, 0.86], [-2.2, 0.66], [-2.2, 0.4]],
  WID: [[2.2, 0.7], [2.05, 0.86], [1.2, 0.9], [-1.0, 0.905], [-1.9, 0.9], [-2.2, 0.84]],
  BOT: [[2.2, 0.25], [2.0, 0.14], [-2.0, 0.16], [-2.2, 0.3]],
  ROOF: [[1.0, 0.7], [0.5, 0.98], [0.15, 1.15], [-0.4, 1.17], [-0.75, 1.1], [-1.2, 0.93], [-1.4, 0.9]],
  gh: { hwb: 0.74, hwt: 0.54, n: 3.6 }, ws: [0.95, 0.2], rg: [-0.7, -1.3], bp: -0.25,
  detail: (p, n, ax, S) => { if (side(n) && p.z < -0.45 && p.z > -0.8 && p.y > 0.5 && p.y < 0.68) return K.grille; if (gapZ(p, n, [0.9, -0.3], 0.2, 0.8)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.6, 0.42, 0.42, 0.06, K.amber); h.lamp(1, 0, 0.27, 1.0, 0.09, K.grille); h.lamp(-1, 0, 0.72, 1.7, 0.1, K.tail);
    h.box(1.74, 0.04, 0.22, 0, 1.0, -2.08, S.col); for (const s of [-1, 1]) h.box(0.06, 0.12, 0.22, s * 0.84, 0.95, -2.08, S.col); } };
// ---- very long, very low, smooth British hypercar (silver) ----
const XJ = { ...DIABLO, ZF: 2.46, ZR: -2.46, ZWF: 1.38, ZWR: -1.26, RT: 0.31, RTR: 0.34, n: 3.2, col: [150, 156, 160], wf: 0.24, wr: 0.34,
  TOP: [[2.46, 0.3], [2.4, 0.42], [2.0, 0.54], [1.2, 0.66], [0.9, 0.7], [0, 0.8], [-1.0, 0.88], [-2.0, 0.8], [-2.38, 0.68], [-2.46, 0.5], [-2.46, 0.36]],
  WID: [[2.46, 0.6], [2.2, 0.88], [1.3, 0.98], [0, 1.0], [-1.3, 1.03], [-2.1, 0.98], [-2.46, 0.8]],
  BOT: [[2.46, 0.24], [2.1, 0.12], [-2.1, 0.14], [-2.46, 0.3]],
  ROOF: [[0.9, 0.68], [0.4, 0.95], [0.0, 1.09], [-0.5, 1.1], [-1.0, 0.98], [-1.6, 0.86], [-1.9, 0.8]],
  gh: { hwb: 0.76, hwt: 0.52, n: 3 }, ws: [0.85, 0.1], rg: [-0.75, -1.8], bp: -0.3, rgN: 0.08,
  detail: (p, n, ax, S) => { if (side(n) && p.z < -0.35 && p.z > -0.9 && p.y > 0.4 && p.y < 0.6) return K.grille; if (gapZ(p, n, [0.8, -0.3], 0.2, 0.76)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.55, 0.4, 0.5, 0.05, K.gap); h.lamp(1, 0, 0.25, 0.9, 0.08, K.grille); h.lamp(-1, 0, 0.58, 1.6, 0.07, K.tail); } };
// ---- compact quad-turbo wedge, short tail, tiny nose intake (blue) ----
const EB = { ...DIABLO, ZF: 2.2, ZR: -2.2, ZWF: 1.3, ZWR: -1.25, n: 5, col: [26, 64, 168], wf: 0.24, wr: 0.34,
  TOP: [[2.2, 0.32], [2.16, 0.44], [1.9, 0.52], [1.3, 0.62], [1.05, 0.68], [0, 0.8], [-0.9, 0.92], [-1.9, 0.92], [-2.15, 0.88], [-2.2, 0.64], [-2.2, 0.38]],
  WID: [[2.2, 0.72], [2.0, 0.9], [1.2, 0.95], [0.2, 0.96], [-0.8, 0.98], [-1.9, 0.98], [-2.2, 0.92]],
  ROOF: [[1.05, 0.66], [0.55, 0.93], [0.15, 1.1], [-0.4, 1.125], [-0.9, 1.06], [-1.5, 0.95], [-1.8, 0.92]],
  gh: { hwb: 0.76, hwt: 0.55, n: 4 }, ws: [1.0, 0.18], rg: [-0.8, -1.7], bp: -0.3, rgN: 0.1,
  detail: (p, n, ax, S) => { if (side(n) && p.z < -0.4 && p.z > -0.75 && p.y > 0.62 && p.y < 0.86 && ((p.z * 14) - Math.floor(p.z * 14)) < 0.5) return K.grille; if (gapZ(p, n, [0.9, -0.3], 0.2, 0.8)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.58, 0.44, 0.44, 0.07, K.lens); h.lamp(1, 0, 0.36, 0.2, 0.08, K.grille); h.lamp(1, 0.5, 0.24, 0.4, 0.07, K.grille); h.lamp(-1, 0.56, 0.7, 0.6, 0.1, K.tail); h.lamp(-1, 0, 0.44, 1.5, 0.12, K.grille); } };
// ---- flat-sided angular British wedge with a glass hatch and lip spoiler (dark green) ----
const ESP = { ...DIABLO, ZF: 2.17, ZR: -2.17, ZWF: 1.28, ZWR: -1.18, RT: 0.3, RTR: 0.31, n: 9, col: [36, 84, 58], wf: 0.22, wr: 0.26,
  TOP: [[2.17, 0.34], [2.13, 0.44], [1.8, 0.52], [1.1, 0.62], [0.8, 0.66], [0, 0.76], [-0.9, 0.84], [-1.9, 0.86], [-2.12, 0.86], [-2.17, 0.66], [-2.17, 0.4]],
  WID: [[2.17, 0.74], [2.0, 0.88], [1.2, 0.92], [-1.0, 0.93], [-1.9, 0.92], [-2.17, 0.88]],
  ROOF: [[0.8, 0.64], [0.3, 0.95], [0.0, 1.09], [-0.5, 1.1], [-0.9, 1.02], [-1.6, 0.9], [-1.9, 0.86]],
  gh: { hwb: 0.74, hwt: 0.56, n: 7 }, ws: [0.75, 0.05], rg: [-0.8, -1.8], bp: -0.35, rgN: 0.08,
  detail: (p, n, ax, S) => { if (p.y < 0.34 && n.y > -0.6) return K.black; if (gapZ(p, n, [0.75, -0.4], 0.34, 0.74)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.6, 0.38, 0.4, 0.05, K.amber); h.lamp(-1, 0, 0.66, 1.7, 0.13, K.tail); h.box(1.84, 0.05, 0.16, 0, 0.9, -2.12, K.black); } };

// ================= v9 (Nov 19): three-seat 90s British hypercar, Italian carbon hypercar, white NSX-type =================
const MCF = { ...DIABLO, ZF: 2.14, ZR: -2.14, ZWF: 1.33, ZWR: -1.39, RT: 0.31, RTR: 0.33, n: 3.6, col: [168, 172, 176], wf: 0.23, wr: 0.3,
  TOP: [[2.14, 0.34], [2.1, 0.46], [1.8, 0.56], [1.2, 0.66], [0.95, 0.7], [0, 0.8], [-0.9, 0.88], [-1.8, 0.86], [-2.08, 0.8], [-2.14, 0.62], [-2.14, 0.4]],
  WID: [[2.14, 0.66], [1.95, 0.84], [1.2, 0.9], [0.2, 0.9], [-0.8, 0.91], [-1.8, 0.91], [-2.14, 0.82]],
  BOT: [[2.14, 0.24], [1.95, 0.13], [-1.95, 0.15], [-2.14, 0.3]],
  ROOF: [[0.95, 0.68], [0.5, 0.96], [0.15, 1.12], [-0.35, 1.14], [-0.8, 1.04], [-1.3, 0.92], [-1.6, 0.87]],
  gh: { hwb: 0.72, hwt: 0.48, n: 3.2 }, ws: [0.9, 0.15], rg: [-0.7, -1.5], bp: -0.3, rgN: 0.1,
  detail: (p, n, ax, S) => { if (side(n) && p.z < -0.35 && p.z > -0.85 && p.y > 0.34 && p.y < 0.56) return K.grille; if (gapZ(p, n, [0.85, -0.3], 0.2, 0.78)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.58, 0.46, 0.4, 0.09, K.lens); h.lamp(1, 0, 0.26, 0.9, 0.08, K.grille); h.lamp(-1, 0, 0.6, 1.6, 0.2, K.grille);
    h.lamp(-1, 0.48, 0.62, 0.075, 0, K.tail, true); h.lamp(-1, 0.68, 0.62, 0.075, 0, K.tail, true); h.box(0.2, 0.09, 0.8, 0, 1.15, -0.55, S.col); } };
const ZON = { ...DIABLO, ZF: 2.2, ZR: -2.2, ZWF: 1.3, ZWR: -1.42, n: 4, col: [226, 188, 30], wf: 0.24, wr: 0.34,
  TOP: [[2.2, 0.3], [2.16, 0.42], [1.9, 0.52], [1.4, 0.62], [1.15, 0.68], [0, 0.8], [-0.9, 0.9], [-1.9, 0.86], [-2.15, 0.8], [-2.2, 0.6], [-2.2, 0.36]],
  WID: [[2.2, 0.7], [2.0, 0.92], [1.3, 0.98], [0.2, 0.97], [-0.8, 1.02], [-1.9, 1.02], [-2.2, 0.94]],
  ROOF: [[1.15, 0.66], [0.7, 0.94], [0.3, 1.1], [-0.2, 1.14], [-0.7, 1.06], [-1.3, 0.94], [-1.7, 0.88]],
  gh: { hwb: 0.74, hwt: 0.5, n: 3 }, ws: [1.0, 0.18], rg: [-0.6, -1.6], bp: -0.2, rgN: 0.1,
  detail: (p, n, ax, S) => { if (side(n) && p.z < -0.4 && p.z > -0.9 && p.y > 0.42 && p.y < 0.66) return K.grille; if (gapZ(p, n, [1.0, -0.2], 0.2, 0.78)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.62, 0.46, 0.3, 0.1, K.lens); h.lamp(1, 0, 0.25, 1.1, 0.09, K.grille); h.lamp(-1, 0, 0.5, 1.75, 0.3, K.grille);
    for (const x of [0.56, 0.72, 0.86]) h.lamp(-1, x, 0.72, 0.055, 0, K.tail, true);
    const T = h.THREE, ring = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.06, 28), h.std([22, 22, 24])); ring.rotation.x = Math.PI / 2; ring.position.set(0, 0.5, -2.2); car.add(ring);
    for (const [x, y] of [[-0.075, 0.575], [0.075, 0.575], [-0.075, 0.425], [0.075, 0.425]]) { const e = new T.Mesh(new T.CylinderGeometry(0.058, 0.058, 0.16, 16), h.std([150, 152, 156])); e.rotation.x = Math.PI / 2; e.position.set(x, y, -2.24); car.add(e); }
    h.box(1.76, 0.04, 0.3, 0, 1.08, -1.98, S.col); for (const s of [-1, 1]) h.box(0.05, 0.2, 0.26, s * 0.7, 0.98, -1.96, S.col); } };
const NSXW = { ...NSX, col: [236, 236, 230] };

// ================= v11 (Nov 24): six new cars =================
// ---- 90s V12 flagship: rounded wedge, big hoop wing blended into the rear arches (red) ----
const F50 = { ...F40, ZF: 2.24, ZR: -2.24, ZWF: 1.3, ZWR: -1.28, n: 3.4, col: [190, 24, 22], wf: 0.24, wr: 0.34,
  TOP: [[2.24, 0.3], [2.2, 0.42], [1.9, 0.54], [1.2, 0.68], [0.8, 0.74], [0, 0.82], [-0.9, 0.9], [-1.9, 0.88], [-2.18, 0.84], [-2.24, 0.66], [-2.24, 0.4]],
  WID: [[2.24, 0.66], [2.05, 0.9], [1.2, 0.98], [0.3, 0.95], [-0.6, 0.995], [-1.9, 0.995], [-2.24, 0.9]],
  ROOF: [[0.8, 0.72], [0.35, 0.98], [0.0, 1.11], [-0.45, 1.12], [-0.75, 1.04], [-1.05, 0.93], [-1.3, 0.9]],
  gh: { hwb: 0.74, hwt: 0.52, n: 3.2 },
  detail: (p, n, ax, S) => { if (side(n) && p.y > 0.4 && p.y < 0.44 && p.z < 1.0 && p.z > -1.0) return K.black; if (side(n) && p.z < -0.45 && p.z > -0.85 && p.y > 0.46 && p.y < 0.66) return K.grille; if (gapZ(p, n, [0.75, -0.4], 0.2, 0.8)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(-1, 0, 0.66, 1.7, 0.26, K.grille); h.lamp(-1, 0.5, 0.68, 0.13, 0, K.tail, true); h.lamp(-1, 0.72, 0.68, 0.13, 0, K.tail, true); h.lamp(1, 0, 0.26, 1.0, 0.1, K.grille); h.lamp(1, 0.62, 0.48, 0.34, 0.1, K.lens);
    for (const s of [-1, 1]) h.box(0.1, 0.36, 0.6, s * 0.9, 1.02, -1.9, S.col); h.box(1.9, 0.05, 0.34, 0, 1.2, -2.02, S.col); } };
// ---- modern hybrid hypercar: teardrop cabin, deep front splitter, open mesh tail (orange) ----
const P1 = { ...ZON, ZF: 2.29, ZR: -2.29, ZWF: 1.36, ZWR: -1.31, n: 3, col: [214, 98, 22],
  TOP: [[2.29, 0.3], [2.24, 0.44], [1.95, 0.56], [1.4, 0.66], [1.1, 0.7], [0, 0.82], [-0.9, 0.9], [-1.9, 0.84], [-2.2, 0.78], [-2.29, 0.6], [-2.29, 0.36]],
  WID: [[2.29, 0.66], [2.05, 0.92], [1.3, 0.97], [0.2, 0.93], [-0.8, 0.99], [-1.9, 0.99], [-2.29, 0.9]],
  ROOF: [[1.1, 0.68], [0.65, 0.96], [0.25, 1.12], [-0.25, 1.15], [-0.8, 1.05], [-1.5, 0.9], [-1.9, 0.84]],
  detail: (p, n, ax, S) => { if (p.y < 0.26 && n.y > -0.6) return K.black; if (side(n) && p.z < 0.6 && p.z > -0.8 && p.y > 0.3 && p.y < 0.52 && p.y < 0.3 + (0.6 - p.z) * 0.16) return K.grille; if (gapZ(p, n, [0.95, -0.25], 0.26, 0.8)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0.62, 0.48, 0.3, 0.12, K.lens); h.lamp(1, 0, 0.24, 1.3, 0.1, K.grille); h.lamp(-1, 0, 0.52, 1.8, 0.34, K.grille); h.lamp(-1, 0, 0.74, 1.7, 0.03, K.tail);
    const T = h.THREE, e = new T.Mesh(new T.CylinderGeometry(0.11, 0.11, 0.16, 18), h.std([60, 62, 64])); e.rotation.x = Math.PI / 2; e.position.set(0, 0.5, -2.3); car.add(e);
    h.box(0.24, 0.1, 0.7, 0, 1.17, -0.45, K.black); } };
// ---- 90s Japanese rotary coupe: front engine, long low rounded nose, short tail, wide arches, big wing (white) ----
const FD = { ...R34, ZF: 2.14, ZR: -2.14, ZWF: 1.26, ZWR: -1.17, RT: 0.32, n: 3, col: [234, 234, 228], wf: 0.27, wr: 0.3, wi: 0.09,
  TOP: [[2.14, 0.36], [2.1, 0.5], [1.9, 0.6], [1.3, 0.72], [0.6, 0.82], [0, 0.84], [-1.0, 0.86], [-1.7, 0.84], [-2.05, 0.8], [-2.13, 0.68], [-2.14, 0.42]],
  WID: [[2.14, 0.6], [2.0, 0.84], [1.3, 0.94], [0.2, 0.9], [-0.7, 0.96], [-1.6, 0.95], [-2.0, 0.86], [-2.14, 0.7]],
  BOT: [[2.14, 0.26], [1.95, 0.13], [-1.95, 0.15], [-2.14, 0.3]],
  ROOF: [[0.6, 0.8], [0.15, 1.08], [-0.2, 1.2], [-0.7, 1.2], [-1.1, 1.08], [-1.6, 0.88], [-1.8, 0.84]],
  gh: { hwb: 0.74, hwt: 0.5, n: 3 }, ws: [0.55, -0.15], rg: [-0.8, -1.7], bp: -0.45, rgN: 0.1,
  detail: (p, n, ax, S) => { if (gapZ(p, n, [0.6, -0.5], 0.2, 0.84)) return K.gap; return null; },
  extras: (car, S, h) => { h.lamp(1, 0, 0.3, 0.9, 0.12, K.grille); h.lamp(1, 0.66, 0.36, 0.2, 0.08, K.amber); h.lamp(-1, 0, 0.66, 1.6, 0.11, K.tail);
    const y = h.top(-1.9) + 0.3; h.box(1.7, 0.04, 0.3, 0, y, -1.98, K.black).rotation.x = 0.08; for (const s of [-1, 1]) { h.box(0.04, 0.3, 0.18, s * 0.5, y - 0.15, -1.95, K.black); h.box(0.03, 0.14, 0.34, s * 0.85, y, -1.98, K.black); } } };
// ---- 2000s V10 roadster: long flat rear deck with twin humps, low nose, roof panels on (silver) ----
const CGT = { ...MCF, ZF: 2.3, ZR: -2.3, ZWF: 1.4, ZWR: -1.33, n: 3.4, col: [172, 176, 180],
  TOP: [[2.3, 0.32], [2.25, 0.46], [1.95, 0.58], [1.3, 0.68], [0.95, 0.72], [0, 0.82], [-0.7, 0.92], [-1.9, 0.86], [-2.22, 0.8], [-2.3, 0.62], [-2.3, 0.4]],
  WID: [[2.3, 0.64], [2.05, 0.9], [1.3, 0.96], [0.2, 0.93], [-0.8, 0.96], [-1.9, 0.96], [-2.3, 0.86]],
  ROOF: [[0.95, 0.7], [0.5, 0.96], [0.2, 1.1], [-0.3, 1.13], [-0.6, 1.06], [-0.75, 0.94], [-0.8, 0.92]],
  gh: { hwb: 0.72, hwt: 0.52, n: 3.2 }, rg: null, sideEnd: -0.6, wheel5: true,
  detail: (p, n, ax, S) => {
    if (p.y < 0.2 && n.y > -0.6) return K.black;                                                              // black sill and lower lip all round
    if (rear(p, n, S) && p.y < 0.34) return K.black;                                                          // rear diffuser
    if (side(n) && p.z < -0.28 && p.z > -0.92 && p.y > 0.3 && p.y < 0.36 + (-0.28 - p.z) * 0.62) return K.grille;   // tall side intake ahead of the rear wheel, opening rearwards
    { const e = ((ax - 0.67) / 0.12) ** 2 + ((p.z - 1.78) / 0.33) ** 2;   // long teardrop lamp covers lying back along the wings, two projectors in line
      if (n.y > 0.2 && e < 1) return (Math.hypot(ax - 0.66, p.z - 1.9) < 0.055 || Math.hypot(ax - 0.68, p.z - 1.72) < 0.05) ? K.dark : K.glass; }
    if (n.y > 0.6 && p.z < 2.02 && p.z > 1.0 && (Math.abs(ax - 0.5 - (p.z - 1.0) * 0.08) < 0.007 || (Math.abs(p.z - 1.0) < 0.007 && ax < 0.5))) return K.gap;   // front lid shut lines
    if (n.y > 0.6 && Math.abs(p.z + 2.0) < 0.007 && ax < 0.8) return K.gap;                                    // wing slot line across the tail
    if (gapZ(p, n, [0.9, -0.25], 0.2, 0.78)) return K.gap; return null; },
  extras: (car, S, h) => { const T = h.THREE, add = (g, c, x, y, z) => { const m = new T.Mesh(g, h.std(c)); m.position.set(x, y, z); car.add(m); return m; };
    // nose: wide centre intake and two corner intakes, body-colour bars between
    h.lamp(1, 0, 0.3, 0.6, 0.13, K.grille); h.lamp(1, 0.64, 0.31, 0.26, 0.12, K.grille);
    // tail: full-width mesh grille, slim lamps at the corners, two round pipes set apart inside the mesh
    h.lamp(-1, 0, 0.5, 1.5, 0.2, K.grille); h.lamp(-1, 0.66, 0.71, 0.36, 0.08, K.tail); h.lamp(-1, 0.56, 0.71, 0.06, 0, K.dark, true); h.lamp(-1, 0.74, 0.71, 0.06, 0, K.dark, true);
    for (const s of [-1, 1]) { const e = add(new T.CylinderGeometry(0.06, 0.06, 0.14, 20), [150, 152, 154], s * 0.36, 0.46, -2.3); e.rotation.x = Math.PI / 2;
      // twin tapered humps behind the seats, each with a roll hoop at the front
      const hp = add(new T.SphereGeometry(1, 24, 16), S.col, s * 0.42, 0.88, -1.3); hp.scale.set(0.21, 0.17, 0.78);
      add(new T.SphereGeometry(1, 24, 16), [78, 80, 82], s * 0.42, 0.895, -1.36).scale.set(0.14, 0.17, 0.6);   // dark mesh panel set into the top of each hump
      add(new T.TorusGeometry(0.15, 0.022, 8, 20, Math.PI), [60, 62, 64], s * 0.42, 0.95, -0.72);
      h.box(0.05, 0.24, 0.16, s * 0.56, h.top(-2.08) + 0.1, -2.08, S.col); }
    // big fixed-height rear wing on two uprights, as wide as the tail
    h.box(1.62, 0.035, 0.3, 0, h.top(-2.08) + 0.23, -2.1, S.col).rotation.x = 0.06; } };
const XJG = { ...XJ, col: [22, 78, 70] };

export const SPECS = { r34: R34, ae86: AE86, f40: F40, diablo: DIABLO, count: COUNT, testa: TESTA, nsx: NSX, xj: XJ, eb: EB, esp: ESP, mcf: MCF, zon: ZON, nsxw: NSXW, f50: F50, p1: P1, fd: FD, cgt: CGT, xjg: XJG };
export const buildSpec = k => buildCar(SPECS[k]);
