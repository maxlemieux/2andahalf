import React from 'react';
import Player from './player';
import NPC from './npc';

const { tileToCartesian, twoDToIso } = require('../utils/tileUtil');

function MapTile(props) {
  const backgroundImage = props.tile.sprite.backgroundImage;
  const spriteOffsetX = props.tile.sprite.spriteOffset[0];
  const spriteOffsetY = props.tile.sprite.spriteOffset[1];
  const background = `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`;

  const zIndex = props.tile.z;

  const cartX = tileToCartesian('x', props.tile.x);
  // console.log(cartX)
  const cartY = tileToCartesian('y', props.tile.y);
  const { xIso, yIso } = twoDToIso(cartX, cartY);
  const left = `${xIso}px`;
  const top = `${yIso}px`;

  const style = {
    left,
    top,
    position: 'absolute',
    width: 64,
    height: 32,
    paddingTop: '96px',
    marginTop: '96px',
    zIndex,
    background,
  };
  
  const playerObj = {
    name: 'Foo',
    xIso,
    yIso,
  }

  return (
    <>
    <div className="map-tile App-map-tile"
         data-x={props.tile.x}
         data-y={props.tile.y}
         style={style}>
      {/* <small>x{props.tile.x} y{props.tile.y}</small> */}
    </div>
    {props.tile.hasPlayer === true && <Player player={playerObj} />}
    {props.tile.hasEnemy === true && <NPC npc='orc' />}
    </>
  );
}

export default MapTile;
