import React from "react";

function MinimapTile(props) {
  const style = {
    // right: '0px',
    // top: '0px',
    // position: 'relative',
    width: 8,
    height: 8,
    zIndex: 5,
  };
  const getTileColor = () => {
    if (props.tile.tileType === 'empty') {
      return 'black';
    } else if (props.tile.tileType === 'wall') {
      return 'white';
    } else if (props.tile.tileType === 'ground') {
      return 'grey';
    }
    return 'pink';
  }
  style.backgroundColor = getTileColor();

  return (
    <div className="minimapTile App-minimapTile" style={style}>
    </div>
  );
}

export default MinimapTile;
