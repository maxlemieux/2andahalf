import { getSeed } from './util';

class Leaf {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.minLeafSize = 6;
  }

  leaf(X, Y, _width, _height) {
    this.x = X;
    this.y = Y;
    this.width = _width;
    this.height = _height;
  }

  split() {
    if (this.leftChild || this.rightChild) {
      return false;
    }
    let splitH = (getSeed() > 0.5);
    if (this.width > this.height && this.width / this.height >= 1.25) {
      splitH = false;
    } else if (this.height > this.width && this.height / this.width >= 1.25) {
      splitH = true;
    }
    const max = (splitH ? this.height : this.width) - this.minLeafSize;
    if (max <= this.minLeafSize) {
      return false;
    }
    const split = 
  }
}

export default Leaf;
