import { WorldMap, Point } from "../types.js";

const getRandomCenterPoint = (mapWidth: number, mapHeight: number): Point => {
  const randomX = Math.floor(Math.random() * mapWidth);
  const randomY = Math.floor(Math.random() * mapHeight);

  const centerPoint: Point = {
    x: randomX,
    y: randomY,
  };

  return centerPoint;
};

export const printIslandMap = (map: WorldMap) => {
  for (let y = 0; y < map.length; y++) {
    console.log(
      map[y]
        .join(" ")
        .replaceAll("0", " ")
        .replaceAll("1", "#")
        .replaceAll("2", ".")
    );
  }
};

const createBlankWorldMap = (
  width: number,
  height: number,
  element: number = 0
): WorldMap => {
  // creates an Array2D of element with size w x h
  const worldMap = Array(height)
    .fill(element)
    .map((_) => Array(width).fill(element));

  return worldMap;
};

const getRandomClusterPoint = (
  centerPoint: Point,
  clusterSpread: number
): Point => {
  // get randomized point centered on the center point
  // clusterSpread determines how far away the points can be from the centerPoint
  // larger clusterSpread means larger islands

  // randomize position offset
  const xOffset =
    Math.round(Math.random() * clusterSpread) - clusterSpread * 0.5;
  const yOffset =
    Math.round(Math.random() * clusterSpread) - clusterSpread * 0.5;

  // create new point
  const randomClusterPoint: Point = {
    x: centerPoint.x + xOffset,
    y: centerPoint.y + yOffset,
  };

  return randomClusterPoint;
};

const expandPoint = (
  point: Point,
  mapWidth: number,
  mapHeight: number,
  radius: number
): Point[] => {
  // expands a point with a radius within the given width and height limits of the map
  // this makes "square" islands which is the best for gameplay
  // returns an array of points

  let expandedPoints: Point[] = [];

  // expand from center in a square
  for (let y = -radius; y < radius; y++) {
    for (let x = -radius; x < radius; x++) {
      // creates new point
      const newPoint: Point = {
        x: point.x + x,
        y: point.y + y,
      };

      // checks if point is within the map limits
      if (
        newPoint.x >= 0 &&
        newPoint.x < mapWidth &&
        newPoint.y >= 0 &&
        newPoint.y < mapHeight
      ) {
        // add point to array
        expandedPoints = [...expandedPoints, newPoint];
      }
    }
  }
  // trim duplicates from expandedPoints
  const trimmedExpandedPoints = [...new Set(expandedPoints)];

  return trimmedExpandedPoints;
};

const generateIsland = (
  mapWidth: number,
  mapHeight: number,
  amountClusterPoints: number,
  clusterSpread: number,
  keepFromBorder: boolean
): WorldMap => {
  // generates an island with a given amount of cluster points and clusterSpread

  // keep from border
  const borderInset = keepFromBorder ? 4 : 0;

  // get blank map
  const blankIslandMap = createBlankWorldMap(mapWidth, mapHeight);

  // generates a random center point for the island
  const centerPoint = getRandomCenterPoint(mapWidth, mapHeight);

  // array of points that will be used to generate the island
  let clusterPoints: Point[] = [centerPoint];

  // generate cluster points and add them to the clusterPoints array
  for (let i = 0; i < amountClusterPoints; i++) {
    // generates a new cluster point
    let newClusterPoint = getRandomClusterPoint(centerPoint, clusterSpread);

    while (
      newClusterPoint.x < borderInset ||
      newClusterPoint.x >= mapWidth - borderInset ||
      newClusterPoint.y < borderInset ||
      newClusterPoint.y >= mapHeight - borderInset ||
      newClusterPoint.x === undefined ||
      newClusterPoint.y === undefined
    ) {
      // creates new random clusterpoints until it is within the map limits
      newClusterPoint = getRandomClusterPoint(centerPoint, clusterSpread);
    }

    // add cluster point to array
    clusterPoints = [...clusterPoints, newClusterPoint];
  }

  // filters out points that are outside the map limits, just in case
  const islandPoints = clusterPoints.filter(
    (point) =>
      point.x >= 0 && point.y >= 0 && point.x < mapWidth && point.y < mapHeight
  );

  // expands each of the island points
  for (let clusterPoint of clusterPoints) {
    // expands point with radius
    const expandedPoints = expandPoint(clusterPoint, mapWidth, mapHeight, 1);

    const trimmedPoints: Point[] = [];

    // this is probably not the most efficent way to do this, but it works
    for (let point of expandedPoints) {
      // skip points with undefined properties
      if (point.x === undefined || point.y === undefined) continue;

      // skip points that are already in the trimmedPoints array
      if (trimmedPoints.find((p) => p.x === point.x && p.y === point.y))
        continue;

      // add point to trimmedPoints array
      trimmedPoints.push(point);
    }

    // add points to islandPoints array
    islandPoints.push(...trimmedPoints);
  }

  // trim again?
  const trimmedIslandCoords = [...new Set(Object.values(islandPoints))];

  // add points to MapArray as 1
  for (let { x, y } of trimmedIslandCoords) {
    if (x === undefined || y === undefined || blankIslandMap === undefined)
      break;

    blankIslandMap[y][x] = 1;
  }

  return blankIslandMap;
};

