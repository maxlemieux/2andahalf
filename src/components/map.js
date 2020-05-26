import React from "react";
import { getSeed, seedrandomRange } from '../util/util';
import createRoom from '../util/roomUtil';
import initializeMap from '../util/mapUtil';
import MapRow from "./mapRow";

/** Map size in 64x32 tiles */
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;



/** Object constructor for Leaf. 
 * This could probably also be an ES6 class object. 
*/
function Leaf(_x, _y, _width, _height) {
  this.width = _width;
  this.height = _height;
  this.minLeafSize = 8;
  this.x = _x;
  this.y = _y;
  this.room = {};
  this.halls = [];

  this.split = () => {
    if (this.leftChild !== undefined|| this.rightChild !== undefined) {
      // already split, abort!
      return false;
    } else {
      // console.log(`leftChild: ${this.leftChild}`)
    }
    this.splitH = (getSeed() > 0.5);
    if (this.width > this.height && this.width / this.height >= 1.25) {
      this.splitH = false;
    } else if (this.height > this.width && this.height / this.width >= 1.25) {
      this.splitH = true;
    }
    // console.log(`splitH: ${this.splitH}`)
    
    // console.log(`Checking leaf size for potential split: height ${this.height} width ${this.width} and minLeafSize ${this.minLeafSize}`)
    this.max = (this.splitH ? this.height : this.width) - this.minLeafSize;
    if (this.max <= this.minLeafSize) {
      // area is too small to split any more, abort!
      // console.log(`area is too small to split any more, abort!`)
      return false;
    }

    this.splitLoc = seedrandomRange(this.minLeafSize, this.max);
    // console.log(`New split location ${this.splitLoc}`)
    if (this.splitH) {
      this.leftChild = new Leaf(this.x, this.y, this.width, this.splitLoc);
      this.rightChild = new Leaf(this.x, this.y + this.splitLoc, this.width, this.height - this.splitLoc);
    } else {
      this.leftChild = new Leaf(this.x, this.y, this.splitLoc, this.height);
      this.rightChild = new Leaf(this.x + this.splitLoc, this.y, this.width - this.splitLoc, this.height);
    }
    return true;
  }

  this.createRooms = (_worldData) => {
    let worldData = _worldData;
    if (this.leftChild || this.rightChild) {
      if (this.leftChild) {
        this.leftChild.createRooms(worldData);
      }
      if (this.rightChild) {
        this.rightChild.createRooms(worldData);
      }
    } else {
      this.roomSize = [
        seedrandomRange(6, this.width - 2),
        seedrandomRange(6, this.height - 2),
      ];
      this.roomPos = [
        seedrandomRange(1, this.width - this.roomSize[0] - 1),
        seedrandomRange(1, this.height - this.roomSize[1] - 1),
      ];
    }

    if (this.roomSize && this.roomPos && worldData) {
      this.room = {
        width: this.roomSize[0],
        height: this.roomSize[1],
        x: this.x + this.roomPos[0],
        y: this.y + this.roomPos[1],
      }
      worldData = createRoom(
        worldData,
        this.roomSize[0],
        this.roomSize[1],
        this.x + this.roomPos[0],
        this.y + this.roomPos[1],
      );
    } else {
      // something is missing, what is it?
      console.log(`this.roomsize ${this.roomSize}, this.roomPos ${this.roomPos}`)
    }
    // need to return something here
    return worldData;
  }

  this.getRoom = () => {
    if (this.room !== {}) {
      return this.room;
    } else {
      let lRoom;
      let rRoom;
      if  (this.leftChild) {
        const lRoom = this.leftChild.getRoom();
      }
      if  (this.rightChild) {
        const rRoom = this.rightChild.getRoom();
      }
      if (lRoom === undefined && rRoom === undefined) {
        return undefined;
      } else if (rRoom === undefined) {
        return lRoom;
      } else if (lRoom === undefined) {
        return rRoom;
      } else if (getSeed() > .5) {
        return lRoom
      } else {
        return rRoom
      }
    }
  }

  this.createHall = (leftRoom,rightRoom) => {
    const halls = [];
    const point1 = [
      seedrandomRange(leftRoom.top + 1, leftRoom.bottom - 2),
      seedrandomRange(leftRoom.top + 1, leftRoom.bottom - 2),
    ]
    const point2 = [
      seedrandomRange(rightRoom.top + 1, rightRoom.bottom - 2),
      seedrandomRange(rightRoom.top + 1, rightRoom.bottom - 2),
    ]
    const w = point2[0] - point1[0];
    const h = point2[1] - point1[1];
    if (w < 0) {
      if (h < 0) {
        if (getSeed() < 0.5) {
          halls.push([point2[0], point1[1], Math.abs(w), 1])
          halls.push([point2[0], point2[1], 1, Math.abs(h)])
        } else {
          halls.push([point2[0], point2[1], Math.abs(w), 1])
          halls.push([point1[0], point2[1], 1, Math.abs(h)])
        }
      } else if (h > 0) {
        if (getSeed() < 0.5) {
          halls.push([point2[0], point1[1], Math.abs(w), 1])
          halls.push([point2[0], point1[1], 1, Math.abs(h)])
        } else {
          halls.push([point2[0], point2[1], Math.abs(w), 1])
          halls.push([point1[0], point1[1], 1, Math.abs(h)])
        }
      } else if (h === 0) {
        halls.push([point2[0], point2[1], Math.abs(w), 1])
      }
    } else if (w > 0) {
      if (h < 0) {
        if (getSeed() < 0.5) {
          halls.push([point1[0], point2[1], Math.abs(w), 1])
          halls.push([point1[0], point2[1], 1, Math.abs(h)])
        } else {
          halls.push([point1[0], point1[1], Math.abs(w), 1])
          halls.push([point2[0], point2[1], 1, Math.abs(h)])
        }
      } else if (h > 0) {
        if (getSeed() < 0.5) {
          halls.push([point1[0], point1[1], Math.abs(w), 1])
          halls.push([point2[0], point1[1], 1, Math.abs(h)])
        } else {
          halls.push([point1[0], point2[1], Math.abs(w), 1])
          halls.push([point1[0], point1[1], 1, Math.abs(h)])
        }
      } else if (h === 0) {
        halls.push([point1[0], point1[1], Math.abs(w), 1])
      }
    } else if (w === 0) {
      if (h < 0) {
        halls.push([point2[0], point2[1], 1, Math.abs(h)])
      } else if (h > 0) {
        halls.push([point1[0], point1[1], 1, Math.abs(h)])
      }
    }
  }
}

/**
 * Functional component to display the main game map.
 */
function Map(props) {
  const style = {
    top: '0px',
    left: '0px',
    width: '100%',
    minHeight: '75vh',
    backgroundColor: 'gray',
  };

  const buildMap = () => {
    /** BSP dungeon generation
     * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
     * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
    console.log('Beginning map build');

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

    // console.log('mapData')
    // console.log(mapData)
    const newStuff = rootLeaf.createRooms(mapData);
    console.log(newStuff);
    return newStuff;
  };

  let worldData = buildMap();
  
  return (
    <div style={style} className="App-map">
      {worldData.map(function(row, i){
        return (
          <MapRow row={row} key={i}/>
        )
      })}
    </div>
  );
};

export default Map;
