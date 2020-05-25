import React, { Component } from "react";
import MapRow from "./mapRow";

const { buildMap, initializeMap } = require('../util/mapUtil');

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

/**
 * Stateful component to display the main game map.
 */
class Map extends Component {
  constructor(props) {
    super(props);
    this.emptyMap = initializeMap(MAP_WIDTH, MAP_HEIGHT);
    this.state = {
      style: {
        top: '0px',
        left: '0px',
        width: '100%',
        minHeight: '75vh',
        backgroundColor: 'gray',
      },
      worldData: buildMap(this.emptyMap),
    };
  }

  render() {
    return (
      <div style={this.state.style} className="App-map">
      {this.state.worldData.map(function(object, i){
        return <MapRow row={object} key={i} />;
      })}
      {/* <Player player={this.playerCharacter} /> */}
      </div>
    );
  }
}

export default Map;
