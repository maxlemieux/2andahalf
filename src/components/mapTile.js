import React from "react";

function MapTile(props) {
  console.log(props.tile.xIso)
  const style = {
    left: props.tile.xIso + 'px',
    top: props.tile.yIso + 'px',
    width: 64,
    height: 32,
    backgroundImage: "url('/img/environment/32_flagstone_tiles.png')",
    position: 'absolute',
  };
  
  return (
    <div className="map-tile"
         style={style}>
    </div>
  );
}

export default MapTile;
