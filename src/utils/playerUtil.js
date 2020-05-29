const { twoDToIso, tileToCartesian } = require('./tileUtil');
const playerSprite = require('./spriteUtil');

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


export {
  movePlayer,
  newPlayer,
};
