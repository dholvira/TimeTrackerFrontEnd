import React, { useState, useEffect } from 'react';
import moment from 'moment';

function Info(props) {
  const [loggedUser, setLoggedUser] = useState('');
  useEffect(() => {
    setLoggedUser(props.infoData.loggedUser);
  }, [props.loggedUser]);
  return (
    <div>
      <h3>Operating System</h3>
      <div className='widget-text'>{props.infoData.osType}</div>
      <h3>Time Online</h3>
      <div className='widget-text'>
        {moment.duration(props.infoData.upTime).humanize()}
      </div>
      <h3>Processor information</h3>
      <div className='widget-text'>
        <strong>Type:</strong> {props.infoData.cpuModel}
      </div>
      <div className='widget-text'>
        <strong>Number of Cores:</strong> {props.infoData.numCores}
      </div>
      <div className='widget-text'>
        <strong>Clock Speed:</strong> {props.infoData.cpuSpeed}
      </div>
      <div className='widget-text'>
        <strong>System User Name:</strong> {props.infoData.user}
      </div>
      <div className='widget-text'>
        <strong>Logged User Name:</strong> {loggedUser}
      </div>
      <div className='widget-text'>
        <strong>Mac Address:</strong> {props.infoData.macA}
      </div>
    </div>
  );
}

export default Info;
