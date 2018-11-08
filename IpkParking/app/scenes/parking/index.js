
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
import notificacion from '../../lib/notificaciones';
import { Actions } from 'react-native-router-flux';

import Cabecera from '../../components/cabecera';
import Pie from '../../components/pie'
import Vehiculos from '../../components/vehiculos';
import Vehiculo from '../../components/vehiculo';
import Parcelas from '../../components/parcelas';

import AvisoModal from '../../components/avisoModal';

import * as literal from '../../constants/literales';
import * as Enum from '../../constants/enum';

const Cargando =()=><View style={styles.loadingContainer}><Spinner color='blue'/><Text style={styles.literalCargando}>Cargando</Text></View>

export default class Parking extends Component {

  constructor(props) {
    super(props);

    this.state = {       
      vehiculos:'',
      parcelas:'',
      usuarios:'',
      usuarioKey:'',
      showAvisoModal:false,
      avisoUsuario:{},
      vehiculoSeleccionadoModelos:'',      
      vehiculoSeleccionadoMatricula:'',
      doRender:false
    };

    this._onPress_Vehiculo=this._onPress_Vehiculo.bind(this);
    this._onLongPress_Parcela=this._onLongPress_Parcela.bind(this);
    this._onPress_Parcela=this._onPress_Parcela.bind(this);
    this._onPress_PowerOff=this._onPress_PowerOff.bind(this);  
    this._onPress_Historico=this._onPress_Historico.bind(this);
    this._onClosed_Aviso_Modal=this._onClosed_Aviso_Modal.bind(this);
    this._onPressSendAviso=this._onPressSendAviso.bind(this);
    this._onPressCallTelefono=this._onPressCallTelefono.bind(this);
  } 

