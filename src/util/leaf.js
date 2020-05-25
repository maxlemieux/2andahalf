import { getSeed, seedrandomRange } from './util';
import createRoom from './roomUtil';

class Leaf {
  constructor(_x, _y, _width, _height) {
    this.width = _width;
    this.height = _height;
    this.minLeafSize = 6;
    this.x = _x;
    this.y = _y;
  }

  split() {
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
    // var split:int = Registry.randomNumber(MIN_LEAF_SIZE, max); // determine where we're going to split
    // this.split = Math.floor(getSeed() * this.max);
    this.splitLocation = seedrandomRange(this.minLeafSize, this.max);
    if (this.splitH) {
      this.leftChild = new Leaf(this.x, this.y, this.width, this.splitLocation);
      this.rightChild = new Leaf(this.x, this.y + this.splitLocation, this.width, this.height - this.splitLocation);
    } else {
      this.leftChild = new Leaf(this.x, this.y, this.splitLocation, this.height);
      this.rightChild = new Leaf(this.x + this.splitLocation, this.y, this.width - this.splitLocation, this.height);
    }
    return true;
  }

  createRooms(_worldData) {
    const worldData = _worldData;
    if (this.leftChild || this.rightChild) {
      if (this.leftChild) {
        this.leftChild.createRooms(worldData);
      }
      if (this.rightChild) {
        this.rightChild.createRooms(worldData);
      }
    } else {
      console.log(`setting roomSize`)
      this.roomSize = [
        seedrandomRange(3, this.width - 2),
        seedrandomRange(3, this.height - 2),
      ];
      this.roomPos = [
        seedrandomRange(1, this.width - this.roomSize[0] - 1),
        seedrandomRange(1, this.height - this.roomSize[1] - 1),
      ];
    }

    return createRoom(
      worldData,
      this.roomSize[0],
      this.roomSize[1],
      this.x + this.roomPos[0],
      this.y + this.roomPos[1],
    );
  }
}

export default Leaf;
