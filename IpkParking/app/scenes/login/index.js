
import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image,
  Alert,
  ImageBackground ,
} from 'react-native';

import {Container, Content, Button, Text, Icon, Form, Item, Input, Label } from 'native-base';
import { Actions } from 'react-native-router-flux';
import store from 'react-native-simple-store';

import firebase from '../../lib/firebase';
import * as literal from '../../constants/literales'

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {  
      username:'',
    };   

    this._btnEntrar=this._btnEntrar.bind(this);    
    this._saveSettings=this._saveSettings.bind(this);
    this._getSettings=this._getSettings.bind(this);
  }

  async _saveSettings(){
    try { 
      await store.save('settings', { username:this.state.username});      
    } catch (error) {
      console.log('ERROR: ' + error);  
    }
  }  
  async _getSettings(){
    try {
      res = await store.get('settings');
      if(res!= null){this.setState({username:res.username})}
    } catch (error) {
      console.log('ERROR: ' + error);  
    }
  }  
  _btnEntrar(){ 

    try {
      
      if (this.state.username){
        var user = firebase.currentUser();
        if (user.email==this.state.username){
          Actions.PARKING({email: user.email});
        }else{
          firebase.signInWithEmailAndPassword(this.state.username, literal.PASS)       
        }            
      }else{
        Alert.alert('LOGIN',literal.FALTA_USUARIO); 
      } 
      
    } catch (error) {
      Alert.alert('LOGIN',error); 
    }

  }

  componentWillMount(){
    try {
      this._getSettings();
    } catch (error) {
      console.log('ERROR: ' + error);  
    }   
  }
  componentDidMount(){
     
    firebase.init();            
    firebase.onAuthStateChanged(user=>{       
        if (user){
          this._saveSettings();
          Actions.PARKING({email: user.email});
        }else{
          Alert.alert('LOGIN', literal.VALIDACION_INCORRECTA)
        }  
      }      
    );  

  }

  render() {

    return (
      <Container >

        <ImageBackground source={require('../../resources/ImagenFondo.jpg')} style={{width: '100%', height: '100%'}}>

          <View style={styles.container}>
            <View style={styles.loginContainer}>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../resources/logoipartek.jpg')} />
              </View>
              <View style={styles.formContainer}>
                <Form  style={styles.form}>                
                  <Item regular>
                    <Icon style={styles.inputIcon} name='person' />                  
                    <Input style={styles.input} keyboardType='email-address' value={this.state.username} placeholder='Usuario' onChangeText={(username) => this.setState({ username: username.toLowerCase()})}/>
                  </Item>                
                </Form>
                <Button block onPress={this._btnEntrar}>
                    <Text>ENTRAR</Text>
                </Button>
                <Text style={styles.version}>Version: {literal.VERSION}</Text>              
              </View>
            </View>
          </View>

        </ImageBackground> 
        
      </Container>
    );
  }
  
}

const styles = StyleSheet.create({
  container: { 
    flex:1,
    alignItems:'center',
    justifyContent:'center',         
  },
  loginContainer:{            
    flexDirection:'column',
    width:270,
    backgroundColor:'white',
    paddingTop:20,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10,
    borderRadius:10
  },
  logoContainer:{    
    alignItems:'center',
  }, 
  formContainer:{
    marginTop:20
  },
  form:{  
    marginBottom:20  
  },
  inputIcon:{
    color:'lightblue'
  },
  input:{   
  },
  version:{
    color:'gray',
    fontSize:12,
    textAlign:'center',
    marginTop:10,
  } 
});
