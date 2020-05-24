import React, { Component } from "react";
import MapRow from "./mapRow";
import Player from "./player";
const { createRoom } = require('../util/roomUtil');
const { buildMap } = require('../util/tileUtil');
const { newPlayer } = require('../util/playerUtil');

/** Map size in 64x32 tiles */
const MAP_WIDTH = 24;
const MAP_HEIGHT = 12;

/**
 * Stateful component to display the main game map.
 * 
 */
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        top: '0px',
        left: '0px',
        width: '100%',
        minHeight: '75vh',
        backgroundColor: 'gray',
      }
    }  
  }
  
  worldData = buildMap(MAP_WIDTH, MAP_HEIGHT);

  /* Make a few rooms */
  worldData = createRoom(this.worldData);

  playerCharacter = newPlayer(5, 5);

  /* Display map */
  render() {
    return (
      <div style={this.state.style} className="App-map"
          >
      {this.worldData.map(function(object, i){
        return <MapRow row={object} key={i} />;
      })}
      <Player player={this.playerCharacter} />
      </div>
    );
  }
}

export default Map;
