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

class Rate extends React.Component{


    submitRating = (rating)=>{
        console.log(rating);
        // uploadrating()
        ratingByClient([rating]);
        this.props.changePage("home");
    }

    render = ()=>{
        return(
            <View style={styles.panel}>

                <View style={styles.greetingBox}>
                    <Text>Rating</Text>
                </View>  
            <View style={styles.flexDiv}> 
                <View style={styles.greetingBox}>
                    <VrButton style={styles.greeting} onClick={()=>this.submitRating(1)}>
                        <Text>1</Text>
                    </VrButton>
                </View>
                <View style={styles.greetingBox}>
                    <VrButton style={styles.greeting} onClick={()=>this.submitRating(2)}>
                        <Text>2</Text>
                    </VrButton>
                </View>
                <View style={styles.greetingBox} >
                    <VrButton style={styles.greeting} onClick={()=>this.submitRating(3)}>
                        <Text>3</Text>
                    </VrButton>
                </View>
                <View style={styles.greetingBox}>
                    <VrButton style={styles.greeting} onClick={()=>this.submitRating(4)}>
                        <Text>4</Text>
                    </VrButton>
                </View>
                <View style={styles.greetingBox}>
                    <VrButton style={styles.greeting} onClick={()=>this.submitRating(5)}>
                        <Text>5</Text>
                    </VrButton>
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
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexDiv:{
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