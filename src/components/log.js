import React from 'react';
import LogMessage from './logMessage';

const Log = (props) => {
  return (
    <div className='App-log' data-name={props.name}>
      {props.messages.map((message, k) => <LogMessage message={message} key={k} />)}
    </div>
  )
}

export default Log;