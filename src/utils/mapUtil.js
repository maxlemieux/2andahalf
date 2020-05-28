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


module.exports = initializeMap;
