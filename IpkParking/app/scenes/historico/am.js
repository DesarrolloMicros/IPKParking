import React, { Component } from 'react';
import {  
  StyleSheet,  
  View,
  Image,  
  TouchableOpacity 
} from 'react-native';

import {Text } from 'native-base';

export default class AñoMes extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    
    var añoMesSeleccionado = this.props.seleccionado? styles.seleccionado:'';

    return (       
        <View style={[styles.container,añoMesSeleccionado]}>             
            <View style={styles.añoContainer}>
              <TouchableOpacity onPress={() => this.props.onPress_YearMonth(this.props.año, this.props.mes)}>
                <Text style={styles.año}>{this.props.año}</Text>
              </TouchableOpacity>
            </View>            
            <View style={styles.mesContainer}>                    
              <TouchableOpacity onPress={() => this.props.onPress_YearMonth(this.props.año, this.props.mes)}>
                <Text style={styles.mes}>{this.props.nombreMes}</Text>         
              </TouchableOpacity>
            </View>
        </View>      
    );
  }
  
}

const styles = StyleSheet.create({
  container: { 
    flex:1,
    marginLeft:2,
    marginRight:1,
    minWidth:85,
    borderColor: 'black',  
    borderWidth: 0.5,  
  },
  seleccionado:{
    borderBottomColor: 'green',    
    borderBottomWidth: 4,
  },
  añoContainer:{
    flex:3,
    alignItems:'center',
    justifyContent:'center',
    borderBottomColor: 'black',  
    borderBottomWidth: 0.25,  
    backgroundColor:'gray', 
  },  
  año:{
    fontSize:14,
    textAlign:'center',
    color:'white'
  },
  mesContainer:{
    flex:6,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'gray',  
  },
  mes:{
    fontSize:18,
    textAlign:'center',
    color:'yellow'
  } 
 
});
