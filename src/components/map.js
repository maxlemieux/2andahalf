import React from "react";
import MapRow from "./mapRow";
import Player from "./player";
import spriteInfo from "../util/spriteUtil.js";
const { playerSprite, dungeonSprite, dungeonTiles, floorSprite, floorTiles } = spriteInfo;
const { newPlayer } = require('../util/playerUtil');
const { getNearbyTiles, twoDToIso, tileToCartesian, createWall, createFloor } = require('../util/tileUtil.js');
const { getSeed } = require('../util/util.js');

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

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

  const buildMap = (mapWidth, mapHeight) => {
    const worldData = [];
    for (let y=0; y<mapHeight; y++) {
      const cartY = tileToCartesian('y', y);
      const thisRow = [];
      for (let x=0; x<mapWidth; x++) {
        /** Move the map to the right by 1/4 the inner window width to center on screen */
        const cartX = tileToCartesian('x', x);

        /** Get isometric coordinates for this tile */
        const { xIso, yIso } = twoDToIso(cartX, cartY);

        /** Create the tile with some defaults */
        const tile = {
          empty: true,
          type: 'empty',
          sprite: {
            spriteOffset: [0,0],
          },
          x,
          y,
          xScreen: cartX,
          yScreen: cartY,
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

  const newRoom = (worldData, widthTiles, heightTiles, thisTopLeftX, thisTopLeftY) => {
    /** get size of array to determine potential size of room */
    const mapWidth = worldData[0].length;
    const mapHeight = worldData.length;

    /** check random position and room size, see if it fits */
    let roomFound = false;
    while (roomFound === false) {
      const roomWidth = widthTiles || Math.floor(getSeed() * mapWidth / 4) + 4;
      const roomHeight = heightTiles || Math.floor(getSeed() * mapHeight / 4) + 4;

      /** Random room position */
      const topLeftX = thisTopLeftX || Math.floor(getSeed() * mapWidth);
      const topLeftY = thisTopLeftY || Math.floor(getSeed() * mapHeight);
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
            const oldTile = (tileType) => {
              if (nearbyTiles.this.type === 'wall' && 
                  nearbyTiles.this.wallType === tileType) {
                return true;
              }
              if (nearbyTiles.this.type === tileType) {
                return true;
              }
            };

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

            
            /** NORTH WALL 
               ========== */
            if (nwCorner &&
                oldTile('empty')) {
              worldData = createWall(x, y, 'nw', worldData);
              continue;
            };
            if (nwCorner && oldTile('e') &&
                nearbyTile('n') === 'e') {
              worldData = createWall(x, y, 'swo', worldData);
              continue;
            }

            if (neCorner &&
              oldTile('empty')) {
              worldData = createWall(x, y, 'ne', worldData);
              continue;
            }
            if (neCorner &&
              oldTile('n')) {
              worldData = createWall(x, y, 'n', worldData);
              continue;
            }
            if (neCorner &&
              oldTile('s') &&
              nearbyTile('w') === 'ground') {
              worldData = createWall(x, y, 'nwo', worldData);
              continue;
            };
            if (neCorner &&
                oldTile('w') &&
               (nearbyTile('n') === 'nw' || nearbyTile('n') === 'w') &&
               (nearbyTile('w') === 'n' || nearbyTile('w') === 'swo')) {
              worldData = createWall(x, y, 'seo', worldData);
              continue;
            };
          
            if (northCenter && 
                oldTile('s')) {
              /* North and south walls are overlapping, make a floor */
              worldData = createFloor(x, y, worldData);  
              continue;
            }
            if (northCenter &&
                oldTile('empty')) {
              worldData = createWall(x, y, 'n', worldData);
              continue;
            };
            if (northCenter &&
               (oldTile('nw') || oldTile('ne'))) {
              worldData = createWall(x, y, 'n', worldData);
              continue;
            };
            if (northCenter &&
                oldTile('w')) {
              worldData = createWall(x, y, 'seo', worldData);
              continue;
            };
            if (northCenter &&
                oldTile('e')) {
              worldData = createWall(x, y, 'swo', worldData);
              continue;
            };

            /* WEST WALL */
            if (westCenter &&
                oldTile('empty')) {
              worldData = createWall(x, y, 'w', worldData);
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
              worldData = createWall(x, y, 'seo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('n') &&
                nearbyTile('w') === 'sw') {
              worldData = createWall(x, y, 'neo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('s') &&
                nearbyTile('w') === 's') {
              worldData = createWall(x, y, 'neo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('sw') &&
                nearbyTile('n') === 'w') {
              worldData = createWall(x, y, 'w', worldData);
              continue;
            }
            if (westCenter &&
                oldTile('se') &&
                nearbyTile('w') === 's') {
              worldData = createWall(x, y, 'neo', worldData);
              continue;
            };
            if (westCenter &&
                oldTile('nw') &&
                nearbyTile('n') === 'w') {
              worldData = createWall(x, y, 'w', worldData);
              continue;
            };

            /** EAST WALL */
            if (eastCenter && oldTile('w')) {
              worldData = createFloor(x, y, worldData);
              continue;
            };
            if (eastCenter && oldTile('e')) {
              continue;
            };
            if (eastCenter && oldTile('n')) {
              worldData = createWall(x, y, 'swo', worldData);
              continue;
            };
            if (eastCenter && oldTile('s')) {
              worldData = createWall(x, y, 'nwo', worldData);
              continue;
            };
            if (eastCenter && oldTile('nw')) {
              worldData = createWall(x, y, 'swo', worldData);
              continue;
            };
            if (eastCenter && 
               (oldTile('se') || 
              ((nearbyTile('n') === 'e') || 
               (nearbyTile('n') === 'ne')))) {
              worldData = createWall(x, y, 'e', worldData);
              continue;
            };
            // if (eastCenter && oldTile('se')) {
            //   worldData = createWall(x, y, 'e', worldData);
            //   continue;
            // };
            if (eastCenter && oldTile('sw')) {
              worldData = createWall(x, y, 'nwo', worldData);
              continue;
            };
            if (eastCenter && oldTile('sw')) {
              worldData = createFloor(x, y, worldData);
              continue;
            };

            if (eastCenter) {
              worldData = createWall(x, y, 'e', worldData);
              continue;
            };

            /* SOUTH WALL 
               ========== */
            if (swCorner &&
                nearbyTile('w') === 's' &&
                nearbyTile('n') === 'ground') {
              worldData = createWall(x, y, 's', worldData);
              continue;
            };
            if (swCorner &&
                oldTile('w') &&
                nearbyTile('e') === 'ground' &&
               (nearbyTile('n') === 'w' || nearbyTile('n') === 'nw') &&
               (nearbyTile('s') === 'w' || nearbyTile('s') === 'sw')) {
              worldData = createWall(x, y, 'w', worldData);
              continue;
            };
            if (swCorner &&
                oldTile('empty') &&
                nearbyTile('ne') === 'ground') {
              worldData = createWall(x, y, 'sw', worldData);
              continue;
            };

            if (seCorner &&
                oldTile('empty')) {
              worldData = createWall(x, y, 'se', worldData);  
              continue;
            };
            if (seCorner &&
                nearbyTile('e') === 's') {
              worldData = createWall(x, y, 's', worldData);
              continue; 
            };
            if (seCorner &&
                oldTile('n')) {
              worldData = createWall(x, y, 'swo', worldData);
              continue; 
            };
            if (seCorner &&
                oldTile('w') &&
                nearbyTile('w') === 's') {
              worldData = createWall(x, y, 'neo', worldData);
              continue;
            };

            if (southCenter &&
                oldTile('empty')) {
              worldData = createWall(x, y, 's', worldData);
              continue;
            };
            if (southCenter &&
                oldTile('w')) {
              worldData = createWall(x, y, 'neo', worldData);
              continue;
            };
            if (southCenter &&
               (oldTile('e') || oldTile('ne'))) {
              worldData = createWall(x, y, 'nwo', worldData);
              continue;
            };
            if (southCenter &&
               (oldTile('sw') || oldTile('se')) &&
                nearbyTile('w') === 's') {
              worldData = createWall(x, y, 's', worldData);
              continue;
            };
            if (southCenter &&
                oldTile('nw')) {
              worldData = createWall(x, y, 'neo', worldData);
              continue;
            };
            if (southCenter &&
               (oldTile('n') || oldTile('nw'))) {
              worldData = createFloor(x, y, worldData); 
              continue;
            };

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

  /* Make a few rooms */
  let worldArray = newRoom(worldData);
  worldArray = newRoom(worldData);
  worldArray = newRoom(worldData);
  // let worldArray = newRoom(worldData, 12, 12, 0, 0);
  // worldArray = newRoom(worldData, 6, 12, 3, 15);

  // worldArray = placeRandom('foo', worldArray);

  const playerCharacter = newPlayer(5, 5);

  /* Display map */
  return (
    <div style={style} className="App-map"
         >
    {worldArray.map(function(object, i){
      return <MapRow row={object} key={i} />;
    })}
    <Player player={playerCharacter} />
    </div>
  );
}

export default Map;
