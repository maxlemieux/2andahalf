import React from "react";

function MapTile(props) {
  const style = {
    left: props.tile.xIso,
    top: props.tile.yIso,
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
