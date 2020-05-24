import React from "react";
import MapRow from "./mapRow";
import Player from "./player";
import spriteInfo from "../util/spriteUtil.js";
const { playerSprite, playerTiles, dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;

const { getNearbyTiles, isoTwoTwoD, twoDToIso } = require('../util/tileUtil.js');

const seedrandom = require('seedrandom');

/** Random seed start point. Call getSeed() for a seeded random value  */
let seedKey = 1247;
const getSeed = () => {
  const seed = new seedrandom(seedKey);
  const thisSeed = seed(seedKey);
  seedKey++;
  return thisSeed;
}

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

function tileToCartesian(axis, tileNumber) {
  if (axis === 'x') {
    return 32 * tileNumber + (window.innerWidth / 4);
  } else if (axis === 'y') {
    return 32 + (32 * tileNumber) - (window.innerHeight / 2);
  };
};

/**
 * Functional component to display the main game map.
 * MapRow and MapTile are probably still too thin,
 * need to keep moving code out of this component.
 */
function Map(props) {
  const style = {
    top: '0px',
    left: '0px',
    width: '100%',
    minHeight: '75vh',
    backgroundColor: 'gray',
  };

  /** Load a player character */
  function newPlayer(x, y) {
    /** Get isometric coordinates for this tile */
    const cartX = tileToCartesian('x', x);
    const cartY = tileToCartesian('y', y);
    const { xIso, yIso } = twoDToIso(cartX, cartY);
    const player = {
      type: 'player',
      sprite: {
        backgroundImage: playerSprite,
        spriteOffset: [0,0],
      },
      x,
      y,
      z: 1,
      xIso,
      yIso,
      cartX,
      cartY,
    };  
    return player;
  }

  /** Get a pair of random floor coordinates */
  const placeRandom = (worldData) => {
    // find an empty floor tile
    let foundFloor = false;
    let tryX;
    let tryY;
    while (foundFloor === false) {
      tryX = Math.floor(getSeed() * worldData.length);
      tryY = Math.floor(getSeed() * worldData[0].length);
      let tryTile = worldData[tryY][tryX];
      console.log(tryTile)
      if (tryTile.type === 'ground') {
        console.log(`found ground at x: ${tryX}, y: ${tryY}`)
        foundFloor = true;
      }
    }
    return [tryX, tryY];
  }

  const spawn = (thing, tileX, tileY, worldData) => {
    return worldData;
  }

  

  /** Build a wall */
  const wall = (x, y, wallType, worldData) => {
    const empty = false;
    const type = 'wall';
    const z = 1;
    const sprite = {
      backgroundImage: dungeonSprite,
    };
    if (wallType === 'n') {
      sprite.spriteOffset = dungeonTiles.n[Math.floor(getSeed() * dungeonTiles.n.length)];
    } else {
      sprite.spriteOffset = dungeonTiles[wallType];
    };
    Object.assign(worldData[y][x], { empty, sprite, type, wallType, z });    
    return worldData;
  };

  /** Build a floor */
  const createFloor = (x, y, worldData) => {
    const empty = false;
    const type = 'ground';
    const wallType = undefined;
    const z = 0;  
    const sprite = {
      backgroundImage: floorSprite,
    };
    sprite.spriteOffset = floorTiles.tiles[Math.floor(getSeed() * floorTiles.tiles.length)];

    Object.assign(worldData[y][x], { empty, sprite, type, wallType, z });    
    return worldData;
  }

  const buildMap = (mapWidth, mapHeight) => {
    const worldData = [];
    /** X: j, Y: i */
    for (let i=0; i<mapHeight; i++) {
      const thisY = tileToCartesian('y', i);
      const thisRow = [];
      for (let j=0; j<mapWidth; j++) {
        /** Move the map to the right by 1/4 the inner window width to center on screen */
        const thisX = tileToCartesian('x', j);

        /** Get isometric coordinates for this tile */
        const { xIso, yIso } = twoDToIso(thisX, thisY);

        /** Create the tile with some defaults */
        const tile = {
          empty: true,
          type: 'empty',
          sprite: {
            spriteOffset: [0,0],
          },
          x: j,
          y: i,
          xScreen: thisX,
          yScreen: thisY,
          xIso,
          yIso,
          z: 0,
        };
        thisRow.push(tile);
      };
      worldData.push(thisRow);
    };
    return worldData;  
  }
  
  const worldData = buildMap(MAP_WIDTH, MAP_HEIGHT);

  const newRoom = (worldData, widthTiles, heightTiles, thisTopLeftX, thisTopLeftY) => {
    /** get size of array to determine potential size of room */
    const mapWidth = worldData[0].length;
    const mapHeight = worldData.length;

    /** check random position and room size, see if it fits */
    let roomFound = false;
    while (roomFound === false) {
      const roomWidth = widthTiles || Math.floor(getSeed() * mapWidth / 4) + 4;
      const roomHeight = heightTiles || Math.floor(getSeed() * mapHeight / 4) + 4;

      /** Random room position */
      const topLeftX = thisTopLeftX || Math.floor(getSeed() * mapWidth);
      const topLeftY = thisTopLeftY || Math.floor(getSeed() * mapHeight);
      if (roomWidth + topLeftX < mapWidth && roomHeight + topLeftY < mapHeight && roomFound === false) {
        roomFound = true;
        console.log(`New room with top left x: ${topLeftX}, y: ${topLeftY}, width ${roomWidth}, height ${roomHeight}`);

        /** For each row in the new room */
        for (let i=0; i<roomHeight; i++) {
          const y = topLeftY + i;
          /** For each tile in that row of the new room */
          for (let j=0; j<roomWidth; j++) {
            const x = topLeftX + j;

            /* Information about nearby tiles in 8 directions */
            const nearbyTiles = getNearbyTiles(x, y, worldData);
    
            /** Check the existing tile on the map to see what is there and what to do */
            /** Type will be either 'empty', 'wall' or 'ground' */
            if (nearbyTiles.this.type === 'ground') {
              /** This is a floor tile from an old room, we want to keep it.
                 Continue by going to the next tile in the row map */
              continue;
            } 
            
            /** If we got this far, it's time to build new stuff. */

            /** Boolean conditions */
            const northWall = (i === 0);
            const southWall = (i === (roomHeight - 1));
            const westWall = (j === 0)
            const eastWall = (j === (roomWidth - 1));
            const neCorner = northWall && eastWall;
            const seCorner = southWall && eastWall;
            const swCorner = southWall && westWall;
            const nwCorner = northWall && westWall;
            const southCenter = southWall && !westWall && !eastWall;
            const northCenter = northWall && !westWall && !eastWall;
            const eastCenter = eastWall && !northWall && !southWall;
            const westCenter = westWall && !northWall && !southWall;

            const oldTile = (tileType) => {
              if (nearbyTiles.this.type === 'wall' && 
                  nearbyTiles.this.wallType === tileType) {
                return true;
              }
              if (nearbyTiles.this.type === tileType) {
                return true;
              }
            };

            const nearbyTile = (direction) => {
              if (nearbyTiles[direction] && nearbyTiles[direction].type === 'wall') {
                return nearbyTiles[direction].wallType;
              };
              if (nearbyTiles[direction] && nearbyTiles[direction].type === 'empty') {
                return 'empty';
              };
              if (nearbyTiles[direction] && nearbyTiles[direction].type === 'ground') {
                return 'ground';
              };
              return false;
            };

            /** NORTH WALL 
               ========== */
            /** NORTHWEST CORNER */
            if (nwCorner &&
                oldTile('empty')) {
              worldData = wall(x, y, 'nw', worldData);
              continue;
            };
            if (nwCorner && oldTile('e') &&
                nearbyTile('n') === 'e') {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }

            // NORTHEAST CORNER
            if (neCorner &&
              oldTile('empty')) {
              worldData = wall(x, y, 'ne', worldData);
              continue;
            }
            if (neCorner &&
              oldTile('n')) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            }
            if (neCorner &&
              oldTile('s') &&
              nearbyTile('w') === 'ground') {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            };
            if (neCorner &&
                oldTile('w') &&
               (nearbyTile('n') === 'nw' || nearbyTile('n') === 'w') &&
               (nearbyTile('w') === 'n' || nearbyTile('w') === 'swo')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            };
          
            // NORTH CENTER wall
            if (northCenter && 
                oldTile('s')) {
              /* North and south walls are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);  
              continue;
            }
            if (northCenter &&
              oldTile('empty')) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            };
            if (northCenter &&
               (oldTile('nw') || oldTile('ne'))) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            };
            if (northCenter &&
                oldTile('w')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            };
            if (northCenter &&
                oldTile('e')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            };

            /* WEST WALL */
            if (westCenter &&
              oldTile('empty')) {
              worldData = wall(x, y, 'w', worldData);
              continue;
            };
            if (westCenter && 
                oldTile('e')) {
              /* A west wall and an east wall are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);
              continue;
            };
            if (westCenter &&
                oldTile('n') &&
                (nearbyTile('w') === 'n' || 
                 nearbyTile('w') === 'nw' || 
                 nearbyTile('w') === 'swo')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('n') &&
                nearbyTile('w') === 'sw') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('s') &&
                nearbyTile('w') === 's') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('sw') &&
                nearbyTile('n') === 'w') {
              worldData = wall(x, y, 'w', worldData);
              continue;
            }
            if (westCenter &&
                oldTile('se') &&
                nearbyTile('w') === 's') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('nw') &&
                nearbyTile('n') === 'w') {
              worldData = wall(x, y, 'w', worldData);
              continue;
            };

            /** EAST WALL */
            if (eastCenter && oldTile('w')) {
              worldData = createFloor(x, y, worldData);
              continue;
            };
            if (eastCenter && oldTile('e')) {
              continue;
            };
            if (eastCenter && oldTile('n')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            };
            if (eastCenter && oldTile('s')) {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            };
            if (eastCenter && oldTile('nw')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            };
            if (eastCenter && 
              ((nearbyTile('n') === 'e') || (nearbyTile('n') === 'ne'))) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            };
            if (eastCenter && oldTile('se')) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            };
            if (eastCenter && oldTile('sw')) {
                console.log(`found ${nearbyTile('w')}`)
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            };
            if (eastCenter && oldTile('sw')) {
              worldData = createFloor(x, y, worldData);
              continue;
            };

            if (eastCenter) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            };

            /* SOUTH WALL 
               ========== */
            if (swCorner &&
                nearbyTile('w') === 's' &&
                nearbyTile('n') === 'ground') {
              worldData = wall(x, y, 's', worldData);
              continue;
            };
            if (swCorner &&
                oldTile('w') &&
                nearbyTile('e') === 'ground' &&
               (nearbyTile('n') === 'w' || nearbyTile('n') === 'nw') &&
               (nearbyTile('s') === 'w' || nearbyTile('s') === 'sw')) {
              worldData = wall(x, y, 'w', worldData);
              continue;
            };
            if (swCorner &&
              oldTile('empty') &&
                nearbyTile('ne') === 'ground') {
              worldData = wall(x, y, 'sw', worldData);
              continue;
            };

            if (seCorner &&
                oldTile('empty')) {
              worldData = wall(x, y, 'se', worldData);  
              continue;
            };
            if (seCorner &&
              nearbyTile('e') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue; 
            };
            if (seCorner &&
              oldTile('n')) {
              worldData = wall(x, y, 'swo', worldData);
              continue; 
            };
            if (seCorner &&
              oldTile('w') &&
                nearbyTile('w') === 's') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };

            if (southCenter &&
                oldTile('empty')) {
              worldData = wall(x, y, 's', worldData);
              continue;
            };
            if (southCenter &&
                oldTile('w')) {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };
            if (southCenter &&
                (oldTile('e') || oldTile('ne'))) {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            };
            if (southCenter &&
              (oldTile('sw') || oldTile('se')) &&
                nearbyTile('w') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue;
            };
            if (southCenter &&
                oldTile('nw')) {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };
            if (southCenter &&
                (oldTile('n') || oldTile('nw'))) {
              worldData = createFloor(x, y, worldData); 
              continue;
            };

            /* FLOORS */
            if (!northWall && !southWall && !westWall && !eastWall) {
              // Always paint the floor tiles that are in the center of the new room
              worldData = createFloor(x, y, worldData);
              continue;
            };


          };
        };
      } else {
        // console.log(`room doesn't fit, trying again`);
      }
    }
    // return cleanData(worldData);
    return worldData;
  }

  /* Make a few rooms */
  // let worldArray = newRoom(worldData);
  let worldArray = newRoom(worldData, 12, 12, 0, 0);
  // worldArray = newRoom(worldData, 6, 12, 3, 15);

  // worldArray = placeRandom('foo', worldArray);

  const playerCharacter = newPlayer(5, 5);

  /* Display map */
  return (
    <div style={style} className="App-map"
         >
    {worldArray.map(function(object, i){
      return <MapRow row={object} key={i} />;
    })}
    <Player player={playerCharacter} />
    </div>
  );
}

export default Map;
