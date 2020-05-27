import React from "react";

function MinimapTile(props) {
  const style = {
    right: '0px',
    top: '0px',
    position: 'relative',
    width: 8,
    height: 8,
    zIndex: 5,
  };
  const getTileColor = (tile) => {
    if (tile.tileType === 'empty') {
      return 'black';
    } else if (tile.tileType === 'wall') {
      return 'white';
    } else if (tile.typeType === 'ground') {
      return 'grey';
    }
    return 'black';
  }
  style.backgroundColor = getTileColor(props.tile);
  
  return (
    <div className="minimapTile App-minimapTile"
         style={style}>
    </div>
  );
}

export default MinimapTile;
