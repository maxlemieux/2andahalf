import React from "react";
const playerSprite = require('../util/spriteUtil');

function Player(props) {
  const sprite = playerSprite.default.playerSprite;
  console.log(sprite);
  const spriteOffsetX = sprite.offset[0];
  const spriteOffsetY = sprite.offset[1];
  const backgroundImage = sprite.image;
  const style = {
    left: props.player.xIso + 'px',
    top: props.player.yIso + 'px',
    position: 'absolute',
    width: '64px',
    height: '32px',
    zIndex: 1,
    color: 'white',
    background: `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`,
  };

  return (
    <div className="player" style={style}>
      {/* <img src="/img/smiley.png" /> */}
      <div className="playerName">
        <h1>{props.player.name}</h1>
      </div>
    </div>
  );
}

export default Player;
