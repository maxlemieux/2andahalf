import React from "react";
import MapRow from "./mapRow";
import getNearbyTiles from "../tileUtil.js";

import spriteInfo from "../spriteInfo.js";
const { dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;

const seedrandom = require('seedrandom');
const RANDOM_KEY = 'fdsafdsfaoo';
const worldSeed = new seedrandom(RANDOM_KEY)();

const MAP_WIDTH = 16;
const MAP_HEIGHT = 16;

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
  
  const cleanData = (worldData) => {
    const mapWidth = worldData[0].length;
    const mapHeight = worldData.length;

    /* Check all of worldData for floors to fill in with walls */
    for (let i=0; i<mapHeight; i++) {
      const y = i;
      /* Every tile in that row */
      for (let j=0; j<mapWidth; j++) {
        const x = j;
    
        let tileToN = false;
        let tileToS = false;
        let tileToE = false;
        let tileToW = false;
        if (y > 0) {
          tileToN = worldData[y - 1][x];  
        }
        if (worldData.length > y + 1) {
          tileToS = worldData[y + 1][x]
        }
        if (worldData[y][x + 1]) {
          tileToE = worldData[y][x + 1];
        }
        if (x > 0) {
          tileToW = worldData[y][x - 1];
        }

        if (worldData[y][x].type === 'ground' && 
            tileToN.type === 'wall' && 
           (tileToN.wallType === 'wall_w' || tileToN.wallType === 'corner_ne_outer' || tileToN.wallType === 'corner_nw_inner') && 
            tileToS.type === 'wall' && 
           (tileToS.wallType === 'wall_w' || tileToS.wallType === 'corner_sw_inner' || tileToS.wallType === 'corner_nw_outer')
            ) {
          console.log('we need to fill in a gap in a west wall')
          /*                         __               __  
          |     |                   | nw inner corner   |  ne outer corner    | 

          |     |_  sw inner corner |                   |                   __| nw outer corner
          */
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'wall_w';
          worldData[y][x].spriteOffset = dungeonTiles.w;
          worldData[y][x].z = 1;
        }

        if (worldData[y][x].type === 'ground' && 
            tileToN.type === 'wall' && 
           (tileToN.wallType === 'wall_e' || tileToN.wallType === 'corner_nw_outer' || tileToN.wallType === 'corner_ne_inner') && 
            tileToS.type === 'wall' && 
           (tileToS.wallType === 'wall_e' || tileToS.wallType === 'corner_se_inner' || tileToS.wallType === 'corner_ne_outer')
            ) {
          console.log('we need to fill in a gap in a east wall')
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'wall_e';
          worldData[y][x].spriteOffset = dungeonTiles.e;
          worldData[y][x].z = 1;
        }

        if (worldData[y][x].type === 'ground' && 
            tileToE.type === 'wall' && 
           (tileToE.wallType === 'wall_n' || tileToE.wallType === 'corner_se_outer' || tileToE.wallType === 'corner_ne_inner') && 
            tileToW.type === 'wall' && 
           (tileToW.wallType === 'wall_n' || tileToW.wallType === 'corner_nw_inner' || tileToW.wallType === 'corner_sw_outer')
            ) {
          console.log(`we need to fill in a gap in a north wall at x: ${x}, y: ${y}`)
          /*         
          
          */
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'wall_n';
          worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
          worldData[y][x].z = 1;
        }

        if (worldData[y][x].type === 'ground' && 
            tileToE.type === 'wall' && 
           (tileToE.wallType === 'wall_s' || tileToE.wallType === 'corner_ne_outer' || tileToE.wallType === 'corner_se_inner') && 
            tileToW.type === 'wall' && 
           (tileToW.wallType === 'wall_s' || tileToW.wallType === 'corner_sw_inner' || tileToW.wallType === 'corner_nw_outer')
            ) {
          console.log(`we need to fill in a gap in a south wall at x: ${x}, y: ${y}`)
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'wall_s';
          worldData[y][x].spriteOffset = dungeonTiles.s;
          worldData[y][x].z = 1;
        }
        
        if (worldData[y][x].type === 'ground' && 
            tileToW.type === 'wall' &&
           (tileToW.wallType === 'wall_n' || tileToW.wallType === 'corner_nw_inner' || tileToW.wallType === 'corner_sw_outer') && 
            tileToN.type === 'wall' && 
           (tileToN.wallType === 'wall_w' || tileToN.wallType === 'corner_nw_inner' || tileToW.wallType === 'corner_ne_outer')
            ) {
          console.log(`we need to fill in a gap in an outer southeast corner at x: ${x}, y: ${y}`)
          /*
          
          _|

          */
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'corner_se_outer';
          worldData[y][x].spriteOffset = dungeonTiles.seo;
          worldData[y][x].z = 1;
        } 
        if (worldData[y][x].type === 'ground' && 
            tileToE.type === 'wall' &&
           (tileToE.wallType === 'wall_n' || tileToE.wallType === 'corner_ne_inner' || tileToE.wallType === 'corner_se_outer') && 
            tileToN.type === 'wall' &&
           (tileToN.wallType === 'wall_e' || tileToN.wallType === 'corner_ne_inner' || tileToN.wallType === 'corner_nw_outer')
            ) {
          console.log(`we need to fill in a gap in an outer southwest corner at x: ${x}, y: ${y}`)
          /*
          
          |_

          */
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'corner_sw_outer';
          worldData[y][x].spriteOffset = dungeonTiles.swo;
          worldData[y][x].z = 1;
        } 

        if (worldData[y][x].type === 'ground' && 
            tileToW.type === 'wall' && 
           (tileToW.wallType === 'wall_s' || tileToW.wallType === 'corner_sw_inner' || tileToW.wallType === 'corner_nw_outer') && 
            tileToS.type === 'wall' && 
           (tileToS.wallType === 'wall_w' || tileToS.wallType === 'corner_sw_inner' || tileToS.wallType === 'corner_se_outer')
            ) {
          console.log(`we need to fill in a gap in an outer northeast corner at x: ${x}, y: ${y}`)
          /* 
          ___
            |

          */
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'corner_ne_outer';
          worldData[y][x].spriteOffset = dungeonTiles.neo;
          worldData[y][x].z = 1;
        } 
        if (worldData[y][x].type === 'ground' && 
            tileToE.type === 'wall' && 
           (tileToE.wallType === 'wall_s' || tileToE.wallType === 'corner_se_inner' || tileToE.wallType === 'corner_ne_outer') && 
            tileToS.type === 'wall' &&
           (tileToS.wallType === 'wall_e' || tileToS.wallType === 'corner_se_inner' || tileToS.wallType === 'corner_sw_outer')
            ) {
          console.log(`we need to fill in a gap in an outer northwest corner at x: ${x}, y: ${y}`)
          /*
          ___
          |

          */
          worldData[y][x].backgroundImage = dungeonSprite;
          worldData[y][x].type = 'wall';
          worldData[y][x].wallType = 'corner_nw_outer';
          worldData[y][x].spriteOffset = dungeonTiles.nwo;
          worldData[y][x].z = 1;
        }
      }
    }; // end fill-in check
    return worldData;
  }

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
      // const topLeftX = Math.floor(seedrandom(RANDOM_KEY)() * mapWidth);
      // const topLeftY = Math.floor(seedrandom(RANDOM_KEY)() * mapHeight);

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
              /* This is a floor tile from an old room, we want to keep it. */
              continue;
            } else {
              /* Build new stuff */
              worldData[y][x].empty = false;



              /* NORTH WALL */
              if ((i === 0) &&  (j === 0)) {
                // northwest corner of room
                worldData[y][x].wallType = 'corner_nw_inner';
                worldData[y][x].spriteOffset = dungeonTiles.nw;
              } 
              if ((i === 0) && j === (roomWidth - 1)) {
                // northeast corner of room
                worldData[y][x].wallType = 'corner_ne_inner';
                worldData[y][x].spriteOffset = dungeonTiles.ne;
              }
              if ((i === 0) && ((j !== 0) && (j !== roomWidth -1))) {
                // north wall center
                if (nearbyTiles.this.type === 'empty') {
                  worldData[y][x].wallType = 'wall_n';
                  worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_w') {
                  worldData[y][x].wallType = 'corner_se_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.seo;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_e') {
                  worldData[y][x].wallType = 'corner_sw_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.swo;
                }
              }
              /* SOUTH WALL */
              if ((i === (roomHeight - 1)) && j===0) {
                // southwest corner of room
                worldData[y][x].wallType = 'corner_sw_inner';
                worldData[y][x].spriteOffset = dungeonTiles.sw;
              }
              if ((i === (roomHeight - 1)) && j === (roomWidth - 1)) {
                // southeast corner of room
                worldData[y][x].wallType = 'corner_se_inner';
                worldData[y][x].spriteOffset = dungeonTiles.se;         
              } 
              if (i === (roomHeight - 1) && (j !== 0) && (j !== (roomWidth - 1))) {
                // south wall center
                if (nearbyTiles.this.type === 'empty') {
                  worldData[y][x].wallType = 'wall_s';
                  worldData[y][x].spriteOffset = dungeonTiles.s;
                }
                // console.log(nearbyTiles.this.type)
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_w') {
                  worldData[y][x].wallType = 'corner_ne_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.neo;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_e') {
                  worldData[y][x].wallType = 'corner_nw_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.nwo;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_n') {
                  /* make a floor */
                  worldData[y][x].backgroundImage = floorSprite;
                  worldData[y][x].wallType = undefined;
                  worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                  worldData[y][x].type = 'ground';
                  worldData[y][x].walkable = true;
                  worldData[y][x].z = 0;  
                }
              }

              /* WEST WALL */
              if ((i !== 0 && i !== roomHeight -1) && (j === 0)) {
                // west wall of room
                if (nearbyTiles.this.type === 'empty') {
                  worldData[y][x].wallType = 'wall_w';
                  worldData[y][x].spriteOffset = dungeonTiles.w;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_n') {
                  worldData[y][x].wallType = 'corner_se_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.seo;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_s') {
                  worldData[y][x].wallType = 'corner_ne_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.neo;
                }
              }

              /* EAST WALL */
              if ((i !== 0 && i !== roomHeight -1) && j===(roomWidth - 1)) {
                // east wall of room
                if (nearbyTiles.this.type === 'empty') {
                  worldData[y][x].wallType = 'wall_e';
                  worldData[y][x].spriteOffset = dungeonTiles.e;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_n') {
                  worldData[y][x].wallType = 'corner_sw_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.swo;
                }
                if (nearbyTiles.this.type === 'wall' && nearbyTiles.this.wallType === 'wall_s') {
                  worldData[y][x].wallType = 'corner_nw_outer';
                  worldData[y][x].spriteOffset = dungeonTiles.nwo;
                }
              }

              /* ALL WALLS */
              /* Use dungeon wall sprites and set tile type to 'wall' */
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';

              /* FLOORS */
              if (i !== 0 && i !== roomHeight -1 && (j !== 0 && j !== (roomWidth -1))) {
                // floor tile in center of room
                worldData[y][x].backgroundImage = floorSprite;
                worldData[y][x].wallType = undefined;
                worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                worldData[y][x].type = 'ground';
                worldData[y][x].walkable = true;
                worldData[y][x].z = 0;
              };
            };
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

  console.log(getNearbyTiles(0, 0, worldArray))

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
