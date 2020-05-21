import React from "react";

function MapTile(props) {
  const offsetX = props.tile.spriteOffset[0];
  const offsetY = props.tile.spriteOffset[1];
  
  const style = {
    left: props.tile.xIso + 'px',
    top: props.tile.yIso + 'px',
    width: 64,
    height: 32,
    backgroundImage: props.tile.backgroundImage,
    // distance from left and top
    backgroundPosition: offsetX + 'px ' + offsetY + 'px',
    position: 'absolute',
  };
  
  return (
    <div className="map-tile App-map-tile"
         style={style}>
    </div>
  );
}

export default MapTile;
