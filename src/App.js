import React from 'react';
import './App.css';
import Map from "./components/map";

function App() {
  // const [dimensions, setDimensions] = React.useState({ 
  //   height: window.innerHeight,
  //   width: window.innerWidth
  // })
  // React.useEffect(() => {
  //   function handleResize() {
  //     console.log('resized');
  //     setDimensions({
  //       height: window.innerHeight,
  //       width: window.innerWidth
  //     })
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return _ => {
  //     window.removeEventListener('resize', handleResize)
  //   };
  // });

  return (
    <div className="App">
      <header className="App-header">
          {/* Width in Tiles: {Math.floor(window.innerWidth / 128)} */}
          {/* Tiles Height: {Math.floor(window.innerHeight / 32)} */}
          <div className="item">2andahalf</div>
      </header>

      <Map />
      {/* <Map mapArray={roomArray} /> */}
      {/* <Map mapArray={mapArray} /> */}


      <footer className="App-footer">
        <div className='App-log' data-logtype='chat'>
         <div className='App-LogEntry'>
            Welcome to 2andahalf.
          </div>
        </div>
        <div className='App-log' data-logtype='combat'>
        <div className='App-LogEntry'>
            You land on your feet.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default App;
