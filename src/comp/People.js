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

class People extends React.Component{

    
    
    
    render = ()=>{
        let list = <View></View>;

        let people = this.props.people;
        list = people.map((ele,i)=>{
            return(
                <View style={styles.greetingBox}>
                    <VrButton style={styles.card} onClick={()=>this.props.changePage("video",ele.name)}>
                        <View>
                            <Text style={styles.greeting}>
                                {ele}
                            </Text>
                        </View>
                    </VrButton>
                </View>
            )
        })

        return(
            <View style={styles.panel}>   
                <Text style={{backgroundColor:"black"}}>Friends</Text>            
                {list}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 500,
      height: 500,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
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
    }
  });

export default People;