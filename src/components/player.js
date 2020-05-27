import React from "react";

function Player(props) {
  const sprite = props.player.sprite.default;
  console.log(sprite.playerSprite);
  const spriteOffsetX = sprite.playerSprite.spriteOffset[0];
  const spriteOffsetY = sprite.playerSprite.spriteOffset[1];
  const backgroundImage = sprite.playerSprite.backgroundImage;
  const style = {
    left: props.xIso + 'px',
    top: props.yIso + 'px',
    position: 'absolute',
    width: '64px',
    height: '32px',
    // paddingTop: 96 + 'px',
    // marginTop: 96 + 'px',
    zIndex: 1,
    background: `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`,
  };

  return (
    <div className="player" style={style}>
      <div className="playerName">
        <h1>Adventurer</h1>
      </div>
    </div>
  );
}

export default Player;
