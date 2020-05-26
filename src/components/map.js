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

  this.createHall = (leftRoom, rightRoom, _worldData) => {
    console.log('left and right room')
    console.log(`L T ${leftRoom.top}`)
    console.log(`L B ${leftRoom.bottom}`)
    console.log(`R T ${rightRoom.top}`)
    console.log(`R B ${rightRoom.bottom}`)
    let worldData = _worldData;
    const halls = [];
    const point1 = {
      x: seedrandomRange(leftRoom.top + 1, leftRoom.bottom - 2),
      y: seedrandomRange(leftRoom.top + 1, leftRoom.bottom - 2),
    }
    const point2 = {
      x: seedrandomRange(rightRoom.top + 1, rightRoom.bottom - 2),
      y: seedrandomRange(rightRoom.top + 1, rightRoom.bottom - 2),
    }
    console.log(`point1`)
    console.log(point1)
    console.log(`point2`)
    console.log(point2)
    const w = point2.x - point1.x;
    const h = point2.y - point1.y;
    if (isNaN(w)) {
      console.log(`oh no, w === NaN, maybe it is because point1.x ${point1.x} or point1.y ${point1.y}`)
      console.log(`oh no, w === NaN, maybe it is because point2.x ${point2.x} or point2.y ${point2.y}`)
    }
    console.log(`w: ${w}, h: ${h}`)
    if (w < 0 && h < 0 
        && getSeed() < 0.5) {
      halls.push({
        x: point2.x,
        y: point1.y,
        width: Math.abs(w),
        height: 1
      });
      halls.push({
        x: point2.x,
        y: point2.y,
        width: 1,
        height: Math.abs(h)
      });
    };
    if (w < 0 && h < 0 
        && getSeed() > 0.5) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: Math.abs(w),
        height: 1
      })
      halls.push({
        x: point1.x,
        y: point2.y,
        width: 1,
        height: Math.abs(h),
      })
    };

    if (w < 0 && h > 0 && getSeed() < 0.5) {
      halls.push({
        x: point2.x,
        y: point1.y,
        width: Math.abs(w),
        height: 1,
      })
      halls.push({
        x: point2.x,
        y: point1.y,
        width: 1,
        height: Math.abs(h),
      })
    };

    if (w < 0 && h > 0 && getSeed() > 0.5) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: Math.abs(w),
        height: 1,
      })
      halls.push({
        x: point1.x,
        y: point1.y,
        width: 1,
        height: Math.abs(h),
      })
    };

    if (w < 0 && h === 0) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: Math.abs(w),
        height: 1,
      })
    };
    
    if (w > 0 && h < 0 && getSeed() < 0.5) {
      halls.push({
        x: point1.x,
        y: point2.y,
        width: Math.abs(w),
        height: 1,
      })
      halls.push({
        x: point1.x,
        y: point2.y,
        width: 1,
        height: Math.abs(h),
      })
    }
    if (w > 0 && h < 0 && getSeed() > 0.5) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: Math.abs(w),
        height: 1,
      })
      halls.push({
        x: point2.x,
        y: point2.y,
        width: 1,
        height: Math.abs(h),
      })
    }
    
    if (w > 0 && h > 0 && getSeed() < 0.5) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: Math.abs(w),
        height: 1,
      })
      halls.push({
        x: point2.x,
        y: point1.y,
        width: 1,
        height: Math.abs(h),
      })
    };
    if (w > 0 && h > 0 && getSeed() > 0.5) {
      halls.push({
        x: point1.x,
        y: point2.y,
        width: Math.abs(w),
        height: 1,
      })
      halls.push({
        x: point1.x,
        y: point1.y,
        width: 1,
        height: Math.abs(h),
      })
    };
    
    if (w > 0 && h === 0) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: Math.abs(w),
        height: 1,
      })
    };

    if (w === 0 && h < 0) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: 1,
        height: Math.abs(h),
      })
    };

    if (w === 0 && h > 0) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: 1,
        height: Math.abs(h),
      })
    };

    console.log('halls')
    console.log(halls)
    // halls.forEach(hall, () => {
    //   worldData = createRoom(
    //     worldData,
    //     this.roomSize.x,
    //     this.roomSize.y,
    //     this.x + this.roomPos.x,
    //     this.y + this.roomPos.y,
    //   );
    // })
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
      if (this.leftChild && this.rightChild) {
        console.log('this should be a room...')
        console.log(this.leftChild.getRoom())
        this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom())
      }
    } else {
      this.roomSize = {
        x: seedrandomRange(6, this.width - 2),
        y: seedrandomRange(6, this.height - 2),
      };
      this.roomPos = {
        x: seedrandomRange(1, this.width - this.roomSize.x - 1),
        y: seedrandomRange(1, this.height - this.roomSize.y - 1),
      };
    }

    if (this.roomSize && this.roomPos && worldData) {
      console.log('adding room object')
      this.room = {
        width: this.roomSize.x,
        height: this.roomSize.y,
        x: this.x + this.roomPos.x,
        y: this.y + this.roomPos.y,
        top: this.x + this.roomPos.x + this.roomSize.x,
        bottom: this.y + this.roomPos.y + this.roomSize.y,
      }
      worldData = createRoom(
        worldData,
        this.roomSize.x,
        this.roomSize.y,
        this.x + this.roomPos.x,
        this.y + this.roomPos.y,
      );
    } 
    
    return worldData;
  }

  this.getRoom = () => {
    if (this.room) {
      // console.log('we have a room')
      // console.log(this.room)
      return this.room;
    } else {
      let lRoom;
      let rRoom;
      if  (this.leftChild) {
        lRoom = this.leftChild.getRoom();
      }
      if  (this.rightChild) {
        rRoom = this.rightChild.getRoom();
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
