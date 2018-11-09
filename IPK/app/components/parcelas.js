import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Text,
  Image,
  } from 'react-native';

import Parcela from './parcela'

export default class Parcelas extends Component {

  constructor(props) {
    super(props);

    this.state = {            
    };

  }

  render() {
    
    var ParcelaOBJ;   
    var numParcela = this.props.numero;
    var parcelasData = this.props.parcelas;

    if (parcelasData){ 
      var libreParcela = parcelasData['parcela' + numParcela].libre;
      var matricula = parcelasData['parcela' + numParcela].matricula;
      var modelo = parcelasData['parcela' + numParcela].modelo;
      var usuario = parcelasData['parcela' + numParcela].usuario;
      var reservaPropia = this.props.nombreUsuario == usuario ?true:false;

      ParcelaOBJ = <Parcela numero={numParcela} libreParcela={libreParcela} modelo={modelo} matricula={matricula} usuario={usuario} reservaPropia={reservaPropia} onLongPress_Parcela={this.props.onLongPress_Parcela} onPress_Parcela={this.props.onPress_Parcela}/>     
    }

    return (      
      <View style={styles.parcelaContainer}>
         {ParcelaOBJ}
      </View>
    );

  }
  
}

const styles = StyleSheet.create({
  parcelaContainer:{
    flex:1,   
 }
});
