// Generic lofted low-poly car for the walk-in block-out. Front = local +z, wheels on y = 0. Parked: every lamp is dark paint, no plate geometry, no recess, no badges.
// buildCar(S): S = { ZF, ZR, ZWF, ZWR, RT, n, TOP, FEN?, WID, BOT, ROOF, gh: { hwb, hwt, n }, ws: [zBase, zTop], rg: [zTop, zBase] | null, bp, col, detail(p, n, ax, S) -> rgb | null, extras(car, S, h) }
import * as THREE from 'three';
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const cr = (pts, z) => { const n = pts.length; if (z >= pts[0][0]) return pts[0][1]; if (z <= pts[n - 1][0]) return pts[n - 1][1];
  let i = 1; while (z < pts[i][0]) i++;
  const p0 = pts[Math.max(0, i - 2)][1], p1 = pts[i - 1][1], p2 = pts[i][1], p3 = pts[Math.min(n - 1, i + 1)][1], t = (pts[i - 1][0] - z) / (pts[i - 1][0] - pts[i][0]);
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t); };
export const K = { dark: [16, 16, 18], gap: [58, 60, 60], glass: [96, 106, 108], grille: [14, 14, 15], tail: [112, 24, 20], amber: [150, 92, 40], lens: [150, 156, 158], black: [24, 25, 26] };
// lofted mesh: rings[s] = array of Vector3 (cols points). Returns mesh with a texture painted per texel from 3D position + normal.
function loft(rings, closed, paint, TW, TH, mat) {
  const NS = rings.length, M = rings[0].length, pos = new Float32Array(NS * M * 3), uv = new Float32Array(NS * M * 2), idx = [];
  rings.forEach((r, s) => r.forEach((v, i) => { const k = s * M + i; pos.set([v.x, v.y, v.z], k * 3); uv.set([s / (NS - 1), i / (M - 1)], k * 2); }));
  for (let s = 0; s < NS - 1; s++) for (let i = 0; i < M - 1; i++) { const a = s * M + i, b = a + M, c = a + 1, d = b + 1; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  if (closed) { // average the seam normals so the bottom seam doesn't crease
    const nr = g.attributes.normal; for (let s = 0; s < NS; s++) { const a = s * M, b = s * M + M - 1, x = nr.getX(a) + nr.getX(b), y = nr.getY(a) + nr.getY(b), z = nr.getZ(a) + nr.getZ(b), l = Math.hypot(x, y, z) || 1; nr.setXYZ(a, x / l, y / l, z / l); nr.setXYZ(b, x / l, y / l, z / l); } }
  const nrm = g.attributes.normal.array;
  const cv = document.createElement('canvas'); cv.width = TW; cv.height = TH; const ctx = cv.getContext('2d'), im = ctx.createImageData(TW, TH);
  const ev = document.createElement('canvas'); ev.width = TW; ev.height = TH; const ectx = ev.getContext('2d'), eim = ectx.createImageData(TW, TH);
  const P = new THREE.Vector3(), N = new THREE.Vector3(), lerp3 = (arr, s0, i0, fs, fi, out) => { const k00 = (s0 * M + i0) * 3, k10 = k00 + M * 3, k01 = k00 + 3, k11 = k10 + 3;
    for (let j = 0; j < 3; j++) out.setComponent(j, (arr[k00 + j] * (1 - fi) + arr[k01 + j] * fi) * (1 - fs) + (arr[k10 + j] * (1 - fi) + arr[k11 + j] * fi) * fs); };
  for (let iv = 0; iv < TH; iv++) for (let iu = 0; iu < TW; iu++) {
    const sf = iu / (TW - 1) * (NS - 1), rf = iv / (TH - 1) * (M - 1), s0 = Math.min(NS - 2, Math.floor(sf)), i0 = Math.min(M - 2, Math.floor(rf));
    lerp3(pos, s0, i0, sf - s0, rf - i0, P); lerp3(nrm, s0, i0, sf - s0, rf - i0, N); N.normalize();
    const [c, e] = paint(P, N), o = (iv * TW + iu) * 4;
    im.data[o] = c[0]; im.data[o + 1] = c[1]; im.data[o + 2] = c[2]; im.data[o + 3] = 255;
    if (e) { eim.data[o] = e[0]; eim.data[o + 1] = e[1]; eim.data[o + 2] = e[2]; } eim.data[o + 3] = 255; }
  ctx.putImageData(im, 0, 0); ectx.putImageData(eim, 0, 0);
  const mk = c => { const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const m = mat.clone(); m.map = mk(cv); m.emissiveMap = mk(ev); m.emissive = new THREE.Color(0xffffff); m.emissiveIntensity = 0;
  const mesh = new THREE.Mesh(g, m); return mesh;
}


export function buildCar(S) {
  const car = new THREE.Group(), Wz = z => cr(S.WID, z), FEN = S.FEN || S.TOP, n = S.n || 5, wells = [[S.ZWF, S.RT], [S.ZWR, S.RTR || S.RT]];
  const rings = [], NS = 230, M = 129;
  for (let s = 0; s < NS; s++) { const z = lerp(S.ZF, S.ZR, s / (NS - 1)), W = Wz(z), yt = cr(S.TOP, z), yf = cr(FEN, z), yb = cr(S.BOT, z), ym = Math.min(S.ym || 0.5, yt - 0.08), cap = s === 0 || s === NS - 1, ring = [];
    for (let i = 0; i < M; i++) { const th = -Math.PI / 2 + 2 * Math.PI * i / (M - 1), c = Math.cos(th), sn = Math.sin(th);
      let x = W * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), y;
      if (sn < 0) y = ym - (ym - yb) * Math.pow(-sn, 2 / n); else { const ytx = lerp(yt, yf, sm(0.3, 0.72, Math.abs(x) / W)); y = ym + (ytx - ym) * Math.pow(sn, 2 / n); }
      for (const [zw, rt] of wells) if (Math.abs(sn) < 0.75 && Math.hypot(y - rt, z - zw) < rt + 0.07 && Math.abs(x) > W - 0.3) x = Math.sign(x) * (W - 0.3);
      ring.push(cap ? new THREE.Vector3(0, ym, z) : new THREE.Vector3(x, y, z)); }
    rings.push(ring); }
  const base = z => cr(S.TOP, z) - 0.02, roof = z => Math.max(base(z) + 0.001, cr(S.ROOF, z)), z0 = S.ROOF[0][0], z1 = S.ROOF[S.ROOF.length - 1][0], ytop = Math.max(...S.ROOF.map(p => p[1]));
  const gr = [], GS = 120, GM = 65, gn = S.gh.n || 3.2;
  for (let s = 0; s < GS; s++) { const z = lerp(z0, z1, s / (GS - 1)), b = base(z), rz = roof(z), hwb = Math.min(Wz(z) - 0.04, S.gh.hwb), ring = [];
    for (let i = 0; i < GM; i++) { const th = Math.PI * i / (GM - 1), c = Math.cos(th), sn = Math.sin(th), f = Math.pow(sn, 2 / gn); ring.push(new THREE.Vector3(Math.sign(c) * Math.pow(Math.abs(c), 2 / gn) * lerp(hwb, S.gh.hwt, f), b + (rz - b) * f, z)); }
    gr.push(ring); }
  const body0 = (p, nn) => { const ax = Math.abs(p.x), W = Wz(p.z);
    for (const [zw, rt] of wells) if (nn.y < 0.55 && Math.hypot(p.y - rt, p.z - zw) < rt + 0.065 && ax < W - 0.02) return K.dark;
    if (nn.y < -0.6) return K.dark;
    const d = S.detail && S.detail(p, nn, ax, S); return d || S.col; };
  const glass0 = (p, nn) => { const ax = Math.abs(p.x), rz = roof(p.z), b = base(p.z), ws = S.ws, rg = S.rg;
    const aL = y => ws[0] - (y - b) / Math.max(0.05, ytop - b) * (ws[0] - ws[1]), cL = y => rg ? rg[1] + (y - b) / Math.max(0.05, ytop - b) * (rg[0] - rg[1]) : z1 + 0.2;
    if (Math.abs(nn.x) > 0.55 && p.y > b + 0.07 && p.y < rz - 0.07 && p.z < aL(p.y) - 0.07 && p.z > cL(p.y) + 0.07 && Math.abs(p.z - S.bp) > 0.035 && (!S.sideEnd || p.z > S.sideEnd)) return K.glass;
    if (nn.z > 0.25 && p.z > ws[1] - 0.02 && p.y > b + 0.05 && p.y < ytop - 0.05 && Math.abs(nn.x) < 0.5) return K.glass;
    if (rg && nn.z < -(S.rgN ?? 0.2) && p.z < rg[0] + 0.02 && p.z > rg[1] + 0.05 && p.y > b + 0.05 && p.y < ytop - 0.05 && Math.abs(nn.x) < 0.45) return K.glass;
    const d = S.ghDetail && S.ghDetail(p, nn, ax, S); return d || S.roofCol || S.col; };
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
  const bodyM = loft(rings, true, (p, nn) => [body0(p, nn), null], 1400, 640, mat); car.add(bodyM); car.updateMatrixWorld(true); car.add(loft(gr, false, (p, nn) => [glass0(p, nn), null], 700, 320, mat));
  const rgb = c => new THREE.Color().setRGB(c[0] / 255, c[1] / 255, c[2] / 255, THREE.SRGBColorSpace), std = c => new THREE.MeshStandardMaterial({ color: rgb(c), roughness: 0.55 });
  const ray = new THREE.Raycaster();
  // lamp(face, ax, y, w, hh, col, round): flat dark lens laid on the nose (face 1) or tail (face -1) at +-ax, following the surface
  const lamp = (face, ax, y, w, hh, col, round) => { for (const s of ax === 0 ? [1] : [-1, 1]) { ray.set(new THREE.Vector3(s * ax, y, face * 6), new THREE.Vector3(0, 0, -face)); const hit = ray.intersectObject(bodyM)[0]; if (!hit) continue;
      const nn = hit.face.normal.clone(); if (nn.z * face < 0) nn.negate(); const m = new THREE.Mesh(round ? new THREE.CircleGeometry(w / 2, 24) : new THREE.PlaneGeometry(w, hh), new THREE.MeshStandardMaterial({ color: rgb(col), roughness: 0.5, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4 }));
      m.position.copy(hit.point).addScaledVector(nn, 0.008); m.lookAt(hit.point.clone().add(nn)); car.add(m); } };
  const h = { THREE, Wz, lamp, top: z => cr(S.TOP, z), std, rgb, box: (w, hh, d, x, y, z, c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), std(c)); m.position.set(x, y, z); car.add(m); return m; } };
  // wheels: plain tyre, silver dish, five dark spokes
  const tyre = std([18, 18, 20]), rim = new THREE.MeshStandardMaterial({ color: 0xa4a7a9, metalness: 0.2, roughness: 0.5 }), dk = std([40, 41, 42]);
  for (const [zw, rt, wd] of [[S.ZWF, S.RT, S.wf || 0.22], [S.ZWR, S.RTR || S.RT, S.wr || 0.25]]) for (const s of [-1, 1]) { const g = new THREE.Group(); g.position.set(s * (Wz(zw) - wd / 2 - (S.wi || 0.015)), rt, zw);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(rt, rt, wd, 40), tyre); t.rotation.z = Math.PI / 2; g.add(t);
    const d = new THREE.Mesh(new THREE.CylinderGeometry(rt * 0.7, rt * 0.7, wd + 0.012, 40), S.rimCol ? std(S.rimCol) : rim); d.rotation.z = Math.PI / 2; g.add(d);
    if (S.wheel5) { d.material = std([26, 26, 28]); const X = s * (wd / 2 + 0.012), sv = std([176, 178, 180]);   // five slim silver spokes on a dark dish, bright rim, centre nut, yellow caliper
      const rr = new THREE.Mesh(new THREE.TorusGeometry(rt * 0.68, 0.022, 8, 40), sv); rr.rotation.y = Math.PI / 2; rr.position.x = X - s * 0.006; g.add(rr);
      const hb = new THREE.Mesh(new THREE.CylinderGeometry(rt * 0.15, rt * 0.15, 0.03, 20), sv); hb.rotation.z = Math.PI / 2; hb.position.x = X; g.add(hb);
      const cp = new THREE.Mesh(new THREE.BoxGeometry(0.01, rt * 0.34, rt * 0.2), std([206, 172, 28])); cp.position.set(X - s * 0.01, rt * 0.08, -rt * 0.44); g.add(cp);
      for (let k = 0; k < 5; k++) { const q = new THREE.Group(); q.rotation.x = k * Math.PI * 2 / 5 + 0.3; const sp = new THREE.Mesh(new THREE.BoxGeometry(0.016, rt * 0.6, rt * 0.13), sv); sp.position.set(X, rt * 0.38, 0); q.add(sp); g.add(q); }
      car.add(g); continue; }
    for (let k = 0; k < 5; k++) { const q = new THREE.Group(); q.rotation.x = k * Math.PI * 2 / 5 + 0.3; const sp = new THREE.Mesh(new THREE.BoxGeometry(0.012, rt * 0.34, rt * 0.34), dk); sp.position.set(s * (wd / 2 + 0.008), rt * 0.42, 0); q.add(sp); g.add(q); }
    car.add(g); }
  for (const s of [-1, 1]) { const zm = S.mirror ?? (S.ws[0] - 0.4), y = cr(S.TOP, zm) + 0.09, x = S.gh.hwb + 0.1, mk = (w, h, d, px, c) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std(c)); m.position.set(s * px, y, zm); car.add(m); };
    mk(0.17, 0.11, 0.08, x + 0.03, S.roofCol || S.col); mk(0.14, 0.05, 0.06, x - 0.1, K.black); }
  S.extras && S.extras(car, S, h);
  car.NEAR = { FRONT: S.ZF, REAR: -S.ZR };
  return car;
}
