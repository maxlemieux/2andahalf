import React from "react";
import MapRow from "./mapRow";

function Map(props) {
  return (
    <div>
    {props.mapArray.map(function(object, i){
      return <MapRow row={object} key={i} />;
    })}
    </div>
  );
}

export default Map;
