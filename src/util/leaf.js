import { getSeed } from './util';
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
    this.split = Math.floor(getSeed() * this.max);
    if (this.splitH) {
      this.leftChild = new Leaf(this.x, this.y, this.width, this.split);
      this.rightChild = new Leaf(this.x, this.y + this.split, this.width, this.height - this.split);
    } else {
      this.leftChild = new Leaf(this.x, this.y, this.split, this.height);
      this.rightChild = new Leaf(this.x + this.split, this.y, this.width - this.split, this.height);
    }
    return true;
  }

  createRooms(_worldData) {
    if (this.leftChild || this.rightChild) {
      if (this.leftChild) {
        this.leftChild.createRooms();
      }
      if (this.rightChild) {
        this.rightChild.createRooms();
      }
    } else {
      this.roomSize = [
        Math.floor(
          getSeed()
          * (this.width - 2),
        ),
        Math.floor(
          getSeed()
          * (this.height - 2),
        ),
      ];
      this.roomPos = [
        Math.floor(
          getSeed()
          * (this.width - this.roomSize.x - 1),
        ),
        Math.floor(
          getSeed()
          * (this.height - this.roomSize.y - 1),
        ),
      ];
    }

    return createRoom(
      _worldData,
      this.roomSize[0],
      this.roomSize[1],
      this.x + this.roomPos[0],
      this.y + this.roomPos[1],
    );
  }
}

export default Leaf;
