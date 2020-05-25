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

  return worldData;
};

export {
  initializeMap,
  buildMap,
};
