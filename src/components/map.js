import React from "react";
import MapRow from "./mapRow";

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
      const thisY = 32 + (32 * i);
      const thisRow = [];
      for (let j=0; j<mapWidth; j++) {
        /* Move the map to the right by 1/2 the inner window width to center on screen */
        const thisX = 32 * j + (window.innerWidth / 2);

        /* Get isometric coordinates for this tile */
        const iso = twoDToIso(thisX, thisY);

        /* Create the tile with some defaults */
        const tile = {
          empty: true,
          backgroundImage: "url('/img/environment/tiles_0.png')",
          spriteOffset: [0,0],
          tile: 0,
          walkable: false,
          // x: thisX,
          // y: thisY,
          x: j,
          y: i,
          xIso: iso.x,
          yIso: iso.y,
        };
        thisRow.push(tile);
      };
      mapArray.push(thisRow);
    };
    return mapArray;  
  }
  
  const mapArray = buildMap(8, 8);
  
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
        console.log(`room fits`);
        roomFound = true;
        console.log(`Adding a room with size ${roomWidth} wide and ${roomHeight} tall with top left at ${topLeftX}, ${topLeftY}`);
  
        /* Tile type 0 is a floor tile */
        // const floorSprite = 'url("/img/environment/tiles_0.png")';
        // const floorTiles = {
        //   0: [0,0],
        // };

        /* Tile types 1 through 8 are walls, North through Northwest counterclockwise. */
        const dungeonSprite = 'url("/img/environment/iso_dungeon_walls_by_pfunked.png")';

        /* Values for sprite shifting */
        const dungeonTiles = {
          1: [1 * 128, 0],
          2: [6 * 128, 128],
          3: [2 * 128, 0],
          4: [7 * 128, 128],
          5: [3 * 128, 0],
          6: [4 * 128, 128],
          7: [0, 0],
          8: [5 * 128, 128],
        }
  
        for (let i=roomHeight-1; i>=0; i--) {
          for (let j=0; j<roomWidth; j++) {
            mapArray[topLeftY][topLeftX].empty = false;
            if (i===0) {
              /* NORTH WALL */
              if (j===0) {   
                // northwest corner of room
                mapArray[topLeftY][topLeftX].walkable = false;
                mapArray[topLeftY][topLeftX].backgroundImage = dungeonSprite;
                mapArray[topLeftY][topLeftX].spriteOffset = dungeonTiles[8];
              } else if (j===(roomWidth - 1)) {
                // northeast corner of room
                mapArray[topLeftY][topLeftX + roomWidth-1].walkable = false;
                mapArray[topLeftY][topLeftX + roomWidth-1].backgroundImage = dungeonSprite;
                mapArray[topLeftY][topLeftX + roomWidth-1].spriteOffset = dungeonTiles[2];
              } else {
                // north wall center
                mapArray[topLeftY][topLeftX + j].walkable = false;
                mapArray[topLeftY][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY][topLeftX + j].spriteOffset = dungeonTiles[7];
              }
            } else if (i===roomHeight.length-1) {
              /* SOUTH WALL */
              if (j===0) {
                // southwest corner of room
                mapArray[topLeftY][topLeftX].walkable = false;
                mapArray[topLeftY][topLeftX].backgroundImage = dungeonSprite;
                mapArray[topLeftY][topLeftX].spriteOffset = dungeonTiles[8];
              } else if (j===(roomWidth - 1)) {
                // southeast corner of room
                mapArray[topLeftY][topLeftX + roomWidth-1].walkable = false;
                mapArray[topLeftY][topLeftX + roomWidth-1].backgroundImage = dungeonSprite;
                mapArray[topLeftY][topLeftX + roomWidth-1].spriteOffset = dungeonTiles[2];
              } else {
                // south wall center
                mapArray[topLeftY][topLeftX + j].walkable = false;
                mapArray[topLeftY][topLeftX + j].backgroundImage = dungeonSprite;
                mapArray[topLeftY][topLeftX + j].spriteOffset = dungeonTiles[7];
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

  const roomArray = newRoom(mapArray);

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
