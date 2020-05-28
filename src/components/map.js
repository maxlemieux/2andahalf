import React from 'react';
import { buildMap }  from '../utils/mapUtil';
// import MapRow from './mapRow';
import MapTile from './mapTile';
import Minimap from './minimap';
import { movePlayer } from '../utils/playerUtil';

/** Map size in 64x32 tiles */
const MAP_WIDTH = 20;
const MAP_HEIGHT = 20;

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

  let worldData = buildMap(MAP_WIDTH, MAP_HEIGHT);
  
  return (
    <div style={style} className="App-map" onClick={movePlayer}>
      <Minimap worldData={worldData} />

      {worldData.map(function(row, i){
        return (
          // <MapRow row={row} key={i}/>
          <div className="map-row">
            {row.map((tile, j) => <MapTile tile={tile} key={j} />)}
          </div>
        )
      })}
    </div>
  );
};

export default Map;
