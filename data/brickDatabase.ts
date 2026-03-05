export interface BrickData {
  type: string;
  qtyHalf: number;
  qtyFull: number;
  yieldHalf: number;
  yieldFull: number;
}

export const BRICK_DATABASE: BrickData[] = [
  { type: '9cmx19cmx19cm', qtyHalf: 25, qtyFull: 47, yieldHalf: 30, yieldFull: 7 },
  { type: '9cmx19cmx24cm', qtyHalf: 20, qtyFull: 38, yieldHalf: 32, yieldFull: 7.5 },
  { type: '9cmx14cmx24cm', qtyHalf: 26, qtyFull: 38, yieldHalf: 22, yieldFull: 9.96 },
  { type: '9cmx19cmx29cm', qtyHalf: 17, qtyFull: 32, yieldHalf: 40, yieldFull: 8 },
  { type: '9cmx19cmx39cm', qtyHalf: 13, qtyFull: 26, yieldHalf: 65, yieldFull: 11 },
  { type: '11,5cmx19cmx29cm', qtyHalf: 17, qtyFull: 26, yieldHalf: 32, yieldFull: 10 },
  { type: '11,5cmx14cmx24cm', qtyHalf: 26, qtyFull: 31, yieldHalf: 17, yieldFull: 13 },
  { type: '11,5cmx19cmx24cm', qtyHalf: 20, qtyFull: 31, yieldHalf: 24, yieldFull: 9 },
  { type: '14cmx19cmx29cm', qtyHalf: 17, qtyFull: 22, yieldHalf: 28, yieldFull: 12 },
  { type: '14cmx19cmx39cm', qtyHalf: 13, qtyFull: 17, yieldHalf: 42, yieldFull: 18 },
  { type: '14cmx19cmx19cm', qtyHalf: 25, qtyFull: 32, yieldHalf: 19, yieldFull: 9 },
  { type: '19cmx19cmx39cm (CERÂMICO)', qtyHalf: 13, qtyFull: 13, yieldHalf: 32.5, yieldFull: 32.5 },
  { type: '19cmx19cmx39cm (CONCRETO)', qtyHalf: 13, qtyFull: 13, yieldHalf: 32.5, yieldFull: 32.5 },
  { type: '11,5cmx19cmx19cm', qtyHalf: 25, qtyFull: 39, yieldHalf: 23, yieldFull: 10 },
  { type: '9cmx5cmx19cm', qtyHalf: 82, qtyFull: 150, yieldHalf: 9, yieldFull: 5 },
  { type: '9cmx9cmx19cm', qtyHalf: 47, qtyFull: 105, yieldHalf: 14.1, yieldFull: 5.5 },
  { type: '9cmx14cmx19cm', qtyHalf: 37, qtyFull: 50, yieldHalf: 35, yieldFull: 15 },
];
