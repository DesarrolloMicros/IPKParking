import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image, 
  ScrollView, 
} from 'react-native';

import firebase from '../lib/firebase';

import Vehiculo from './vehiculo'

export default class Vehiculos extends Component {

  constructor(props) {
    super(props);

    this.state = {       
      vehiculoSeleccionado:''
    };

  }

  render() {

    var vehiculosData = this.props.vehiculos;
    var vehiculoPersonalAsignado =this.props.vehiculoPersonalAsignado;

    if (vehiculosData){

      var matriculas =Object.keys(vehiculosData);

      var vehiculos = matriculas.map((matricula, i) => {

        var libre = vehiculosData[matricula].libre;       
        var modelo = vehiculosData[matricula].modelo;
        var seleccionado = matricula == this.state.vehiculoSeleccionado;

        if (modelo.toUpperCase() == 'PERSONAL'){
          libre =vehiculoPersonalAsignado?false:true;          
        }

        return (<View key={i}>
                  <Vehiculo libre={libre} modelo={modelo} matricula={matricula} seleccionado={seleccionado} onPressVehiculo={this.props.onPressVehiculo}/> 
                </View>)
      });
    }

    return (
      <ScrollView horizontal={true}>
        <View style={styles.vehiculosContainer}>
          {vehiculos}
        </View>
      </ScrollView>      
    );

  }
  
  seleccionarVehiculo(vehiculoSeleccionado){
    this.setState({vehiculoSeleccionado});
  }
  eliminarSeleccionVehiculo(){
    this.setState({vehiculoSeleccionado:''});
  }  
}

const styles = StyleSheet.create({
  vehiculosContainer:{   
      flex:1,
      padding:2,      
      //justifyContent:'space-around',
      //alignItems: 'center',
      flexDirection:'row',
  }
});
