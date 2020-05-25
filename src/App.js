import React from 'react';
import './App.css';
import Map from "./components/map";
// import Player from "./components/player";
// const { newPlayer } = require('./util/playerUtil');

function App() {
  // const playerCharacter = newPlayer(5, 5);

  return (
    <div className="App">
      <header className="App-header">
          {/* Width in Tiles: {Math.floor(window.innerWidth / 64)} */}
          {/* Tiles Height: {Math.floor(window.innerHeight / 32)} */}
          {/* <div className="item">2andahalf</div> */}
      </header>

      <Map />
      {/* <Player player={playerCharacter} /> */}

      <footer className="App-footer">
        <div className='App-log' data-logtype='chat'>
         <div className='App-LogEntry'>
          </div>
        </div>
        <div className='App-log' data-logtype='combat'>
        <div className='App-LogEntry'>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;
