import React from "react";

function MinimapTile(props) {
  const style = {
    right: '0px',
    top: '0px',
    position: 'relative',
    width: 8,
    height: 8,
    background: 'green',
    zIndex: 5,
  };
  return (
    <div className="minimapTile App-minimapTile"
         style={style}>
    </div>
  );
}

export default MinimapTile;
