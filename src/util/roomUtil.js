import { getSeed } from './util';

const { createFloor, createWall, getNearbyTiles } = require('./tileUtil');

const createRoom = (_worldData, widthTiles, heightTiles, _tX, _tY) => {
  console.log(`createRoom widthTiles ${widthTiles}, heightTiles ${heightTiles}, tX ${_tX}, tY ${_tY}`);
  console.log('we are in createRoom and initial worldData is');
  console.log(_worldData);
  let worldData = _worldData;
  /** get size of array to determine potential size of room */
  const mapWidth = worldData[0].length;
  const mapHeight = worldData.length;
  console.log(`current mapWidth ${mapWidth} mapHeight ${mapHeight}`)

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
      console.log(`New room: top left x: ${tX}, y: ${tY}, w ${roomWidth}, h ${roomHeight}`);

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
            if (nearbyTiles.this.tileType === 'wall'
                && nearbyTiles.this.wallType === thisType) {
              return true;
            }
            if (nearbyTiles.this.tileType === thisType) {
              return true;
            }
            return false;
          };

          const nearbyTile = (direction) => {
            if (nearbyTiles[direction]
                && nearbyTiles[direction].tileType === 'wall') {
              return nearbyTiles[direction].wallType;
            }
            if (nearbyTiles[direction]
                && nearbyTiles[direction].tileType === 'empty') {
              return 'empty';
            }
            if (nearbyTiles[direction]
                && nearbyTiles[direction].tileType === 'ground') {
              return 'ground';
            }
            return false;
          };

          /** If we got this far, it's time to build new stuff. */

          /** Boolean conditions */
          const northWall = (i === 0);
          const southWall = (i === (roomHeight - 1));
          const westWall = (j === 0);
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
          }
          if (nwCorner
            && oldTile('e')
            && (nearbyTile('n') === 'e' || nearbyTile('n') === 'ne')
            && (nearbyTile('e') === 'n' || nearbyTile('e') === 'seo')) {
            worldData = createWall(x, y, 'swo', worldData);
          }
          if (nwCorner
            && oldTile('n')) {
            worldData = createWall(x, y, 'n', worldData);
          }
          if (nwCorner
            && oldTile('s')
            && nearbyTile('e') === 'ground') {
            worldData = createWall(x, y, 'neo', worldData);
          }

          if (neCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'ne', worldData);
          }
          if (neCorner
              && oldTile('n')) {
            worldData = createWall(x, y, 'n', worldData);
          }
          if (neCorner
              && oldTile('s')
              && nearbyTile('w') === 'ground') {
            worldData = createWall(x, y, 'nwo', worldData);
          }
          if (neCorner
              && oldTile('w')
              && (nearbyTile('n') === 'w' || nearbyTile('n') === 'nw')
              && (nearbyTile('w') === 'n' || nearbyTile('w') === 'swo')) {
            worldData = createWall(x, y, 'seo', worldData);
          }

          if (northCenter
              && oldTile('s')) {
            worldData = createFloor(x, y, worldData);
          }
          if (northCenter
              && oldTile('empty')) {
            worldData = createWall(x, y, 'n', worldData);
          }
          if (northCenter
              && oldTile('sw')
              && (nearbyTile('n') === 'w'
              || nearbyTile('n') === 'nw')) {
            worldData = createWall(x, y, 'seo', worldData);
          }
          if (northCenter
              && (oldTile('nw') || oldTile('ne'))) {
            worldData = createWall(x, y, 'n', worldData);
          }
          if (northCenter
              && oldTile('w')) {
            worldData = createWall(x, y, 'seo', worldData);
          }
          if (northCenter
              && oldTile('e')) {
            worldData = createWall(x, y, 'swo', worldData);
          }

          /* WEST WALL */
          if (westCenter
              && oldTile('empty')) {
            worldData = createWall(x, y, 'w', worldData);
          }
          if (westCenter
              && oldTile('e')) {
            worldData = createFloor(x, y, worldData);
          }
          if (westCenter
              && oldTile('n')
              && (nearbyTile('w') === 'n'
              || nearbyTile('w') === 'nw'
              || nearbyTile('w') === 'swo')) {
            worldData = createWall(x, y, 'seo', worldData);
          }
          if (westCenter
              && oldTile('n')
              && nearbyTile('w') === 'sw') {
            worldData = createWall(x, y, 'neo', worldData);
          }
          if (westCenter
              && oldTile('s')
              && (nearbyTile('w') === 's'
              || nearbyTile('w') === 'sw')) {
            worldData = createWall(x, y, 'neo', worldData);
          }
          if (westCenter
              && oldTile('sw')
              && nearbyTile('n') === 'w') {
            worldData = createWall(x, y, 'w', worldData);
          }
          if (westCenter
              && oldTile('se')
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 'neo', worldData);
          }
          if (westCenter
              && oldTile('nw')
              && nearbyTile('n') === 'w') {
            worldData = createWall(x, y, 'w', worldData);
          }

          /** EAST WALL */
          if (eastCenter
              && (oldTile('w')
              || oldTile('ground'))) {
            worldData = createFloor(x, y, worldData);
          }
          if (eastCenter
              && oldTile('n')) {
            worldData = createWall(x, y, 'swo', worldData);
          }
          if (eastCenter
            && oldTile('s')
            && (nearbyTile('e') === 's'
            || nearbyTile('e') === 'se')) {
            worldData = createWall(x, y, 'nwo', worldData);
          }
          if (eastCenter
              && oldTile('nw')) {
            worldData = createWall(x, y, 'swo', worldData);
          }
          if (eastCenter
              && (oldTile('empty')
              || (oldTile('se')
              || ((nearbyTile('n') === 'e')
              || (nearbyTile('n') === 'ne'))))) {
            worldData = createWall(x, y, 'e', worldData);
          }
          if (eastCenter
              && oldTile('se')) {
            worldData = createWall(x, y, 'e', worldData);
          }
          if (eastCenter
              && oldTile('sw')) {
            worldData = createWall(x, y, 'nwo', worldData);
          }
          if (eastCenter
              && oldTile('sw')) {
            worldData = createFloor(x, y, worldData);
          }

          /* SOUTH WALL
             ========== */
          if (swCorner
              && nearbyTile('w') === 's'
              && nearbyTile('n') === 'ground') {
            worldData = createWall(x, y, 's', worldData);
          }
          if (swCorner
              && oldTile('w')
              && nearbyTile('e') === 'ground'
              && (nearbyTile('n') === 'w' || nearbyTile('n') === 'nw')
              && (nearbyTile('s') === 'w' || nearbyTile('s') === 'sw')) {
            worldData = createWall(x, y, 'w', worldData);
          }
          if (swCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'sw', worldData);
          }

          if (seCorner
              && oldTile('empty')) {
            worldData = createWall(x, y, 'se', worldData);
          }
          if (seCorner
              && nearbyTile('e') === 's') {
            worldData = createWall(x, y, 's', worldData);
          }
          if (seCorner
              && oldTile('n')) {
            worldData = createWall(x, y, 'swo', worldData);
          }
          if (seCorner
              && oldTile('w')
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 'neo', worldData);
          }

          if (southCenter
              && oldTile('empty')) {
            worldData = createWall(x, y, 's', worldData);
          }
          if (southCenter
              && oldTile('w')) {
            worldData = createWall(x, y, 'neo', worldData);
          }
          if (southCenter
              && (oldTile('e') || oldTile('ne'))) {
            worldData = createWall(x, y, 'nwo', worldData);
          }
          if (southCenter
              && (oldTile('sw') || oldTile('se'))
              && nearbyTile('w') === 's') {
            worldData = createWall(x, y, 's', worldData);
          }
          if (southCenter
              && oldTile('nw')) {
            worldData = createWall(x, y, 'neo', worldData);
          }
          if (southCenter
              && (oldTile('n')
              || oldTile('nw'))) {
            worldData = createFloor(x, y, worldData);
          }

          /* FLOORS */
          if (!northWall && !southWall && !westWall && !eastWall) {
            worldData = createFloor(x, y, worldData);
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
