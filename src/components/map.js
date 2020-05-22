import React from "react";
import MapRow from "./mapRow";
const seedrandom = require('seedrandom');

const RANDOM_KEY = 'fdsafdsfaoo';

const dungeonSprite = '/img/environment/iso_dungeon_walls_by_pfunked.png';
const dungeonTiles = {
  n: [/* The same two plain ones repeated */
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      /* Fancy ones */
      [32 + 5 * 128, 256],
      [32 + 3 * 128, 256],
      [32 + 1 * 128, 256],
      [32 + 1 * 128, 384],
      [32 + 7 * 128, 256]],
  ne: [32 + 6 * 128, 128],
  e: [32 + 2 * 128, 0],
  se: [32 + 7 * 128, 128],
  s: [32 + 3 * 128, 0],
  sw: [32 + 4 * 128, 128],
  w: [32,0],
  nw: [32 + 5 * 128, 128],
  neo: [32, 128],
  seo: [32 + 128, 128],
  swo: [32 + 2 * 128, 128],
  nwo: [32 + 3 * 128, 128],
}

const floorSprite = '/img/environment/tiles_0.png';
const floorTiles = {
  tiles: [[0, 0],
          [64, 0],
          [2 * 64, 0],
          [3 * 64, 0],
          [4 * 64, 0],
          [0, 64],
          [1 * 64, 0],
          [2 * 64, 0],
         ],
};

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
      const thisY = 32 + (32 * i) - (window.innerHeight / 4);
      const thisRow = [];
      for (let j=0; j<mapWidth; j++) {
        /* Move the map to the right by 1/2 the inner window width to center on screen */
        const thisX = 32 * j + (window.innerWidth / 4);

        /* Get isometric coordinates for this tile */
        const iso = twoDToIso(thisX, thisY);

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
          xIso: iso.x,
          yIso: iso.y,
          z: 1,
        };
        thisRow.push(tile);
      };
      worldData.push(thisRow);
    };
    return worldData;  
  }
  
  const worldData = buildMap(20, 20);
  
  const newRoom = (worldData) => {
    // get size of array to determine potential size of room
    const mapWidth = worldData[0].length;
    const mapHeight = worldData.length;
    // check random position and room size, see if it fits
    let roomFound = false;
    while (roomFound === false) {
      const roomWidth = Math.floor(seedrandom(RANDOM_KEY)() * mapWidth / 2) + 4;
      const roomHeight = Math.floor(seedrandom(RANDOM_KEY)() * mapHeight / 2) + 4;
      /* For some reason using seedrandom on the topLeftX and topLeftY breaks everything */
      // const topLeftX = Math.floor(seedrandom(RANDOM_KEY)() * mapWidth);
      // const topLeftY = Math.floor(seedrandom(RANDOM_KEY)() * mapHeight);
      const topLeftX = Math.floor(Math.random() * mapWidth);
      const topLeftY = Math.floor(Math.random() * mapHeight);
      if (roomWidth + topLeftX < mapWidth && roomHeight + topLeftY < mapHeight && roomFound === false) {
        roomFound = true;
        // console.log(`${topLeftX}, ${topLeftY}`)
        /* Every row */
        for (let i=0; i<roomHeight; i++) {
          const y = topLeftY + i;
          /* Every tile in that row */
          for (let j=0; j<roomWidth; j++) {
            const x = topLeftX + j;
            
            const existingTileType = worldData[y][x].type;

            if (existingTileType === 'wall') {
              /* This is an old wall from another room, make it into a floor to create a big room*/
              /* Set floor tile for now, then check if it needs to be an outside corner after drawing the new room */
              worldData[y][x].walkable = true;
              worldData[y][x].type = 'ground';
              worldData[y][x].z = 0;
              worldData[y][x].backgroundImage = floorSprite;
              worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              worldData[y][x].facing = false;
            } else if (existingTileType === 'ground') {
              // do diddly
            } else if (existingTileType === 'empty') {
              /* build stuff */
              worldData[y][x].empty = false;
              if (i===0) {
                /* NORTH WALL */
                worldData[y][x].type = 'wall';
                worldData[y][x].backgroundImage = dungeonSprite;
                if (j===0) {
                  // northwest corner of room
                  worldData[y][x].spriteOffset = dungeonTiles.nw;
                  worldData[y][x].facing = 'se';
                } else if (j===(roomWidth - 1)) {
                  // northeast corner of room
                  worldData[y][x].spriteOffset = dungeonTiles.ne;
                  worldData[y][x].facing = 'sw';
                } else {
                  // north wall center
                  worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
                  worldData[y][x].facing = 's';
                }
              } else if (i===roomHeight-1) {
                /* SOUTH WALL */
                worldData[y][x].type = 'wall';
                worldData[y][x].backgroundImage = dungeonSprite;
                if (j===0) {
                  // southwest corner of room
                  worldData[y][x].spriteOffset = dungeonTiles.sw;
                  worldData[y][x].facing = 'ne';
                } else if (j===(roomWidth - 1)) {
                  // southeast corner of room
                  worldData[y][x].spriteOffset = dungeonTiles.se;         
                 worldData[y][x].facing = 'nw';
                } else {
                  // south wall center
                  worldData[y][x].spriteOffset = dungeonTiles.s;
                  worldData[y][x].facing = 'n';
                }
              } else {
                /* CENTER OF ROOM */
                /* Place a wall on either end and floor tiles in the center. */
                worldData[y][x].type = 'wall';
                worldData[y][x].backgroundImage = dungeonSprite;

                if (j===0) {
                  // west wall of room
                  worldData[y][x].spriteOffset = dungeonTiles.w;
                  worldData[y][x].facing = 'e';
                } else if (j===(roomWidth - 1)) {
                  // east wall of room
                  worldData[y][x].spriteOffset = dungeonTiles.e;
                  worldData[y][x].facing = 'w';
                } else {
                  // floor tile in center of room
                  worldData[y][x].walkable = true;
                  worldData[y][x].type = 'ground';
                  worldData[y][x].z = 0;
                  worldData[y][x].backgroundImage = floorSprite;
                  worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                  worldData[y][x].facing = false;
                }
              }
            }
          }
        }
        /* After adding the new room, check worldData for floors to replace with outside corners */
        // for (let i=0; i<mapHeight; i++) {
        //   const y = i;
        //   /* Every tile in that row */
        //   for (let j=0; j<mapWidth; j++) {
        //     const x = j;
        //     let tileToN = false;
        //     let tileToS = false;
        //     let tileToE = false;
        //     let tileToW = false;
        //     if (y > 0) {
        //       tileToN = worldData[y - 1][x + 0];  
        //     }
        //     if (worldData[y + 1]) {
        //       tileToS = worldData[y + 1][x + 0]
        //     }
        //     if (worldData[y][x + 1]) {
        //       tileToE = worldData[y + 0][x + 1];
        //     }
        //     if (worldData[y][x - 1]) {
        //       tileToW = worldData[y + 0][x - 1];
        //     }

        //     const thisTile = worldData[y][x];
            
        //     // const existingTileType = worldData[y][x].type;
        //     if (thisTile.type === 'ground') {
        //       // console.log(tileToN);
        //       if (tileToN.type === 'wall' && tileToN.facing === 'e' &&
        //           tileToW.type === 'wall' && tileToW.facing === 's' &&
        //           tileToS.type === 'ground' &&
        //           tileToE.type === 'ground') {
        //         console.log(`Outside southeast corner at X: ${x}, Y: ${y}!`);
        //         worldData[y][x].type = 'wall';
        //         worldData[y][x].facing = 'nw';
        //         worldData[y][x].walkable = 'false';
        //         worldData[y][x].backgroundImage = dungeonSprite;
        //         worldData[y][x].spriteOffset = dungeonTiles.seo;
        //       }
        // //       } else if (tileToN && tileToN.type === 'wall' && tileToN.facing === 'west' &&
        // //                   tileToE && tileToE.type === 'wall' && tileToE.facing === 'south' &&
        // //                   tileToS && tileToS.type === 'ground' &&
        // //                   tileToW && tileToW.type === 'ground') {
        // //         console.log('Outside southwest corner!');
        // //         worldData[y][x].type = 'wall';
        // //         worldData[y][x].backgroundImage = dungeonSprite;
        // //         worldData[y][x].spriteOffset = dungeonTiles.swo;
        // //       } else if (tileToW && tileToW.type === 'wall' && 
        // //                   tileToS && tileToS.type === 'wall' &&
        // //                   tileToE && tileToE.type === 'ground' && 
        // //                   tileToN && tileToN.type === 'ground') {
        // //         console.log('Outside Northeast corner!');
        // //         worldData[y][x].type = 'wall';
        // //         worldData[y][x].backgroundImage = dungeonSprite;
        // //         worldData[y][x].spriteOffset = dungeonTiles.neo;
        // //       } else if (tileToE && tileToE.type === 'wall' &&
        // //                   tileToS && tileToS.type === 'wall' &&
        // //                   tileToW && tileToW.type === 'ground' &&
        // //                   tileToN && tileToN.type === 'ground') {
        // //         console.log('Outside Northwest corner!');
        // //         worldData[y][x].type = 'wall';
        // //         worldData[y][x].backgroundImage = dungeonSprite;
        // //         worldData[y][x].spriteOffset = dungeonTiles.nwo;
        // //       }
        //     }
        //   }
        // }
      } else {
        console.log(`room doesn't fit, trying again`);
      }
    }
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
    return iso;
  };

  let roomArray = newRoom(worldData);
   roomArray = newRoom(worldData);
  //  roomArray = newRoom(worldData);
  //  roomArray = newRoom(worldData);

  /* Display map */
  return (
    <div style={style} className="App-map">
    {roomArray.map(function(object, i){
      return <MapRow row={object} key={i} />;
    })}
    </div>
  );
}

export default Map;
