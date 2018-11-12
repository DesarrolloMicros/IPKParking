import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,  
} from 'react-native';

import {Text,Footer} from 'native-base';

export default class Pie extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    var username = this.getNombreUsuario(this.props.usuarios)

    return (      
      <Footer style={styles.footerContainer}>
          <Text style={styles.usernameFooter}>{username}</Text>
      </Footer>
    );
    
  }

  getNombreUsuario(usuarios){

    var NombreUsuario=''

    var usuariosData = usuarios;
    if (usuariosData){
      var usuarios=Object.keys(usuariosData);
      var usuario=usuarios.filter(usuario=>usuariosData[usuario].email==this.props.email);
      if (usuario.length){NombreUsuario=usuariosData[usuario].nombre}
    }
    return NombreUsuario;
  } 
  
}

const styles = StyleSheet.create({
  footerContainer:{
    height:30,
    alignItems:'center',
  },
  usernameFooter:{
    color:'white',
    fontWeight: "bold"
  }
});
