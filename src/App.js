import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from "./components/map";

const mapWidth = 16;
const mapHeight = 8;

const buildMap = (mapWidth, mapHeight) => {
  const mapArray = [];
  let thisX = 0;
  let thisY = 0;
  for (let i=0; i<mapHeight; i++) {
    thisY = 32 + (32 * i);
    let thisRow = [];
    for (let j=0; j<mapWidth; j++) {
      thisX = 64 * j;
      let iso = twoDToIso(thisX, thisY)
      let tile = {
        tile: 0,
        walkable: 1,
        x: thisX,
        y: thisY,
        xIso: iso.x,
        yIso: iso.y,
      };
      console.log(`tile:`)
      console.log(tile);

      thisRow.push(tile);
    };
    mapArray.push(thisRow);
  };
  return mapArray;  
}

const mapArray = buildMap(mapWidth, mapHeight);

function isoToTwoD(x, y) {
  const twoD = {};
  twoD.x = (2 * y + x) / 2;
  twoD.y = (2 * y - x) / 2;
  return(twoD);
};

function twoDToIso(x, y) {
  const iso = {};
  iso.x = x - y;
  iso.y = (x + y) / 2;
  return(iso);
};

// function calcTwoDFromMapArr(x, y, mapArr) {

// }

function App() {
  return (
    <div className="App">
      <header className="App-header">
          {/* Width in Tiles: {Math.floor(window.innerWidth / 64)} */}
          {/* Tiles Height: {Math.floor(window.innerHeight / 32)} */}
      </header>

      <Map mapArray={mapArray} />

    </div>
  );
}

export default App;
