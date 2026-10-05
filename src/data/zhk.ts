export type Grade = "A" | "B" | "C" | "D";

export type Developer = {
  slug: string;
  name: string;
  objects: number;
  volumeM2: number;
  delayedShare: number; // % объёма с переносом сроков
  since: number;
  apiConnected: boolean;
};

export type Factor = {
  id: string;
  kind: "plus" | "minus";
  type: "forest" | "park" | "water" | "highway" | "rail" | "industry" | "school" | "metro";
  title: string;
  distance: number; // м
  angle: number; // градусы, 0 = север
  note: string;
};

export type Lot = {
  id: string;
  rooms: 0 | 1 | 2 | 3 | 4;
  area: number;
  floor: number;
  floors: number;
  windows: string;
  finish: "Без отделки" | "Предчистовая" | "Чистовая";
  price: number; // руб
};

export type Zhk = {
  slug: string;
  name: string;
  district: string;
  okrug: string;
  coords: [number, number];
  metro: string;
  developer: string;
  grade: Grade;
  ecoFull: boolean;
  priceFrom: number; // млн
  priceTo: number;
  pricePerM2: number; // тыс руб
  aggregatorPerM2: number;
  deadline: string;
  deadlineSort: number;
  photo: string;
  photoPos: string;
  tags: ("clean12" | "forest" | "west" | "reliable")[];
  wind: number[]; // 8 румбов С, СВ, В, ЮВ, Ю, ЮЗ, З, СЗ — доля %
  factors: Factor[];
  lots: Lot[];
  finishOptions: string[];
};

const P1 = "https://cdn.poehali.dev/projects/d17275dc-9a7c-441f-9648-ab923780e85f/files/0ab9cf62-cd2d-46e5-828d-647adc0153f4.jpg";
const P2 = "https://cdn.poehali.dev/projects/d17275dc-9a7c-441f-9648-ab923780e85f/files/0c27140b-72fa-40cc-86f8-32f29c9fc73b.jpg";
const P3 = "https://cdn.poehali.dev/projects/d17275dc-9a7c-441f-9648-ab923780e85f/files/7f5da9dd-2435-4947-bcf8-5d4ce0a37d53.jpg";

export const developers: Developer[] = [
  { slug: "samolet", name: "Самолёт", objects: 54, volumeM2: 4120000, delayedShare: 4, since: 2012, apiConnected: true },
  { slug: "fsk", name: "ФСК", objects: 27, volumeM2: 1980000, delayedShare: 0, since: 2005, apiConnected: true },
  { slug: "granel", name: "Гранель", objects: 19, volumeM2: 1350000, delayedShare: 11, since: 2007, apiConnected: true },
  { slug: "brusnika", name: "Брусника", objects: 8, volumeM2: 610000, delayedShare: 0, since: 2004, apiConnected: true },
  { slug: "level", name: "Level Group", objects: 14, volumeM2: 980000, delayedShare: 0, since: 2010, apiConnected: false },
  { slug: "mic", name: "МИЦ", objects: 16, volumeM2: 1120000, delayedShare: 22, since: 2008, apiConnected: false },
];

const mkLots = (seed: number, base: number, floors: number, west: boolean): Lot[] => {
  const dirs = west ? ["Запад", "Юго-запад", "Запад, двор", "Север"] : ["Восток", "Юг", "Двор", "Север, двор"];
  const finishes: Lot["finish"][] = ["Предчистовая", "Чистовая", "Без отделки"];
  const rooms: Lot["rooms"][] = [0, 1, 1, 2, 2, 3, 1, 2, 3, 4];
  const areas = [24.6, 36.2, 41.8, 54.1, 62.7, 78.3, 39.5, 58.9, 84.2, 102.6];
  return rooms.map((r, i) => {
    const area = areas[i];
    const floor = ((seed * 3 + i * 5) % (floors - 2)) + 2;
    const k = 1 + ((i * 7 + seed) % 9) / 100;
    return {
      id: `L${seed}${i}`,
      rooms: r,
      area,
      floor,
      floors,
      windows: dirs[(i + seed) % dirs.length],
      finish: finishes[(i + seed) % finishes.length],
      price: Math.round((area * base * 1000 * k) / 10000) * 10000,
    };
  });
};

