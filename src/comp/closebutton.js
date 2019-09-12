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

class Close extends React.Component{

    dimLight = ()=>{
        Environment.setBackgroundImage(asset('360_world.jpg'));
    }
    brightLight = ()=>{
        Environment.setBackgroundImage(asset('tv-room.jpg'));
    }

    render = ()=>{
        return(
            <View style={styles.panel}>   
                <View style={styles.greetingBox}>
                    <VrButton style={styles.card} onClick={()=>this.props.changePage("rating")}>
                        <View>
                            <Text style={styles.greeting}>
                                exit
                            </Text>
                        </View>
                    </VrButton>
                    </View>
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
                        </VrButton>
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