import React from "react";

const { tileToCartesian, twoDToIso } = require('../util/tileUtil');

function MapTile(props) {
  const spriteOffsetX = props.tile.sprite.spriteOffset[0];
  const spriteOffsetY = props.tile.sprite.spriteOffset[1];
  const backgroundImage = props.tile.sprite.backgroundImage;

  const cartX = tileToCartesian('x', props.tile.x);
  const cartY = tileToCartesian('y', props.tile.y);
  /** Get isometric coordinates for this tile */
  const { xIso, yIso } = twoDToIso(cartX, cartY);

  const style = {
    left: xIso + 'px',
    top: yIso + 'px',
    position: 'absolute',
    width: 64,
    height: 32,
    paddingTop: '96px',
    marginTop: '96px',
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
