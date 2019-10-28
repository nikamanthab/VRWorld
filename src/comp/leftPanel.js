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
  import {searchPeople,upClick,downClick} from './../../store';

//   import {getFriendsList} from './../../store';
// import {} from './../../store'
import {addFriend,acceptHandler} from './../../store';

class Left extends React.Component{
    componentDidMount = ()=>{
        // getFriendsList()
    }

    handleSearchClick = () => {
        searchPeople();
    }

    handleUpClick = () => {
        upClick()
    }

    handleDownClick = () => {
        downClick()
    }

    handleAccept = (id)=>{
        acceptHandler(id)
    }
    handleAddFriend = (uid)=>{
        console.log("thongidu:",uid);
        addFriend(uid);
    }
    
    render = ()=>{
        console.log("bhaammmmmmmmmmmmmmmmmmmmmmmmmmm:",this.props.friendsactive,this.props.people,this.props.friends);
        let list = <View></View>;
        

        if(this.props.friendsactive){
            friends = this.props.friends||[];
            console.log("booom:",this.props.searchtext,friends)
            list = friends.map((ele,i)=>{
                console.log("onlinestaus:",ele[0].onlineStatus);
                let onlinelogo = (ele[0].onlineStatus? <Image style={styles.img} source={greendot}/>:<Image style={styles.img} source={reddot}/>)
                console.log("onlinelogo:",onlinelogo);
                let friendbtn = (<View></View>);
                if(ele[0].status == false){
                    friendbtn = (
                    <VrButton style={styles.accept} onClick={()=>{this.handleAccept(ele[1])}}>
                        <Text style={styles.greeting}>Accept</Text>
                    </VrButton>
                    )
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
                                    <Image style={styles.thumbnail}  source={{uri: ele[0]["profilepic"]}} />
                                </View>
                                <View style={{marginLeft:10}}>
                                    <Text style={styles.greeting}>
                                        {ele[0].name}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.friendadddiv}>
                                {friendbtn}
                            </View>
                    </View>
                )
            });
        }
        else{
            peoples = this.props.people || [];
            list = peoples.map((ele,i)=>{
                console.log("onlinestaus:",ele.onlineStatus);
                let onlinelogo = (ele.onlineStatus? <Image style={styles.img} source={greendot}/>:<Image style={styles.img} source={reddot}/>)
                console.log("onlinelogo:",onlinelogo);
                let friendbtn = (<View></View>);
                friendbtn = (<VrButton style={styles.card} onClick={()=>{this.handleAddFriend(ele["uid"])}}>
                        <Image style={styles.img1} source={addfriend}/>
                    </VrButton>)
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
                                    <Image style={styles.thumbnail}  source={{uri: ele["profilepic"]}} />
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
        }
        

            // if(!this.props.friendsactive){
                
            // }
            // else{
            //     console.log("umbu:",ele[0].status)
                
            // }



        //     return(
        //         <View key={i} style={styles.greetingBox}>
        //                 {/* <View>
        //                     <Image style={styles.thumbnail} source={asset(`thumbnails/${ele.name}.jpg`)} />
        //                 </View> */}
        //                 <View style={{flexDirection:"row"}}>
        //                     <View>
        //                         {onlinelogo}
        //                     </View>
        //                     <View>
        //                         <Image style={styles.thumbnail}  source={{uri: ele[0]["profilepic"]}} />
        //                     </View>
        //                     <View style={{marginLeft:10}}>
        //                         <Text style={styles.greeting}>
        //                             {ele[0].name}
        //                         </Text>
        //                     </View>
        //                 </View>
        //                 <View style={styles.friendadddiv}>
        //                     {friendbtn}
        //                 </View>
        //         </View>
        //     )
        // })

        return(
            <View style={[styles.panel]}>   
                {list}
                {/* CALL ALL THE FETCH INSTRUCTIONS IN STORE JS */}
                <View style={styles.bottombar}>
                    <VrButton onClick={()=>{this.handleUpClick()}}>
                        <Image source={up} style={{width:50,height:50,transform: [{ rotate: '180deg' }]}}/>
                    </VrButton>
                    <VrButton onClick={()=>{this.handleSearchClick()}}>
                        <Image source={search} style={{width:50,height:50}}/>
                    </VrButton>
                    <VrButton onClick={()=>{this.handleDownClick()}}>
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