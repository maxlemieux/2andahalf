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

  /** sprite move example */
  var dx = 5;
  var dy = 5;
  
  var xPos = 0;
  var yPos = 0;
  
  function position() {
    console.log(style)
      // Object.assign(style, {left: xPos + "px"});
      // Object.assign(style, {top: yPos + "px"});
      // setTimeout(position, 10);
  }
  
  function move(event) {
      var keyPressed = String.fromCharCode(event.keyCode);
      console.log('moving')
      if (keyPressed === "A") {
          xPos -= dx;
      } else if (keyPressed === "D") {
          xPos += dx;
      } else if (keyPressed === "S") {
          yPos -= dy;
      } else if (keyPressed === "W") {
          yPos += dy;
      }
      position();
  }
  
  document.addEventListener("keydown", move)

  /**end of sprite move example */

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
