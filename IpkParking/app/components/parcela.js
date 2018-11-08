import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image,
  TouchableOpacity 
} from 'react-native';

import {Text } from 'native-base';

import * as Enum from '../constants/enum';
import VehiculoParcela from './vehiculoparcela';

export default class Parcela extends Component {

  constructor(props) {
    super(props);
  }

  getImage =(num) => { 
    return Enum.IMAGES[num];
  }

  render() {

    var Parcela;
    var parcelaSuelo;
    var parcelaContainer;
    var vehiculoPersonal;
    var vehiculoPropio=false;

    if (this.props.libreParcela){
      var numParcelaImage=this.getImage(this.props.numero);
      vehiculoPersonal=false;
      Parcela=<Image resizeMode="contain" style={styles.numeroParcela} source={numParcelaImage}/>
      parcelaSuelo = styles.colorParcelaLibre;
      parcelaContainer= styles.numeroParcelaContainer;     
    }else{
      vehiculoPersonal= this.props.modelo.toUpperCase()=='PERSONAL'?true:false;
      if (vehiculoPersonal && this.props.reservaPropia){ // Vehiculo Personal y Propio
        vehiculoPropio=true;
      }
      Parcela=<VehiculoParcela {...this.props} personal={vehiculoPersonal} propio={vehiculoPropio}/> 
      parcelaSuelo = styles.colorParcelaOcupada;
      parcelaContainer= styles.vehiculoParcelaContainer;
    }

    return (
     
        <View style={[styles.container,parcelaSuelo]}>      
          <View style={[parcelaContainer]}>
           <TouchableOpacity onLongPress={()=> this.props.onLongPress_Parcela(this.props.numero, this.props.libreParcela, vehiculoPropio, this.props.usuario)}
                             onPress={()=> this.props.onPress_Parcela(this.props.numero,this.props.libreParcela, vehiculoPropio, this.props.matricula, this.props.modelo,this.props.usuario)}>
              {Parcela}              
           </TouchableOpacity>   
          </View>
        </View>

    );

  }
  
}

const styles = StyleSheet.create({
  container: { 
    flex:1,   
    justifyContent: 'center',
    alignItems:'center'
  },
  colorParcelaLibre:{
    backgroundColor:'black'
  },
  colorParcelaOcupada:{
    backgroundColor:'white'
  },
  numeroParcelaContainer:{
    width:75,
    height:75,
    borderRadius:37.5,
    backgroundColor:'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems:'center'
  },
  numeroParcela:{
    height:74,
    width:74,
  },  
  vehiculoParcelaContainer:{
    flex:1,   
  },
 
});
