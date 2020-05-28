import React from 'react';
import initializeMap from '../utils/mapUtil';
import MapRow from './mapRow';
import Minimap from './minimap';
import Leaf from '../utils/leaf';
const { getRandomEmptyFloor } = require('../utils/tileUtil');

/** Map size in 64x32 tiles */
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

/** Size for leaf splits on BSP */
const maxLeafSize = 8;

/**
 * Functional component to display the main game map.
 */
function Map(props) {
  const style = {
    top: '0px',
    left: '0px',
    width: '100%',
    minHeight: '75vh',
    backgroundColor: 'gray',
  };

  const buildMap = (_MAP_WIDTH, _MAP_HEIGHT) => {
    /** BSP dungeon generation
     * http://roguebasin.roguelikedevelopment.org/index.php?title=Basic_BSP_Dungeon_generation
     * https://gamedevelopment.tutsplus.com/tutorials/how-to-use-bsp-trees-to-generate-game-maps--gamedev-12268 */
    console.log('Beginning map build');
    // props.logFunc('chat', 'Beginning map build');
    let mapData = initializeMap(_MAP_WIDTH, _MAP_HEIGHT);

    const leafArr = [];
    const rootLeaf = new Leaf(0, 0, mapData[0].length, mapData.length);
    leafArr.push(rootLeaf);
  
    let didSplit = true;
    while (didSplit) {
      didSplit = false;
      for (let i = 0; i < leafArr.length; i += 1) {
        const leaf = leafArr[i];
        if (!leaf.leftChild && !leaf.rightChild) {
          if (leaf.width > maxLeafSize || leaf.height > maxLeafSize) {
            if (leaf.split()) {
              leafArr.push(leaf.leftChild);
              leafArr.push(leaf.rightChild);
              didSplit = true;
            } 
          }
        }
      }
    }
    const createdRooms = rootLeaf.createRooms(mapData);
    const randomSpawn = getRandomEmptyFloor(createdRooms);
    createdRooms[randomSpawn.y][randomSpawn.x].hasPlayer = true;
    console.log(`Attempting to spawn player at x ${randomSpawn.x}, y ${randomSpawn.y}`)
    return createdRooms;
  };

  let worldData = buildMap(MAP_WIDTH, MAP_HEIGHT);
  
  const movePlayer = (event) => {
    const { x, y } = event.target.dataset;
    console.log(`iso map tile x: ${x}, y: ${y}`)
    console.log(`this tile type is ${worldData[y][x].tileType}`)
    // let movedWorld = worldData;
    // movedWorld[y][x].hasPlayer = true;
    // worldData = movedWorld;
    console.log(worldData[y][x].hasPlayer)
  }

  return (
    <div style={style} className="App-map" onClick={movePlayer}>
      <Minimap worldData={worldData} />

      {worldData.map(function(row, i){
        return (
          <MapRow row={row} key={i}/>
        )
      })}
    </div>
  );
};

export default Map;
