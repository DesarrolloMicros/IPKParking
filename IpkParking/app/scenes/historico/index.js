
import React, { Component } from 'react';
import {  
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
  ToastAndroid,
  Linking
} from 'react-native';

import {Container,Content,Footer,Spinner} from 'native-base';

import firebase from '../../lib/firebase';
import { Actions } from 'react-native-router-flux';

import Cabecera from '../../components/cabecera';
import Pie from '../../components/pie'
import AñosMeses from '../../components/añosMeses'
import MovimientosHistorico from '../../components/movimientosHistorico'

import * as literal from '../../constants/literales';
import * as Enum from '../../constants/enum';

const Cargando =()=><View style={styles.loadingContainer}><Spinner color='blue'/><Text style={styles.literalCargando}>Cargando</Text></View>
const SeleccionAñoMes =()=><View style={styles.seleccionAñoMes}><Text style={styles.literalseleccionAñoMes}>{literal.SELECCION_AÑO_MES}</Text></View>
const CabeceraHistorico =()=> <View style={styles.cabeceraHistoricoContainer}>
                                <Text style={[styles.literalCabeceraHistoricoFecha,styles.literalCabeceraHistorico]}>Fecha</Text>
                                <Text style={[styles.literalCabeceraHistoricoUsuario,styles.literalCabeceraHistorico]}>Usuario</Text>
                                <Text style={[styles.literalCabeceraHistoricoParcela,styles.literalCabeceraHistorico]}>Parcela</Text>
                                <Text style={[styles.literalCabeceraHistoricoIn,styles.literalCabeceraHistorico]}>In</Text>
                                <Text style={[styles.literalCabeceraHistoricoOut,styles.literalCabeceraHistorico]}>Out</Text>
                              </View>

export default class Historico extends Component {

  constructor(props) {
    super(props);

    this.state = {
      historico:[],
      añoSeleccionado:'',           
      mesSeleccionado:'',           
      doRender:false
    };
    
    this._onPress_YearMonth=this._onPress_YearMonth.bind(this);
    this._onPress_PowerOff=this._onPress_PowerOff.bind(this);      
  } 

  _onPress_PowerOff(){
    Alert.alert('PARKING','Salir de Aplicación?',
         [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
          {text: 'OK', onPress: () => { firebase.signOut();
                                        BackHandler.exitApp();}}
         ]
    );    
  }  

  componentWillMount(){     
    
  }
  componentDidMount(){
    firebase.onGetHistorico(historico=>{
      this.setState({historico,doRender:true});  
    }); 
  }

  render() {  

    if (!this.state.doRender){return(<Cargando/>)}

    return (
      <Container>

        <Cabecera titulo='HISTÓRICO' onPress_PowerOff={this._onPress_PowerOff}/>
       
        <View style={styles.añoMesContainer}>
          <AñosMeses ref="añosMeses" historico={this.state.historico} onPress_YearMonth={this._onPress_YearMonth}/>                  
        </View>

        <View style={styles.historicoContainer}> 
         
         {!this.state.añoSeleccionado ? <SeleccionAñoMes/>:<View style={{flex:1}}>
                                                              <CabeceraHistorico/>
                                                              <View style={styles.movimientosHistoricoContainer}>
                                                                <MovimientosHistorico historico={this.state.historico} añoSeleccionado={this.state.añoSeleccionado} mesSeleccionado={this.state.mesSeleccionado}/>
                                                              </View>
                                                            </View>}
        
        </View>

        <Pie email={this.props.email} usuarios={this.props.usuarios}></Pie>
        
      </Container>
    );
  }
    
  _onPress_YearMonth(año,mes){         
    this.refs.añosMeses.seleccionarAñoMes(año,mes);    
    this.setState({añoSeleccionado:año, mesSeleccionado:mes});
  }
 
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  seleccionAñoMes: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  literalCargando:{
    textAlign:'center',
    color:'black',
    fontSize:20,
  },
  literalseleccionAñoMes:{
    textAlign:'center',
    color:'white',
    fontSize:20,
  },  
  añoMesContainer: {
    flex: 1.3,    
    backgroundColor:'white',    
  },
  historicoContainer: {
    flex: 8.7,
    justifyContent: 'center',
    alignContent: 'stretch',
    backgroundColor: 'black',  
  },
  cabeceraHistoricoContainer:{
    flex:4,
    flexDirection:'row',
    backgroundColor:'rgb(77,134,183)',
    justifyContent: 'center',
    alignItems:'center'
  },
  literalCabeceraHistorico:{
    color:'white',   
    fontSize:12
  },
  literalCabeceraHistoricoFecha:{
    flex:2,
    textAlign:'center',
  },
  literalCabeceraHistoricoUsuario:{
    flex:3.5,
    marginLeft:10
  },
  literalCabeceraHistoricoParcela:{
    flex:1.5,
    textAlign:'center',
  },
  literalCabeceraHistoricoIn:{
    flex:1.5,
    textAlign:'center',
  },
  literalCabeceraHistoricoOut:{
    flex:1.5,
    textAlign:'center',
  },
  movimientosHistoricoContainer:{
    flex:90,
  },
     
});
