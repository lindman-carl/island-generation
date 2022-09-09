import { exportedForTesting } from "./islandGeneration.js";
import { Point } from "../types.js";
import { findVariance } from "./utils/testingUtils.js";

const { createBlankWorldMap, getRandomClusterPoint } = exportedForTesting;

describe("createBlankWorldMap", () => {
  test("should return height*width number of elements", () => {
    const TEST_WIDTH = 20;
    const TEST_HEIGHT = 20;
    const EXPECTED_NUM_ELEMENTS = TEST_WIDTH * TEST_HEIGHT;

    const blankWorldMap = createBlankWorldMap(TEST_WIDTH, TEST_HEIGHT, 0);

    // count length of each subarray
    const numElements = blankWorldMap.reduce(
      (acc, curr) => acc + curr.length,
      0
    );

    // except 20*20 to be 400 lol
    expect(numElements).toBe(EXPECTED_NUM_ELEMENTS);
  });

  test("should have only one type of element", () => {
    const TEST_ELEMENT = 3;
    const TEST_WIDTH = 20;
    const TEST_HEIGHT = 20;
    const EXPECTED_NUM_ELEMENTS = TEST_WIDTH * TEST_HEIGHT;

    const blankWorldMap = createBlankWorldMap(20, 20, TEST_ELEMENT);

    let elementCount = 0;

    // assert all elements equal TEST_ELEMENT
    blankWorldMap.forEach((row) => {
      row.forEach((el) => {
        expect(el).toEqual(TEST_ELEMENT);
        elementCount++;
      });
    });

    expect(elementCount).toBe(EXPECTED_NUM_ELEMENTS);
  });
});

describe("getRandomClusterPoint", () => {
  test("they should be random enough, mean to be close to center", () => {
    // lol this test
    // testing that random is random enough
    // lol
    const centerPoint: Point = {
      x: 8,
      y: 8,
    };

    const results: { x: number[]; y: number[] } = { x: [], y: [] };

    for (let i = 0; i < 1000; i++) {
      const randomClusterPoint = getRandomClusterPoint(centerPoint, 10);

      results.x = [...results.x, randomClusterPoint.x];
      results.y = [...results.y, randomClusterPoint.y];
    }

    const xMean =
      results.x.reduce((acc, curr) => acc + curr, 0) / results.x.length;
    const yMean =
      results.y.reduce((acc, curr) => acc + curr, 0) / results.y.length;

    // this is how far from center the average randomClusterPoint is
    // expect it to be very low for linear spread
    const xOffset = Math.abs(xMean - centerPoint.x);
    const yOffset = Math.abs(yMean - centerPoint.y);

    expect(xOffset).toBeLessThan(0.5);
    expect(yOffset).toBeLessThan(0.5);

    const xVariance = findVariance(results.x);
    const yVariance = findVariance(results.y);

    console.log(xVariance, yVariance);

    const xStandardDeviation = Math.sqrt(xVariance);
    const yStandardDeviation = Math.sqrt(yVariance);

    console.log(xStandardDeviation, yStandardDeviation);

    // expect low for linear data
    expect(xStandardDeviation).toBeLessThan(0.5);
    expect(yStandardDeviation).toBeLessThan(0.5);
  });
});
