import React from 'react';
import './App.css';
import Map from "./components/map";

const buildMap = (mapWidth, mapHeight) => {
  const mapArray = [];
  for (let i=0; i<mapHeight; i++) {
    const thisY = 32 + (32 * i);
    const thisRow = [];
    for (let j=0; j<mapWidth; j++) {
      /* Move the map to the right by 1/2 the inner window width to center on screen */
      const thisX = 32 * j + (window.innerWidth / 2);
      const iso = twoDToIso(thisX, thisY);
      const tile = {
        backgroundImage: "url('/img/environment/32_flagstone_tiles.png')",
        tile: 0,
        walkable: 0,
        x: thisX,
        y: thisY,
        xIso: iso.x,
        yIso: iso.y,
      };
      thisRow.push(tile);
    };
    mapArray.push(thisRow);
  };
  return mapArray;  
}

const mapArray = buildMap(16, 16);

const newRoom = (mapArray) => {
  const roomArray = [];
  // get size of array to determine potential size of room
  const mapWidth = mapArray[0].length;
  const mapHeight = mapArray.length;
  // check random position and room size, see if it fits
  let roomFound = false;
  while (roomFound === false) {
    const roomWidth = Math.floor(Math.random() * mapWidth / 2) + 4;
    const roomHeight = Math.floor(Math.random() * mapHeight / 2) + 4;
    const topLeftX = Math.floor(Math.random() * mapWidth);
    const topLeftY = Math.floor(Math.random() * mapHeight);
    if (roomWidth + topLeftX < mapWidth && roomHeight + topLeftY < mapHeight && roomFound === false) {
      console.log(`room fits`);
      roomFound = true;
    } else {
      console.log(`room doesn't fit, trying again`);
    }
    console.log(`Adding a room with size ${roomWidth} wide and ${roomHeight} tall with top left at ${topLeftX}, ${topLeftY}`);
  }
  
}

newRoom(mapArray);

function isoToTwoD(x, y) {
  const twoD = {};
  twoD.x = (2 * y + x) / 2;
  twoD.y = (2 * y - x) / 2;
  return twoD;
};

function twoDToIso(x, y) {
  const iso = {};
  iso.x = x - y;
  iso.y = (x + y) / 2;
  return iso;
};

function App() {
  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })
  React.useEffect(() => {
    function handleResize() {
      console.log('resized');
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    };
    window.addEventListener('resize', handleResize);
    return _ => {
      window.removeEventListener('resize', handleResize)
    };
  });
  return (
    <div className="App">
      <header className="App-header">
          {/* Width in Tiles: {Math.floor(window.innerWidth / 64)} */}
          {/* Tiles Height: {Math.floor(window.innerHeight / 32)} */}
          <div className="item">2andahalf</div>
      </header>

      <Map mapArray={mapArray} />

      <footer className="App-footer">
        <div className='App-log' data-logtype='chat'>
         <div className='logEntry'>
            Welcome to 2andahalf.
          </div>
        </div>
        <div className='App-log' data-logtype='combat'>
        <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
          <div className='logEntry'>
            You land on your feet.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
