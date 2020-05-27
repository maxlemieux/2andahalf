import React, { Component } from 'react';
import './App.css';
import Log from './components/log';
import Map from './components/map';
// import Player from "./components/player";
// const { newPlayer } = require('./util/playerUtil');

class App extends Component {
  // const playerCharacter = newPlayer(5, 5);
  state = {
    log: {
      chat: ['TIMESTAMP: Logged in'],
      combat: ['1','2','3'],
    },
  };

  // logMessage = (logName, message) => {
  //   this.setState((state, props) => {
  //     return { log: { chat: ['foo','bar','baz'], combat: ['1','2','3']}}
  //   })
  // };

  render = () => {
    return (
      <div className="App">
        <header className="App-header">
            {/* Width in Tiles: {Math.floor(window.innerWidth / 64)} */}
            {/* Tiles Height: {Math.floor(window.innerHeight / 32)} */}
            {/* <div className="item">2andahalf</div> */}
        </header>
  
        <Map />

        {/* <Map logFunc={this.logMessage} /> */}
        {/* <Player player={playerCharacter} /> */}
  
        <footer className="App-footer">
          <Log name='chat' messages={this.state.log.chat} />
          <Log name='combat' messages={this.state.log.combat} />
        </footer>
      </div>
    );
  }
}

export default App;
