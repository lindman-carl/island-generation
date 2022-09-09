import { exportedForTesting } from "./islandGeneration.js";

const { createBlankWorldMap } = exportedForTesting;

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
