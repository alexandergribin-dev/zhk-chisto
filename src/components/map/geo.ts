export type LatLng = [number, number];
export type Area = { n: string | null; ha: number; c: LatLng[][] };
export type Road = { n: string | null; c: LatLng[] };
export type Station = { n: string; c: LatLng; col: string | null };
export type Rail = { u: "m" | "b"; c: LatLng[] };
export type RailStation = { n: string; c: LatLng; d: string[] };
export type FileId =
  | "metro"
  | "green"
  | "industry"
  | "roads"
  | "green-detail"
  | "rail"
  | "rail-stations";

const cache: Partial<Record<FileId, Promise<unknown>>> = {};
export const loadGeo = <T>(id: FileId) =>
  (cache[id] ??= fetch(`/geo/${id}.json`).then((r) => r.json())) as Promise<T>;

const KX = Math.cos((55.75 * Math.PI) / 180) * 111320;
const KY = 111320;

export const offset = (p: LatLng, angleDeg: number, meters: number): LatLng => {
  const a = (angleDeg * Math.PI) / 180;
  return [
    p[0] + (Math.cos(a) * meters) / KY,
    p[1] + (Math.sin(a) * meters) / KX,
  ];
};

const segDist = (p: LatLng, a: LatLng, b: LatLng) => {
  const px = p[1] * KX,
    py = p[0] * KY;
  const ax = a[1] * KX,
    ay = a[0] * KY,
    bx = b[1] * KX,
    by = b[0] * KY;
  const dx = bx - ax,
    dy = by - ay;
  const l = dx * dx + dy * dy;
  const t = l
    ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l))
    : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

export const lineDist = (p: LatLng, line: LatLng[]) => {
  let m = Infinity;
  for (let i = 1; i < line.length; i++)
    m = Math.min(m, segDist(p, line[i - 1], line[i]));
  return m;
};

export const inRing = (p: LatLng, ring: LatLng[]) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [yi, xi] = ring[i],
      [yj, xj] = ring[j];
    if (
      yi > p[0] !== yj > p[0] &&
      p[1] < ((xj - xi) * (p[0] - yi)) / (yj - yi) + xi
    )
      inside = !inside;
  }
  return inside;
};

export const areaDist = (p: LatLng, a: Area) =>
  inRing(p, a.c[0]) ? 0 : lineDist(p, a.c[0]);

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[«»"().,]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 3 &&
        ![
          "шоссе",
          "парк",
          "лесопарк",
          "улица",
          "промзона",
          "часть",
          "южная",
          "северная",
          "западная",
          "восточная",
          "массив",
          "вдоль",
          "трасса",
          "станция",
          "склады",
        ].includes(w),
    );

export const nameScore = (title: string, name: string | null) => {
  if (!name) return 0;
  const n = name.toLowerCase();
  return words(title).some((w) =>
    n.includes(w.slice(0, Math.max(4, w.length - 2))),
  )
    ? 1
    : 0;
};

const dist = (a: LatLng, b: LatLng) =>
  Math.hypot((a[0] - b[0]) * KY, (a[1] - b[1]) * KX);

export type Target =
  | { kind: "area"; geo: Area; anchor: LatLng }
  | { kind: "line"; geo: LatLng[][]; anchor: LatLng }
  | { kind: "point"; geo: LatLng; anchor: LatLng; approx: boolean };

type FactorLike = {
  type: string;
  title: string;
  distance: number;
  angle: number;
};

const best = <T>(items: T[], score: (x: T) => number) => {
  let b: T | null = null;
  let bs = Infinity;
  for (const x of items) {
    const s = score(x);
    if (s < bs) {
      bs = s;
      b = x;
    }
  }
  return b ? { item: b, score: bs } : null;
};

const nearestPoint = (p: LatLng, pts: LatLng[]) =>
  pts.reduce((b, c) => (dist(p, c) < dist(p, b) ? c : b), pts[0]);

const clipLine = (line: LatLng[], center: LatLng, radius: number) => {
  const runs: LatLng[][] = [];
  let cur: LatLng[] = [];
  line.forEach((p, i) => {
    if (dist(p, center) <= radius) {
      if (!cur.length && i > 0) cur.push(line[i - 1]);
      cur.push(p);
    } else if (cur.length) {
      cur.push(p);
      runs.push(cur);
      cur = [];
    }
  });
  if (cur.length > 1) runs.push(cur);
  return runs;
};

