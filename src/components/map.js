import React from "react";
import MapRow from "./mapRow";

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
    const mapArray = [];
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
      mapArray.push(thisRow);
    };
    return mapArray;  
  }
  
  const mapArray = buildMap(20, 20);
  
  const newRoom = (mapArray) => {
    // get size of array to determine potential size of room
    const mapWidth = mapArray[0].length;
    const mapHeight = mapArray.length;
    // check random position and room size, see if it fits
    let roomFound = false;
    while (roomFound === false) {
      const roomWidth = Math.floor(Math.random() * mapWidth / 2) + 4;
      const roomHeight = Math.floor(Math.random() * mapHeight / 2) + 4;
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
            
            const existingTileType = mapArray[y][x].type;

            if (existingTileType === 'wall') {
              /* This is an old wall from another room, make it into a floor to create a big room*/
              /* Set floor tile for now, then check if it needs to be an outside corner after drawing the new room */
              mapArray[y][x].walkable = true;
              mapArray[y][x].type = 'ground';
              mapArray[y][x].z = 0;
              mapArray[y][x].backgroundImage = floorSprite;
              mapArray[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
              mapArray[y][x].facing = false;
            } else if (existingTileType === 'ground') {
              // do diddly
            } else if (existingTileType === 'empty') {
              /* build stuff */
              mapArray[y][x].empty = false;
              if (i===0) {
                /* NORTH WALL */
                mapArray[y][x].type = 'wall';
                mapArray[y][x].backgroundImage = dungeonSprite;
                if (j===0) {
                  // northwest corner of room
                  mapArray[y][x].spriteOffset = dungeonTiles.nw;
                  mapArray[y][x].facing = 'se';
                } else if (j===(roomWidth - 1)) {
                  // northeast corner of room
                  mapArray[y][x].spriteOffset = dungeonTiles.ne;
                  mapArray[y][x].facing = 'sw';
                } else {
                  // north wall center
                  mapArray[y][x].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
                  mapArray[y][x].facing = 's';
                }
              } else if (i===roomHeight-1) {
                /* SOUTH WALL */
                mapArray[y][x].type = 'wall';
                mapArray[y][x].backgroundImage = dungeonSprite;
                if (j===0) {
                  // southwest corner of room
                  mapArray[y][x].spriteOffset = dungeonTiles.sw;
                  mapArray[y][x].facing = 'ne';
                } else if (j===(roomWidth - 1)) {
                  // southeast corner of room
                  mapArray[y][x].spriteOffset = dungeonTiles.se;         
                 mapArray[y][x].facing = 'nw';
                } else {
                  // south wall center
                  mapArray[y][x].spriteOffset = dungeonTiles.s;
                  mapArray[y][x].facing = 'n';
                }
              } else {
                /* CENTER OF ROOM */
                /* Place a wall on either end and floor tiles in the center. */
                mapArray[y][x].type = 'wall';
                mapArray[y][x].backgroundImage = dungeonSprite;

                if (j===0) {
                  // west wall of room
                  mapArray[y][x].spriteOffset = dungeonTiles.w;
                  mapArray[y][x].facing = 'e';
                } else if (j===(roomWidth - 1)) {
                  // east wall of room
                  mapArray[y][x].spriteOffset = dungeonTiles.e;
                  mapArray[y][x].facing = 'w';
                } else {
                  // floor tile in center of room
                  mapArray[y][x].walkable = true;
                  mapArray[y][x].type = 'ground';
                  mapArray[y][x].z = 0;
                  mapArray[y][x].backgroundImage = floorSprite;
                  mapArray[y][x].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                  mapArray[y][x].facing = false;
                }
              }
            }
          }
        }
        /* After adding the new room, check mapArray for floors to replace with outside corners */
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
              tileToN = mapArray[y - 1][x + 0];  
            }
            if (mapArray[y + 1]) {
              tileToS = mapArray[y + 1][x + 0]
            }
            if (mapArray[y][x + 1]) {
              tileToE = mapArray[y + 0][x + 1];
            }
            if (mapArray[y][x - 1]) {
              tileToW = mapArray[y + 0][x - 1];
            }

            const thisTile = mapArray[y][x];
            
            // const existingTileType = mapArray[y][x].type;
            if (thisTile.type === 'ground') {
              // console.log(tileToN);
              if (tileToN.type === 'wall' && tileToN.facing === 'e' &&
                  tileToW.type === 'wall' && tileToW.facing === 's' &&
                  tileToS.type === 'ground' &&
                  tileToE.type === 'ground') {
                console.log(`Outside southeast corner at X: ${x}, Y: ${y}!`);
                mapArray[y][x].type = 'wall';
                mapArray[y][x].facing = 'nw';
                mapArray[y][x].walkable = 'false';
                mapArray[y][x].backgroundImage = dungeonSprite;
                mapArray[y][x].spriteOffset = dungeonTiles.seo;
              }
        //       } else if (tileToN && tileToN.type === 'wall' && tileToN.facing === 'west' &&
        //                   tileToE && tileToE.type === 'wall' && tileToE.facing === 'south' &&
        //                   tileToS && tileToS.type === 'ground' &&
        //                   tileToW && tileToW.type === 'ground') {
        //         console.log('Outside southwest corner!');
        //         mapArray[y][x].type = 'wall';
        //         mapArray[y][x].backgroundImage = dungeonSprite;
        //         mapArray[y][x].spriteOffset = dungeonTiles.swo;
        //       } else if (tileToW && tileToW.type === 'wall' && 
        //                   tileToS && tileToS.type === 'wall' &&
        //                   tileToE && tileToE.type === 'ground' && 
        //                   tileToN && tileToN.type === 'ground') {
        //         console.log('Outside Northeast corner!');
        //         mapArray[y][x].type = 'wall';
        //         mapArray[y][x].backgroundImage = dungeonSprite;
        //         mapArray[y][x].spriteOffset = dungeonTiles.neo;
        //       } else if (tileToE && tileToE.type === 'wall' &&
        //                   tileToS && tileToS.type === 'wall' &&
        //                   tileToW && tileToW.type === 'ground' &&
        //                   tileToN && tileToN.type === 'ground') {
        //         console.log('Outside Northwest corner!');
        //         mapArray[y][x].type = 'wall';
        //         mapArray[y][x].backgroundImage = dungeonSprite;
        //         mapArray[y][x].spriteOffset = dungeonTiles.nwo;
        //       }
            }
          }
        }
      } else {
        console.log(`room doesn't fit, trying again`);
      }
    }
    return mapArray;
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

  let roomArray = newRoom(mapArray);
   roomArray = newRoom(mapArray);
  //  roomArray = newRoom(mapArray);
  //  roomArray = newRoom(mapArray);

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
