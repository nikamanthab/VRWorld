import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    VrButton,
    Image,
    asset,
    Environment
  } from 'react-360';

  import {leaveParty} from "./../../store"
  import AnimatedBtn from "./animatedBtn";
  import bulb from './../../static_assets/bulb.png';

class Close extends React.Component{
    state={
        bright:true
    }

    dimLight = ()=>{
        Environment.setBackgroundImage(asset('milky1.jpg'));
    }
    brightLight = ()=>{
        Environment.setBackgroundImage(asset('milky2.jpg'));
    }
    exitParty(){
        leaveParty();
        this.props.changePage("rating")
    }

    brightDim = ()=>{
        this.setState({
            bright:!this.state.bright
        },()=>{
            if(!this.state.bright){
                this.brightLight()
            }
            else{
                this.dimLight()
            }
        })
    }

    render = ()=>{
        return(
            <View style={styles.panel}>   
                <View style={{flexDirection:"row",justifyContent:'space-around',width:800}}>
                    
                        {/* <AnimatedBtn icon={bulb} onClick={()=>{this.exitParty()}} text={"Exit"} /> */}
                        <VrButton style={{borderRadius:5,backgroundColor:"#0690ba",height:50,width:150,justifyContent:'center',textAlign:'center'}} onClick={()=>{this.exitParty()}}>
                            <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}> Exit </Text>
                        </VrButton>
                    
                    {/* <View>
                        <AnimatedBtn icon={bulb} onClick={()=>{this.brightDim()}} text={"light"} />  
                    </View> */}
                       <VrButton style={{borderRadius:5,backgroundColor:"#0690ba",height:50,width:150,justifyContent:'center',textAlign:'center'}} onClick={()=>{this.brightDim()}}>
                            <Text style={{textAlign:'center',color:'white',fontWeight:'bold'}}> Light </Text>
                        </VrButton>
                    {/* <VrButton style={styles.card} onClick={()=> this.exitParty()}>
                        <View>
                            <Text style={styles.greeting}>
                                exit
                            </Text>
                        </View>
                    </VrButton> */}
                    {/* </View>
                    <View style={styles.greetingBox}>
                        <VrButton style={styles.card} onClick={this.dimLight}>
                            <View>
                                <Text style={styles.greeting}>
                                    dim
                                </Text>
                            </View>
                        </VrButton>
                    </View>
                    <View style={styles.greetingBox}>
                        <VrButton style={styles.card} onClick={this.brightLight}>
                            <View>
                                <Text style={styles.greeting}>
                                    light
                                </Text>
                            </View>
                        </VrButton> */}
                    </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 1000,
      height: 600,
    //   backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
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
        width:100,
        flexDirection:"row"
        // height: 50
    },
    thumbnail:{
        width:100,
        height:50
    }
  });

export default Close;