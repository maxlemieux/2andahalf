import React from "react";
import { getSeed, seedrandomRange } from '../util/util';
import createRoom from '../util/roomUtil';
import initializeMap from '../util/mapUtil';
import MapRow from "./mapRow";

/** Map size in 64x32 tiles */
const MAP_WIDTH = 24;
const MAP_HEIGHT = 24;

/** Size for leaf splits on BSP */
const maxLeafSize = 8;

/** Object constructor for Leaf. 
 * This could probably also be an ES6 class object. 
*/
function Leaf(_x, _y, _width, _height) {
  this.width = _width;
  this.height = _height;
  this.minLeafSize = 10;
  this.x = _x;
  this.y = _y;
  this.halls = [];

  this.split = () => {
    if (this.leftChild !== undefined|| this.rightChild !== undefined) {
      // already split, abort!
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
      // area is too small to split any more, abort!
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

  this.createHall = (_worldData, leftRoom, rightRoom) => {
    let worldData = _worldData;
    const halls = [];
    const point1 = {
      x: seedrandomRange(leftRoom.x + 2, leftRoom.x + leftRoom.width - 3),
      y: seedrandomRange(leftRoom.top + 2, leftRoom.bottom - 3),
    }
    const point2 = {
      x: seedrandomRange(rightRoom.x + 2, rightRoom.x + rightRoom.width - 3),
      y: seedrandomRange(rightRoom.top + 2, rightRoom.bottom - 3),
    }

    const w = point2.x - point1.x;
    const h = point2.y - point1.y;

    if (w < 0 && h < 0 
        && getSeed() < 0.5) {
      halls.push({
        x: point2.x,
        y: point1.y,
        width: Math.abs(w),
        height: 4,
      });
      halls.push({
        x: point2.x,
        y: point2.y,
        width: 4,
        height: Math.abs(h)
      });
    };
    if (w < 0 && h < 0 
        && getSeed() > 0.5) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point1.x,
        y: point2.y,
        width: 4,
        height: Math.abs(h),
      })
    };

    if (w < 0 && h > 0 && getSeed() < 0.5) {
      halls.push({
        x: point2.x,
        y: point1.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point2.x,
        y: point1.y,
        width: 4,
        height: Math.abs(h),
      })
    };

    if (w < 0 && h > 0 && getSeed() > 0.5) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point1.x,
        y: point1.y,
        width: 4,
        height: Math.abs(h),
      })
    };

    if (w < 0 && h === 0) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: Math.abs(w),
        height: 4,
      })
    };
    
    if (w > 0 && h < 0 && getSeed() < 0.5) {
      halls.push({
        x: point1.x,
        y: point2.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point1.x,
        y: point2.y,
        width: 4,
        height: Math.abs(h),
      })
    }
    if (w > 0 && h < 0 && getSeed() > 0.5) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point2.x,
        y: point2.y,
        width: 4,
        height: Math.abs(h),
      })
    }
    
    if (w > 0 && h > 0 && getSeed() < 0.5) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point2.x,
        y: point1.y,
        width: 4,
        height: Math.abs(h),
      })
    };
    if (w > 0 && h > 0 && getSeed() > 0.5) {
      halls.push({
        x: point1.x,
        y: point2.y,
        width: Math.abs(w),
        height: 4,
      })
      halls.push({
        x: point1.x,
        y: point1.y,
        width: 4,
        height: Math.abs(h),
      })
    };
    
    if (w > 0 && h === 0) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: Math.abs(w),
        height: 4,
      })
    };

    if (w === 0 && h < 0) {
      halls.push({
        x: point2.x,
        y: point2.y,
        width: 4,
        height: Math.abs(h),
      })
    };

    if (w === 0 && h > 0) {
      halls.push({
        x: point1.x,
        y: point1.y,
        width: 4,
        height: Math.abs(h),
      })
    };

    // console.log('halls')
    // console.log(halls)

    // for (let i = 0; i < halls.length; i += 1) {
    //   console.log(`Attempting to create hall with width ${halls[i].width}, height ${halls[i].height}, x ${halls[i].x}, y ${halls[i].y}`)
    //   console.log(halls[i])
    //   if (halls[i] && worldData) {
    //     worldData = createRoom(
    //       worldData,
    //       halls[i].width,
    //       halls[i].height,
    //       halls[i].x,
    //       halls[i].y
    //     );
    //   }
    // }
    if (halls[0] && worldData) {
      // console.log(halls[0])
      worldData = createRoom(
        worldData,
        halls[0].width,
        halls[0].height,
        halls[0].x,
        halls[0].y
      );
    }
    if (halls[1] && worldData) {
      // console.log(halls[1])
      worldData = createRoom(
        worldData,
        halls[1].width,
        halls[1].height,
        halls[1].x,
        halls[1].y
      );
    }
    if (halls[2] && worldData) {
      console.log('halls[2]')
      console.log(halls[2])
      worldData = createRoom(
        worldData,
        halls[2].width,
        halls[2].height,
        halls[2].x,
        halls[2].y
      );
    }
    if (halls[3] && worldData) {
      console.log('halls[3]')
      console.log(halls[3])
    //   worldData = createRoom(
    //     worldData,
    //     halls[3].width,
    //     halls[3].height,
    //     halls[3].x,
    //     halls[3].y
    //   );
    }
    return worldData;
  }

  this.createRooms = (_worldData) => {
    let worldData = _worldData;
    if (this.leftChild) {
      this.leftChild.createRooms(worldData);
    }
    if (this.rightChild) {
      this.rightChild.createRooms(worldData);
    }
    if (this.leftChild && this.rightChild) {
      // console.log('this.leftChild.getRoom')
      // console.log(this.leftChild.getRoom())
      // console.log('this.rightChild.getRoom')
      // console.log(this.rightChild.getRoom())
      worldData = this.createHall(
        worldData,
        this.leftChild.getRoom(),
        this.rightChild.getRoom(),
      );
    }
    if (!this.leftChild && !this.rightChild) {
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
      this.room = {
        width: this.roomSize.x,
        height: this.roomSize.y,
        x: this.x + this.roomPos.x,
        y: this.y + this.roomPos.y,
        top: this.y + this.roomPos.y,
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
      return this.room;
    } else {
      let lRoom;
      let rRoom;
      if (this.leftChild) {
        lRoom = this.leftChild.getRoom();
      }
      if (this.rightChild) {
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
            } 
          }
        }
      }
    }
    return rootLeaf.createRooms(mapData);
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
