import {
  generateValidIslandMap,
  printIslandMap,
} from "./lib/islandGeneration.js";

// generate islandMap
const islandMap = generateValidIslandMap(20, 20, 10, 4, 0.65, false);

// print islandMap
printIslandMap(islandMap);
