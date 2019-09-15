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

class Home extends React.Component{

  
  render = ()=>{
    let list = <View></View>
    movies = this.props.movies;
        list = movies.map((ele,i)=>{
            return(
                <View style={styles.greetingBox}>
                    <VrButton onClick={()=>this.props.changePage("video",ele.name)} style={styles.card}>
                        <View>
                            <Image style={styles.thumbnail} source={asset(`thumbnails/${ele.name}.jpg`)} />
                        </View>
                        <View>
                            <Text style={styles.greeting}>
                                {ele.name}
                            </Text>
                        </View>
                    </VrButton>
                </View>
            )
        })
        return(
          <View style={styles.panel}>
          <View style={styles.header}>
              <Text style={styles.greeting}>
                Movie Collection
              </Text>
          </View>
          
          <View style={styles.flexPanel} >
            {list}
          </View>
          <View style={{width: 300, height:50, flexDirection:'row'}}>
             <VrButton style={styles.buttons}>
                <Text style={styles.greeting}>Up</Text>
             </VrButton>
             <VrButton style={styles.buttons}>
               <Text style={styles.greeting}>Down</Text>
             </VrButton>
          <VrButton onClick={()=>{console.log(this.props.searchtext)}}>
                    <Text>
                        search
                    </Text>
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
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      // justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    header:{
         height: 50,
         borderWidth:1,
         borderColor: 'green'

    },
    flexPanel:{
      flexDirection: 'row',
      flexWrap:'wrap',
      width: 980,
      height: 500,
      borderWidth:1,
      borderColor: 'green',

    },
    greetingBox: {
      width: 310,
      height: 100,
      padding: 10,
      margin:5,
      backgroundColor: '#000000',
      borderColor: '#639dda',
      borderWidth: 2,
    },
    greeting: {
      fontSize: 30,
      textAlign: 'center'
    },
    card:{
      // width:275,
      flexDirection:"row"
      // height: 50
    },
    thumbnail:{
        width:100,
        height:50
    },
    buttons:{
     width: 120,
     marginLeft: 10,
     marginRight: 10,
     backgroundColor: 'black'
    },
  });

export default Home;