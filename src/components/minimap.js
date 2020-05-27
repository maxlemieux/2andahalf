import React from "react";
import MinimapRow from './minimapRow';

function Minimap(props) {
  const style = {
    right: '0px',
    top: '40px',
    position: 'absolute',
    width: 192,
    height: 192,
    background: 'white',
    zIndex: 5,
  };
  return (
    <div className="minimap App-minimap"
         style={style}>
      {props.worldData.map(function(row, k) {
        return (
          <MinimapRow row={row} key={k} />
        )
      })}
    </div>
  );
}

export default Minimap;
