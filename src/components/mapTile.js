import React from "react";

function MapTile(props) {
  const offsetX = props.tile.spriteOffset[0];
  const offsetY = props.tile.spriteOffset[1];
  
  const style = {
    left: props.tile.xIso + 'px',
    top: props.tile.yIso + 'px',
    position: 'absolute',
    width: 64,
    height: 32,
    paddingTop: 96 + 'px',
    marginTop: 96 + 'px',
    zIndex: props.tile.y,
    background: `url("${props.tile.backgroundImage}") -${offsetX}px -${offsetY}px`,
  };
  
  return (
    <div className="map-tile App-map-tile"
         style={style}>
           <small>x{props.tile.x} y{props.tile.y}</small>
    </div>
  );
}

export default MapTile;
