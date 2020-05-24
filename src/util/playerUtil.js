const { isoToTwoD } = require('./tileUtil');

const movePlayer = (playerObj, isoX, isoY) => {
  const { cartX, cartY } = isoToTwoD(isoX, isoY);
  const newLocation = {
    cartX,
    cartY,
    isoX,
    isoY,
  };
  Object.assign(playerObj.props, newLocation);
};

module.exports = {
  movePlayer,
};
