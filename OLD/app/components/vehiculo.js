import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image,  
  TouchableOpacity 
} from 'react-native';

import {Text } from 'native-base';

export default class Vehiculo extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    var imagenVehiculo = this.props.libre?require('../resources/cochelibre.png'):require('../resources/cocheocupado.png');
    var vehiculoSeleccionado = this.props.seleccionado? styles.seleccionado:'';

    return (
      <View style={[styles.container,vehiculoSeleccionado]}>      
        <View style={styles.modeloContainer}>
            <Text style={styles.modeloVehiculo}>{this.props.modelo}</Text>
        </View>
        <View style={styles.imagenContainer}>           
          <TouchableOpacity  onPress={() => this.props.onPressVehiculo(this.props.libre, this.props.modelo, this.props.matricula)}>
            <Image resizeMode="contain" style={styles.imagenVehiculo} source={imagenVehiculo} />
          </TouchableOpacity> 
        </View>
        <View style={styles.matriculaContainer}>
            <Text style={styles.matriculaVehiculo}>{this.props.matricula}</Text>
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
  seleccionado:{
    borderBottomColor: 'green',    
    borderBottomWidth: 3,
  },
  modeloContainer:{
      flex:2,
      alignItems:'center',
      justifyContent:'center', 
  },  
  modeloVehiculo:{
    fontSize:10,
    textAlign:'center'
  },
  imagenContainer:{
      flex:7,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'white',      
  },   
  imagenVehiculo:{ 
   width:60,
   minWidth:56,
   minHeight:56
  }, 
  matriculaContainer:{
    flex:2,
    alignItems:'center',
    justifyContent:'center',   
  },
  matriculaVehiculo:{
    fontSize:10,
    textAlign:'center'
  }
});
