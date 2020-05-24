import { getSeed } from './util';
import spriteInfo from './spriteUtil';

const { dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;

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
    yIso: iso.y,
  };
};

const buildMap = (mapWidth, mapHeight) => {
  const worldData = [];
  for (let y = 0; y < mapHeight; y += 1) {
    const cartY = tileToCartesian('y', y);
    const thisRow = [];
    for (let x=0; x<mapWidth; x++) {
      /** Move the map to the right by 1/4 the inner window width to center on screen */
      const cartX = tileToCartesian('x', x);

      /** Get isometric coordinates for this tile */
      const { xIso, yIso } = twoDToIso(cartX, cartY);

      /** Create the tile with some defaults */
      const tile = {
        empty: true,
        tileType: 'empty',
        sprite: {
          spriteOffset: [0, 0],
        },
        x,
        y,
        cartX,
        cartY,
        xIso,
        yIso,
        z: 0,
      };
      thisRow.push(tile);
    }
    worldData.push(thisRow);
  }
  return worldData;
};


/** Build a wall */
const createWall = (x, y, wallType, worldData) => {
  const empty = false;
  const tileType = 'wall';
  const z = 1;
  const sprite = {
    backgroundImage: dungeonSprite,
  };
  if (wallType === 'n') {
    sprite.spriteOffset = dungeonTiles.n[Math.floor(getSeed() * dungeonTiles.n.length)];
  } else {
    sprite.spriteOffset = dungeonTiles[wallType];
  }
  Object.assign(
    worldData[y][x],
    {
      empty,
      sprite,
      tileType,
      wallType,
      z,
    },
  );
  return worldData;
};

/** Build a floor */
const createFloor = (x, y, worldData) => {
  const empty = false;
  const tileType = 'ground';
  const wallType = undefined;
  const z = 0;
  const sprite = {
    backgroundImage: floorSprite,
    spriteOffset: floorTiles.tiles[Math.floor(getSeed() * floorTiles.tiles.length)],
  };
  console.log(`creating floor with tileType ${tileType}`);
  Object.assign(
    worldData[y][x],
    {
      empty,
      sprite,
      tileType,
      wallType,
      z,
    },
  );
  console.log(`result ${worldData[y][x].tileType}`);

  return worldData;
};

// const spawn = (thing, tileX, tileY, worldData) => {
//   return worldData;
// };

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
    if (tryTile.tileType === 'ground') {
      // console.log(`found ground at x: ${tryX}, y: ${tryY}`)
      foundFloor = true;
    }
  }
  return [tryX, tryY];
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

export {
  buildMap,
  createWall,
  createFloor,
  getNearbyTiles,
  isoToTwoD,
  placeRandom,
  // spawn,
  tileToCartesian,
  twoDToIso,
};
