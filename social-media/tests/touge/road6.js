// v6 route: "Touge at dawn". One mountain pass climbing a slope (uphill is +x) through two hairpins.
export const PTS = [[-30, -100], [-14, -50], [0, 0], [22, 70], [45, 140], [58, 166], [75, 170], [86, 150], [108, 105], [106, 58], [125, 10], [138, -16], [155, -20], [167, 0], [186, 70], [205, 140], [222, 190], [236, 240]];
export const SPEED = 14, T = 12, CUTS = [0, 2, 4, 6, 8, 10, 12], LANE = 1.8, ROADW = 7.4, SLOPE = 0.2;
function cr(p0, p1, p2, p3, t) { const t2 = t * t, t3 = t2 * t; return [0, 1].map(i => 0.5 * (2 * p1[i] + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3)); }
export const LINE = []; { const P = [PTS[0], ...PTS, PTS[PTS.length - 1]]; for (let i = 1; i < P.length - 2; i++) for (let k = 0; k < 40; k++) LINE.push(cr(P[i - 1], P[i], P[i + 1], P[i + 2], k / 40)); LINE.push(PTS[PTS.length - 1]); }
export const ACC = [0]; for (let i = 1; i < LINE.length; i++) ACC.push(ACC[i - 1] + Math.hypot(LINE[i][0] - LINE[i - 1][0], LINE[i][1] - LINE[i - 1][1]));
export const LEN = ACC[ACC.length - 1];
export function at(s) { s = Math.max(0, Math.min(LEN - 0.01, s)); let lo = 1, hi = ACC.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; ACC[m] < s ? lo = m + 1 : hi = m; } const i = lo, L = ACC[i] - ACC[i - 1] || 1e-6, k = (s - ACC[i - 1]) / L, a = LINE[i - 1], b = LINE[i]; const x = a[0] + (b[0] - a[0]) * k, z = a[1] + (b[1] - a[1]) * k; return { x, z, y: SLOPE * x, dx: (b[0] - a[0]) / L, dz: (b[1] - a[1]) / L, s }; }
export function head(s, w = 4) { const a = at(s - w), b = at(s + w); const dx = b.x - a.x, dz = b.z - a.z, n = Math.hypot(dx, dz); return { dx: dx / n, dz: dz / n }; }
export function sNear(x, z) { let b = 0, bd = 1e9; for (let i = 0; i < LINE.length; i++) { const d = (LINE[i][0] - x) ** 2 + (LINE[i][1] - z) ** 2; if (d < bd) { bd = d; b = i; } } return ACC[b]; }
// shot centres: wide on leg 1, chase on leg 1, hairpin 1, the S-bend on leg 2, out of hairpin 2, leg 3
export const MID = [sNear(10, 32), sNear(30, 95), sNear(68, 170), sNear(108, 82), sNear(170, 12), sNear(196, 105)];
export const S0 = MID.map(m => m - SPEED);
export const shotOf = t => { let i = 0; while (i < CUTS.length - 2 && t >= CUTS[i + 1]) i++; return i; };
export const sAt = t => { const sh = shotOf(t); return S0[sh] + SPEED * (t - CUTS[sh]); };
export function carAt(s) { const q = at(s), h = head(s, 2.5); return { ...q, x: q.x - h.dz * LANE, z: q.z + h.dx * LANE, hx: h.dx, hz: h.dz }; }