const addIslandToWorldMap = (map: WorldMap, islandMap: WorldMap): WorldMap => {
  // adds island to a existing MapArray
  const copiedMap: WorldMap = [...map];

  // iterates through the islandMap and adds it to the copiedMap
  for (let y = 0; y < copiedMap.length; y++) {
    for (let x = 0; x < copiedMap[0].length; x++) {
      // get current tile from map with island
      const currentTile = islandMap[y][x];
      if (currentTile !== 0) {
        copiedMap[y][x] = currentTile;
      }
    }
  }

  return copiedMap;
};

const generateIslands = (
  mapWidth: number,
  mapHeight: number,
  numIslands: number,
  clusterSpread: number,
  keepFromBorder: boolean
): WorldMap => {
  let islands = [];

  // generate array of islands
  for (let i = 0; i < numIslands; i++) {
    // randomize each cluster's size
    const randomNumberCluster = Math.floor(Math.random() * 16) + 16;

    // generate island
    const newIsland = generateIsland(
      mapWidth,
      mapHeight,
      randomNumberCluster,
      clusterSpread,
      keepFromBorder
    );

    // add island to array
    islands.push(newIsland);
  }

  let worldMap = islands[0]; // map start off as the first island

  if (numIslands < 2) {
    // no need to add more islands if there are less than two
    return worldMap;
  }

  for (let i = 1; i < islands.length; i++) {
    // add islands to map
    worldMap = addIslandToWorldMap(worldMap, islands[i]);
  }

  return worldMap;
};

const smoothenIslands = (
  islandMap: WorldMap
): { smoothendMap: WorldMap; count: number } => {
  // flood fills the islandMap to create a "water" map
  // smooths the map by removing small inlets and inaccessible areas

  let count = 0;

  const rec = (x: number, y: number, target_color: number, color: number) => {
    // recursive function to flood fill the map

    // check if point is within map limits
    if (x < 0 || y < 0 || x >= islandMap[0].length || y >= islandMap.length)
      return;

    // get value of point
    const value = islandMap[y][x];

    // check if point has already been visited
    if (value === color) return;

    // check if point is the target color
    if (value !== target_color) return;

    // eliminate vertical small inlets
    if (y - 1 >= 0 && y + 1 < islandMap.length) {
      if (islandMap[y - 1][x] === 1 && islandMap[y + 1][x] === 1) {
        return;
      }
    } else if (y - 1 < 0 && islandMap[y + 1][x] === 1) {
      return;
    } else if (y + 1 >= islandMap.length && islandMap[y - 1][x] === 1) {
      return;
    }

    // eliminate horizontal small inlets
    if (x - 1 >= 0 && x + 1 < islandMap[0].length) {
      if (islandMap[y][x - 1] === 1 && islandMap[y][x + 1] === 1) {
        return;
      }
    } else if (x - 1 < 0 && islandMap[y][x + 1] === 1) {
      return;
    } else if (x + 1 >= islandMap[0].length && islandMap[y][x - 1] === 1) {
      return;
    }

    // set visited
    islandMap[y][x] = color;

    // increase water tile count
    count++;

    // recursively call flood fill in all directions
    rec(x + 1, y, 0, 2);
    rec(x, y + 1, 0, 2);
    rec(x - 1, y, 0, 2);
    rec(x, y - 1, 0, 2);

    return;
  };

  // lets go!
  rec(0, 0, 0, 2);

  // give all water tiles the same value
  for (let y = 0; y < islandMap.length; y++) {
    for (let x = 0; x < islandMap[0].length; x++) {
      if (islandMap[y][x] === 0) {
        islandMap[y][x] = 1;
      }
    }
  }

  // returns the map and the number of water tiles
  return { smoothendMap: islandMap, count };
};

export const generateIslandMap = (
  mapWidth: number,
  mapHeight: number,
  amountIslands: number,
  clusterSpread: number,
  waterRatio: number = 0.6,
  keepFromBorder: boolean
): WorldMap => {
  // generates maps until a valid map is found
  while (true) {
    const islandMap = generateIslands(
      mapWidth,
      mapHeight,
      amountIslands,
      clusterSpread,
      keepFromBorder
    );

    const { smoothendMap: map, count } = smoothenIslands(islandMap);

    // keep generating new maps until one has enough water
    // lower water ratio if too few maps are valid
    if (count > mapWidth * mapHeight * waterRatio) {
      return map;
    }
  }
};

export const exportedForTesting = {
  createBlankWorldMap,
  getRandomClusterPoint,
  expandPoint,
  getRandomCenterPoint,
  generateIsland,
};
