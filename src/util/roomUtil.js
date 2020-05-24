import { getSeed } from './util';

const { createFloor, createWall, getNearbyTiles } = require('./tileUtil');

const createRoom = (_worldData, widthTiles, heightTiles, _tX, _tY) => {
  let worldData = _worldData;
  /** get size of array to determine potential size of room */
  const mapWidth = worldData[0].length;
  const mapHeight = worldData.length;

  /** check random position and room size, see if it fits */
  let roomFound = false;
  while (roomFound === false) {
    const roomWidth = widthTiles || Math.floor(getSeed() * (mapWidth / 4)) + 4;
    const roomHeight = heightTiles || Math.floor(getSeed() * (mapHeight / 4)) + 4;

    /** Random room position */
    const tX = _tX || Math.floor(getSeed() * mapWidth);
    const tY = _tY || Math.floor(getSeed() * mapHeight);
    if (roomWidth + tX < mapWidth && roomHeight + tY < mapHeight && roomFound === false) {
      roomFound = true;
      console.log(`New room with top left x: ${tX}, y: ${tY}, width ${roomWidth}, height ${roomHeight}`);

      /** For each row in the new room */
      for (let i = 0; i < roomHeight; i += 1) {
        const y = tY + i;
        /** For each tile in that row of the new room */
        for (let j = 0; j < roomWidth; j += 1) {
          const x = tX + j;

          /* Information about nearby tiles in 8 directions */
          const nearbyTiles = getNearbyTiles(x, y, worldData);

          /** Check the existing tile on the map to see what is there and what to do */
          /** Type will be either 'empty', 'wall' or 'ground' */

          const oldTile = (thisType) => {
            if (nearbyTiles.this.tileType === 'wall' && 
                nearbyTiles.this.wallType === thisType) {
              return true;
            }
            if (nearbyTiles.this.tileType === thisType) {
              return true;
            }
            return false;
          };

          const nearbyTile = (direction) => {
            if (nearbyTiles[direction] && nearbyTiles[direction].tileType === 'wall') {
              return nearbyTiles[direction].wallType;
            };
            if (nearbyTiles[direction] && nearbyTiles[direction].tileType === 'empty') {
              return 'empty';
            };
            if (nearbyTiles[direction] && nearbyTiles[direction].tileType === 'ground') {
              return 'ground';
            };
            return false;
          };

          // if (oldTile('ground')) {
          //   /** This is a floor tile from an old room, we want to keep it.
          //      Continue by going to the next tile in the row map */
          //   continue;
          // };
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
          if (nwCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'nw', worldData);
            continue;
          }
          if (nwCorner
              && oldTile('e')
              && nearbyTile('n') === 'e') {
            worldData = createWall(x, y, 'swo', worldData);
            continue;
          }

          if (neCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'ne', worldData);
            continue;
          }
          if (neCorner
              && oldTile('n')) {
            worldData = createWall(x, y, 'n', worldData);
            continue;
          }
          if (neCorner
              && oldTile('s')
              && nearbyTile('w') === 'ground') {
            worldData = createWall(x, y, 'nwo', worldData);
            continue;
          }
          if (neCorner
              && oldTile('w')
              && (nearbyTile('n') === 'nw' || nearbyTile('n') === 'w')
              && (nearbyTile('w') === 'n' || nearbyTile('w') === 'swo')) {
            worldData = createWall(x, y, 'seo', worldData);
            continue;
          }

          if (northCenter
              && oldTile('s')) {
            /* North and south walls are overlapping, make a floor */
            worldData = createFloor(x, y, worldData);
            continue;
          }
          if (northCenter
              && oldTile('empty')) {
            worldData = createWall(x, y, 'n', worldData);
            continue;
          }
          if (northCenter
              && oldTile('sw')
              && (nearbyTile('n') === 'w' || nearbyTile('n') === 'nw')) {
            worldData = createWall(x, y, 'seo', worldData);
            continue;
          }
          if (northCenter
              && (oldTile('nw') || oldTile('ne'))) {
            worldData = createWall(x, y, 'n', worldData);
            continue;
          }
          if (northCenter && oldTile('w')) {
            worldData = createWall(x, y, 'seo', worldData);
            continue;
          }
          if (northCenter
              && oldTile('e')) {
            worldData = createWall(x, y, 'swo', worldData);
            continue;
          }

          /* WEST WALL */
          if (westCenter
              && oldTile('empty')) {
            worldData = createWall(x, y, 'w', worldData);
            continue;
          };
          if (westCenter
              && oldTile('e')) {
            /* A west wall and an east wall are overlapping, make a floor */
            worldData = createFloor(x, y, worldData);
            continue;
          }
          if (westCenter
              && oldTile('n')
              && (nearbyTile('w') === 'n'
              || nearbyTile('w') === 'nw'
              || nearbyTile('w') === 'swo')) {
            worldData = createWall(x, y, 'seo', worldData);
            continue;
          }
          if (westCenter
              && oldTile('n')
              && nearbyTile('w') === 'sw') {
            worldData = createWall(x, y, 'neo', worldData);
            continue;
          }
          if (westCenter
              && oldTile('s')
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 'neo', worldData);
            continue;
          };
          if (westCenter
              && oldTile('sw')
              && nearbyTile('n') === 'w') {
            worldData = createWall(x, y, 'w', worldData);
            continue;
          }
          if (westCenter
              && oldTile('se')
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 'neo', worldData);
            continue;
          };
          if (westCenter
              && oldTile('nw')
              && nearbyTile('n') === 'w') {
            worldData = createWall(x, y, 'w', worldData);
            continue;
          }

          /** EAST WALL */
          if (eastCenter
              && oldTile('w')) {
            worldData = createFloor(x, y, worldData);
            continue;
          }
          if (eastCenter
              && oldTile('e')) {
            continue;
          }
          if (eastCenter
              && oldTile('n')) {
            worldData = createWall(x, y, 'swo', worldData);
            continue;
          }
          if (eastCenter
              && oldTile('s')) {
            worldData = createWall(x, y, 'nwo', worldData);
            continue;
          }
          if (eastCenter
              && oldTile('nw')) {
            worldData = createWall(x, y, 'swo', worldData);
            continue;
          }
          if (eastCenter
              && (oldTile('se')
              || ((nearbyTile('n') === 'e')
              || (nearbyTile('n') === 'ne')))) {
            worldData = createWall(x, y, 'e', worldData);
            continue;
          }
          if (eastCenter
              && oldTile('sw')) {
            worldData = createWall(x, y, 'nwo', worldData);
            continue;
          }
          if (eastCenter
              && oldTile('sw')) {
            worldData = createFloor(x, y, worldData);
            continue;
          }

          if (eastCenter) {
            worldData = createWall(x, y, 'e', worldData);
            continue;
          }

          /* SOUTH WALL 
             ========== */
          if (swCorner
              && nearbyTile('w') === 's'
              && nearbyTile('n') === 'ground') {
            worldData = createWall(x, y, 's', worldData);
            continue;
          }
          if (swCorner
              && oldTile('w')
              && nearbyTile('e') === 'ground'
              && (nearbyTile('n') === 'w' || nearbyTile('n') === 'nw')
              && (nearbyTile('s') === 'w' || nearbyTile('s') === 'sw')) {
            worldData = createWall(x, y, 'w', worldData);
            continue;
          }
          if (swCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'sw', worldData);
            continue;
          }

          if (seCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'se', worldData);  
            continue;
          }
          if (seCorner
              && nearbyTile('e') === 's') {
            worldData = createWall(x, y, 's', worldData);
            continue; 
          };
          if (seCorner
              && oldTile('n')) {
            worldData = createWall(x, y, 'swo', worldData);
            continue; 
          };
          if (seCorner
              && oldTile('w')
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 'neo', worldData);
            continue;
          };

          if (southCenter
              && oldTile('empty')) {
            worldData = createWall(x, y, 's', worldData);
            continue;
          }
          if (southCenter
              && oldTile('w')) {
            worldData = createWall(x, y, 'neo', worldData);
            continue;
          }
          if (southCenter
              && (oldTile('e') || oldTile('ne'))) {
            worldData = createWall(x, y, 'nwo', worldData);
            continue;
          }
          if (southCenter
              && (oldTile('sw') || oldTile('se'))
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 's', worldData);
            continue;
          }
          if (southCenter
              && oldTile('nw')) {
            worldData = createWall(x, y, 'neo', worldData);
            continue;
          }
          if (southCenter
              && (oldTile('n') || oldTile('nw'))) {
            worldData = createFloor(x, y, worldData); 
            continue;
          };

          /* FLOORS */
          if (!northWall && !southWall && !westWall && !eastWall) {
            // Always paint the floor tiles that are in the center of the new room
            worldData = createFloor(x, y, worldData);
            continue;
          }
        }
      }
    } else {
      // console.log(`room doesn't fit, trying again`);
    }
  }
  return worldData;
};

export default createRoom;
