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
    thisY = i;
    let thisRow = [];
    for (let j=0; j<mapWidth; j++) {
      thisX = j;
      let tile = [{
        tile: 0,
        walkable: 1,
        x: thisX,
        y: thisY,
      }];
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
        <div className="test-sprite">
          Width in Tiles: {Math.floor(window.innerWidth / 64)}
          <hr></hr>
          Tiles Height: {Math.floor(window.innerHeight / 32)}
        </div>
        <p>iso x {twoDToIso(10,5).x}</p>
        <p>iso y {twoDToIso(10,5).y}</p>

        <Map mapArray={mapArray} />

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
