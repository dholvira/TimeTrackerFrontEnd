import React from 'react';
import drawCircle from './utilities/canvasLoadAnimation';

function Cpu(props) {
  const canvas = document.querySelector(
    `.${props.cpuData.cpuWidgetId.replace(/[^a-zA-Z0-9]/g, '')}`
  );
  drawCircle(canvas, props.cpuData.cpuLoad);
  //   console.log(props);
  return (
    <div>
      <h3>CPU load</h3>
      <div className='canvas-wrapper'>
        <canvas
          className={props.cpuData.cpuWidgetId.replace(/[^a-zA-Z0-9]/g, '')}
          width='200'
          height='200'
        />
        <div className='cpu-text'>{props.cpuData.cpuLoad}%</div>
      </div>
    </div>
  );
}

export default Cpu;
