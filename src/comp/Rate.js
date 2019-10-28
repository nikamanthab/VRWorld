import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    VrButton,
    Image,
    asset
  } from 'react-360';

  import {ratingByClient} from "./../../store";
  import AnimatedBtn from './animatedBtn';
  import star from './../../static_assets/star.png';

class Rate extends React.Component{


    submitRating = (rating)=>{
        console.log("rating:",rating);
        // uploadrating()
        ratingByClient(rating);
        this.props.changePage("home");
    }

    render = ()=>{
        return(
            <View style={styles.panel}>

                <View style={styles.greetingBox}>
                    <View style={{margin:40}}>
                      <Text style={{fontWeight:'bold',textAlign:'center',fontSize:50}}>Rating</Text>
                    </View>  
                    <View style={styles.flexDiv}> 
                        <View >
                            <VrButton style={styles.greeting} onClick={()=>this.submitRating(1)}>
                                <AnimatedBtn icon={star} height={100} width={100}/>
                            </VrButton>
                        </View>
                        <View >
                            <VrButton style={styles.greeting} onClick={()=>this.submitRating(2)}>
                                <AnimatedBtn icon={star} height={100} width={100}/>
                            </VrButton>
                        </View>
                        <View  >
                            <VrButton style={styles.greeting} onClick={()=>this.submitRating(3)}>
                                <AnimatedBtn icon={star} height={100} width={100}/>
                            </VrButton>
                        </View>
                        <View >
                            <VrButton style={styles.greeting} onClick={()=>this.submitRating(4)}>
                                <AnimatedBtn icon={star} height={100} width={100}/>
                            </VrButton>
                        </View>
                        <View >
                            <VrButton style={styles.greeting} onClick={()=>this.submitRating(5)}>
                                <AnimatedBtn icon={star} height={100} width={100}/>
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
      height: 600,
    //   backgroundColor: 'rgba(255, 255, 255, 0.4)',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    },
    flexDiv:{
        flexDirection: 'row',
        // borderWidth:3,
        // borderColor:'red',
        alignItems:'center',
        paddingLeft:60
    },
    greetingBox: {
      padding: 25,
      margin:10,
    //   backgroundColor: '#000000',
    //   borderColor: '#639dda',
      borderWidth: 2,
      borderRadius:5,
      justifyContent:'center',
      alignItems:"center"
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
    }
  });

export default Rate;