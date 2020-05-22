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
        [32 + 7 * 128, 256]
      ],
  ne: [32 + 6 * 128, 128],
  e: [32 + 2 * 128, 0],
  se: [32 + 7 * 128, 128],
  s: [32 + 3 * 128, 0],
  sw: [32 + 4 * 128, 128],
  w: [32, 0],
  nw: [32 + 5 * 128, 128],
  swo: [32, 128],
  nwo: [32 + 128, 128],
  neo: [32 + 2 * 128, 128],
  seo: [32 + 3 * 128, 128],
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

      /* For some reason, using seedrandom on the topLeftX and topLeftY breaks everything */
      // const topLeftX = Math.floor(seedrandom(RANDOM_KEY)() * mapWidth);
      // const topLeftY = Math.floor(seedrandom(RANDOM_KEY)() * mapHeight);

      const topLeftX = Math.floor(Math.random() * mapWidth);
      const topLeftY = Math.floor(Math.random() * mapHeight);
      if (roomWidth + topLeftX < mapWidth && roomHeight + topLeftY < mapHeight && roomFound === false) {
        roomFound = true;

        /* For each row */
        for (let i=0; i<roomHeight; i++) {
          const y = topLeftY + i;
          /* For each tile in that row */
          for (let j=0; j<roomWidth; j++) {
            const x = topLeftX + j;
            const existingTileType = worldData[y][x].type;

            let tileToN = false;
            let tileToS = false;
            let tileToE = false;
            let tileToW = false;
            if (y > 0) {
              tileToN = worldData[y - 1][x];  
            }
            if (worldData[y + 1]) {
              tileToS = worldData[y + 1][x]
            }
            if (worldData[y][x + 1]) {
              tileToE = worldData[y][x + 1];
            }
            if (worldData[y][x - 1]) {
              tileToW = worldData[y][x - 1];
            }

            if (existingTileType === 'wall') {
              /* This is an old wall from another room, make it into a floor to create a big room.
                 Check if it needs to end up as an outside wall:
                 If the new wall and the old wall are the same, just keep it. */
              console.log(`Found old wall at x: ${x}, y: ${y}, facing: ${worldData[y][x].facing}, 
                roomHeight: ${roomHeight}, roomWidth: ${roomWidth} and i = ${i}`)

              /* Need to also check for inside corners that need to remain */
              if (worldData[y][x].wallType === 'wall_n' && i === 0) {
                /* If we are on the north side of the room */
                console.log(`Found an existing north wall at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'wall_s' && i === (roomHeight - 1)) {
                /* If we are on the south side of the room  */
                console.log(`Found an existing south wall at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'wall_w' && j === 0) {
                /* If we are on the west side of the room  */
                console.log(`Found an existing west wall at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'wall_e' && j === (roomWidth - 1)) {
                /* If we are on the east side of the room  */
                console.log(`Found an existing east wall at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'corner_nw_inner' && i === 0 && j === 0) {
                /* If we are on the northwest corner of the room */
                console.log(`Found an existing inner northwest corner at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'corner_ne_inner' && i === 0 && j === (roomWidth - 1)) {
                /* If we are on the northeast corner of the room */
                console.log(`Found an existing inner northeast corner at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'corner_sw_inner' && i === (roomHeight - 1) && j === 0) {
                /* If we are on the southwest corner of the room */
                console.log(`Found an existing inner southwest corner at x: ${x}, y: ${y}`)
              } else if (worldData[y][x].wallType === 'corner_se_inner' && i === (roomHeight - 1) && j === (roomWidth - 1)) {
                /* If we are on the southeast corner of the room */
                console.log(`Found an existing inner southeast corner at x: ${x}, y: ${y}`)
              } else {
                console.log(`j=${j} did not match (roomWidth - 1) = ${roomWidth - 1}`)
                console.log(`i=${i} did not match (roomHeight - 1) = ${roomHeight - 1}`)
                 /*   Set floor tile for now. */
                 worldData[y][x].backgroundImage = floorSprite;
                 worldData[y][x].facing = false;
                 worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                 worldData[y][x].type = 'ground';
                 worldData[y][x].walkable = true;
                 worldData[y][x].z = 0;
                 /* Check if it needs to be an outside corner AFTER drawing the rest of the new room. */
              }
              
            } else if (existingTileType === 'ground') {
              /* This is a floor tile from an old room, we want to keep it. */
            } else if (existingTileType === 'empty') {
              /* This tile is empty, let's build stuff */
              worldData[y][x].empty = false;

              /* Dungeon walls */
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';

              /* Is this the north wall? */
              if (i===0) {
                /* NORTH WALL */
                if (j===0) {
                  // northwest corner of room
                  worldData[y][x].facing = 'se';
                  worldData[y][x].wallType = 'corner_nw_inner';
                  worldData[y][x].spriteOffset = dungeonTiles.nw;
                } else if (j===(roomWidth - 1)) {
                  // northeast corner of room
                  worldData[y][x].facing = 'sw';
                  worldData[y][x].wallType = 'corner_ne_inner';
                  worldData[y][x].spriteOffset = dungeonTiles.ne;
                } else {
                  // north wall center
                  worldData[y][x].facing = 's';
                  worldData[y][x].wallType = 'wall_n_various';
                  worldData[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
                }
              } else if (i === (roomHeight - 1)) {
                /* SOUTH WALL */
                if (j===0) {
                  // southwest corner of room
                  worldData[y][x].facing = 'ne';
                  worldData[y][x].wallType = 'corner_sw_inner';
                  worldData[y][x].spriteOffset = dungeonTiles.sw;
                } else if (j === (roomWidth - 1)) {
                  // southeast corner of room
                  worldData[y][x].facing = 'nw';
                  worldData[y][x].wallType = 'corner_se_inner';
                  worldData[y][x].spriteOffset = dungeonTiles.se;         
                } else {
                  // south wall center
                  worldData[y][x].facing = 'n';
                  worldData[y][x].wallType = 'wall_s';
                  worldData[y][x].spriteOffset = dungeonTiles.s;
                }
              } else {
                /* CENTER OF ROOM */
                /* Place a wall on either end and floor tiles in the center. */
                if (j===0) {
                  // west wall of room
                  worldData[y][x].facing = 'e';
                  worldData[y][x].wallType = 'wall_w';
                  worldData[y][x].spriteOffset = dungeonTiles.w;
                } else if (j===(roomWidth - 1)) {
                  // east wall of room
                  worldData[y][x].facing = 'w';
                  worldData[y][x].wallType = 'wall_e';
                  worldData[y][x].spriteOffset = dungeonTiles.e;
                } else {
                  // floor tile in center of room
                  worldData[y][x].backgroundImage = floorSprite;
                  worldData[y][x].facing = false;
                  worldData[y][x].wallType = undefined;
                  worldData[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                  worldData[y][x].type = 'ground';
                  worldData[y][x].walkable = true;
                  worldData[y][x].z = 0;
                }; // filling tile, check new type for each tile of new room
              }; // filling tile, check new type for each row of new room
            }; // if empty
          }; // check tile
        }; // check row to see what to do

        /* After adding the new room, check all of worldData for floors to replace with outside corners */
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
            if (worldData[y + 1]) {
              tileToS = worldData[y + 1][x]
            }
            if (worldData[y][x + 1]) {
              tileToE = worldData[y][x + 1];
            }
            if (worldData[y][x - 1]) {
              tileToW = worldData[y][x - 1];
            }

            if (worldData[y][x].type === 'ground' && 
                tileToN.type === 'wall' && tileToN.wallType === 'wall_w' && 
                tileToS.type === 'wall' && tileToS.wallType === 'wall_w'
                ) {
              console.log('we need to fill in a gap in a west wall')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'e';
              worldData[y][x].wallType = 'wall_w';
              worldData[y][x].spriteOffset = dungeonTiles.w;
              worldData[y][x].z = 1;
            }

            if (worldData[y][x].type === 'ground' && 
                tileToN.type === 'wall' && tileToN.wallType === 'wall_e' && 
                tileToS.type === 'wall' && tileToS.wallType === 'wall_e'
                ) {
              console.log('we need to fill in a gap in a east wall')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'w';
              worldData[y][x].wallType = 'wall_e';
              worldData[y][x].spriteOffset = dungeonTiles.e;
              worldData[y][x].z = 1;
            }

            if (worldData[y][x].type === 'ground' && 
                tileToN.type === 'wall' && tileToN.wallType === 'wall_n' && 
                tileToS.type === 'wall' && tileToS.wallType === 'wall_n'
                ) {
              console.log('we need to fill in a gap in a north wall')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 's';
              worldData[y][x].wallType = 'wall_n';
              worldData[y][x].spriteOffset = dungeonTiles.n;
              worldData[y][x].z = 1;
            }

            if (worldData[y][x].type === 'ground' && 
                tileToN.type === 'wall' && tileToN.wallType === 'wall_s' && 
                tileToS.type === 'wall' && tileToS.wallType === 'wall_s'
                ) {
              console.log('we need to fill in a gap in a south wall')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'n';
              worldData[y][x].wallType = 'wall_s';
              worldData[y][x].spriteOffset = dungeonTiles.s;
              worldData[y][x].z = 1;
            }
            
            if (worldData[y][x].type === 'ground' && 
                tileToE.type === 'wall' && (tileToE.wallType === 'wall_s' || tileToE.wallType === 'corner_se_inner') && 
                tileToS.type === 'wall' && (tileToS.wallType === 'wall_e' || tileToS.wallType === 'corner_se_inner')
                ) {
              console.log('we need to fill in a gap in a outside southeast corner')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'nw';
              worldData[y][x].wallType = 'corner_se_outer';
              worldData[y][x].spriteOffset = dungeonTiles.seo;
              worldData[y][x].z = 1;
            } 
            if (worldData[y][x].type === 'ground' && 
                tileToW.type === 'wall' && (tileToW.wallType === 'wall_s' || tileToW.wallType === 'corner_sw_inner') && 
                tileToS.type === 'wall' && (tileToS.wallType === 'wall_w' || tileToS.wallType === 'corner_sw_inner')
                ) {
              console.log('we need to fill in a gap in a outside southwest corner')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'ne';
              worldData[y][x].wallType = 'corner_sw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.swo;
              worldData[y][x].z = 1;
            } 
            if (worldData[y][x].type === 'ground' && 
                tileToE.type === 'wall' && (tileToE.wallType === 'wall_n' || tileToE.wallType === 'corner_ne_inner') && 
                tileToN.type === 'wall' && (tileToN.wallType === 'wall_e' || tileToN.wallType === 'corner_ne_inner')
                ) {
              console.log('we need to fill in a gap in a outside northeast corner')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'sw';
              worldData[y][x].wallType = 'corner_ne_outer';
              worldData[y][x].spriteOffset = dungeonTiles.neo;
              worldData[y][x].z = 1;
            } 
            if (worldData[y][x].type === 'ground' && 
                tileToW.type === 'wall' && (tileToW.wallType === 'wall_n' || tileToW.wallType === 'corner_nw_inner') && 
                tileToN.type === 'wall' && (tileToN.wallType === 'wall_w' || tileToN.wallType === 'corner_nw_inner')
                ) {
              console.log('we need to fill in a gap in a outside northwest corner')
              worldData[y][x].backgroundImage = dungeonSprite;
              worldData[y][x].type = 'wall';
              worldData[y][x].facing = 'se';
              worldData[y][x].wallType = 'corner_nw_outer';
              worldData[y][x].spriteOffset = dungeonTiles.nwo;
              worldData[y][x].z = 1;
            }
          }
        }; // end fill-in check
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

  let worldArray = newRoom(worldData);
  worldArray = newRoom(worldData);
  //  roomArray = newRoom(worldData);
  //  roomArray = newRoom(worldData);

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
