// Walk-in copy of desert/car964.js. build964({ stock: true, colour: [r,g,b] }) = parked road car: plain paint, no number, no wing, no splitter, every lamp dark, silver wheels.
// 964 RSR-style wide-body coupe, built procedurally. Front = local +z. No badges, plates or real sponsor names.
// build964({ livery: 'a' | 'b', number: '7' }) -> THREE.Group with .wheels (spin groups, rotate .rotation.x)
import * as THREE from 'three';

const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
// Catmull-Rom through [[z, v], ...] sorted by descending z
const cr = (pts, z) => { const n = pts.length; if (z >= pts[0][0]) return pts[0][1]; if (z <= pts[n - 1][0]) return pts[n - 1][1];
  let i = 1; while (z < pts[i][0]) i++;
  const p0 = pts[Math.max(0, i - 2)][1], p1 = pts[i - 1][1], p2 = pts[i][1], p3 = pts[Math.min(n - 1, i + 1)][1], t = (pts[i - 1][0] - z) / (pts[i - 1][0] - pts[i][0]);
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t); };

// ---- side and plan profiles (metres) ----
const ZF = 2.16, ZR = -2.17, WB = 2.272, ZWF = WB / 2 - 0.02, ZWR = -WB / 2 - 0.02, RT = 0.33;
const TOP = [[2.16, 0.38], [2.13, 0.5], [2.08, 0.57], [1.98, 0.63], [1.7, 0.68], [1.2, 0.74], [0.85, 0.79], [0.0, 0.8], [-0.9, 0.83], [-1.3, 0.92], [-1.65, 0.87], [-1.95, 0.76], [-2.1, 0.64], [-2.15, 0.52], [-2.17, 0.4]];
const FEN = [[2.16, 0.38], [2.12, 0.5], [2.06, 0.56], [2.0, 0.63], [1.94, 0.73], [1.7, 0.8], [1.2, 0.815], [0.85, 0.8], [0.0, 0.8], [-0.6, 0.83], [-1.0, 0.9], [-1.3, 0.93], [-1.7, 0.88], [-2.0, 0.76], [-2.1, 0.64], [-2.15, 0.52], [-2.17, 0.4]];
const WID = [[2.16, 0.4], [2.13, 0.62], [2.08, 0.74], [1.98, 0.83], [1.75, 0.875], [1.2, 0.88], [0.75, 0.84], [0.2, 0.83], [-0.5, 0.84], [-0.85, 0.89], [-1.2, 0.905], [-1.7, 0.9], [-2.0, 0.86], [-2.1, 0.79], [-2.15, 0.66], [-2.17, 0.45]];
const BOT = [[2.16, 0.32], [2.0, 0.2], [1.7, 0.16], [-1.75, 0.16], [-2.0, 0.2], [-2.17, 0.34]];
const ROOF = [[0.84, 0.79], [0.5, 1.02], [0.15, 1.24], [-0.1, 1.29], [-0.45, 1.27], [-0.8, 1.16], [-1.1, 1.04], [-1.3, 0.96], [-1.45, 0.9]];
const Wz = z => cr(WID, z);

const C = { white: [240, 238, 232], red: [200, 28, 30], blue: [22, 58, 150], orange: [238, 112, 30], dark: [16, 16, 18], gap: [60, 60, 62], glass: [14, 17, 22], grille: [10, 10, 11], tail: [230, 20, 12], refl: [120, 10, 8], amber: [255, 150, 30] };
let EMI = 1.4;
export const NEAR964 = { FRONT: 2.16, REAR: 2.17 };

function livery(liv, p, n) {
  if (liv === 'plain') return C.plain;
  const ax = Math.abs(p.x), side = Math.abs(n.x) > 0.35, rear = n.z < -0.35;
  if (liv === 'a') { // white with a red / blue sweep that starts behind the front wheel and rises over the rear hip, thin orange pinstripe on top
    if (p.z < 0.95 && (side || rear)) { const yc = 0.5 + 0.2 * sm(0.6, -1.9, p.z), th = 0.21 * sm(0.95, -1.5, p.z), d = p.y - yc;
      if (Math.abs(d) < th) return Math.abs(d) < 0.012 ? C.white : d > 0 ? C.red : C.blue;
      if (d > th + 0.012 && d < th + 0.035) return C.orange; }
    return C.white; }
  // 'b': white with a red lower body and a diagonal red sash over the roof behind the doors
  if (p.y < 0.4) return C.red;
  const zc = -0.15 - (1.29 - p.y) * 0.85, dz = Math.abs(p.z - zc);
  if (dz < 0.17) return C.red; if (dz < 0.19) return C.white; if (dz < 0.205) return C.red;
  return C.white;
}