export const zhkList: Zhk[] = [
  {
    slug: "lesnaya-riviera",
    name: "ЖК Лесная Ривьера",
    district: "Новомосковский",
    okrug: "НАО",
    coords: [55.5905, 37.461],
    metro: "Саларьево, 12 мин на авто",
    developer: "samolet",
    grade: "A",
    ecoFull: true,
    priceFrom: 8.4,
    priceTo: 11.9,
    pricePerM2: 214,
    aggregatorPerM2: 229,
    deadline: "IV кв. 2026",
    deadlineSort: 20264,
    photo: P1,
    photoPos: "12% 50%",
    tags: ["clean12", "forest", "reliable"],
    wind: [9, 6, 7, 10, 12, 18, 23, 15],
    factors: [
      { id: "f1", kind: "plus", type: "forest", title: "Ульяновский лесопарк", distance: 180, angle: 300, note: "Смешанный лес, 1 600 га. Ветер чаще всего дует отсюда — к окнам идёт лесной воздух." },
      { id: "f2", kind: "plus", type: "water", title: "Пруд Ракитки", distance: 620, angle: 200, note: "Благоустроенная набережная, прогулочная зона." },
      { id: "f3", kind: "plus", type: "school", title: "Школа на 1 100 мест", distance: 260, angle: 90, note: "Построена в первой очереди, уже работает." },
      { id: "f4", kind: "minus", type: "highway", title: "Калужское шоссе", distance: 1450, angle: 70, note: "За пределами 1 км. Ветер с этой стороны дует редко (7% времени)." },
    ],
    lots: mkLots(1, 214, 17, true),
    finishOptions: ["Предчистовая", "Чистовая"],
  },
  {
    slug: "sosnoviy-kvartal",
    name: "ЖК Сосновый квартал",
    district: "Красногорск",
    okrug: "МО, запад",
    coords: [55.824, 37.33],
    metro: "Мякинино, 15 мин пешком",
    developer: "fsk",
    grade: "A",
    ecoFull: true,
    priceFrom: 7.1,
    priceTo: 10.6,
    pricePerM2: 198,
    aggregatorPerM2: 211,
    deadline: "II кв. 2027",
    deadlineSort: 20272,
    photo: P2,
    photoPos: "50% 40%",
    tags: ["clean12", "forest", "reliable", "west"],
    wind: [10, 7, 6, 8, 11, 17, 24, 17],
    factors: [
      { id: "f1", kind: "plus", type: "forest", title: "Сосновый бор", distance: 90, angle: 280, note: "Лес начинается сразу за забором двора." },
      { id: "f2", kind: "plus", type: "park", title: "Парк «Москва-река»", distance: 740, angle: 160, note: "Набережная с велодорожкой." },
      { id: "f3", kind: "minus", type: "highway", title: "Волоколамское шоссе", distance: 880, angle: 40, note: "В пределах 1 км, но с подветренной стороны: дым и шум уходят от дома." },
    ],
    lots: mkLots(2, 198, 14, true),
    finishOptions: ["Чистовая", "Предчистовая"],
  },
  {
    slug: "tihiy-bereg",
    name: "ЖК Тихий берег",
    district: "Хорошёво-Мнёвники",
    okrug: "СЗАО",
    coords: [55.7775, 37.471],
    metro: "Народное Ополчение, 9 мин",
    developer: "level",
    grade: "B",
    ecoFull: true,
    priceFrom: 9.2,
    priceTo: 11.8,
    pricePerM2: 268,
    aggregatorPerM2: 281,
    deadline: "I кв. 2027",
    deadlineSort: 20271,
    photo: P3,
    photoPos: "50% 55%",
    tags: ["clean12", "west"],
    wind: [8, 6, 8, 11, 13, 17, 22, 15],
    factors: [
      { id: "f1", kind: "plus", type: "water", title: "Москва-река", distance: 140, angle: 250, note: "Окна западной секции выходят на воду." },
      { id: "f2", kind: "plus", type: "park", title: "Серебряный бор", distance: 950, angle: 270, note: "Заповедный лес, пляжи." },
      { id: "f3", kind: "minus", type: "highway", title: "ул. Народного Ополчения", distance: 520, angle: 80, note: "Плотный трафик в часы пик, шумовой фон в восточной секции." },
    ],
    lots: mkLots(3, 268, 24, true),
    finishOptions: ["Предчистовая"],
  },
  {
    slug: "berezoviy-park",
    name: "ЖК Берёзовый парк",
    district: "Мытищи",
    okrug: "МО, север",
    coords: [55.918, 37.765],
    metro: "Медведково, 20 мин на авто",
    developer: "brusnika",
    grade: "A",
    ecoFull: true,
    priceFrom: 7.8,
    priceTo: 12.4,
    pricePerM2: 186,
    aggregatorPerM2: 199,
    deadline: "III кв. 2026",
    deadlineSort: 20263,
    photo: P2,
    photoPos: "80% 50%",
    tags: ["clean12", "forest", "reliable"],
    wind: [9, 6, 7, 9, 13, 19, 22, 15],
    factors: [
      { id: "f1", kind: "plus", type: "forest", title: "Лосиный остров", distance: 410, angle: 160, note: "Национальный парк, один из крупнейших лесов в черте города." },
      { id: "f2", kind: "plus", type: "school", title: "Детский сад", distance: 120, angle: 20, note: "Во дворе комплекса." },
      { id: "f3", kind: "minus", type: "rail", title: "Ярославское направление МЦД", distance: 1100, angle: 90, note: "За пределами 1 км, шум не доходит." },
    ],
    lots: mkLots(4, 186, 12, false),
    finishOptions: ["Чистовая"],
  },
  {
    slug: "zapadnye-okna",
    name: "ЖК Западные окна",
    district: "Одинцово",
    okrug: "МО, запад",
    coords: [55.679, 37.272],
    metro: "Одинцово (МЦД-1), 8 мин",
    developer: "samolet",
    grade: "B",
    ecoFull: true,
    priceFrom: 6.9,
    priceTo: 13.2,
    pricePerM2: 192,
    aggregatorPerM2: 207,
    deadline: "IV кв. 2027",
    deadlineSort: 20274,
    photo: P3,
    photoPos: "20% 50%",
    tags: ["west", "forest"],
    wind: [8, 5, 6, 9, 14, 19, 24, 15],
    factors: [
      { id: "f1", kind: "plus", type: "forest", title: "Одинцовский лес", distance: 350, angle: 260, note: "Прогулочные тропы, лыжня зимой." },
      { id: "f2", kind: "minus", type: "rail", title: "Белорусская ж/д", distance: 610, angle: 30, note: "Электрички и грузовые составы, шум с северной стороны." },
      { id: "f3", kind: "plus", type: "metro", title: "Станция МЦД-1", distance: 700, angle: 10, note: "До Белорусского вокзала — 25 минут." },
    ],
    lots: mkLots(5, 192, 22, true),
    finishOptions: ["Предчистовая", "Без отделки"],
  },
  {
    slug: "yuzhnye-sady",
    name: "ЖК Южные сады",
    district: "Видное",
    okrug: "МО, юг",
    coords: [55.553, 37.709],
    metro: "Домодедовская, 18 мин на авто",
    developer: "granel",
    grade: "C",
    ecoFull: true,
    priceFrom: 6.2,
    priceTo: 10.8,
    pricePerM2: 171,
    aggregatorPerM2: 186,
    deadline: "II кв. 2026",
    deadlineSort: 20262,
    photo: P1,
    photoPos: "70% 50%",
    tags: ["clean12"],
    wind: [9, 7, 7, 10, 12, 18, 22, 15],
    factors: [
      { id: "f1", kind: "minus", type: "highway", title: "МКАД", distance: 720, angle: 0, note: "В пределах 1 км. Северный ветер — 9% времени." },
      { id: "f2", kind: "minus", type: "industry", title: "Промзона «Северная»", distance: 940, angle: 240, note: "Складские комплексы. Находится с наветренной стороны — нужна проверка на месте." },
      { id: "f3", kind: "plus", type: "park", title: "Парк Ёлочки", distance: 300, angle: 120, note: "Новый благоустроенный парк." },
    ],
    lots: mkLots(6, 171, 25, false),
    finishOptions: ["Чистовая", "Предчистовая"],
  },
  {
    slug: "nadezhniy-dom",
    name: "ЖК Остров Мечты",
    district: "Нагатинский Затон",
    okrug: "ЮАО",
    coords: [55.695, 37.684],
    metro: "Технопарк, 11 мин",
    developer: "fsk",
    grade: "B",
    ecoFull: true,
    priceFrom: 11.4,
    priceTo: 19.6,
    pricePerM2: 312,
    aggregatorPerM2: 328,
    deadline: "III кв. 2027",
    deadlineSort: 20273,
    photo: P3,
    photoPos: "60% 40%",
    tags: ["reliable", "west"],
    wind: [8, 6, 7, 10, 13, 18, 23, 15],
    factors: [
      { id: "f1", kind: "plus", type: "water", title: "Москва-река", distance: 200, angle: 270, note: "Панорама на воду из западных квартир." },
      { id: "f2", kind: "plus", type: "park", title: "Парк Коломенское", distance: 900, angle: 150, note: "Музей-заповедник." },
      { id: "f3", kind: "minus", type: "highway", title: "Проспект Андропова", distance: 650, angle: 100, note: "Восточная сторона, с подветренной стороны." },
    ],
    lots: mkLots(7, 312, 30, true),
    finishOptions: ["Чистовая"],
  },
  {
    slug: "promenad",
    name: "ЖК Промышленный квартал",
    district: "Люблино",
    okrug: "ЮВАО",
    coords: [55.68, 37.765],
    metro: "Люблино, 14 мин",
    developer: "mic",
    grade: "D",
    ecoFull: false,
    priceFrom: 7.4,
    priceTo: 12.1,
    pricePerM2: 224,
    aggregatorPerM2: 239,
    deadline: "IV кв. 2026",
    deadlineSort: 20264,
    photo: P1,
    photoPos: "40% 70%",
    tags: [],
    wind: [9, 7, 7, 10, 12, 18, 22, 15],
    factors: [
      { id: "f1", kind: "minus", type: "industry", title: "Промзона Курьяново", distance: 480, angle: 220, note: "Очистные сооружения. С наветренной стороны." },
      { id: "f2", kind: "minus", type: "rail", title: "Курская ж/д", distance: 260, angle: 300, note: "Грузовое движение ночью." },
      { id: "f3", kind: "minus", type: "highway", title: "Ул. Перерва", distance: 150, angle: 30, note: "Магистральная улица рядом с домом." },
    ],
    lots: [],
    finishOptions: ["Без отделки"],
  },
  {
    slug: "zelenaya-gavan",
    name: "ЖК Зелёная гавань",
    district: "Пушкино",
    okrug: "МО, северо-восток",
    coords: [56.011, 37.847],
    metro: "Пушкино (ж/д), 10 мин",
    developer: "granel",
    grade: "A",
    ecoFull: false,
    priceFrom: 6.4,
    priceTo: 9.8,
    pricePerM2: 158,
    aggregatorPerM2: 169,
    deadline: "I кв. 2028",
    deadlineSort: 20281,
    photo: P2,
    photoPos: "30% 60%",
    tags: ["clean12", "forest"],
    wind: [9, 6, 7, 10, 12, 18, 23, 15],
    factors: [
      { id: "f1", kind: "plus", type: "forest", title: "Лесной массив вдоль Серебрянки", distance: 220, angle: 200, note: "По данным кадастра — земли лесного фонда." },
      { id: "f2", kind: "plus", type: "water", title: "Река Серебрянка", distance: 450, angle: 180, note: "По данным кадастра." },
    ],
    lots: mkLots(9, 158, 12, false),
    finishOptions: ["Предчистовая"],
  },
  {
    slug: "kvartal-zapad",
    name: "ЖК Солнечный склон",
    district: "Солнцево",
    okrug: "ЗАО",
    coords: [55.65, 37.404],
    metro: "Солнцево, 7 мин",
    developer: "level",
    grade: "B",
    ecoFull: true,
    priceFrom: 9.6,
    priceTo: 15.2,
    pricePerM2: 251,
    aggregatorPerM2: 266,
    deadline: "II кв. 2027",
    deadlineSort: 20272,
    photo: P3,
    photoPos: "90% 50%",
    tags: ["west", "reliable"],
    wind: [8, 6, 7, 10, 13, 18, 23, 15],
    factors: [
      { id: "f1", kind: "plus", type: "park", title: "Мещерский парк", distance: 800, angle: 60, note: "Лесопарк 200 га." },
      { id: "f2", kind: "minus", type: "highway", title: "Боровское шоссе", distance: 400, angle: 340, note: "С подветренной стороны, но в пределах 1 км." },
    ],
    lots: mkLots(10, 251, 19, true),
    finishOptions: ["Чистовая", "Предчистовая"],
  },
  {
    slug: "rechnoy-bulvar",
    name: "ЖК Речной бульвар",
    district: "Химки",
    okrug: "МО, северо-запад",
    coords: [55.889, 37.445],
    metro: "Ховрино, 16 мин на авто",
    developer: "samolet",
    grade: "C",
    ecoFull: true,
    priceFrom: 8.1,
    priceTo: 14.7,
    pricePerM2: 205,
    aggregatorPerM2: 222,
    deadline: "III кв. 2026",
    deadlineSort: 20263,
    photo: P2,
    photoPos: "10% 40%",
    tags: ["west"],
    wind: [9, 7, 7, 10, 12, 18, 22, 15],
    factors: [
      { id: "f1", kind: "minus", type: "highway", title: "Трасса М-11", distance: 540, angle: 230, note: "С наветренной стороны — нужна проверка шумов и запаха на месте." },
      { id: "f2", kind: "minus", type: "industry", title: "Склады Химки-Север", distance: 870, angle: 310, note: "Логистические терминалы." },
      { id: "f3", kind: "plus", type: "water", title: "Канал им. Москвы", distance: 350, angle: 90, note: "Набережная." },
    ],
    lots: mkLots(11, 205, 21, true),
    finishOptions: ["Предчистовая"],
  },
  {
    slug: "kedrovyi",
    name: "ЖК Кедровый",
    district: "Ленинский",
    okrug: "МО, юг",
    coords: [55.52, 37.77],
    metro: "Бульвар Дм. Донского, 22 мин на авто",
    developer: "brusnika",
    grade: "A",
    ecoFull: true,
    priceFrom: 7.3,
    priceTo: 11.5,
    pricePerM2: 182,
    aggregatorPerM2: 194,
    deadline: "IV кв. 2027",
    deadlineSort: 20274,
    photo: P1,
    photoPos: "55% 30%",
    tags: ["clean12", "forest", "reliable"],
    wind: [9, 6, 7, 10, 12, 18, 23, 15],
    factors: [
      { id: "f1", kind: "plus", type: "forest", title: "Битцевский лес (южная часть)", distance: 260, angle: 320, note: "Лес с наветренной стороны — чистый воздух." },
      { id: "f2", kind: "plus", type: "school", title: "Школа и сад", distance: 150, angle: 100, note: "Внутри квартала." },
    ],
    lots: mkLots(12, 182, 9, false),
    finishOptions: ["Чистовая"],
  },
];

