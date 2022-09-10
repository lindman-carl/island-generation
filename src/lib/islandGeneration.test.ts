import { exportedForTesting, printIslandMap } from "./islandGeneration.js";
import { Point } from "../types.js";
import { findVariance } from "./utils/testingUtils.js";

const {
  createBlankWorldMap,
  getRandomClusterPoint,
  expandPoint,
  getRandomCenterPoint,
  generateIsland,
} = exportedForTesting;

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

    // calculate standard deviation
    const xVariance = findVariance(results.x);
    const yVariance = findVariance(results.y);
    const xStandardDeviation = Math.sqrt(xVariance);
    const yStandardDeviation = Math.sqrt(yVariance);

    // expect low for linear data
    expect(xStandardDeviation).toBeLessThan(0.5);
    expect(yStandardDeviation).toBeLessThan(0.5);
  });
});

describe("expandPoint", () => {
  const TEST_WIDTH = 20;
  const TEST_HEIGHT = 20;
  const TEST_RADIUS = 2;

  // get man random points
  const expandedPoints: Point[][] = Array(100)
    .fill(0)
    .map((_) => {
      const randomPoint = getRandomCenterPoint(TEST_WIDTH, TEST_HEIGHT);
      return expandPoint(randomPoint, TEST_WIDTH, TEST_HEIGHT, TEST_RADIUS);
    });

  test("all points are within boundaries", () => {
    expandedPoints.forEach((pointArray) => {
      pointArray.forEach((point) => {
        // expect all points coordinates to be within map boundaries
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThan(TEST_WIDTH);
        expect(point.y).toBeLessThan(TEST_HEIGHT);
      });
    });
  });

  test("expect no duplicate points", () => {
    expandedPoints.forEach((pointArray) => {
      // remove duplicates
      const noDuplicates = [...new Set(pointArray)];

      // expect no change in length
      expect(pointArray.length).toBe(noDuplicates.length);
    });
  });
});

describe("generateIsland", () => {
  const WIDTH = 20;
  const HEIGHT = 20;
  const NUM_CLUSTER_POINTS = 8;
  const NUM_CLUSTER_SPREAD = 4;
  const islandMap = generateIsland(
    WIDTH,
    HEIGHT,
    NUM_CLUSTER_POINTS,
    NUM_CLUSTER_SPREAD,
    false
  );

  test("map should have correct width and height", () => {
    for (const row of islandMap) {
      expect(row.length).toBe(WIDTH);
    }
    expect(islandMap.length).toBe(HEIGHT);
  });

  test("islandMap has at least as many land tiles as cluster points", () => {
    let numLandTiles = 0;
    islandMap.forEach((row) => {
      numLandTiles += row.reduce((acc, curr) => {
        if (curr === 1) {
          return acc + 1;
        }
        return acc;
      }, 0);
    });

    expect(numLandTiles).toBeGreaterThanOrEqual(NUM_CLUSTER_POINTS);
  });

  test("island should not be generated on borders if keepFromBorder", () => {
    const islandMapKeepFromBorder = generateIsland(
      WIDTH,
      HEIGHT,
      NUM_CLUSTER_POINTS,
      NUM_CLUSTER_SPREAD,
      true
    );

    islandMapKeepFromBorder.forEach((row, indexY) => {
      row.forEach((el, indexX) => {
        if (
          indexY === 0 ||
          indexY === HEIGHT - 1 ||
          indexX === 0 ||
          indexX === WIDTH - 1
        ) {
          expect(el).toBe(0);
        }
      });
    });
  });
});
