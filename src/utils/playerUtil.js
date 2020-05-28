const { twoDToIso, tileToCartesian } = require('./tileUtil');
const playerSprite = require('./spriteUtil');

// const movePlayer = (playerObj, xIso, yIso) => {
//   const { cartX, cartY } = isoToTwoD(xIso, yIso);
//   const newLocation = {
//     cartX,
//     cartY,
//     xIso,
//     yIso,
//   };
//   Object.assign(playerObj.props, newLocation);
// };

const movePlayer = (event, worldData) => {
  const { x, y } = event.target.dataset;
  console.log(`iso map tile x: ${x}, y: ${y}`);
  // console.log(`this tile type is ${worldData[y][x].tileType}`)
  // let movedWorld = worldData;
  // movedWorld[y][x].hasPlayer = true;
  // worldData = movedWorld;
  console.log(worldData[y][x].hasPlayer)
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


export {
  movePlayer,
  newPlayer,
};
