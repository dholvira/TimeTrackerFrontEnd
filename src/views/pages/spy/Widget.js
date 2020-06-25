import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col } from 'reactstrap';

import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';
import './widget.css';

class Widget extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      user,
      freeMem,
      totalMem,
      usedMem,
      memUseage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
      macA,
      isActive,
      loggedUser,
    } = this.props.data;

    const cpuWidgetId = `cpu-widget-${macA}`;
    const memWidgetId = `mem-widget-${macA}`;

    const cpu = { cpuLoad, cpuWidgetId };
    const mem = { totalMem, usedMem, memUseage, freeMem, memWidgetId };
    const info = {
      macA,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      user,
      loggedUser,
    };

    let notActiveDiv = '';
    if (!isActive) {
      notActiveDiv = <div className='not-active'>Offline</div>;
    }

    return (
      <CardBody>
        {notActiveDiv}
        <Row className='row-example'>
          <Col sm>
            <Cpu cpuData={cpu} />
          </Col>
          <Col sm>
            <Mem memData={mem} />
          </Col>
          <Col sm>
            <Info infoData={info} />
          </Col>
        </Row>
      </CardBody>
    );
  }
}
export default Widget;
