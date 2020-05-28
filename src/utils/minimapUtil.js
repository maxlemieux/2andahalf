const getMinimapTileColor = (tile) => {
  if (tile.hasPlayer) {
    return 'purple';
  }
  if (tile.tileType === 'empty') {
    return 'black';
  }
  if (tile.tileType === 'wall') {
    return 'white';
  }
  if (tile.tileType === 'ground') {
    return 'grey';
  }
  return 'pink';
};

export default getMinimapTileColor;
