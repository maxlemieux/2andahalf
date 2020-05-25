import Leaf from './leaf';

const { tileToCartesian, twoDToIso } = require('./tileUtil');


const initializeMap = (mapWidth, mapHeight) => {
  const worldData = [];
  for (let y = 0; y < mapHeight; y += 1) {
    const cartY = tileToCartesian('y', y);
    const thisRow = [];
    for (let x = 0; x < mapWidth; x += 1) {
      /** Move the map to the right by 1/4 the inner window width to center on screen */
      const cartX = tileToCartesian('x', x);

      /** Get isometric coordinates for this tile */
      const { xIso, yIso } = twoDToIso(cartX, cartY);

      /** Create the tile with some defaults */
      const tile = {
        empty: true,
        tileType: 'empty',
        sprite: {
          spriteOffset: [0, 0],
        },
        x,
        y,
        cartX,
        cartY,
        xIso,
        yIso,
        z: 0,
      };
      thisRow.push(tile);
    }
    worldData.push(thisRow);
  }
  return worldData;
};

const buildMap = (worldData) => {
  /** BSP dungeon generation
   * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
   * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
  const maxLeafSize = 20;
  const leafArr = [];
  const rootLeaf = new Leaf(0, 0, worldData.length, worldData[0].length);
  leafArr.push(rootLeaf);

  let didSplit = true;
  console.log('foobarbaz')
  while (didSplit === true) {
    didSplit = false;
    for (let i = 0; i < leafArr.length; i += 1) {
      const leaf = leafArr[i];
      console.log(`leaf number ${i} of the leaf array`)
      if (!leaf.leftChild && !leaf.rightChild) {
        console.log('this leaf does not have children, make them')
        if (leaf.width > maxLeafSize || leaf.height > maxLeafSize) {
          console.log(`leaf width ${leaf.width} or height ${leaf.height} bigger than maxLeafSize ${maxLeafSize}`);
          if (leaf.split() === true) {
            console.log('leaf split was true')
            leafArr.push(leaf.leftChild);
            leafArr.push(leaf.rightChild);
            console.log(`leaf right child ${leaf.rightChild}`);
            didSplit = true;
          } else {
            console.log('leaf split was false')
          }
        } else {
          console.log('leaf width and height are under maxLeafSize')
          console.log(`w ${leaf.width} h ${leaf.height}`)
        }
      }
    }
  }
  console.log(leafArr.length);

  return worldData;
};

export {
  initializeMap,
  buildMap,
};