export const findTarget = async (
  f: FactorLike,
  home: LatLng,
): Promise<Target> => {
  const guess = offset(home, f.angle, f.distance);
  const fallback: Target = {
    kind: "point",
    geo: guess,
    anchor: guess,
    approx: true,
  };

  if (f.type === "highway") {
    const roads = (await loadGeo<Road[]>("roads")).filter(
      (r) =>
        lineDist(home, r.c) < Math.max(f.distance * 2.5, f.distance + 2500),
    );
    const named = best(
      roads.filter((r) => nameScore(f.title, r.n)),
      (r) => lineDist(home, r.c),
    );
    const geom = best(roads, (r) => lineDist(guess, r.c));
    const pick = named?.item ?? (geom && geom.score <= 600 ? geom.item : null);
    if (!pick) return fallback;
    const same = pick.n ? roads.filter((r) => r.n === pick.n) : [pick];
    const radius = Math.max(2500, lineDist(home, pick.c) * 1.8);
    const geo = same.flatMap((r) => clipLine(r.c, home, radius));
    const all = geo.flat();
    if (!all.length) return fallback;
    return { kind: "line", geo, anchor: nearestPoint(home, all) };
  }

  if (f.type === "forest" || f.type === "park" || f.type === "industry") {
    const ids: FileId[] =
      f.type === "industry" ? ["industry"] : ["green", "green-detail"];
    const sets = await Promise.all(ids.map((id) => loadGeo<Area[]>(id)));
    const areas = sets
      .flat()
      .filter(
        (a) =>
          Math.abs(a.c[0][0][0] - home[0]) < 0.3 &&
          Math.abs(a.c[0][0][1] - home[1]) < 0.5,
      );
    const named = best(
      areas.filter(
        (a) =>
          nameScore(f.title, a.n) &&
          areaDist(home, a) < Math.max(f.distance * 2.5, f.distance + 1500),
      ),
      (a) => areaDist(home, a) - Math.min(a.ha, 500),
    );
    const minHa = f.type === "industry" ? 3 : f.type === "forest" ? 8 : 3;
    const tol = Math.max(300, f.distance * 0.6);
    const geom = best(
      areas.filter(
        (a) =>
          a.ha >= minHa &&
          Math.abs(areaDist(home, a) - f.distance) <= tol &&
          areaDist(guess, a) < 1500,
      ),
      (a) =>
        Math.abs(areaDist(home, a) - f.distance) +
        areaDist(guess, a) * 0.5 -
        Math.min(a.ha, 300),
    );
    const pick = named?.item ?? geom?.item ?? null;
    if (!pick) return fallback;
    return {
      kind: "area",
      geo: pick,
      anchor: inRing(home, pick.c[0]) ? home : nearestPoint(home, pick.c[0]),
    };
  }

  if (f.type === "rail") {
    const rails = (await loadGeo<Rail[]>("rail")).filter(
      (r) =>
        lineDist(home, r.c) < Math.max(f.distance * 2.5, f.distance + 2500),
    );
    const b = best(
      rails,
      (r) =>
        Math.abs(lineDist(home, r.c) - f.distance) + lineDist(guess, r.c) * 0.5,
    );
    if (!b || b.score > 900) return fallback;
    const geo = clipLine(
      b.item.c,
      home,
      Math.max(2500, lineDist(home, b.item.c) * 1.8),
    );
    const all = geo.flat();
    if (!all.length) return fallback;
    return { kind: "line", geo, anchor: nearestPoint(home, all) };
  }

  if (f.type === "metro") {
    const isRail = /мцд|мцк|платформ|электрич|ж\/д/i.test(f.title);
    const pts: { n: string; c: LatLng }[] = isRail
      ? await loadGeo<RailStation[]>("rail-stations")
      : await loadGeo<Station[]>("metro");
    const b = best(
      pts,
      (s) => dist(guess, s.c) - nameScore(f.title, s.n) * 1500,
    );
    return b && b.score <= 1500
      ? { kind: "point", geo: b.item.c, anchor: b.item.c, approx: false }
      : fallback;
  }

  return fallback;
};
