import React from "react";
import MapRow from "./mapRow";

function Map(props) {
  const style = {
    top: '0px',
    left: '0px',
    width: '100%',
    minHeight: '80vh',
    backgroundColor: 'green',
  };

  return (
    <div style={style} className="map">
    {props.mapArray.map(function(object, i){
      return <MapRow row={object} key={i} />;
    })}
    </div>
  );
}

export default Map;