function paintBody(liv, p, n) {
  const ax = Math.abs(p.x), W = Wz(p.z);
  for (const zw of [ZWF, ZWR]) if (Math.hypot(p.y - RT, p.z - zw) < 0.395 && ax < W - 0.025) return [C.dark, null];
  if (n.y < -0.6) return [C.dark, null];
  // panel gaps: doors, front lid
  if (Math.abs(n.x) > 0.5 && p.y > 0.3 && p.y < 0.83 && (Math.abs(p.z - 0.8) < 0.006 || Math.abs(p.z + 0.62) < 0.006)) return [C.gap, null];
  if (n.y > 0.6 && p.z > 0.86 && p.z < 1.98 && Math.abs(ax - 0.5) < 0.006) return [C.gap, null];
  if (n.z > 0.5 && p.z > 1.9) { // front bumper: intakes + indicators
    if (p.y > 0.27 && p.y < 0.38 && ax < 0.62) return [C.grille, null];
    if (p.y > 0.42 && p.y < 0.47 && ax > 0.45 && ax < 0.7) return [C.amber, C.amber]; }
  if (n.z < -0.4 && p.z < -1.95 && p.y > 0.6 && p.y < 0.72 && ax < 0.8) return ax < 0.5 ? [C.refl, C.refl] : [C.tail, C.tail]; // full-width tail bar
  return [livery(liv, p, n), null];
}

const roofAt = z => cr(ROOF, z);
function paintGlasshouse(liv, p, n) {
  const ax = Math.abs(p.x), rz = roofAt(p.z);
  const aLine = y => 0.78 - (y - 0.84) / 0.4 * 0.66, cLine = y => -1.1 + (y - 0.9) / 0.34 * 0.65;
  if (Math.abs(n.x) > 0.55 && p.y > 0.87 && p.y < rz - 0.07 && p.z < aLine(p.y) - 0.06 && p.z > cLine(p.y) + 0.06 && Math.abs(p.z + 0.42) > 0.035) return [C.glass, null];
  if (n.z > 0.3 && p.z > 0.12 && p.y > 0.83 && p.y < 1.21 && Math.abs(n.x) < 0.5) return [C.glass, null];
  if (n.z < -0.2 && p.z < -0.5 && p.y > 0.95 && p.y < 1.2 && Math.abs(n.x) < 0.45) return [C.glass, null];
  return [livery(liv, p, n), null];
}

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
  const m = mat.clone(); m.map = mk(cv); m.emissiveMap = mk(ev); m.emissive = new THREE.Color(0xffffff); m.emissiveIntensity = EMI;
  const mesh = new THREE.Mesh(g, m); mesh.castShadow = mesh.receiveShadow = true; return mesh;
}

function bodyRings() {
  const NS = 230, M = 129, rings = [], n = 5;
  for (let s = 0; s < NS; s++) {
    const z = lerp(ZF, ZR, s / (NS - 1)), W = Wz(z), yt = cr(TOP, z), yf = cr(FEN, z), yb = cr(BOT, z), ym = Math.min(0.5, yt - 0.08), cap = s === 0 || s === NS - 1;
    const ring = [];
    for (let i = 0; i < M; i++) {
      const th = -Math.PI / 2 + 2 * Math.PI * i / (M - 1), c = Math.cos(th), sn = Math.sin(th);
      let x = W * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), y;
      if (sn < 0) y = ym - (ym - yb) * Math.pow(-sn, 2 / n);
      else { const ytx = lerp(yt, yf, sm(0.3, 0.72, Math.abs(x) / W)); y = ym + (ytx - ym) * Math.pow(sn, 2 / n); }
      // wheel wells: push the side in where the arch is
      for (const zw of [ZWF, ZWR]) if (Math.hypot(y - RT, z - zw) < 0.4 && Math.abs(x) > W - 0.34) x = Math.sign(x) * (W - 0.34);
      ring.push(cap ? new THREE.Vector3(x * 0.0, ym, z) : new THREE.Vector3(x, y, z));
    }
    rings.push(ring);
  }
  return rings;
}

