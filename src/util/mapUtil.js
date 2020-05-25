import Leaf from './leaf';

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

const buildMap = (_worldData) => {
  /** BSP dungeon generation
   * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
   * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
  let worldData = _worldData;
  const maxLeafSize = 20;
  const leafArr = [];
  const rootLeaf = new Leaf(0, 0, worldData[0].length, worldData.length);
  leafArr.push(rootLeaf);

  let didSplit = true;
  while (didSplit === true) {
    didSplit = false;
    for (let i = 0; i < leafArr.length; i += 1) {
      const leaf = leafArr[i];
      if (!leaf.leftChild && !leaf.rightChild) {
        if (leaf.width > maxLeafSize || leaf.height > maxLeafSize) {
          if (leaf.split() === true) {
            leafArr.push(leaf.leftChild);
            leafArr.push(leaf.rightChild);
            didSplit = true;
          }
        }
      }
    }
  }
  // console.log(worldData)
  worldData = rootLeaf.createRooms(worldData);

  return worldData;
};

export {
  initializeMap,
  buildMap,
};
