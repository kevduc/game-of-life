import { describe, expect, test } from 'vitest';

import { golRule } from './gol-logic';

describe('gol-logic', () => {
  describe('golRule', () => {
    test('Any live cell with fewer than two live neighbours dies, as if by underpopulation', () => {
      expect(golRule(0, 0)).toBe(0);
      expect(golRule(0, 1)).toBe(0);
      expect(golRule(1, 0)).toBe(0);
      expect(golRule(1, 1)).toBe(0);
    });
    test('Any live cell with two or three live neighbours lives on to the next generation', () => {
      expect(golRule(1, 2)).toBe(1);
      expect(golRule(1, 3)).toBe(1);
    });
    test('Any live cell with more than three live neighbours dies, as if by overpopulation', () => {
      [4, 5, 6, 7, 8].forEach((number) => {
        expect(golRule(1, number)).toBe(0);
        expect(golRule(0, number)).toBe(0);
      });
    });
    test('Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction', () => {
      expect(golRule(0, 3)).toBe(1);
    });
  });
});