function glassRings() {
  const NS = 120, M = 65, rings = [], n = 3.2;
  for (let s = 0; s < NS; s++) {
    const z = lerp(0.84, -1.45, s / (NS - 1)), base = cr(TOP, z) - 0.02, rz = Math.max(base + 0.001, cr(ROOF, z));
    const hwb = Math.min(Wz(z) - 0.05, lerp(0.79, 0.72, sm(-0.7, -1.45, z))), hwt = 0.6, ring = [];
    for (let i = 0; i < M; i++) { const th = Math.PI * i / (M - 1), c = Math.cos(th), sn = Math.sin(th), f = Math.pow(sn, 2 / n);
      ring.push(new THREE.Vector3(Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * lerp(hwb, hwt, f), base + (rz - base) * f, z)); }
    rings.push(ring);
  }
  return rings;
}

function numberDecal(num, style) {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  x.fillStyle = '#f2f0ea'; x.strokeStyle = '#111'; x.lineWidth = 8;
  if (style === 'a') { x.beginPath(); x.arc(128, 128, 118, 0, Math.PI * 2); x.fill(); x.stroke(); }
  else { x.beginPath(); x.roundRect(14, 24, 228, 208, 28); x.fill(); x.stroke(); }
  x.fillStyle = '#111'; x.font = 'bold 150px Helvetica, Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(num, 128, 136);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
}

function makeWheel(width, mats) {
  const spin = new THREE.Group(), o = width / 2;
  const add = (geo, mat, f) => { const m = new THREE.Mesh(geo, mat); f && f(m); m.castShadow = true; spin.add(m); return m; };
  add(new THREE.CylinderGeometry(RT, RT, width, 48), mats.tyre, m => m.rotation.z = Math.PI / 2);
  add(new THREE.TorusGeometry(RT - 0.02, 0.03, 10, 48), mats.tyre, m => { m.rotation.y = Math.PI / 2; m.position.x = o - 0.01; });
  add(new THREE.CylinderGeometry(0.245, 0.245, 0.06, 48, 1, true), mats.chrome, m => { m.rotation.z = Math.PI / 2; m.position.x = o - 0.03; });
  add(new THREE.TorusGeometry(0.245, 0.012, 8, 48), mats.chrome, m => { m.rotation.y = Math.PI / 2; m.position.x = o; });
  add(new THREE.CircleGeometry(0.245, 48), mats.well, m => { m.rotation.y = Math.PI / 2; m.position.x = o - 0.16; });
  add(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 32), mats.disc, m => { m.rotation.z = Math.PI / 2; m.position.x = o - 0.13; });
  // gold cross-laced mesh: 10 V pairs from the hub to the rim
  for (let k = 0; k < 10; k++) for (const sg of [-1, 1]) {
    const a0 = k * Math.PI / 5, a1 = a0 + sg * 0.33, r0 = 0.06, r1 = 0.235, y0 = Math.cos(a0) * r0, z0 = Math.sin(a0) * r0, y1 = Math.cos(a1) * r1, z1 = Math.sin(a1) * r1, L = Math.hypot(y1 - y0, z1 - z0);
    add(new THREE.BoxGeometry(0.03, L, 0.016), mats.gold, m => { m.position.set(o - 0.07, (y0 + y1) / 2, (z0 + z1) / 2); m.rotation.x = -Math.atan2(z1 - z0, y1 - y0); }); }
  add(new THREE.CylinderGeometry(0.075, 0.08, 0.06, 24), mats.gold, m => { m.rotation.z = Math.PI / 2; m.position.x = o - 0.06; });
  add(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16), mats.chrome, m => { m.rotation.z = Math.PI / 2; m.position.x = o - 0.03; });
  return spin;
}

