import React from "react";
import MapTile from "./mapTile";

function MapRow(props) {
  return (
    <div className="map-row">
      {props.row.map((tile, j) => <MapTile tile={tile} key={j} />)}
    </div>
    )
}

export default MapRow;
