import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image,  
  TouchableOpacity 
} from 'react-native';

import {Text } from 'native-base';

import * as fn from '../lib/funcionesgenerales';

const Movimiento=({fecha, usuario, parcela, entrada, salida}) => <View style={styles.container}>      
                      <Text style={[styles.literalHistoricoFecha,styles.literalHistorico]}>{fecha}</Text>
                      <Text style={[styles.literalHistoricoUsuario,styles.literalHistorico]}>{usuario}</Text>
                      <Text style={[styles.literalHistoricoParcela,styles.literalHistorico]}>{parcela}</Text>
                      <Text style={[styles.literalHistoricoIn,styles.literalHistorico]}>{entrada}</Text>
                      <Text style={[styles.literalHistoricoOut,styles.literalHistorico]}>{salida}</Text>     
                    </View>

export default class MovimientosHistorico extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    var historicoData = this.props.historico;

    var añoSeleccionado=this.props.añoSeleccionado;
    var mesSeleccionado=this.props.mesSeleccionado;

    if (historicoData){

      var historicoKeys = Object.keys(historicoData);
      var movimientos=[];

      historicoKeys.forEach(function(movimiento) {

        var fecha = historicoData[movimiento].fecha;
        var año = fn.getYear(fecha); 
        var mes = fn.getMonth(fecha);
        
        var nombre = historicoData[movimiento].nombre;
        var horaIN = historicoData[movimiento].horaIN;
        var horaOUT = historicoData[movimiento].horaOUT;
        var parcela = historicoData[movimiento].parcela.substring(7, 8);
        
        if(año == añoSeleccionado && mes == mesSeleccionado){
          movimientos.push({fecha,nombre,parcela,horaIN,horaOUT});  
        }        
        
      });

      var Movimientos = movimientos.map((movimiento, i) => {
          return (<View key={i}>
                    <Movimiento fecha={movimiento.fecha} usuario={movimiento.nombre} parcela={movimiento.parcela} entrada={movimiento.horaIN} salida={movimiento.horaOUT} />
                  </View>)
      });

    }

    return (
      <View>
        {Movimientos}
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {    
    flexDirection:'row',   
    justifyContent: 'center',
    alignItems:'center',
    marginTop:5,
    borderBottomColor:'gray',    
    borderBottomWidth: 0.25,
  },
  literalHistorico:{
    color:'white',   
    fontSize:12
  },
  literalHistoricoFecha:{
    flex:2.2,
    textAlign:'center',    
  },
  literalHistoricoUsuario:{
    flex:3.3,
    marginLeft:10
  },
  literalHistoricoParcela:{
    flex:1.5,
    textAlign:'center',
  },
  literalHistoricoIn:{
    flex:1.5,
    textAlign:'center',
  },
  literalHistoricoOut:{
    flex:1.5,
    textAlign:'center',
  },
});
