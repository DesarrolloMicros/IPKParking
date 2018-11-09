
import React from 'react';
import { View, Image ,StyleSheet } from 'react-native';

import {Header, Body, Title, Left, Right, Button, Icon} from 'native-base';

import { Actions } from 'react-native-router-flux';

import firebase from '../lib/firebase'

export default cabecera = ({titulo, historico, onPress_Historico, onPress_PowerOff}) => { 

    return (
      <Header style={styles.cabeceraContainer}>
        <Left style={styles.logoContainer}>         
          <Button transparent onPress={Actions.pop}><Icon style={styles.icon} name='arrow-back'/></Button>          
        </Left>
        <Body style={[styles.tituloContainer]}>          
          <Title style={styles.titulo}>{titulo=='' || titulo == undefined?'?':titulo}</Title>          
        </Body>
        <Right>
          {historico && <Button transparent onPress={onPress_Historico}><Icon style={styles.icon} name='calendar'/></Button>}
          <Button transparent onPress={onPress_PowerOff}><Icon style={styles.icon} name='power'/></Button>
        </Right>       
      </Header>
    )

  }
  
const styles = StyleSheet.create({ 
  cabeceraContainer: {
    backgroundColor: '#4E7AA6'
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  logo: {
    width: 50,
    height: 50
  },
  tituloContainer: {
    alignItems: 'center',  
  },
  titulo:{
    fontSize:22
  },
  icon:{
    color:'white',
    fontSize:30
  } 
});
