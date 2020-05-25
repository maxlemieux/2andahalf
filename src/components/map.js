import React from "react";
import { getSeed, seedrandomRange } from '../util/util';
import createRoom from '../util/roomUtil';
import initializeMap from '../util/mapUtil';
import MapTile from "./mapTile";

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

/** Object constructor for Leaf. 
 * This could probably also be an ES6 class object. 
*/
function Leaf(_x, _y, _width, _height) {
  this.width = _width;
  this.height = _height;
  this.minLeafSize = 6;
  this.x = _x;
  this.y = _y;

  this.split = () => {
    if (this.leftChild || this.rightChild) {
      return false;
    }
    this.splitH = (getSeed() > 0.5);
    if (this.width > this.height && this.width / this.height >= 1.25) {
      this.splitH = false;
    } else if (this.height > this.width && this.height / this.width >= 1.25) {
      this.splitH = true;
    }
    this.max = (this.splitH ? this.height : this.width) - this.minLeafSize;
    if (this.max <= this.minLeafSize) {
      return false;
    }
    this.splitLoc = seedrandomRange(this.minLeafSize, this.max);
    if (this.splitH) {
      this.leftChild = new Leaf(this.x, this.y, this.width, this.splitLoc);
      this.rightChild = new Leaf(this.x, this.y + this.splitLoc, this.width, this.height - this.splitLoc);
    } else {
      this.leftChild = new Leaf(this.x, this.y, this.splitLoc, this.height);
      this.rightChild = new Leaf(this.x + this.splitLoc, this.y, this.width - this.splitLoc, this.height);
    }
    return true;
  }

  this.createRooms = (_worldData, setWorldData) => {
    const worldData = _worldData;
    if (this.leftChild || this.rightChild) {
      if (this.leftChild) {
        this.leftChild.createRooms(worldData, setWorldData);
      }
      if (this.rightChild) {
        this.rightChild.createRooms(worldData, setWorldData);
      }
    } else {
      this.roomSize = [
        seedrandomRange(3, this.width - 2),
        seedrandomRange(3, this.height - 2),
      ];
      this.roomPos = [
        seedrandomRange(1, this.width - this.roomSize[0] - 1),
        seedrandomRange(1, this.height - this.roomSize[1] - 1),
      ];
    }

    if (this.roomSize && this.roomPos && worldData) {
      const newWorldData = createRoom(
        worldData,
        this.roomSize[0],
        this.roomSize[1],
        this.x + this.roomPos[0],
        this.y + this.roomPos[1],
      );
      setWorldData(newWorldData);
    }
  }
}

/**
 * Stateful component to display the main game map.
 */
// class Map extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
function Map(props) {
  console.log('Beginning map build');

  let worldData;

  const style = {
    top: '0px',
    left: '0px',
    width: '100%',
    minHeight: '75vh',
    backgroundColor: 'gray',
  };

  const setWorldData = (_worldData) => {
    worldData = _worldData;
  };

  const buildMap = () => {
    /** BSP dungeon generation
     * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
     * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
    let mapData = initializeMap(MAP_WIDTH, MAP_HEIGHT);

    const maxLeafSize = 20;
    const leafArr = [];
    const rootLeaf = new Leaf(0, 0, mapData[0].length, mapData.length);
    leafArr.push(rootLeaf);
  
    let didSplit = true;
    while (didSplit) {
      didSplit = false;
      for (let i = 0; i < leafArr.length; i += 1) {
        const leaf = leafArr[i];
        if (!leaf.leftChild && !leaf.rightChild) {
          if (leaf.width > maxLeafSize || leaf.height > maxLeafSize) {
            if (leaf.split()) {
              leafArr.push(leaf.leftChild);
              leafArr.push(leaf.rightChild);
              didSplit = true;
            } else {
              console.log('We did not split')
            }
          }
        }
      }
    }
    console.log('mapData')
    console.log(mapData)
    worldData = rootLeaf.createRooms(mapData, setWorldData);
    console.log('worldData');
    console.log(worldData)
  };
  buildMap();
  return (
    <div style={style} className="App-map">
    {worldData.map(function(row, i){
      return (
      <div className="map-row">
      {row.map(function(tile, j){
        return <MapTile tile={tile} key={j} />;
      })}
      </div>
      )
    })}
    </div>
  );
};

export default Map;
