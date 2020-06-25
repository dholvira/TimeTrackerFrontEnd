import React from 'react';
import drawCircle from './utilities/canvasLoadAnimation';

function Mem(props) {
  //   console.log(props);
  const { totalMem, usedMem, memUseage, freeMem } = props.memData;

  const canvas = document.querySelector(
    `.${props.memData.memWidgetId.replace(/[^a-zA-Z0-9]/g, '')}`
  );
  drawCircle(canvas, memUseage * 100);
  //   console.log(memUseage);
  const totalMemInGB = ((totalMem / 1073741824) * 100) / 100;
  const freeMemInGB = Math.floor((freeMem / 1073741824) * 100) / 100;
  const usedMemInGB = Math.floor((usedMem / 1073741824) * 100) / 100;
  return (
    <div>
      <h3>Memory Useage</h3>
      <div className='canvas-wrapper'>
        <canvas
          className={props.memData.memWidgetId.replace(/[^a-zA-Z0-9]/g, '')}
          width='200'
          height='200'
        />
        <div className='mem-text'>{memUseage * 100}%</div>
      </div>
      <div>Total Memory: {totalMemInGB} GB</div>
      <div>Free Memory: {freeMemInGB} GB</div>
      <div>Used Memory: {usedMemInGB} GB</div>
    </div>
  );
}

export default Mem;
