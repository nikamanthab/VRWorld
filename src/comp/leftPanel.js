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
  import greendot from './../../static_assets/green.png';
  import reddot from './../../static_assets/red.png';
  import addfriend from './../../static_assets/addfriend.png';
  import search from './../../static_assets/search.png';
  import up from './../../static_assets/down.png';


class Left extends React.Component{

    
    
    
    render = ()=>{
        console.log("bhaammmmmmmmmmmmmmmmmmmmmmmmmmm:",this.props.friends);
        let list = <View></View>;

        movies = this.props.movies;
        console.log("booom:",this.props.searchtext)
        list = movies.map((ele,i)=>{
            
            let onlinelogo = (ele.online? <Image style={styles.img} source={greendot}/>:<Image style={styles.img} source={reddot}/>)
            console.log("onlinelogo:",onlinelogo);
            let friendbtn = (<VrButton style={styles.card} onClick={()=>{}}>
                    <Image style={styles.img1} source={addfriend}/>
                </VrButton>)
            if(ele.friend == true){
                friendbtn = (<VrButton style={styles.accept}>
                    <Text style={styles.greeting}>Accept</Text>
                </VrButton>)
            }


            return(
                <View key={i} style={styles.greetingBox}>
                        {/* <View>
                            <Image style={styles.thumbnail} source={asset(`thumbnails/${ele.name}.jpg`)} />
                        </View> */}
                        <View style={{flexDirection:"row"}}>
                            <View>
                                {onlinelogo}
                            </View>
                            <View>
                                <Image style={styles.thumbnail} source={asset(`profilepic/nitin.jpg`)} />
                            </View>
                            <View style={{marginLeft:10}}>
                                <Text style={styles.greeting}>
                                    {ele.name}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.friendadddiv}>
                            {friendbtn}
                        </View>
                </View>
            )
        })

        return(
            <View style={[styles.panel]}>   
                {list}
                {/* CALL ALL THE FETCH INSTRUCTIONS IN STORE JS */}
                <View style={styles.bottombar}>
                    <VrButton>
                        <Image source={up} style={{width:50,height:50,transform: [{ rotate: '180deg' }]}}/>
                    </VrButton>
                    <VrButton onClick={()=>{console.log(this.props.searchtext)}}>
                        <Image source={search} style={{width:50,height:50}}/>
                    </VrButton>
                    <VrButton>
                        <Image source={up} style={{width:50,height:50}}/>
                    </VrButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bottombar:{
        width:400,
        justifyContent:"space-around",
        flexDirection:"row"
    },
    friendadddiv:{
        justifyContent:"center",
        alignItems:"center",
        // borderColor:"green",
        // borderWidth:2,
        // width:200
    },
    accept:{
        height:50,
        width:100,
        backgroundColor:"#0690ba",
        borderRadius:5
    },
    img:{
        width:15,
        height:15,
        // borderColor: "green",
    },
    img1:{
        height:50,
        width:50
    },
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
      backgroundColor: 'rgba(0, 0, 0,0.8)',
      marginBottom:5,
      borderRadius:10,
      borderColor: '#639dda',
      borderTopWidth: 1,
      flexDirection:"row",
      width:375,
      justifyContent:"space-between"
    },
    greeting: {
      fontSize: 30,
      color:'white',
      textAlign:"center"
    },
    card:{
        // width:50,
        borderRadius:10,
        // backgroundColor: "white",
        // flexDirection:"row"
        // height: 50
    },
    thumbnail:{
        borderRadius:50,
        width:50,
        height:50
    },
  });

export default Left;