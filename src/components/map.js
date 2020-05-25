import React, { Component } from "react";
import MapRow from "./mapRow";
// import createRoom from '../util/roomUtil';
const { buildMap, initializeMap } = require('../util/mapUtil');

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

/**
 * Stateful component to display the main game map.
 * 
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
    // date: new Date(),
  }  
  componentDidMount() {
    // this.timerID = setInterval(
    //   () => this.tick(),
    //   10000
    // );
  }

  componentWillUnmount() {
    // clearInterval(this.timerID);
  }

  tick() {
    // this.setState({
    //   date: new Date()
    // });
  }

  // updateWorld = () => {
  //   this.setState(() => ({
  //     worldData: this.worldData
  //   }));
  // }

  processMap() {
    this.worldData = initializeMap(MAP_WIDTH, MAP_HEIGHT);
    this.worldData = buildMap(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
    // this.worldData = createRoom(this.worldData);
  }    /* Make a few rooms */


  /* Display map */
  render() {
    this.processMap();

    return (
      <div style={this.state.style} className="App-map">
      {this.worldData.map(function(object, i){
        return <MapRow row={object} key={i} />;
      })}
      {/* <Player player={this.playerCharacter} /> */}
      </div>
    );
  }
}

export default Map;
