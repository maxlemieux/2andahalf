import React from "react";
import MinimapTile from './minimapTile';

function MinimapRow(props) {
  const style = {
    right: '0px',
    top: '0px',
    position: 'relative',
    width: 128,
    height: 8,
    background: 'black',
    zIndex: 5,
  };
  return (
    <div className="minimapRow App-minimapRow"
         style={style}>
      {props.row.map(function(tile, i) {
        return <MinimapTile tile={tile} key={i} />
      })}
    </div>
  );
}

export default MinimapRow;
