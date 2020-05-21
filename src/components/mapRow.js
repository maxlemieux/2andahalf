import React from "react";
import MapTile from "./mapTile";

function MapRow(props) {
  return (
    <div className="map-row">
    {props.row.map(function(object, i){
      return <MapTile tile={object} key={i} />;
    })}
    </div>
  );
}

export default MapRow;
