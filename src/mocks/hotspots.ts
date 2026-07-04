import { DISTRICTS } from "./firs";

export interface Hotspot {
  district: string;
  x: number; // 0-100 (svg coord)
  y: number;
  intensity: number; // 0-100
  cases: number;
  dominant: string;
  trend: number; // % change
}

// Rough relative positions of KA districts on a stylised map (not geographic)
const POS: Record<string, [number, number]> = {
  "Bengaluru Urban": [72, 62],
  "Bengaluru Rural": [70, 56],
  Mysuru: [58, 78],
  Mangaluru: [30, 72],
  Belagavi: [22, 20],
  Kalaburagi: [55, 12],
  "Hubballi-Dharwad": [32, 34],
  Tumakuru: [62, 55],
  Shivamogga: [42, 55],
  Ballari: [58, 32],
  Vijayapura: [40, 15],
  Udupi: [28, 62],
  Chitradurga: [55, 45],
  Hassan: [48, 65],
};

const CRIME_DOM = ["Theft", "Vehicle Theft", "Cybercrime", "Robbery", "Cheating"];

export function generateHotspots(): Hotspot[] {
  return DISTRICTS.map((d, i) => {
    const p = POS[d] ?? [50, 50];
    return {
      district: d,
      x: p[0],
      y: p[1],
      intensity: 25 + ((i * 37) % 75),
      cases: 40 + ((i * 53) % 220),
      dominant: CRIME_DOM[i % CRIME_DOM.length],
      trend: (i % 2 === 0 ? 1 : -1) * (2 + (i % 9)),
    };
  });
}
