import React from "react";
import MapRow from "./mapRow";
import getNearbyTiles from "../tileUtil.js";

import spriteInfo from "../spriteInfo.js";
const { dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;

const seedrandom = require('seedrandom');
const RANDOM_KEY = 'fdsafdsfaoo';
const worldSeed = new seedrandom(RANDOM_KEY)();

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
          spriteOffset: [0,0],
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
      const roomWidth = Math.floor(worldSeed * mapWidth / 4) + 4;
      const roomHeight = Math.floor(worldSeed * mapHeight / 4) + 4;

      /* For some reason, using seedrandom on the topLeftX and topLeftY breaks everything */
      // const topLeftX = Math.floor(worldSeed * mapWidth);
      // const topLeftY = Math.floor(worldSeed * mapHeight);

      /* Random room position */
      const topLeftX = Math.floor(Math.random() * mapWidth);
      const topLeftY = Math.floor(Math.random() * mapHeight);
      if (roomWidth + topLeftX < mapWidth && roomHeight + topLeftY < mapHeight && roomFound === false) {
        roomFound = true;
        console.log(`New room with top left x: ${topLeftX}, y: ${topLeftY}, width ${roomWidth}, height ${mapHeight}`);

        /* For each row in the new room */
        for (let i=0; i<roomHeight; i++) {
          const y = topLeftY + i;
          /* For each tile in that row of the new room */
          for (let j=0; j<roomWidth; j++) {
            const x = topLeftX + j;

            /* Object containing information about nearby tiles in 8 directions */
            const nearbyTiles = getNearbyTiles(x, y, worldData);
    
            /* Check the existing tile on the map to see what is there and what to do */
            /* Type will be either 'empty', 'wall' or 'ground' */

            if (nearbyTiles.this.type === 'ground') {
              /* This is a floor tile from an old room, we want to keep it.
                 Continue by going to the next tile in the row map */
              continue;
            } 
            
            /* If we got this far, it's time to build new stuff. */

            /* Boolean conditions to use */
            const northWall = (i === 0);
            const westWall = (j === 0)
            const eastWall = (j === (roomWidth - 1));
            const southWall = (i === (roomHeight - 1));

            const oldTile = (wallType) => {
              return nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === wallType;
            }

            /* NORTH WALL */
            
            // NORTHWEST CORNER of room
            /* Old tile was empty */
            if (northWall && westWall && nearbyTiles.this.type === 'empty')
            {
              worldData[y][x].wallType = 'corner_nw_inner';
              worldData[y][x].spriteOffset = dungeonTiles.nw;
            }
            /* Old tile was a North wall */
            if (northWall && westWall && oldTile('wall_n') )
            {
              worldData[y][x].wallType = 'wall_n';
              worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
            }

            // NORTHEAST CORNER of room
            /* Old tile was empty */
            if (northWall && eastWall && nearbyTiles.this.type === 'empty') {
              worldData[y][x].wallType = 'corner_ne_inner';
              worldData[y][x].spriteOffset = dungeonTiles.ne;
            }
            /* Old tile was a North wall */
            if (northWall && eastWall && oldTile('wall_n')) {
              worldData[y][x].wallType = 'wall_n';
              worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
            }
          
            // NORTH CENTER wall
            if (oldTile('wall_s') && 
              northWall && !eastWall && !westWall) {
              /* North and south walls are overlapping, make a floor */
              worldData[y][x].backgroundImage = floorSprite;
              worldData[y][x].wallType = undefined;
              worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              worldData[y][x].type = 'ground';
              worldData[y][x].walkable = true;
              worldData[y][x].z = 0;  
            }

            if (nearbyTiles.this.type === 'empty' &&
                northWall && !eastWall && !westWall)
            {
              worldData[y][x].wallType = 'wall_n';
              worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
            }

            if ((oldTile('corner_nw_inner') || oldTile('corner_ne_inner')) &&
               northWall && !eastWall && !westWall)
            {
              worldData[y][x].wallType = 'wall_n';
              worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
            }

            if ((oldTile('wall_w') || oldTile('corner_se_inner') || oldTile('corner_sw_inner')) && 
              northWall && !eastWall && !westWall)
            {
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
            }

            if ((oldTile('wall_e') || oldTile('corner_sw_inner')) &&
               northWall && !eastWall && !westWall)
            {
              worldData[y][x].wallType = 'corner_sw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.swo;
            }
            if (northWall && westWall && oldTile('corner_sw_inner')) 
            {
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
            }
            
            /* SOUTH WALL */
            if (southWall && westWall) {
              // southwest corner of room
              worldData[y][x].wallType = 'corner_sw_inner';
              worldData[y][x].spriteOffset = dungeonTiles.sw;
            }
            if (southWall && eastWall) {
              // southeast corner of room
              worldData[y][x].wallType = 'corner_se_inner';
              worldData[y][x].spriteOffset = dungeonTiles.se;         
            } 
            // south wall center
            if (southWall && !eastWall && !westWall &&
               (nearbyTiles.this.type === 'empty')) {
              worldData[y][x].wallType = 'wall_s';
              worldData[y][x].spriteOffset = dungeonTiles.s;
            }
            if (southWall && !eastWall && !westWall &&
                oldTile('wall_w')) {
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
            }
            if (southWall && !eastWall && !westWall &&
                oldTile('wall_e')) {
              worldData[y][x].wallType = 'corner_nw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.swo;
            }
            if (southWall && !eastWall && !westWall &&
                (oldTile('wall_n') || oldTile('corner_nw_inner'))) {
              /* make a floor */
              worldData[y][x].backgroundImage = floorSprite;
              worldData[y][x].wallType = undefined;
              worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              worldData[y][x].type = 'ground';
              worldData[y][x].walkable = true;
              worldData[y][x].z = 0;  
            }

            /* WEST WALL */
            /* Old tile was north wall and the wall to the west is a north wall */
            if (!northWall && !southWall && westWall &&
                oldTile('wall_n') &&
                (nearbyTiles.w.type === 'wall' && nearbyTiles.w.wallType === 'wall_n')) {
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
            }
            /* Old tile was south wall and the wall to the west is a south wall */
            if (!northWall && !southWall && westWall &&
                (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_s') &&
                (nearbyTiles.w.type === 'wall' && nearbyTiles.w.wallType === 'wall_s')) {
              worldData[y][x].wallType = 'corner_ne_outer';
              worldData[y][x].spriteOffset = dungeonTiles.neo;
            }

            /* Old tile was east wall */
            if (!northWall && !southWall && westWall && 
                oldTile('wall_e')) {
              /* A west wall and an east wall are overlapping, make a floor */
              worldData[y][x].backgroundImage = floorSprite;
              worldData[y][x].wallType = undefined;
              worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              worldData[y][x].type = 'ground';
              worldData[y][x].walkable = true;
              worldData[y][x].z = 0;  
            }

            /* Old tile was empty */
            if (((i !== 0 && i !== roomHeight -1) && (j === 0)) &&
                  nearbyTiles.this.type === 'empty') {
              worldData[y][x].wallType = 'wall_w';
              worldData[y][x].spriteOffset = dungeonTiles.w;
            }

            /* Old tile was inner northeast corner and the tile to the west is a north wall */
            if (((i !== 0 && i !== roomHeight -1) && (j === 0)) &&
                  nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'corner_ne_inner' &&
                nearbyTiles.w.type === 'wall' && nearbyTiles.w.wallType === 'wall_n') {
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
            }
            /* Old tile was inner southwest corner and the tile to the north is a west wall */
            if (((i !== 0 && i !== roomHeight -1) && (j === 0)) &&
                  nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'corner_sw_inner' &&
                  nearbyTiles.n.type === 'wall' && nearbyTiles.n.wallType === 'wall_w') {
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
            }
            /* Old tile was inner northwest corner and the tiles to the north and south are west walls */
            if (((i !== 0 && i !== roomHeight -1) && (j === 0)) &&
                  nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'corner_nw_inner' &&
                 ((nearbyTiles.s.type === 'wall' && nearbyTiles.s.wallType === 'wall_w') ||
                  (nearbyTiles.s.type === 'wall' && nearbyTiles.s.wallType === 'corner_sw_inner')) &&
                 (nearbyTiles.n.type === 'wall' && nearbyTiles.n.wallType === 'wall_w')) {
              worldData[y][x].wallType = 'wall_w';
              worldData[y][x].spriteOffset = dungeonTiles.w;
            }

            /* EAST WALL */

            /* Old tile was west wall */
            if (((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) && 
                  (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_w')) {
              /* A west wall and an east wall are overlapping, make a floor */
              worldData[y][x].backgroundImage = floorSprite;
              worldData[y][x].wallType = undefined;
              worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              worldData[y][x].type = 'ground';
              worldData[y][x].walkable = true;
              worldData[y][x].z = 0;  
            }

            /* Old tile was east wall
               no action needed */

            /* Old tile was empty */
            if (((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) &&
                  nearbyTiles.this.type === 'empty') {
              worldData[y][x].wallType = 'wall_e';
              worldData[y][x].spriteOffset = dungeonTiles.e;
            }
            /* Old tile was a north wall */
            if (((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) &&
                  nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_n') {
              worldData[y][x].wallType = 'corner_sw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.swo;
            }

            /* Old tile was a south wall */
            if (((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) && 
                  nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_s') {
              worldData[y][x].wallType = 'corner_nw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.nwo;
            }
            
            /* Old tile was inner northwest corner and the tile to the east is a north wall */
            if ((nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'corner_nw_inner') &&
               ((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) &&                  
                (nearbyTiles.e.type === 'wall' && nearbyTiles.e.wallType === 'wall_n')) {
              worldData[y][x].wallType = 'corner_sw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.swo;
            }
            /* Old tile was inner southwest corner and the tile to the east is a south wall */
            if ((nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'corner_sw_inner') &&
               ((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) &&                  
                (nearbyTiles.e.type === 'wall' && nearbyTiles.e.wallType === 'wall_s')) {
              worldData[y][x].wallType = 'corner_nw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.nwo;
            }
            /* Old tile was inner northeast corner and the tile to the south is a east wall */
            if ((nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'corner_ne_inner') &&
                ((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) &&                  
                (nearbyTiles.s.type === 'wall' && nearbyTiles.s.wallType === 'wall_e')) {
              worldData[y][x].wallType = 'wall_e';
              worldData[y][x].spriteOffset = dungeonTiles.e;
            }
             /* Old tile was inner southeast corner and the tile to the north is a east wall */
             if (oldTile('corner_se_inner') &&
                ((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) &&                  
                (nearbyTiles.n.type === 'wall' && nearbyTiles.n.wallType === 'wall_e')) {
              worldData[y][x].wallType = 'wall_e';
              worldData[y][x].spriteOffset = dungeonTiles.e;
            }
            /* ALL WALLS */
            /* Use dungeon wall sprites and set tile type to 'wall' */
            worldData[y][x].backgroundImage = dungeonSprite;
            worldData[y][x].type = 'wall';

            /* FLOORS */
            if (i !== 0 && i !== roomHeight -1 && 
                (j !== 0 && j !== roomWidth -1)) {
              // Always paint the floor tiles that are in the center of the new room
              worldData[y][x].backgroundImage = floorSprite;
              worldData[y][x].wallType = undefined;
              worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              worldData[y][x].type = 'ground';
              worldData[y][x].walkable = true;
              worldData[y][x].z = 0;
            };

            /* ALL TILES */
            /* Since we just drew either a wall or a floor on this tile, set empty to false */
            worldData[y][x].empty = false;
            /* And set z-index to '1' if a tile is a wall */
            if (worldData[y][x].type === 'wall') {
              worldData[y][x].z = 1;
            }
          }; // for tile
        }; // for row to see what to do
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

  let worldArray = newRoom(worldData);
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
