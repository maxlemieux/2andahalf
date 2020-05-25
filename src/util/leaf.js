import { getSeed } from './util';

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
      console.log('already have leftchild or rightchild, returning false')
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
      console.log('under min leaf size')
      return false;
    }
    this.split = Math.floor(getSeed() * this.max);
    if (this.splitH) {
      this.leftChild = new Leaf(this.x, this.y, this.width, this.split);
      this.rightChild = new Leaf(this.x, this.y + this.split, this.width, this.height - this.split);
      console.log(this.rightChild)
    } else {
      this.leftChild = new Leaf(this.x, this.y, this.split, this.height);
      this.rightChild = new Leaf(this.x + this.split, this.y, this.width - this.split, this.height);
      console.log(this.rightChild)
    }
    return true;
  }
}

export default Leaf;
