import React from "react";
import MapRow from "./mapRow";
import getNearbyTiles from "../tileUtil.js";

import spriteInfo from "../spriteInfo.js";
const { dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;

const MAP_WIDTH = 24;
const MAP_HEIGHT = 24;

function Map(props) {
  const style = {
    top: '0px',
    left: '0px',
    width: '100%',
    minHeight: '75vh',
    backgroundColor: 'gray',
  };

  const wall = (x, y, wallType, worldData) => {
    worldData[y][x].type = 'wall';
    worldData[y][x].wallType = wallType;
    worldData[y][x].empty = false;
    worldData[y][x].z = 1;
    worldData[y][x].sprite.backgroundImage = dungeonSprite;
    if (wallType === 'n') {
      worldData[y][x].sprite.spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
    } else {
      worldData[y][x].sprite.spriteOffset = dungeonTiles[wallType];
    }
    
    return worldData;
  }

  const createFloor = (x, y, worldData) => {
    worldData[y][x].sprite.backgroundImage = floorSprite;
    worldData[y][x].wallType = undefined;
    worldData[y][x].sprite.spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
    worldData[y][x].type = 'ground';
    worldData[y][x].walkable = true;
    worldData[y][x].z = 0;  

    return worldData;
  }

  const buildMap = (mapWidth, mapHeight) => {
    const worldData = [];
    /* X: j, Y: i */
    for (let i=0; i<mapHeight; i++) {
      const thisY = 32 + (32 * i) - (window.innerHeight / 2);
      const thisRow = [];
      for (let j=0; j<mapWidth; j++) {
        /* Move the map to the right by 1/4 the inner window width to center on screen */
        const thisX = 32 * j + (window.innerWidth / 4);

        /* Get isometric coordinates for this tile */
        const { xIso, yIso } = twoDToIso(thisX, thisY);

        /* Create the tile with some defaults */
        const tile = {
          empty: true,
          type: 'empty',
          sprite: {
            spriteOffset: [0,0],
          },
          walkable: false,
          x: j,
          y: i,
          xScreen: thisX,
          yScreen: thisY,
          xIso,
          yIso,
          z: 1,
        };
        thisRow.push(tile);
      };
      worldData.push(thisRow);
    };
    return worldData;  
  }
  
  const worldData = buildMap(MAP_WIDTH, MAP_HEIGHT);

  const newRoom = (worldData) => {
    // get size of array to determine potential size of room
    const mapWidth = worldData[0].length;
    const mapHeight = worldData.length;

    // check random position and room size, see if it fits
    let roomFound = false;
    while (roomFound === false) {
      const roomWidth = Math.floor(mapWidth / 4) + 4;
      const roomHeight = Math.floor(mapHeight / 4) + 4;

      /* Random room position */
      const topLeftX = Math.floor(Math.random() * mapWidth);
      const topLeftY = Math.floor(Math.random() * mapHeight);
      if (roomWidth + topLeftX < mapWidth && roomHeight + topLeftY < mapHeight && roomFound === false) {
        roomFound = true;
        console.log(`New room with top left x: ${topLeftX}, y: ${topLeftY}, width ${roomWidth}, height ${roomHeight}`);

        /* For each row in the new room */
        for (let i=0; i<roomHeight; i++) {
          const y = topLeftY + i;
          /* For each tile in that row of the new room */
          for (let j=0; j<roomWidth; j++) {
            const x = topLeftX + j;

            /* Information about nearby tiles in 8 directions */
            const nearbyTiles = getNearbyTiles(x, y, worldData);
    
            /* Check the existing tile on the map to see what is there and what to do */
            /* Type will be either 'empty', 'wall' or 'ground' */

            if (nearbyTiles.this.type === 'ground') {
              /* This is a floor tile from an old room, we want to keep it.
                 Continue by going to the next tile in the row map */
              continue;
            } 
            
            /* If we got this far, it's time to build new stuff. */

            /* Boolean conditions */
            const northWall = (i === 0);
            const southWall = (i === (roomHeight - 1));
            const westWall = (j === 0)
            const eastWall = (j === (roomWidth - 1));

            const oldTile = (wallType) => {
              return nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === wallType;
            };

            const oldEmpty = (nearbyTiles.this.type === 'empty');

            const nearbyWall = (direction) => {
              if (nearbyTiles[direction] && nearbyTiles[direction].type === 'wall') {
                return nearbyTiles[direction].wallType;
              };
            };

            /* NORTH WALL 
               ========== */
            // NORTHWEST CORNER
            if (northWall && westWall &&
                oldEmpty) {
              worldData = wall(x, y, 'nw', worldData);
              continue;
            }
            if (northWall && westWall && oldTile('e') &&
                nearbyWall('n') === 'e') {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }

            // NORTHEAST CORNER
            if (northWall && eastWall &&
                oldEmpty) {
              worldData = wall(x, y, 'ne', worldData);
              continue;
            }
            if (northWall && eastWall &&
                oldTile('n')) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            }
          
            // NORTH CENTER wall
            if (northWall && !eastWall && !westWall && 
                oldTile('s')) {
              /* North and south walls are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);  
              continue;
            }
            if (northWall && !eastWall && !westWall &&
                oldEmpty) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            }
            if (northWall && !eastWall && !westWall &&
               (oldTile('nw') || oldTile('ne'))) {
              worldData = wall(x, y, 'n', worldData);
              continue;
            }
            if (northWall && !eastWall && !westWall &&
                oldTile('w')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            }           
            if (northWall && !eastWall && !westWall &&
                oldTile('e')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }

            /* WEST WALL */
            if (!northWall && !southWall && westWall &&
                 oldEmpty) {
              worldData = wall(x, y, 'w', worldData);
              continue;
            };
            if (!northWall && !southWall && westWall && 
                oldTile('e')) {
              /* A west wall and an east wall are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);
              continue;
            };
            if (!northWall && !southWall && westWall &&
                oldTile('n') &&
                (nearbyWall('w') === 'n' || 
                 nearbyWall('w') === 'nw' || 
                 nearbyWall('w') === 'swo')) {
              worldData = wall(x, y, 'seo', worldData);
              continue;
            }
            if (!northWall && !southWall && westWall &&
              oldTile('n') &&
              nearbyWall('w') === 'sw') {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            }

            /* EAST WALL */
            if (!northWall && !southWall && eastWall &&
              oldTile('w')) {
              /* A west wall and an east wall are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);
              continue;
            }
            if (!northWall && !southWall && eastWall &&
              oldTile('e')) {
              continue;
            };
            if (!northWall && !southWall && eastWall && oldEmpty) {
              worldData = wall(x, y, 'e', worldData);
              continue;
            }
            if (!northWall && !southWall && eastWall &&
                 oldTile('n')) {
              worldData = wall(x, y, 'swo', worldData);
              continue;
            }
            if (!northWall && !southWall && eastWall &&
                 oldTile('s')) {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            }

            /* SOUTH WALL 
               ========== */
            // southwest corner of room
            if (southWall && westWall &&
                oldEmpty) {
              worldData = wall(x, y, 'sw', worldData);
              continue;
            }
            if (southWall && westWall &&
                nearbyWall('w') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue;
            }
            
            // southeast corner of room
            if (southWall && eastWall &&
                oldEmpty) {
              worldData = wall(x, y, 'se', worldData);  
              continue;
            } 

            if (southWall && eastWall &&
              nearbyWall('e') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue; 
            }         
            if (southWall && eastWall &&
              oldTile('n')) {
              worldData = wall(x, y, 'swo', worldData);
              continue; 
            }

            // south wall center
            if (southWall && !eastWall && !westWall &&
                oldEmpty) {
              worldData = wall(x, y, 's', worldData);
              continue;
            }
            if (southWall && !eastWall && !westWall &&
                oldTile('w')) {
              worldData = wall(x, y, 'neo', worldData);
              continue;
            }
            if (southWall && !eastWall && !westWall &&
                (oldTile('e') || oldTile('ne'))) {
              worldData = wall(x, y, 'nwo', worldData);
              continue;
            }
            if (southWall && !eastWall && !westWall &&
              (oldTile('sw') || oldTile('se')) &&
                nearbyWall('w') === 's') {
              worldData = wall(x, y, 's', worldData);
              continue;
            }
            if (southWall && !eastWall && !westWall &&
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
