import React, { Component } from 'react';
import SimpleHeader from 'components/Headers/SimpleHeader.jsx';
import { Card, Container, Row } from 'reactstrap';
import io from 'socket.io-client';
// import './Spy.css';
// import socket from './utilities/socketConnection';
import Widget from './Widget';

class Spy extends Component {
  constructor() {
    super();
    this.state = {
      socket: io('http://165.22.212.180:8181'),

      performanceData: {},
    };
  }

  componentDidMount() {
    this.state.socket.open();

    this.state.socket.emit('clientAuth', 'uihjt3refvdsadf');

    this.state.socket.on('data', (data) => {
      // inside this callback, we just got some new data!
      // let's update state so we can
      // re-render App --> Widget --> CPU/Mem/Info
      // we need to make a copy of current state
      // so we can mutate it!
      const currentState = { ...this.state.performanceData };
      // const currentState = Object.assign(this.state.performanceData,{})
      // currentState is an object! Not an array!
      // the reason for this is so we can use the machine's
      // MacA as it's property
      // console.log(data, 'here is the list of machines');
      currentState[data.macA] = data;
      console.log(currentState, 'current state');
      this.setState({
        performanceData: currentState,
      });
    });
  }
  componentWillUnmount() {
    this.state.socket.emit('disconnect');
    this.state.socket.close();
  }

  render() {
    // console.log(this.state.performanceData);
    let widgets = [];
    const data = this.state.performanceData;
    // grab each machine, by property, from data
    Object.entries(data).forEach(([key, value]) => {
      widgets.push(<Widget key={key} data={value} />);
    });
    return (
      <>
        <SimpleHeader name='Logged In Employees' parentName='System Status' />
        <Container className='mt--6' fluid>
          <Row>
            <Card className='border-0'>{widgets}</Card>
          </Row>
        </Container>
      </>
    );
  }
}

export default Spy;