export function build964(opt = {}) {
  const stock = !!opt.stock, liv = stock ? 'plain' : (opt.livery || 'a'), num = String(opt.number ?? '7');
  if (stock) { C.plain = opt.colour || [42, 74, 57]; EMI = 0; C.tail = [112, 24, 20]; C.refl = [78, 16, 14]; C.amber = [150, 92, 40]; }
  const car = new THREE.Group(); car.wheels = [];
  const paintMat = stock ? new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.0 }) : new THREE.MeshPhysicalMaterial({ roughness: 0.3, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08 });
  const body = loft(bodyRings(), true, (p, n) => paintBody(liv, p, n), 1400, 640, paintMat); car.add(body);
  const gh = loft(glassRings(), false, (p, n) => paintGlasshouse(liv, p, n), 700, 320, paintMat); car.add(gh);
  body.material.side = gh.material.side = THREE.DoubleSide;
  car.updateMatrixWorld(true);
  const ray = new THREE.Raycaster(), hit = (o, d) => { ray.set(o, d); const h = ray.intersectObjects([gh, body])[0]; if (!h) return null; return { p: h.point, n: h.face.normal.clone().transformDirection(h.object.matrixWorld) }; };
  const white = stock ? new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(C.plain[0] / 255, C.plain[1] / 255, C.plain[2] / 255, THREE.SRGBColorSpace), roughness: 0.55 }) : new THREE.MeshPhysicalMaterial({ color: 0xf0eee8, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 });
  const mats = { tyre: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.85 }), chrome: new THREE.MeshStandardMaterial(stock ? { color: 0x9c9fa2, metalness: 0.2, roughness: 0.45 } : { color: 0xe6e6e6, metalness: 1, roughness: 0.15 }),
    gold: new THREE.MeshStandardMaterial(stock ? { color: 0xa9acae, metalness: 0.2, roughness: 0.5 } : { color: 0xc9a248, metalness: 0.9, roughness: 0.28 }), well: new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9 }),
    disc: new THREE.MeshStandardMaterial({ color: 0x5a5a5e, metalness: 0.7, roughness: 0.45 }), black: new THREE.MeshStandardMaterial({ color: 0x0e0e10, roughness: 0.6 }) };
  const place = (m, h, off = 0.004) => { m.position.copy(h.p).addScaledVector(h.n, off); m.lookAt(h.p.clone().add(h.n)); car.add(m); return m; };
  // headlights: sloped round lenses in the fender fronts
  for (const s of [-1, 1]) { const h = hit(new THREE.Vector3(s * 0.6, 0.66, 3), new THREE.Vector3(0, 0, -1)); if (!h) continue;
    place(new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshStandardMaterial(stock ? { color: 0x8f9699, roughness: 0.3 } : { color: 0xfff4dc, emissive: 0xfff2d0, emissiveIntensity: 1.2 })), h, 0.012);
    place(new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.014, 8, 32), mats.chrome), h, 0.012); }
  // number roundels on both doors
  const nm = numberDecal(num, liv);
  if (!stock) for (const s of [-1, 1]) { const h = hit(new THREE.Vector3(s * 3, 0.6, 0.25), new THREE.Vector3(-s, 0, 0)); if (h) place(new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), nm), h, 0.006); }
  // door handles
  for (const s of [-1, 1]) { const h = hit(new THREE.Vector3(s * 3, 0.76, -0.45), new THREE.Vector3(-s, 0, 0)); if (h) place(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.03), mats.black), h, 0.012).rotation.z += 0; }
  // aero mirrors on the doors
  for (const s of [-1, 1]) { const h = hit(new THREE.Vector3(s * 3, 0.9, 0.6), new THREE.Vector3(-s, 0, 0)); if (!h) continue;
    const st = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.05), white); st.position.copy(h.p).add(new THREE.Vector3(s * 0.05, 0, 0)); car.add(st);
    const hd = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 12), white); hd.scale.set(0.8, 0.75, 1.3); hd.position.copy(h.p).add(new THREE.Vector3(s * 0.14, 0.02, -0.02)); hd.castShadow = true; car.add(hd); }
  // RSR rear wing on two pylons
  if (!stock) { const zc = -1.9, yl = cr(TOP, zc);
    const w = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.035, 0.42), white); w.position.set(0, yl + 0.3, zc - 0.05); w.rotation.x = 0.1; w.castShadow = true; car.add(w);
    for (const s of [-1, 1]) { const ep = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.46), white); ep.position.set(s * 0.79, yl + 0.27, zc - 0.05); car.add(ep);
      const py = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.18), mats.black); py.position.set(s * 0.42, yl + 0.13, zc); car.add(py); } }
  // splitter, exhaust
  { const sp = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 0.22), mats.black); sp.position.set(0, 0.2, 2.02); if (!stock) car.add(sp);
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 20, 1, true), new THREE.MeshStandardMaterial(stock ? { color: 0x55585a, roughness: 0.6, side: THREE.DoubleSide } : { color: 0x9a8aa8, metalness: 1, roughness: 0.25, side: THREE.DoubleSide })); ex.rotation.x = Math.PI / 2; ex.position.set(-0.45, 0.27, -2.12); car.add(ex); }
  // wheels: 18" gold mesh, wider at the rear
  for (const [zw, wd] of [[ZWF, 0.27], [ZWR, 0.31]]) for (const s of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(s * (Wz(zw) - wd / 2 - 0.015), RT, zw); piv.scale.x = s; const sp = makeWheel(wd, mats); piv.add(sp); car.add(piv); car.wheels.push(sp); }
  car.traverse(o => { if (o.isMesh) o.castShadow = !stock; });
  if (stock) car.scale.x = 0.93;   // road-car width, not the race widebody
  return car;
}
