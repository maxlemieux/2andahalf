import Leaf from './leaf';
import { getRandomEmptyFloor } from './tileUtil';

const initializeMap = (mapWidth, mapHeight) => {
  const worldData = [];
  for (let y = 0; y < mapHeight; y += 1) {
    const thisRow = [];
    for (let x = 0; x < mapWidth; x += 1) {
      /** Create the tile with some defaults */
      const tile = {
        empty: true,
        tileType: 'empty',
        sprite: {
          spriteOffset: [0, 0],
        },
        seeThrough: true,
        passThrough: false,
        x,
        y,
        z: 0,
      };
      thisRow.push(tile);
    }
    worldData.push(thisRow);
  }
  return worldData;
};

const buildMap = (_MAP_WIDTH, _MAP_HEIGHT) => {
  /** BSP dungeon generation
   * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
   * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
  console.log('Beginning map build');
  // props.logFunc('chat', 'Beginning map build');
  const mapData = initializeMap(_MAP_WIDTH, _MAP_HEIGHT);

  /** Size for leaf splits on BSP */
  const maxLeafSize = 8;

  const leafArr = [];
  const rootLeaf = new Leaf(0, 0, mapData[0].length, mapData.length);
  leafArr.push(rootLeaf);

  let didSplit = true;
  while (didSplit) {
    didSplit = false;
    for (let i = 0; i < leafArr.length; i += 1) {
      const leaf = leafArr[i];
      if (!leaf.leftChild && !leaf.rightChild) {
        if (leaf.width > maxLeafSize || leaf.height > maxLeafSize) {
          if (leaf.split()) {
            leafArr.push(leaf.leftChild);
            leafArr.push(leaf.rightChild);
            didSplit = true;
          }
        }
      }
    }
  }
  const createdRooms = rootLeaf.createRooms(mapData);
  const randomSpawn = getRandomEmptyFloor(createdRooms);
  createdRooms[randomSpawn.y][randomSpawn.x].hasPlayer = true;
  console.log(`Attempting to spawn player at x ${randomSpawn.x}, y ${randomSpawn.y}`)
  return createdRooms;
};


export {
  buildMap,
  initializeMap,
};
