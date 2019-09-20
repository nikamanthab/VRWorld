import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    VrButton,
    Image,
    asset,
  } from 'react-360';
import {changeSearchText} from './../../store';


class Keyboard extends React.Component{

    state = {
        // text: "",
        num:['1','2','3','4','5','6','7','8','9'],
        alpha1: ['q','w','e','r','t','y','u','i','o','p'],
        alpha2: ['a','s','d','f','g','h','j','k','l'],
        alpha3: ['z','x','c','v','b','n','m']
    }

    //input handlers
    handleChangeText = (input)=>{
        // this.setState({
        //     text: this.state.text+input
        // })
        changeSearchText(this.props.text+input)
    }

    handleSpace = ()=> {
        let input = this.props.text;
        input = input + " ";
        changeSearchText(input);
    }

    handleBackspace = ()=>{
        let input = this.props.text;
        input = input.slice(0,input.length-1)
        changeSearchText(input)
        // this.setState({
        //     text:input
        // })
    }

    renderKeys = (alpha) => {
        return alpha.map(ele => {
            return(
                <VrButton 
                    style = {styles.buttons}
                    onClick={()=>this.handleChangeText(ele)}>
                        <View style={styles.keytext}>
                            <Text style={{textAlign:"center"}}>{ele}</Text>
                        </View>
                </VrButton>  
            )
        })
    }

    
    render = ()=>{
        let inputtext = <View></View>
        if(this.props.text === ""){
            inputtext = (<Text 
                    style = {styles.searchBox}>
                    {"type..."}
            </Text>  )
        }
        else{
            inputtext = (<Text 
                    style = {styles.searchBox}>
                    {this.props.text}
            </Text>  )
        }
        return(
            <View style={styles.panel}>   
                  {inputtext}
                <View style={{flexDirection:"row"}}>
                    <View >
                        <View style={styles.keyboard}>
                        {this.renderKeys(this.state.num)}
                        </View>    
                        <View style={styles.keyboard}>
                            {this.renderKeys(this.state.alpha1)}
                        </View>  
                        <View style={styles.keyboard}>
                            {this.renderKeys(this.state.alpha2)}
                        </View>  
                        <View style={styles.keyboard}>
                            {this.renderKeys(this.state.alpha3)}
                        </View>  
                    </View>
                    <View>
                        <View style={styles.enter}>
                            <VrButton onClick={this.handleSpace} >
                                <Text>
                                    Space
                                </Text>
                            </VrButton>
                        </View> 
                        <View style={styles.enter}>
                            <VrButton onClick={this.handleBackspace}>
                                <Text>
                                    Backspace
                                </Text>
                            </VrButton>
                        </View> 
                    </View>
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 1000,
      height: 300,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    //   justifyContent: 'center',
    flexDirection:'column',
      alignItems: 'center',
    //   flexDirection: 'column'
    },
    greetingBox: {
      padding: 20,
      margin:10,
      backgroundColor: '#000000',
      borderColor: '#639dda',
      borderWidth: 2,
    },
    greeting: {
      fontSize: 30,
    },
    card:{
        width:300,
        flexDirection:"row"
        // height: 50
    },
    thumbnail:{
        width:100,
        height:50
    },
    searchBhtox:{
        width:100,
        height:50,
        backgroundColor: '#000000',
        marginTop:10,
        alignItems: 'stretch'
    },
    keyboard:{
        flexDirection:'row',
        flexWrap: 'wrap',
        width:600,
        // borderColor:"green",
        // borderWidth: 2,
        height: 60
    },
    buttons:{
        width:50,
        height:50,
        backgroundColor:'#000000',
        borderColor: '#000000',
        margin:5,
    },
    keytext:{
        justifyContent:"center",
        alignItems:"center",
    },
    enter:{
        backgroundColor:"black",
        borderWidth: 2,
        width:100,
        height:50,
        margin:30,

    }
  });

export default Keyboard;