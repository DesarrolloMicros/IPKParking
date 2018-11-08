import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image,  
} from 'react-native';

import {Text } from 'native-base';

export default class VehiculoParcela extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    var imagenVehiculo;

    if(this.props.personal && !this.props.propio){
      imagenVehiculo=require('../resources/cocheocupado.png');
    }else if (!this.props.personal || (this.props.personal && this.props.propio)){
      imagenVehiculo=require('../resources/cochelibre.png');
    }

    return (
      <View style={styles.container}>      
        <View style={styles.modeloContainer}>
            <Text style={styles.modeloVehiculo}>{this.props.modelo}</Text>
        </View>
        <View style={styles.imagenContainer}>                     
            <Image resizeMode="contain" style={styles.imagenVehiculo} source={imagenVehiculo} />          
        </View>
        <View style={styles.matriculaContainer}>
            <Text style={styles.matriculaVehiculo}>{this.props.personal? this.props.usuario:this.props.matricula}</Text>            
        </View >       
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    backgroundColor:'white'
  },
  modeloContainer:{
      flex:2,
      alignItems:'center',
      justifyContent:'flex-end', 
  },  
  modeloVehiculo:{
    fontSize:16,
    textAlign:'center'
  },
  imagenContainer:{
      flex:4,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'white',      
  },   
  imagenVehiculo:{ 
   
  }, 
  matriculaContainer:{
    flex:2,
    alignItems:'center',
    justifyContent:'flex-start',   
  },
  matriculaVehiculo:{
    fontSize:14,
    textAlign:'center'
  }
});