export const gradeText: Record<Grade, string> = {
  A: "Рядом нет трасс, ж/д и промзон в опасной близости",
  B: "Один фактор рядом, но с подветренной стороны",
  C: "Два фактора рядом, нужна проверка",
  D: "Несколько факторов рядом",
};

export const collections = [
  { id: "clean12", title: "Самые чистые ЖК до 12 млн", short: "Самые чистые до 12 млн", count: 48, chips: ["До 12 млн", "Эко A–B", "Сдача до 2028"] },
  { id: "forest", title: "У леса", short: "У леса", count: 31, chips: ["Лес до 500 м", "Эко A–B"] },
  { id: "west", title: "С окнами на запад", short: "С окнами на запад", count: 67, chips: ["Окна на запад", "Вечернее солнце"] },
  { id: "reliable", title: "Надёжные застройщики", short: "Надёжные застройщики", count: 22, chips: ["Без переносов", "Данные ЕРЗ"] },
] as const;

export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug);
export const getZhk = (slug: string) => zhkList.find((z) => z.slug === slug);

export const fmtMln = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtRub = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export const reliabilityText = (share: number) =>
  share === 0 ? "Сроки не переносились" : share <= 15 ? "Переносы случаются" : "У значительной части объёма сроки сдвинуты";

const AIR_TYPES: Factor["type"][] = ["forest", "park", "water", "highway", "rail", "industry"];
const AIR_WORD: Partial<Record<Factor["type"], string>> = {
  forest: "леса",
  park: "парка",
  water: "воды",
  highway: "трассы",
  rail: "ж/д",
  industry: "промзоны",
};
export const windDir = (angle: number) => Math.round((((angle % 360) + 360) % 360) / 45) % 8;

export const mainAirSource = (z: Zhk) => {
  const best = z.factors
    .filter((f) => AIR_TYPES.includes(f.type))
    .map((f) => ({ f, share: z.wind[windDir(f.angle)] }))
    .sort((a, b) => b.share - a.share)[0];
  if (!best) return null;
  const plus = best.f.kind === "plus";
  return {
    plus,
    share: best.share,
    type: best.f.type,
    label: `${plus ? "Воздух" : "Ветер"} с ${AIR_WORD[best.f.type]}`,
  };
};
