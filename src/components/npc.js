import React from "react";
const npcSprite = require('../utils/spriteUtil');

function NPC(props) {
  const sprite = npcSprite.default.npcSprite;
  console.log(sprite);
  const spriteOffsetX = sprite.offset[0];
  const spriteOffsetY = sprite.offset[1];
  const backgroundImage = sprite.image;
  const style = {
    left: props.npc.xIso + 'px',
    top: props.npc.yIso + 160 + 'px',
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
    <div className="npc" style={style}>
      {/* <img src="/img/smiley.png" /> */}
      <div className="npcName" style={styleName}>
        <p>{props.npc.name}</p>
      </div>
    </div>
  );
}

export default NPC;
