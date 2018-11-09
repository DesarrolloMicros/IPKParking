import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image, 
  ScrollView, 
} from 'react-native';

import firebase from '../../lib/firebase';
import * as fn from '../../lib/funcionesgenerales';

import AñoMes from './am'

export default class AñosMeses extends Component {

  constructor(props) {
    super(props);

    this.state = {       
      añoSeleccionado:'',           
      mesSeleccionado:'',      
    };

  }

  render() {

    var historicoData = this.props.historico;

    if (historicoData){

      var historicoKeys = Object.keys(historicoData);
      var historico=[];

      historicoKeys.forEach(function(movimiento) {

        var fecha = historicoData[movimiento].fecha;
        var año = fn.getYear(fecha); 
        var mes = fn.getMonth(fecha);

        var existe = historico.filter((movimiento)=> movimiento.año==año && movimiento.mes==mes)
        if (!existe.length){
          historico.push({año,mes});        
        }        
      });
      
      historico=fn.fnSortArray_AñoMes(historico);

      var añosMeses = historico.map((movimiento, i) => {
        
          var nombreMes = fn.fnNombreMes(movimiento.mes);
        
          var seleccionado = movimiento.año == this.state.añoSeleccionado && movimiento.mes == this.state.mesSeleccionado;

          return (<View key={i}>
                    <AñoMes seleccionado={seleccionado} año={movimiento.año} mes={movimiento.mes} nombreMes={nombreMes} onPress_YearMonth={this.props.onPress_YearMonth}/> 
                  </View>)
      });
    }

    return (
      <ScrollView horizontal={true}>
        <View style={styles.añoMesContainer}>
          {añosMeses}
        </View>
      </ScrollView>      
    );

  }
  
  seleccionarAñoMes(añoSeleccionado,mesSeleccionado){
    this.setState({añoSeleccionado,mesSeleccionado});
  }
}

const styles = StyleSheet.create({
  añoMesContainer:{   
      flex:1,
      padding:2,      
      //justifyContent:'space-around',
      //alignItems: 'center',
      flexDirection:'row',
  }
});
