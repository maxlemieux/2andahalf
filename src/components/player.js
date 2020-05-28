import React from "react";
const playerSprite = require('../utils/spriteUtil');

function Player(props) {
  const sprite = playerSprite.default.playerSprite;
  console.log(sprite);
  const spriteOffsetX = sprite.offset[0];
  const spriteOffsetY = sprite.offset[1];
  const backgroundImage = sprite.image;
  const style = {
    left: props.player.xIso + 'px',
    top: props.player.yIso + 160 + 'px',
    position: 'absolute',
    width: '64px',
    height: '64px',
    zIndex: 1,
    // color: 'white',
    background: `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`,
  };
  const styleName = {
    color: 'white',
    marginTop: '-50px',
  }

  return (
    <div className="player" style={style}>
      {/* <img src="/img/smiley.png" /> */}
      <div className="playerName" style={styleName}>
        <p>{props.player.name}</p>
      </div>
    </div>
  );
}

export default Player;
