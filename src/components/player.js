import React from "react";

// By extending the React.Component class, Player inherits functionality from it
class Player extends React.Component {
  // Setting the initial state of the Player component
  state = {
    level: 1
  };
  sprite = props.player.sprite;
  spriteOffsetX = sprite.spriteOffset[0];
  spriteOffsetY = sprite.spriteOffset[1];
  backgroundImage = sprite.backgroundImage;
  style = {
    left: props.tile.xIso + 'px',
    top: props.tile.yIso + 'px',
    position: 'absolute',
    width: 64,
    height: 32,
    paddingTop: 96 + 'px',
    marginTop: 96 + 'px',
    zIndex: props.tile.z,
    background: `url("${backgroundImage}") -${spriteOffsetX}px -${spriteOffsetY}px`,
  };

  // levelUp increments this.state.level by 1
  levelUp = () => {
    // We always use the setState method to update a component's state
    this.setState({ level: this.state.level + 1 });
  };

  // The render method returns the JSX that should be rendered
  render() {
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
}

export default Player;
