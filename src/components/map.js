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
          border: 'north',
          // backgroundImage: '/img/environment/tiles_0.png',
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

        for (let i=0; i<roomHeight; i++) {
          const Y = topLeftY + i;
          for (let j=0; j<roomWidth; j++) {
            const X = topLeftX + j;
            const tileToNorth = mapArray[Y - 1][X];
            const tileToEast = mapArray[Y][X + 1];
            const tileToSouth = mapArray[Y + 1][X];
            const tileToWest = mapArray[Y][X - 1];
            
            const existingTileType = mapArray[Y][X].type;

            if (existingTileType === 'wall') {
              /* This is an old wall from another room, make it into a floor to create a big room*/
              /* Set floor tile for now, then check if it needs to be an outside corner after drawing the new room */
              mapArray[Y][X].walkable = true;
              mapArray[Y][X].type = 'ground';
              mapArray[Y][X].z = 0;
              mapArray[Y][X].backgroundImage = floorSprite;
              mapArray[Y][X].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
            } else if (existingTileType === 'ground') {
              // do diddly
            } else {
              /* build stuff */
              if (i===0) {
                /* NORTH WALL */
                mapArray[Y][X].type = 'wall';
                mapArray[Y][X].backgroundImage = dungeonSprite;
                if (j===0) {
                  // northwest corner of room
                  mapArray[Y][X].spriteOffset = dungeonTiles.nw;
                } else if (j===(roomWidth - 1)) {
                  // northeast corner of room
                  mapArray[Y][X].spriteOffset = dungeonTiles.ne;
                } else {
                  // north wall center
                  mapArray[Y][X].spriteOffset = dungeonTiles.n[Math.floor(Math.random() * dungeonTiles.n.length)];
                }
              } else if (i===roomHeight-1) {
                /* SOUTH WALL */
                mapArray[Y][X].type = 'wall';
                mapArray[Y][X].backgroundImage = dungeonSprite;
                if (j===0) {
                  // southwest corner of room
                  mapArray[Y][X].spriteOffset = dungeonTiles.sw;
                } else if (j===(roomWidth - 1)) {
                  // southeast corner of room
                  mapArray[Y][X].spriteOffset = dungeonTiles.se;
                } else {
                  // south wall center
                  mapArray[Y][X].spriteOffset = dungeonTiles.s;
                }
              } else {
                /* CENTER OF ROOM */
                /* Place a wall on either end and floor tiles in the center. */
                if (j===0) {
                  // west wall of room
                  mapArray[Y][X].type = 'wall';
                  mapArray[Y][X].backgroundImage = dungeonSprite;
                  mapArray[Y][X].spriteOffset = dungeonTiles.w;
                } else if (j===(roomWidth - 1)) {
                  // east wall of room
                  mapArray[Y][X].type = 'wall';
                  mapArray[Y][X].backgroundImage = dungeonSprite;
                  mapArray[Y][X].spriteOffset = dungeonTiles.e;
                } else {
                  // floor tile in center of room
                  mapArray[Y][X].walkable = true;
                  mapArray[Y][X].type = 'ground';
                  mapArray[Y][X].z = 0;
                  mapArray[Y][X].backgroundImage = floorSprite;
                  mapArray[Y][X].spriteOffset = floorTiles.tiles[Math.floor(Math.random() * floorTiles.tiles.length)];
                }
              }
            }

            /* Check for outside corners to replace floors with */
            if (mapArray[Y][X].type === 'ground') {
              if (tileToNorth && tileToNorth.type === 'wall' &&
                  tileToWest && tileToWest.type === 'wall' &&
                  tileToSouth && tileToSouth.type === 'ground' &&
                  tileToEast && tileToEast.type === 'ground') {
                console.log('Outside southeast corner!');
                mapArray[Y][X].type = 'wall';
                mapArray[Y][X].backgroundImage = dungeonSprite;
                mapArray[Y][X].spriteOffset = dungeonTiles.seo;
              } else if (tileToNorth && tileToNorth.type === 'wall' &&
                          tileToEast && tileToEast.type === 'wall' &&
                          tileToSouth && tileToSouth.type === 'ground' &&
                          tileToWest && tileToWest.type === 'ground') {
                console.log('Outside southwest corner!');
                mapArray[Y][X].type = 'wall';
                mapArray[Y][X].backgroundImage = dungeonSprite;
                mapArray[Y][X].spriteOffset = dungeonTiles.swo;
              } else if (tileToWest && tileToWest.type === 'wall' && 
                          tileToSouth && tileToSouth.type === 'wall' &&
                          tileToEast && tileToEast.type === 'ground' && 
                          tileToNorth && tileToNorth.type === 'ground') {
                console.log('Outside Northeast corner!');
                mapArray[Y][X].type = 'wall';
                mapArray[Y][X].backgroundImage = dungeonSprite;
                mapArray[Y][X].spriteOffset = dungeonTiles.neo;
              } else if (tileToEast && tileToEast.type === 'wall' &&
                          tileToSouth && tileToSouth.type === 'wall') {
                console.log('Outside Northwest corner!');
                mapArray[Y][X].type = 'wall';
                mapArray[Y][X].backgroundImage = dungeonSprite;
                mapArray[Y][X].spriteOffset = dungeonTiles.nwo;
              }
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
