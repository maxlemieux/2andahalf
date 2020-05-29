import React, { Component } from 'react';
import { buildMap }  from '../utils/mapUtil';
// import MapRow from './mapRow';
import MapTile from './mapTile';
import Minimap from './minimap';
// import { movePlayer } from '../utils/playerUtil';

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

/**
 * Class-based component to display the main game map.
 */
class Map extends Component {
  state = {
    style: {
      top: '0px',
      left: '0px',
      width: '100%',
      minHeight: '75vh',
      backgroundColor: 'gray',
    },
    player: {
      x: 0,
      y: 0,
    }
  }

  movePlayer = (event, worldData) => {
    const { x, y } = event.target.dataset;
    console.log(`iso map tile x: ${x}, y: ${y}`);
    const newLocation = { x, y };
    this.setState({ player: newLocation });
  }

  worldData = buildMap(MAP_WIDTH, MAP_HEIGHT);
  
  render = () => {
    return (
      <div style={this.state.style} className="App-map" onClick={this.movePlayer}>
        <Minimap worldData={this.worldData} />
  
        {this.worldData.map(function(row, i){
          return (
            <div className="map-row">
              {row.map((tile, j) => {
                return (<MapTile tile={tile} key={j} />)
                // return (<MapTile tile={tile} key={j}
                // hasPlayer={this.state.player.x === j && this.state.player.y === i} />)
              })}
            </div>
          )
        })}
      </div>
    );
  }
};

export default Map;
