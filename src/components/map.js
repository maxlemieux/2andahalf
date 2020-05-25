import React, { Component } from "react";
import MapTile from "./mapTile";
import Leaf from '../util/leaf';
const { initializeMap } = require('../util/mapUtil');

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

/**
 * Stateful component to display the main game map.
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
      },
    };
    this.buildMap = () => {
      /** BSP dungeon generation
       * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
       * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
      let worldData = initializeMap(MAP_WIDTH, MAP_HEIGHT);

      const maxLeafSize = 20;
      const leafArr = [];
      const rootLeaf = new Leaf(0, 0, worldData[0].length, worldData.length);
      leafArr.push(rootLeaf);
    
      let didSplit = true;
      while (didSplit === true) {
        didSplit = false;
        for (let i = 0; i < leafArr.length; i += 1) {
          const leaf = leafArr[i];
          if (!leaf.leftChild && !leaf.rightChild) {
            if (leaf.width > maxLeafSize || leaf.height > maxLeafSize) {
              if (leaf.split() === true) {
                leafArr.push(leaf.leftChild);
                leafArr.push(leaf.rightChild);
                didSplit = true;
              }
            }
          }
        }
      }
      // console.log(worldData)    
      this.setState({worldData: rootLeaf.createRooms(worldData)});
    };
    this.buildMap();
  }


  setWorldData(_worldData) {
    this.setState({ worldData: _worldData});
  }

  render() {
    return (
      <div style={this.state.style} className="App-map">
      {this.state.worldData.map(function(row, i){
        return (
        <div className="map-row">
        {row.map(function(tile, j){
          return <MapTile tile={tile} setWorldData={this.setWorldData} key={j} />;
        })}
        </div>
        )
      })}
      </div>
    );
  }
}

export default Map;
