import React from "react";

function Player(props) {
  const sprite = props.player.sprite;
  
  const spriteOffsetX = sprite.spriteOffset[0];
  const spriteOffsetY = sprite.spriteOffset[1];
  const backgroundImage = sprite.backgroundImage;
  const style = {
    left: props.xIso + 'px',
    top: props.yIso + 'px',
    position: 'absolute',
    width: 64,
    height: 32,
    paddingTop: 96 + 'px',
    marginTop: 96 + 'px',
    zIndex: props.z,
    background: `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`,
  };

  return (
    <div className="player" style={style}>
      <div className="playerSprite">
      </div>
      <div className="playerName">
        Adventurer
      </div>

    </div>
  );
}

export default Player;
