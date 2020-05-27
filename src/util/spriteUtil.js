const spriteInfo = {
  playerSprite: {
    image: '/img/isometric_hero/clothes.png',
    // image: '/img/smiley.png',
    offset: [32, 64],
  },
  dungeonSprite: '/img/environment/iso_dungeon_walls_by_pfunked.png',
  dungeonTiles: {
    n: [/* The same two plain ones repeated */
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      [32 + 128, 0],
      [32 + 5 * 128, 0],
      /* Fancy ones */
      [32 + 5 * 128, 256],
      [32 + 3 * 128, 256],
      [32 + 1 * 128, 256],
      [32 + 1 * 128, 384],
      [32 + 7 * 128, 256],
    ],
    ne: [32 + 6 * 128, 128],
    e: [32 + 2 * 128, 0],
    se: [32 + 7 * 128, 128],
    s: [32 + 3 * 128, 0],
    sw: [32 + 4 * 128, 128],
    w: [32, 0],
    nw: [32 + 5 * 128, 128],
    swo: [32 + 2 * 128, 128],
    nwo: [32 + 3 * 128, 128],
    neo: [32, 128],
    seo: [32 + 1 * 128, 128],
  },
  floorSprite: '/img/environment/tiles_0.png',
  floorTiles: {
    tiles: [[0, 0],
      [64, 0],
      [2 * 64, 0],
      [3 * 64, 0],
      [4 * 64, 0],
      [0, 64],
      [1 * 64, 0],
      [2 * 64, 0],
    ],
  },
};

export default spriteInfo;
