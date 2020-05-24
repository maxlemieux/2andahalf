import { getSeed } from './util';


const spawn = (thing, tileX, tileY, worldData) => {
  return worldData;
};

/** Get a pair of random floor coordinates */
const placeRandom = (worldData) => {
  // find an empty floor tile
  let foundFloor = false;
  let tryX;
  let tryY;
  while (foundFloor === false) {
    tryX = Math.floor(getSeed() * worldData.length);
    tryY = Math.floor(getSeed() * worldData[0].length);
    const tryTile = worldData[tryY][tryX];
    if (tryTile.type === 'ground') {
      // console.log(`found ground at x: ${tryX}, y: ${tryY}`)
      foundFloor = true;
    }
  }
  return [tryX, tryY];
};

const tileToCartesian = (axis, tileNumber) => {
  if (axis === 'x') {
    return 32 * tileNumber + (window.innerWidth / 4);
  }
  if (axis === 'y') {
    return 32 + (32 * tileNumber) - (window.innerHeight / 2);
  }
  return undefined;
};

const isoToTwoD = (x, y) => {
  const twoD = {};
  twoD.x = (2 * y + x) / 2;
  twoD.y = (2 * y - x) / 2;
  return twoD;
};

const twoDToIso = (x, y) => {
  const iso = {};
  iso.x = x - y;
  iso.y = (x + y) / 2;
  return {
    xIso: iso.x, 
    yIso: iso.y 
  };
};

const getNearbyTiles = (x, y, worldData) => {
  const nearbyTiles = {
    w: null,
    nw: null,
    n: null,
    ne: null,
    e: null,
    sw: null,
    s: null,
    se: null,
    this: null,
  };
  if (x > 0) {
    nearbyTiles.w = worldData[y][x - 1];
  }
  if (x > 0 && y > 0) {
    nearbyTiles.nw = worldData[y - 1][x - 1];
  }
  if (y < worldData.length - 1) {
    nearbyTiles.s = worldData[y + 1][x];
  }
  if (x > 0 && y < worldData.length - 1) {
    nearbyTiles.sw = worldData[y + 1][x - 1];
  }
  if (x < worldData[0].length) {
    nearbyTiles.e = worldData[y][x + 1];
  }
  if (x < worldData[0].length && y < worldData.length - 1) {
    nearbyTiles.se = worldData[y + 1][x + 1];
  }
  if (y > 0) {
    nearbyTiles.n = worldData[y - 1][x];
  }
  if (y > 0 && x < worldData[0].length) {
    nearbyTiles.ne = worldData[y - 1][x + 1];
  }

  nearbyTiles.this = worldData[y][x];

  return nearbyTiles;
};

module.exports = {
  getNearbyTiles,
  twoDToIso,
  isoToTwoD,
  tileToCartesian,
  placeRandom,
  spawn,
};
