import React from "react";
import MinimapRow from './minimapRow';

function Minimap(props) {
  const style = {
    right: '0px',
    top: '40px',
    position: 'absolute',
    width: 128,
    height: 128,
    background: 'white',
    zIndex: 5,
  };
  return (
    <div className="minimap App-minimap" style={style}>
      {props.worldData.map(function(row, i) {
        return <MinimapRow row={row} key={i} />
      })}
    </div>
  );
}

export default Minimap;
