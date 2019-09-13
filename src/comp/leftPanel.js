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

class Left extends React.Component{

    
    
    
    render = ()=>{
        let list = <View></View>;

        movies = this.props.movies;
        list = movies.map((ele,i)=>{

            let friendbtn = (<VrButton style={styles.card} onCLick={()=>{}}>
                    <Text>Add Friend</Text>
                </VrButton>)
            if(ele.friend == true){
                friendbtn = (<VrButton style={styles.card} onClick={()=>{}}>
                    <Text>remove</Text>
                </VrButton>)
            }


            return(
                <View key={i} style={styles.greetingBox}>
                        {/* <View>
                            <Image style={styles.thumbnail} source={asset(`thumbnails/${ele.name}.jpg`)} />
                        </View> */}
                        <View>
                            <Image style={styles.thumbnail} source={asset(`profilepic/nitin.jpg`)} />
                        </View>
                        <View>
                            <Text style={styles.greeting}>
                                {ele.name}
                            </Text>
                        </View>
                        {friendbtn}
                </View>
            )
        })

        return(
            <View style={[styles.panel]}>   
                <View style={styles.greetingBox}>
                    <VrButton style={[styles.card]}>
                        {/* <View>
                            <Image style={styles.thumbnail} source={asset(`thumbnails/${ele.name}.jpg`)} />
                        </View> */}
                        <View>
                            <Text style={[styles.greeting, {color: '#282828' }]}>
                                Friends
                            </Text>
                        </View>
                    </VrButton>
                </View>
                {list}
                {/* CALL ALL THE FETCH INSTRUCTIONS IN STORE JS */}
                <VrButton onClick={()=>{console.log(this.props.searchtext)}}>
                    <Text>
                        search
                    </Text>
                </VrButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 400,
      height: 600,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    //   flexDirection: 'column'
    },
    greetingBox: {
      padding: 20,
      marginHorizontal:10,
      backgroundColor: 'rgba(242, 247, 252,0.8)',
      borderColor: '#639dda',
      borderTopWidth: 1,
      flexDirection:"row"
    },
    greeting: {
      fontSize: 30,
      color:'#475993'
    },
    card:{
        width:200,
        // flexDirection:"row"
        // height: 50
    },
    thumbnail:{
        borderRadius:50,
        width:50,
        height:50
    }
  });

export default Left;