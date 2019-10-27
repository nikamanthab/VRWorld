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
  import {listenParty, emitJoin,changePage,setSelectedMovieidInStore} from './../../store';

class Right extends React.Component{

    componentWillMount = ()=>{
        if(this.props.type == "friends")
            listenParty(true)
        else if(this.props.type == "global") 
            listenParty(false)
    }
    movetoParty(movieid,initiator){
        console.log("movieid",movieid)
        emitJoin(movieid,initiator);
        setSelectedMovieidInStore(movieid);
        changePage("video");

    }
    renderGlobal(){
        if(this.props.type == "global")
            console.log("here",this.props.globalfriends);   
        let joinparty = this.props.globalfriends;
        list = joinparty.map((ele,i)=>{
            return(
                <View style={styles.greetingBox}>
                    <View>
                            <Image style={styles.thumbnail} source={{uri : ele.photo}} />
                    </View>
                    <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <View>
                            <Text style={{textAlign:'center',padding:2}}>{ele.name}</Text>
                        </View>
                        <VrButton style={{width:150,backgroundColor:'#0690ba',borderRadius:5,marginTop:5}} onClick={() => this.movetoParty(ele.movieid,ele.initiator)}>
                            <Text style={{textAlign:'center',padding:2,color:'white'}}> Join Party</Text>
                        </VrButton>

                    </View>
                    {/* <VrButton style={styles.card} onClick={()=>this.props.changePage("video",ele.name)}>
                        <View>
                            <Image style={styles.thumbnail} source={asset(`thumbnails/${ele.name}.jpg`)} />
                        </View>
                        <View>
                            <Text style={styles.greeting}>
                                {ele.name}
                            </Text>
                        </View>
                    </VrButton> */}
                </View>
            )
        })

        return list;

    }

    renderFriend(){

    }

    render = ()=>{
        console.log("props in right panel:",this.props);
        console.log("here1",this.props.type,this.props.globalfriends)
        return(
            <View style={{width: 400,height: 600,}}>  
                <View style={{height:30,width:400}}>
                   <Text style={{fontSize:25,backgroundColor:"rgba(0,0,0,0.5)",textAlign:'center'}}>{this.props.title}</Text>   
               </View> 
             < View style={styles.panel}>
                {this.renderGlobal()}
                {/* <VrButton onClick={()=>{console.log(this.props.searchtext)}}>
                    <Text>
                        search
                    </Text>
                </VrButton> */}
             </View>   
                            
            </View>
        )
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
    //   width: 400,
      height: 570,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    greetingBox: {
      padding: 2,
      margin:3,
      backgroundColor: 'rgba(0, 0, 0,0.8)',
    //   borderColor: '#639dda',
    //   borderWidth: 2,    
      width: 350,
      flexDirection: 'row',
      borderRadius: 10,
      justifyContent:'space-around'

    },
    greeting: {
      fontSize: 30,
    },
    card:{
        width:350,
        flexDirection:"row"
        // height: 50
    },
    thumbnail:{
        width:60,
        height:80
    },
    btn:{
        width:150,
        backgroundColor:'#0690ba',
        borderRadius:5,
        marginTop:5
    },
    btn1:{
        width:150,
        backgroundColor:'#0690ba',
        borderRadius:5,
        marginTop:5,
        opacity:0.5,
    }
  });

export default Right;