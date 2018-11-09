
import React, { Component } from 'react';

import { Router, Scene } from 'react-native-router-flux';

import * as pages from '../constants/pages';

import Login from './login';
import Parking from './parking';
import Historico from './historico';

//Ocultar Warning Timer con fireBase
console.ignoredYellowBox = [
  'Setting a timer'
];

export default class index extends Component {
  render() {
    return (      
      <Router>
        <Scene key="root">
          <Scene key={pages.LOGIN} component={Login} hideNavBar initial={true} />
          <Scene key={pages.PARKING} component={Parking} hideNavBar />          
          <Scene key={pages.HISTORICO} component={Historico} hideNavBar /> 
        </Scene>
      </Router>
    );
  }
}
