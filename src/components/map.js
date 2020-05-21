import React from "react";
import MapRow from "./mapRow";

const dungeonSprite = '/img/environment/iso_dungeon_walls_by_pfunked.png';
const dungeonTiles = {
  n: [32 + 128, 0],
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
  0: [-32,-32],
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
        console.log(`Room fits! Adding a room with size ${roomWidth} wide and ${roomHeight} tall with top left at ${topLeftX}, ${topLeftY}`);
  
        for (let i=0; i<roomHeight; i++) {
          console.log(`Now building row ${i}`);
          for (let j=0; j<roomWidth; j++) {
            // console.log(`Now building tile ${j} of row ${i}`);
            const existingTileType = mapArray[topLeftY + i][topLeftX + j].type;
            if (existingTileType === 'ground') {
              /* This is an existing room, leave the floor tiles alone */
              continue;
            } else if (existingTileType === 'wall') {
              /* This is an old wall from another room, make it into a floor to create a big room*/
              /* First let's check to see if we should make an outside corner instead*/
              const tileToNorth = mapArray[topLeftY + i - 1][topLeftX + j];
              const tileToEast = mapArray[topLeftY + i][topLeftX + j + 1];
              const tileToSouth = mapArray[topLeftY + i + 1][topLeftX + j];
              const tileToWest = mapArray[topLeftY + i][topLeftX + j - 1];
              if (tileToNorth && tileToNorth.type === 'wall' &&
                  tileToEast && tileToEast.type === 'ground' &&
                  tileToSouth && tileToSouth.type === 'ground' &&
                  tileToWest && tileToWest.type === 'wall' ) {
                console.log('Outside southeast corner!');
                mapArray[topLeftY + i][topLeftX + j].type = 'wall';
                mapArray[topLeftY + i][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY + i][topLeftX + j].spriteOffset = dungeonTiles.seo;
                continue;  
              } else if (tileToNorth && tileToNorth.type === 'wall' &&
                         tileToEast && tileToEast.type === 'wall' &&
                         tileToSouth && tileToSouth.type === 'ground' &&
                         tileToWest && tileToWest.type === 'ground') {
                console.log('Outside southwest corner!');
                mapArray[topLeftY + i][topLeftX + j].type = 'wall';
                mapArray[topLeftY + i][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY + i][topLeftX + j].spriteOffset = dungeonTiles.swo;
                continue;  
              } else if (tileToWest && tileToWest.type === 'wall' && 
                         tileToNorth && tileToNorth.type === 'ground' &&
                         tileToEast && tileToEast.type === 'ground' &&
                         tileToSouth && tileToSouth.type === 'wall') {
                console.log('Outside Northeast corner!');
                mapArray[topLeftY + i][topLeftX + j].type = 'wall';
                mapArray[topLeftY + i][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY + i][topLeftX + j].spriteOffset = dungeonTiles.neo;
                continue;  
          } else if (tileToWest && tileToWest.type === 'ground' && 
                     tileToNorth && tileToNorth.type === 'ground' &&
                     tileToEast && tileToEast.type === 'wall' &&
                     tileToSouth && tileToSouth.type === 'wall') {
                console.log('Outside Northwest corner!');
                mapArray[topLeftY + i][topLeftX + j].type = 'wall';
                mapArray[topLeftY + i][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY + i][topLeftX + j].spriteOffset = dungeonTiles.nwo;
                continue;  
          }
              /* Okay, it should be a floor */
              mapArray[topLeftY + i][topLeftX + j].walkable = true;
              mapArray[topLeftY + i][topLeftX + j].type = 'ground';
              mapArray[topLeftY + i][topLeftX + j].backgroundImage = floorSprite;
              mapArray[topLeftY + i][topLeftX + j].spriteOffset = floorTiles[0];
              continue;
            }
            if (i===0) {
              console.log('We are on the north wall');
              /* NORTH WALL */
              if (j===0) {
                // northwest corner of room
                console.log('nw corner');
                mapArray[topLeftY][topLeftX + j].spriteOffset = dungeonTiles.nw;
              } else if (j===(roomWidth - 1)) {
                // northeast corner of room
                console.log('ne corner');
                mapArray[topLeftY][topLeftX + j].spriteOffset = dungeonTiles.ne;
              } else {
                // north wall center
                console.log(`n center - X=${topLeftX + j}`);
                mapArray[topLeftY][topLeftX + j].spriteOffset = dungeonTiles.n;
              }
              mapArray[topLeftY][topLeftX + j].type = 'wall';
              mapArray[topLeftY][topLeftX + j].backgroundImage = dungeonSprite;

            } else if (i===roomHeight-1) {
              /* SOUTH WALL */
              if (j===0) {
                // southwest corner of room
                mapArray[topLeftY + roomHeight - 1][topLeftX].type = 'wall';
                mapArray[topLeftY + roomHeight - 1][topLeftX].backgroundImage = dungeonSprite;
                mapArray[topLeftY + roomHeight - 1][topLeftX].spriteOffset = dungeonTiles.sw;
              } else if (j===(roomWidth - 1)) {
                // southeast corner of room
                mapArray[topLeftY + roomHeight - 1][topLeftX + roomWidth - 1].type = 'wall';
                mapArray[topLeftY + roomHeight - 1][topLeftX + roomWidth - 1].backgroundImage = dungeonSprite;
                mapArray[topLeftY + roomHeight - 1][topLeftX + roomWidth - 1].spriteOffset = dungeonTiles.se;
              } else {
                // south wall center
                mapArray[topLeftY + roomHeight - 1][topLeftX + j].type = 'wall';
                mapArray[topLeftY + roomHeight - 1][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY + roomHeight - 1][topLeftX + j].spriteOffset = dungeonTiles.s;
              }
            } else {
              /* CENTER OF ROOM */
              /* Place a wall on either end and floor tiles in the center. */
              if (j===0) {
                // west side of room
                mapArray[topLeftY + i][topLeftX].type = 'wall';
                mapArray[topLeftY + i][topLeftX].backgroundImage = dungeonSprite;
                mapArray[topLeftY + i][topLeftX].spriteOffset = dungeonTiles.w;
              } else if (j===(roomWidth - 1)) {
                // east side of room
                mapArray[topLeftY + i][topLeftX + roomWidth - 1].type = 'wall';
                mapArray[topLeftY + i][topLeftX + roomWidth - 1].backgroundImage = dungeonSprite;
                mapArray[topLeftY + i][topLeftX + roomWidth - 1].spriteOffset = dungeonTiles.e;
              } else {
                // floor tile in center of room
                mapArray[topLeftY + i][topLeftX + j].walkable = true;
                mapArray[topLeftY + i][topLeftX + j].type = 'ground';
                mapArray[topLeftY + i][topLeftX + j].backgroundImage = floorSprite;
                mapArray[topLeftY + i][topLeftX + j].spriteOffset = floorTiles[0];
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
   roomArray = newRoom(mapArray);
   roomArray = newRoom(mapArray);

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
