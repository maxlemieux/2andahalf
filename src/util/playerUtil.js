const { isoToTwoD, twoDToIso, tileToCartesian } = require('./tileUtil');
const playerSprite = require('./spriteUtil');

const movePlayer = (playerObj, xIso, yIso) => {
  const { cartX, cartY } = isoToTwoD(xIso, yIso);
  const newLocation = {
    cartX,
    cartY,
    xIso,
    yIso,
  };
  Object.assign(playerObj.props, newLocation);
};

/** Load a player character */
function newPlayer(x, y) {
  /** Get isometric coordinates for this tile */
  const cartX = tileToCartesian('x', x);
  const cartY = tileToCartesian('y', y);
  const { xIso, yIso } = twoDToIso(cartX, cartY);
  const player = {
    type: 'player',
    sprite: {
      backgroundImage: playerSprite,
      spriteOffset: [0, 0],
    },
    x,
    y,
    z: 1,
    xIso,
    yIso,
    cartX,
    cartY,
  };
  return player;
}


module.exports = {
  movePlayer,
  newPlayer,
};
