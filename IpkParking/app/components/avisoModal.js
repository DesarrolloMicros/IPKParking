
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import {Button, Left, Right, Icon, Text, Input, Item, Form, H2, Label} from 'native-base';
import Modal from 'react-native-modalbox';

var screen = Dimensions.get('window');

export default class AvisoModal extends Component {

  constructor(props) {
    super(props);

    this.state = {      
      mensaje:''
    };
  }  

  render() {      
    return (  
            <View style={styles.Container}>
              <View style={styles.modalContainer}>            
                <Modal  isOpen={this.props.open}
                        onClosed={this.props.onClosed_Aviso_Modal}
                        style={[styles.modal]}>

                    <View style={styles.headerContainer}>
                      <View style={styles.tituloContainer}>
                        <Text style={styles.titulo}>{this.props.usuario.usuario}</Text>
                      </View>
                      <Button transparent onPress={this.props.onClosed_Aviso_Modal}><Icon style={styles.iconcloseModal} name='close'></Icon></Button>
                    </View>

                    <View style={styles.inputsContainer}> 
                      <Form>
                        <Item regular style={{borderColor:'white'}}>
                          <Input onChangeText={(mensaje) => this.setState({mensaje})}                       
                                value={this.state.mensaje}
                                multiline={true} 
                                maxLength={50}
                                numberOfLines={3}
                                placeholder='Mensaje'/>
                        </Item>                        
                        <Text style={{fontSize:10, marginTop:5}}>50 Caracteres Max.</Text>                        
                      </Form>
                    </View>

                    <View style={styles.btnsContainer}>
                      <Button block primary style={styles.btnNoticia} onPress={()=>this.props.onPressSendAviso(this.props.usuario.token, this.state.mensaje)}>
                          <Icon name='mail'/>
                      </Button>
                      {this.props.usuario.telefono !='' && 
                        <Button block primary style={styles.btnNoticia} onPress={()=>this.props.onPressCallTelefono(this.props.usuario.telefono)}>
                          <Icon name='call'/>
                        </Button>}
                      <Button block primary style={styles.btnNoticia} onPress={this.props.onClosed_Aviso_Modal}>
                          <Icon name='exit'/>
                      </Button>
                    </View>

                </Modal>   
              </View>
            </View>         
    );
  }

}

const styles = StyleSheet.create({ 
  Container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  modalContainer:{
    height: 260,
    width: screen.width*0.75,   
    margin:5,
  },
  modal: {    
    padding:20,
    backgroundColor: 'rgba(255,255,255,0.75)',    
  },  
  iconcloseModal:{
    fontSize:35,    
    color:'white'
  },
  headerContainer:{
    flexDirection:'row',
    position: "absolute",
    top: 10,
    right: 10,
  },
  tituloContainer:{
    flex:1,    
    justifyContent:'center',
  }, 
  titulo:{
    color:'white',
    fontSize:20,
    textAlign:'center',
  },
  inputsContainer:{
    marginTop:40
  },
  btnsContainer:{
    marginTop:10,
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center',
  },
  btnNoticia: {
    padding:10,
  },
});
