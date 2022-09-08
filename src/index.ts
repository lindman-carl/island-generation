import { generateIslandMap, printIslandMap } from "./lib/islandGeneration.js";

// generate islandMap
const islandMap = generateIslandMap(20, 20, 10, 4, 0.65, false);
// print islandMap
printIslandMap(islandMap);
