import React from "react";
import getMinimapTileColor from '../utils/minimapUtil';

function MinimapTile(props) {
  const style = {
    width: 8,
    height: 8,
    zIndex: 5,
  };
 
  style.backgroundColor = getMinimapTileColor(props.tile);

  return (
    <div className="minimapTile App-minimapTile" style={style}>
    </div>
  );
}

export default MinimapTile;
