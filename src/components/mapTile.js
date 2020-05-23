import React from "react";

function MapTile(props) {
  // console.log(props.tile)
  const sprite = props.tile.sprite;
  const spriteOffsetX = sprite.spriteOffset[0];
  const spriteOffsetY = sprite.spriteOffset[1];
  const backgroundImage = sprite.backgroundImage;
  const style = {
    left: props.tile.xIso + 'px',
    top: props.tile.yIso + 'px',
    position: 'absolute',
    width: 64,
    height: 32,
    paddingTop: 96 + 'px',
    marginTop: 96 + 'px',
    zIndex: props.tile.z,
    background: `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`,
  };
  
  return (
    <div className="map-tile App-map-tile"
         data-x={props.tile.x}
         data-y={props.tile.y}
         style={style}>
           <small>x{props.tile.x} y{props.tile.y}</small>
    </div>
  );
}

export default MapTile;
