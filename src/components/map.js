import React from "react";
import MapRow from "./mapRow";
import getNearbyTiles from "../tileUtil.js";

import spriteInfo from "../spriteInfo.js";
const { dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;

const seedrandom = require('seedrandom');

/** Random seed start point. Call getSeed() for a seeded random value  */
let seedKey = 1237;
const seed = new seedrandom(seedKey);
const getSeed = () => {
  const thisSeed = seed(seedKey);
  seedKey++;
  return thisSeed;
}

/** Map size in 64x32 tiles */
const MAP_WIDTH = 24;
const MAP_HEIGHT = 24;

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

  /** Build a wall */
  const wall = (x, y, wallType, worldData) => {
    const empty = false;
    const type = 'wall';
    const z = 1;
    const sprite = {
      backgroundImage: dungeonSprite,
    };
    if (wallType === 'n') {
      sprite.spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
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
    sprite.spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];

    Object.assign(worldData[y][x], { empty, sprite, type, wallType, z });    
    return worldData;
  }

  const buildMap = (mapWidth, mapHeight) => {
    const worldData = [];
    /** X: j, Y: i */
    for (let i=0; i<mapHeight; i++) {
      const thisY = 32 + (32 * i) - (window.innerHeight / 2);
      const thisRow = [];
      for (let j=0; j<mapWidth; j++) {
        /** Move the map to the right by 1/4 the inner window width to center on screen */
        const thisX = 32 * j + (window.innerWidth / 4);

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

  const newRoom = (worldData) => {
    /** get size of array to determine potential size of room */
    const mapWidth = worldData[0].length;
    const mapHeight = worldData.length;

    /** check random position and room size, see if it fits */
    let roomFound = false;
    while (roomFound === false) {
      const roomWidth = Math.floor(getSeed() * mapWidth / 4) + 4;
      const roomHeight = Math.floor(getSeed() * mapHeight / 4) + 4;

      /** Random room position */
      // const topLeftX = Math.floor(Math.random() * mapWidth);
      // const topLeftY = Math.floor(Math.random() * mapHeight);
      const topLeftX = Math.floor(getSeed() * mapWidth);
      const topLeftY = Math.floor(getSeed() * mapHeight);
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

            const oldTile = (wallType) => {
              return nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === wallType;
            };

            const oldEmpty = (nearbyTiles.this.type === 'empty');

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
                oldEmpty) {
              worldData = wall(x, y, 'nw', worldData);
              continue;
            }
            if (nwCorner && oldTile('e') &&
                nearbyTile('n') === 'e') {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }

            // NORTHEAST CORNER
            if (neCorner &&
                oldEmpty) {
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
            }
            if (neCorner &&
                oldTile('w') &&
               (nearbyTile('n') === 'nw' || nearbyTile('n') === 'w') &&
               (nearbyTile('w') === 'n' || nearbyTile('w') === 'swo')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            }
          
            // NORTH CENTER wall
            if (northCenter && 
                oldTile('s')) {
              /* North and south walls are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);  
              continue;
            }
            if (northCenter &&
                oldEmpty) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            }
            if (northCenter &&
               (oldTile('nw') || oldTile('ne'))) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            }
            if (northCenter &&
                oldTile('w')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            }           
            if (northCenter &&
                oldTile('e')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }

            /* WEST WALL */
            if (westCenter &&
                 oldEmpty) {
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
            }
            if (westCenter &&
                oldTile('n') &&
                nearbyTile('w') === 'sw') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            }
            if (westCenter &&
                oldTile('s') &&
                nearbyTile('w') === 's') {
                worldData = wall(x, y, 'neo', worldData);
                continue;
              }
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
            }
            if (westCenter &&
                oldTile('nw') &&
                nearbyTile('n') === 'w') {
              worldData = wall(x, y, 'w', worldData);
              continue;
            }

            /** EAST WALL */
            if (eastCenter && oldTile(undefined)) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            };
            if (eastCenter && oldTile('w')) {
              worldData = createFloor(x, y, worldData);
              continue;
            }
            if (eastCenter && oldTile('e')) {
              continue;
            }
            if (eastCenter && oldTile('n')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }
            if (eastCenter && oldTile('s')) {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            }
            if (eastCenter && oldTile('nw')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }
            if (eastCenter && 
              ((nearbyTile('n') === 'e') || (nearbyTile('n') === 'ne'))) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            }
            if (eastCenter && oldTile('se')) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            }
            if (eastCenter && oldTile('sw')) {
              worldData = createFloor(x, y, worldData);

              continue;
            }

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
                oldEmpty &&
                nearbyTile('ne') === 'ground') {
              worldData = wall(x, y, 'sw', worldData);
              continue;
            };

            if (seCorner &&
                oldEmpty) {
              worldData = wall(x, y, 'se', worldData);  
              continue;
            } 
            if (seCorner &&
              nearbyTile('e') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue; 
            }         
            if (seCorner &&
              oldTile('n')) {
              worldData = wall(x, y, 'swo', worldData);
              continue; 
            }
            if (seCorner &&
              oldTile('w') &&
                nearbyTile('w') === 's') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            };

            if (southCenter &&
                oldEmpty) {
              worldData = wall(x, y, 's', worldData);
              continue;
            }
            if (southCenter &&
                oldTile('w')) {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            }
            if (southCenter &&
                (oldTile('e') || oldTile('ne'))) {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            }
            if (southCenter &&
              (oldTile('sw') || oldTile('se')) &&
                nearbyTile('w') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue;
            }
            if (southCenter &&
                oldTile('nw')) {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            }
            if (southCenter &&
                (oldTile('n') || oldTile('nw'))) {
              worldData = createFloor(x, y, worldData); 
              continue;
            }

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

  // function isoToTwoD(x, y) {
  //   const twoD = {};
  //   twoD.x = (2 * y + x) / 2;
  //   twoD.y = (2 * y - x) / 2;
  //   return twoD;
  // };
  
  function twoDToIso(x, y) {
    const iso = {};
    iso.x = x - y;
    iso.y = (x + y) / 2;
    return {
      xIso: iso.x, 
      yIso: iso.y 
    };
  };

  /* Make a few rooms */
  let worldArray = newRoom(worldData);
  worldArray = newRoom(worldData);
  worldArray = newRoom(worldData);

  /* Display map */
  return (
    <div style={style} className="App-map">
    {worldArray.map(function(object, i){
      return <MapRow row={object} key={i} />;
    })}
    </div>
  );
}

export default Map;
