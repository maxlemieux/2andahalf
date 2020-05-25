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
}

export default Leaf;
