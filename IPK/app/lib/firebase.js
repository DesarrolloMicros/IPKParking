
import {  
  Alert
} from 'react-native';

import * as fb from 'firebase';
import axios from 'axios';

import * as Enum from '../constants/enum';
import * as fn from './funcionesgenerales';

export default class firebase{   

  static config = {
    apiKey: "AIzaSyCrOwcxbeXwbKXMtAYBQlKDTQddQL6u16A",
    authDomain: "ipkparking.firebaseapp.com",
    databaseURL: "https://ipkparking.firebaseio.com",
    projectId: "ipkparking"
  };

  //FIREBASE

  static init(){  
    if (!fb.apps.length){ // No esta iniciada     
        fb.initializeApp(this.config); 
        console.log('FireBase Init...');  
    } 
  }
  static isInit(){
    return fb.apps.length
  }
  
  //FIREBASE USUARIOS

  static async createUserWithEmailAndPassword(email, password){   //eMail, Pass
        await fb.auth().createUserWithEmailAndPassword(email, password)
                      .then(user=> console.log('Usuario Creado -> User:' + user.email + ', UserID: ' + user.uid))
                      .catch(function(error) {Alert.alert('ALTA USUSARIO',error.message)});
  }
  static async signInWithEmailAndPassword(email, password){
    try {       
       var User;      
       await fb.auth().signInWithEmailAndPassword(email, password)
                      .then(user=> User=user)
                      .catch(function(error) {Alert.alert('LOGIN',error.message)});       
        return User; 
    } catch (error) {
      Alert.alert('LOGIN',error);
    }        
  }
  static async signInAnonymously(){
        var User;
        await fb.auth().signInAnonymously()
                .then(user=> User=user)
                .catch(function(error) {Alert.alert('LOGIN',error.message)});
        return User;                
  }
  static async onAuthStateChanged(fnSuccess){    
    await fb.auth().onAuthStateChanged(user=> {      
      if (user) {
        console.log('User is Signed In...');
        fnSuccess(user);    
      } else {
        console.log('User is Signed Out...'); 
      }
    });
  }
  static currentUser(){
      var user = fb.auth().currentUser;    
      if (user) {
        //console.log('Usuario Info -> User email:' + user.email + ', UserID: ' + user.uid);
        return user;
      } else {
        console.log('Usuario Info -> Usuario No logeado');
        return '';
      }    
  }
  static async deletetUser(){
      var user = await fb.auth().currentUser; 
      if (user) {
          await user.delete().then(function() {
            console.log('Usuario Borrado...')
          }, function(error) {
            console.log('Usuario Borrar --> error: ' + error)
          });
      } else {
        console.log('Usuario Borrar --> Usuario No logeado...')
      }         
  }   
  static async signOut(){
      await fb.auth().signOut().then(function() {
                console.log('Signed Out...');
              }, function(error) {
                console.error('Sign Out Error...', error);
      });
  }

// USUARIOS
static async getUsuarios(){
  var user = await fb.auth().currentUser; 
  if (user) {
    var usuarios = await fb.database().ref('usuarios').once('value');      
    return usuarios.val();
  } else {
    console.log('Usuario Info (getUsuarios)-> Usuario No logeado')
    return '';
  }  
}
static async setUsuarioTokenByEmail(usuarioKey, token){
  try {
    var user = await fb.auth().currentUser; 
    if (user && usuarioKey && token) {            
        var usuarioRef = fb.database().ref('usuarios/' + usuarioKey);  
        usuarioRef.update({token});  // Asignamos token
        return true;
    } else {
      console.log('setUsuarioTokenByEmail Info (setUsuarioTokenByEmail)-> Usuario No logeado')
      return false;
    }
  } catch (error) {
    Alert.alert('Asignar Token Usuario',error)
    return false
  }    
}
static async getUsuarioByEmail(email){
  var user = await fb.auth().currentUser; 
  if (user) {
    var usuario = await fb.database().ref('usuarios').orderByChild('email').equalTo(email).once("value");
    var usuarioData = usuario.val();

    if (usuarioData == null){
      return '';
    }else{      
      var users=Object.keys(usuarioData);
      var user=users.map(usuario => usuarioData[usuario]);
      return user[0];
    }   

  } else {
    console.log('getUsuarioByEmail Info (getUsuarioByEmail)-> Usuario No logeado')
    return '';
  }    
}
static async getUsuarioTokenByEmail(email){
  var user = await fb.auth().currentUser; 
  if (user) {
    var usuario = await fb.database().ref('usuarios').orderByChild('email').equalTo(email).once("value");
    var usuarioData = usuario.val();

    if (usuarioData == null){
      return '';
    }else{      
      var users=Object.keys(usuarioData);
      var userToken=users.map(usuario => usuarioData[usuario].token);
      return userToken;
    }    
  } else {
    console.log('getUsuarioTokenByEmail Info (getUsuarioTokenByEmail)-> Usuario No logeado')
    return '';
  }    
}
static async getUsuarioKeyByEmail(email){
  var user = await fb.auth().currentUser; 
  if (user) {
    var usuario = await fb.database().ref('usuarios').orderByChild('email').equalTo(email).once("value");
    var usuarioData = usuario.val();

    if (usuarioData == null){
      return '';
    }else{      
      var users=Object.keys(usuarioData);
      var userKey=users.map(usuario => usuario);
      return userKey;
    }    
  } else {
    console.log('getUsuarioKeyByEmail Info (getUsuarioKeyByEmail)-> Usuario No logeado')
    return '';
  }    
}

// VEHICULOS
static async getVehiculos(){
  var user = await fb.auth().currentUser; 
  if (user) {
    var vehiculos = await fb.database().ref('vehiculos').once('value');
    return vehiculos.val();
  } else {
    console.log('Usuario Info (getVehiculos)-> Usuario No logeado')
    return null;
  }  
}
static async onGetVehiculos(fnSuccess){
  var user = await fb.auth().currentUser;   
  if (user) {  
    await fb.database().ref('vehiculos').on('value',function(vehiculos) {        
      fnSuccess(vehiculos.val());
    });
  }
}
static async getVehiculoPersonalParcela(usuario){
  var user = await fb.auth().currentUser; 
  if (user) {
    var parcelasPesonal = await fb.database().ref('parcelas').orderByChild('modelo').equalTo('Personal').once("value");
    var parcelasData = parcelasPesonal.val();

    if (parcelasData == null){
      return false
    }else{      
      var parcelas=Object.keys(parcelasData);
      var usuarioName=parcelas.filter(parcela => parcelasData[parcela].usuario==usuario);
      return usuarioName.length?true:false;
    }    

  } else {
    console.log('Get Vehiculo Personal Parcela Info (getVehiculoPersonalParcela)-> Usuario No logeado')
    return false;
  }  
}

// PARCELAS
static async getParcelas(){
  var user = await fb.auth().currentUser; 
  if (user) {
    var parcelas = await fb.database().ref('parcelas').once('value');
    return parcelas.val();
  } else {
    console.log('Parcelas Info (getParcelas)-> Usuario No logeado')
    return null;
  }  
}
static async onGetParcelas(fnSuccess){
  var user = await fb.auth().currentUser;   
  if (user) {  
    await fb.database().ref('parcelas').on('value',function(parcelas) {        
      fnSuccess(parcelas.val());
    });
  }
}
static async asignarParcelaVehiculo(numParcela, modelo, matricula, usuario){
  try {
    var user = await fb.auth().currentUser;   
    if (user) { 

      var parcelaRef=fb.database().ref('parcelas/parcela' + numParcela);
      var vehiculoRef=fb.database().ref('vehiculos/' + matricula);
  
      parcelaRef.update ({"libre":false,matricula,modelo,usuario});  // Asignamos Parcela
      vehiculoRef.update ({"libre":false});                          // Asignamos Vehiculo

      return true;

    }else {
      console.log('Asignar Parcela-Vehiculo Info (asignarParcelaVehiculo)-> Usuario No logeado')
      return false;
    } 
    
  } catch (err) {
    console.log('ERROR Asignar Parcela: ' + err)
    return false
  } 
}
static async liberarParcelaVehiculo(numParcela,matricula){
  try {

    var user = await fb.auth().currentUser;   
    if (user) {  
      var parcelaRef=fb.database().ref('parcelas/parcela' + numParcela);
      var vehiculoRef=fb.database().ref('vehiculos/' + matricula);
  
      parcelaRef.update ({"libre":true,matricula:'',modelo:'',usuario:''});  // Liberamos Parcela
      vehiculoRef.update ({"libre":true}); // Liberamos Vehiculo

      return true;

    }else {
      console.log('Liberar Parcela-Vehiculo Info (liberarParcelaVehiculo)-> Usuario No logeado')
      return false;
    }
    
  } catch (err) {
    console.log('ERROR Liberar Parcela: ' + err)
    return false
  }
}

// HISTORICO PARKING
static async getHistorico(){
  var user = await fb.auth().currentUser; 
  if (user) {
    var historico = await fb.database().ref('historico').once('value');
    return historico.val();
  } else {
    console.log('historico Info (getHistorico)-> Usuario No logeado')
    return null;
  }  
}
static async onGetHistorico(fnSuccess){
  var user = await fb.auth().currentUser;   
  if (user) {  
    await fb.database().ref('historico').on('value',function(historico) {        
      fnSuccess(historico.val());
    });
  }
}
static async asignarHistorico(accion, nombre, parcela){  
  try {
    var user = await fb.auth().currentUser;   
    if (user) {  

      var now = new Date();
      var fecha = fn.formatDateDDMMYYYY(now);
      var hora = fn.formatDateHHMM(now);
      
      if (accion==Enum.ACCION_PARCELA.IN){        
        this.asignarHistorico_IN(fecha, hora , nombre, parcela)
      }else if (accion==Enum.ACCION_PARCELA.OUT){
        this.asignarHistorico_OUT(fecha, hora , nombre, parcela);
      }

      return true;

    }else {
      console.log('Asignar asignarHistorico Info (asignarHistorico)-> Usuario No logeado')
      return false;
    } 
    
  } catch (err) {
    console.log('ERROR Asignar Historico: '  + err)
    return false
  }   
}
static async asignarHistorico_IN(fecha, horaIN , nombre, parcela){
  try{
    var historicoRef=fb.database().ref('historico');
    historicoRef.push ({fecha, horaIN, nombre, parcela});
  } catch (err) {
    console.log('ERROR Asignar Historico IN: '  + err)
    return false
  } 
}
static async asignarHistorico_OUT(fecha, horaOUT, nombre, parcela){
  try{
      var historicodDia = await fb.database().ref('historico').orderByChild('fecha').equalTo(fecha).once("value");
      var historicodDiaData = historicodDia.val();

      var vKey='';
      var vKeys=Object.keys(historicodDiaData);
      vKeys.forEach((key)=> {
        if (historicodDiaData[key].nombre==nombre && !historicodDiaData[key].hasOwnProperty('horaOUT')){
          vKey=key;
        }
      });

      if(vKey){ // Update dia con horaOut       
        var diaRef=fb.database().ref('historico/' + vKey);  
        diaRef.update({horaOUT}); 
      }else{ // Insertamos dia con horaOut
        var historicoRef=fb.database().ref('historico');
        historicoRef.push ({fecha, horaOUT, nombre, parcela});
      }

  } catch (err) {
    console.log('ERROR Asignar Historico OUT: '  + err)
    return false
  } 
}

// AXIOS NOTIFICACION
static async sendNotification(to, mensaje){

  try{

    var clave_Servidor_FCM = 'AAAATIbu5b8:APA91bF-aR6sTgckLTav32M1ttKCSFGl56cFSWY5GGSCX92GCKD013eSx6-mZ6evOYLu88_h5C9UPbJc0-oWSuWY1iOrQYAYfj73Wu5nXaVWSMO2JdJ1E6HKvzicCx4zKiL4pLYSOmn0';
    var url = 'https://fcm.googleapis.com/fcm/send';

    var collapsable_key = String(parseInt(new Date().getTime() / 1000));

    var titulo = 'Aviso Parking';
    var data = JSON.stringify({ "to": to, "notification": { "title": titulo, "body": mensaje }, collapse_key: collapsable_key })

    var authOptions = {
      method: 'POST',
      url: url,
      data: data,
      headers: {
          'Authorization': 'key=' + clave_Servidor_FCM,
          'Content-Type': 'application/json'
      },
      json: true
    };
    
    await axios(authOptions)
          .then(function (response) {
                //console.log('Data: ' + response.data);
                //console.log('Status: ' + response.status);
                return true;
          })
          .catch(function (error) {
                Alert.alert('Envio Notificación',error)
                return false;
          });

  } catch (err) {
    console.log('ERROR Envio Notificación: ' + err)
    return false
  } 
}

}