  _onPress_Vehiculo(libre, modelo, matricula){
    if (libre){      
      this.refs.vehiculos.seleccionarVehiculo(matricula);
      this.setState({vehiculoSeleccionadoModelo:modelo, vehiculoSeleccionadoMatricula:matricula});
    }
  }
  _onLongPress_Parcela(numero, libreParcela, vehiculoPropio, usuario){ 
   
    var to_User=this.getUsuarioByName(this.state.usuarios,usuario);
    var reservaPropia = to_User.email == this.props.email?true:false;

    if (!libreParcela && !vehiculoPropio && !reservaPropia){ // Liberar Parcela-Vehiculo
      var telefono = to_User.telefono || '';
      var token = to_User.token || '';
      this.setState({showAvisoModal:true, avisoUsuario:{usuario,telefono,token}});    
    }
  }  
  _onPress_Parcela(numero, libreParcela, vehiculoPropio, matricula, modelo, usuario){    

    var nombreUsuario=this.getNombreUsuarioByEmail(this.state.usuarios,this.props.email);

    if (!libreParcela){ //Liberar Parcela-Vehiculo
      var modeloCoche = modelo.toUpperCase();
      if (modeloCoche == 'PERSONAL' && !vehiculoPropio){ // No es el Propio
        this.msgBox(literal.VEHICULO_NO_PROPIO);
      }else { //IPK + Propio
        Alert.alert('PARKING','Liberar Parcela?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
            {text: 'OK', onPress: () => {
              this.liberarParcelaVehiculo(numero, modeloCoche, matricula, nombreUsuario);}
            }
          ]
        );
      }      
    }else{  //Asignacion Parcela
      var matricula = this.state.vehiculoSeleccionadoMatricula;
      var modelo = this.state.vehiculoSeleccionadoModelo;
      if (matricula){
        this.asignarParcelaVehiculo(numero, modelo, matricula, nombreUsuario);
        this.refs.vehiculos.eliminarSeleccionVehiculo();     
      }      
    }
  }
  _onPress_Historico(){
    Actions.HISTORICO({email: this.props.email, usuarios: this.state.usuarios});
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
  _onClosed_Aviso_Modal(){   
    this.setState({showAvisoModal:false});
  }
  _onPressSendAviso(token, mensaje){ 

    if(token == ''){
      this.msgBox(literal.USUARIO_SIN_TOKEN);
    }else if (mensaje == ''){
      this.msgBox(literal.MENSAJE_VACIO);
    }else{
      var rtn=firebase.sendNotification(token,mensaje);
      if (rtn){
        this.msgBox(literal.MENSAJE_ENVIADO);
      }
    }
    this._onClosed_Aviso_Modal();
  }
  _onPressCallTelefono(telefono){    
    if(telefono != ''){
      Linking.openURL('tel:' + telefono)
    }else{
      this.msgBox(literal.USUARIO_SIN_TELEFONO);
    }
    this._onClosed_Aviso_Modal();
  }

  componentWillMount(){     
    var user = firebase.currentUser();
    if (!user) {
      Actions.LOGIN();
    };  
  }
  componentDidMount(){   
    this.getMaestros().then(()=> this.initNotificaciones());         // Vehiculos, Parcelas y Ususarios --> initNotificaciones
    firebase.onGetVehiculos(vehiculos=> this.setState({vehiculos})); // Cabecera con evento change estado Vehiculos 
    firebase.onGetParcelas(parcelas=>{ this.setState({parcelas});}); // Parcelas con evento change estado Parcelas  
  }

  render() {  

    if (!this.state.doRender){return(<Cargando/>)}
    
    var nombreUsuario = this.getNombreUsuarioByEmail(this.state.usuarios, this.props.email);
    var vehiculoPersonalAsignado = this.getVehiculoPersonalAsignado(nombreUsuario);            

    return (
      <Container>

        <Cabecera titulo='PARKING' historico onPress_Historico={this._onPress_Historico} onPress_PowerOff={this._onPress_PowerOff}/>
       
        <View style={styles.vehiculosContainer}>
          <Vehiculos ref="vehiculos" vehiculos={this.state.vehiculos} vehiculoPersonalAsignado={vehiculoPersonalAsignado} nombreUsuario={nombreUsuario} onPressVehiculo={this._onPress_Vehiculo}/>                  
        </View>

        <View style={styles.parkingContainer}> 
          {!this.state.showAvisoModal &&
            <View style={styles.plazasContainer}>
              <View style={styles.plazas_1_2_3_Container}>
                <View style={styles.plaza_Sup_Container}>
                  <Parcelas numero={1} parcelas={this.state.parcelas} nombreUsuario={nombreUsuario} onPress_Parcela={this._onPress_Parcela} onLongPress_Parcela={this._onLongPress_Parcela}/>
                </View>
                <View style={styles.plaza_Sup_Container}>
                  <Parcelas numero={2} parcelas={this.state.parcelas} nombreUsuario={nombreUsuario} onPress_Parcela={this._onPress_Parcela} onLongPress_Parcela={this._onLongPress_Parcela}/>
                </View>
                <View style={styles.plaza_Sup_Container}>
                  <Parcelas numero={3} parcelas={this.state.parcelas} nombreUsuario={nombreUsuario} onPress_Parcela={this._onPress_Parcela} onLongPress_Parcela={this._onLongPress_Parcela}/>
                </View>
              </View>
              <View style={styles.plazas_4_5_6_Container}>
                <View style={styles.plaza_Inf_Container}>
                  <Parcelas numero={4} parcelas={this.state.parcelas} nombreUsuario={nombreUsuario} onPress_Parcela={this._onPress_Parcela} onLongPress_Parcela={this._onLongPress_Parcela}/>
                </View>
                <View style={styles.plaza_Inf_Container}>
                  <Parcelas numero={5} parcelas={this.state.parcelas} nombreUsuario={nombreUsuario} onPress_Parcela={this._onPress_Parcela} onLongPress_Parcela={this._onLongPress_Parcela}/>
                </View>
                <View style={styles.plaza_Inf_Container}>
                  <Parcelas numero={6} parcelas={this.state.parcelas} nombreUsuario={nombreUsuario} onPress_Parcela={this._onPress_Parcela} onLongPress_Parcela={this._onLongPress_Parcela}/>
                </View>
              </View>
            </View>
          }        
          {this.state.showAvisoModal && <AvisoModal open={this.state.showAvisoModal} usuario={this.state.avisoUsuario} onClosed_Aviso_Modal={this._onClosed_Aviso_Modal} onPressSendAviso={this._onPressSendAviso} onPressCallTelefono={this._onPressCallTelefono}/>}
        </View>

        <Pie email={this.props.email} usuarios={this.state.usuarios}></Pie>
        
      </Container>
    );
  }
    
  async getMaestros(){
    await firebase.getVehiculos().then(vehiculos=> this.setState({vehiculos})); //  Cabecera con estado de Vehiculos        
    await firebase.getParcelas().then(parcelas=>{this.setState({parcelas})});  //  Parcelas   
    await firebase.getUsuarios().then(usuarios=> this.setState({usuarios,doRender:true}));    //  Usuario. email + Nombre         
  }
  liberarParcelaVehiculo(numParcela, modelo, matricula, usuario){
    firebase.liberarParcelaVehiculo(numParcela, matricula).then((rtn)=>{
       if (rtn){
         this.msgBox(literal.PARCELA_LIBERADA);

         if (modelo.toUpperCase() == 'PERSONAL'){
            var accion=Enum.ACCION_PARCELA.OUT;
            var nombre = usuario;
            var parcela = 'parcela'+ numParcela ;
            firebase.asignarHistorico(accion, nombre, parcela);            
         } 
        }   
    });
  }
  asignarParcelaVehiculo(numParcela, modelo, matricula, usuario){
    firebase.asignarParcelaVehiculo(numParcela, modelo, matricula, usuario).then(
      (rtn)=>{
        if (rtn){  
          this.setState({vehiculoSeleccionadoModelo:'',vehiculoSeleccionadoMatricula:''});
          this.msgBox(literal.PARCELA_ASIGNADA);
    
          if (modelo.toUpperCase() == 'PERSONAL'){
              var accion=Enum.ACCION_PARCELA.IN;
              var nombre = usuario;
              var parcela = 'parcela'+ numParcela ;
              firebase.asignarHistorico(accion, nombre, parcela);            
          }       
        }
      }
    );
    
  }
  getVehiculoPersonalAsignado(nombreUsuario){
    
    var parcelasData= this.state.parcelas;

    if (parcelasData == null){
      return false;
    }else{      
      var parcelas=Object.keys(parcelasData);
      var usuarioName=parcelas.filter(parcela => parcelasData[parcela].modelo.toUpperCase() =='PERSONAL' && parcelasData[parcela].usuario==nombreUsuario);
      return usuarioName.length?true:false;
    }   

  }
  getNombreUsuarioByEmail(usuarios, email){

    var NombreUsuario=''
    var usuariosData = usuarios;

    if (usuariosData){
      var usuarios=Object.keys(usuariosData);
      var usuario=usuarios.filter(usuario=>usuariosData[usuario].email==email);
      if (usuario.length){NombreUsuario=usuariosData[usuario].nombre}
    }
    return NombreUsuario;
  } 
  getUsuarioByName(usuarios, nombre){

    var Usuario={};
    var usuariosData = usuarios;

    if (usuariosData){
      var usuarios=Object.keys(usuariosData);
      var usuario=usuarios.filter(usuario=>usuariosData[usuario].nombre==nombre);
      if (usuario.length){Usuario=usuariosData[usuario]}
    }
    return Usuario;
      
  }
  initNotificaciones(){// NOTIFICACIONES  
    var usuarioKey=this.getKeyUsuarioByEmail(this.state.usuarios, this.props.email);
    this.setState({usuarioKey})
    notificacion.getToken().then((token)=>{ // Registramos el token del Usuario
        if (token && usuarioKey){         
            firebase.setUsuarioTokenByEmail(usuarioKey,token);          
        }
    }); 
    notificacion.listenerNotification();   //  Escuchamos Notificaciones
  }
  getTokenUsuarioByEmail(usuarios, email){

    var tokenUsuario=''
    var usuariosData = usuarios;

    if (usuariosData){
      var usuarios=Object.keys(usuariosData);
      var usuario=usuarios.filter(usuario=>usuariosData[usuario].email==email);
      if (usuario.length){tokenUsuario=usuariosData[usuario].token}
    }
    return tokenUsuario;
  } 
  getTokenUsuarioByName(usuarios, nombre){

    var tokenUsuario=''
    var usuariosData = usuarios;

    if (usuariosData){
      var usuarios=Object.keys(usuariosData);
      var usuario=usuarios.filter(usuario=>usuariosData[usuario].nombre==nombre);
      if (usuario.length){tokenUsuario=usuariosData[usuario].token}
    }
    return tokenUsuario;
  } 
  getKeyUsuarioByEmail(usuarios, email){

    var keyUsuario=''
    var usuariosData = usuarios;

    if (usuariosData){
      var usuarios=Object.keys(usuariosData);
      var usuario=usuarios.filter(usuario=>usuariosData[usuario].email==email);
      if (usuario.length){keyUsuario=usuario[0]}
    }
    return keyUsuario;
  } 
  msgBox(mensaje){
    ToastAndroid.showWithGravity(
      mensaje,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  }

}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  literalCargando:{
    textAlign:'center',
    color:'black',
    fontSize:20,
  },
  vehiculosContainer: {
    flex: 2.3,    
    backgroundColor:'white',    
  },
  parkingContainer: {
    flex: 10,
    justifyContent: 'center',
    alignContent: 'stretch',
    backgroundColor: 'black',  
  },
  plazasContainer:{
    flex:1,
    margin:10,
    justifyContent: 'center',
    alignContent: 'stretch',
    borderBottomWidth:10,
    borderColor:'white'
  },
  plazas_1_2_3_Container:{
    flex:1,
    borderColor: 'rgba(255,255,255,0.7)',    
    borderWidth: 1,  
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection:'row', 
    borderTopWidth:0
  },
  plazas_4_5_6_Container:{
    flex:1,
    borderColor: 'rgba(255,255,255,0.7)',    
    borderWidth: 1,  
    justifyContent: 'center',
    alignContent: 'center',  
    flexDirection:'row',
    borderTopWidth:0  
  },
  plaza_Sup_Container:{
    flex:1,
    borderColor: 'rgba(255,255,255,0.7)',    
    borderWidth: .5,  
    justifyContent: 'center',
    alignContent: 'center',  
    borderTopWidth:0  
  },  
  plaza_Inf_Container:{
    flex:1,
    borderColor: 'rgba(255,255,255,0.7)',    
    borderWidth: .5,  
    justifyContent: 'center',
    alignContent: 'center', 
  },   
});
