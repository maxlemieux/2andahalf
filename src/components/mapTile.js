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
    backgroundPosition: offsetX + 'px 0px ' + offsetY + 'px 0px',
    position: 'absolute',
  };
  
  return (
    <div className="map-tile App-map-tile"
         style={style}>
           <small>x{Math.floor(props.tile.x / 128)} y{Math.floor(props.tile.y / 128)}</small>
    </div>
  );
}

export default MapTile;
