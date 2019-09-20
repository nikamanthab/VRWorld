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
import {getFriendsList,getAllMovies,watchParty,setSelectedMovieidInStore,emitJoin} from './../../store'
// import {getFriendsList,getAllMovies,watchParty,} from './../../store'
import AnimatedBtn from './../comp/animatedBtn';
import search from './../../static_assets/search.png';

class Home extends React.Component{

  state={
    visible:true,
    movieselected:null,
    movies: [],
    search: "",
    styles:{
      height:220,
      width:170,
      padding:3,
      borderWidth:3,
      borderColor:"red"
    }
  }

  componentWillMount = ()=>{
    getAllMovies();
    
  }

  componentDidMount = ()=>{
    //calling the main functions from store
    // getFriendsList();
    movies = this.props.movies;
    this.setState({
      movies:movies,
      video: "video",
      selected: null,
      id: null,
      first: true
    })

  }


  handleSearch = ()=>{
    console.log(this.props.searchtext);
    this.setState({
      search:this.props.searchtext
    })
  }

handleselect(val,val1,val2,val3){
  console.log("betta",val1,val2);
  this.setState({
    selected : val1,
    visible: false,
    first:false,
    id:val2,
    photo:val3,
  },()=>{
    setSelectedMovieidInStore(val2)
  });
  
  // this.props.changePage("video",ele.name)

}

handleredirect(){
  console.log("friends:",this.props.friends,this.state.id,this.state.selected);
  let myfriends=this.props.friends.filter(data =>{
    return data[0]["status"]==true
  });
  let myarr= myfriends.map(ele =>{
    return ele[1];
  });
  
  console.log("myfriends:",myarr)

  watchParty(myarr,this.state.id,true,this.state.selected,this.state.photo);
  emitJoin(this.state.id,"");
  this.props.changePage("video",this.state.selected);
}
  
  render = ()=>{
    let searchedmovies;
    let nn = [];
    for(ele of this.props.movies){
      console.log("suppu:",ele);
      if(ele["name"].toLowerCase().indexOf(this.state.search)!=-1 || this.state.search==""){
        nn.push(ele)
        console.log("suppu3:",nn);
    }
  }
  
  console.log("suppu2",nn);
  searchedmovies = nn;
  searchedmovies = searchedmovies.slice(0,12);
    console.log("fuckkkkkkk:",searchedmovies,this.props.movies)
    let list = <View></View>
        // movies = this.props.movies;
        list = searchedmovies.map((ele,i)=>{
            return(
                <View style={styles.greetingBox}>
                    <VrButton onClick={()=>this.handleselect("video",ele.name,ele.id,ele.photo)} style={{justifyContent:'center',alignItems:'center'}}>
                        <View 
                          // style={{borderWidth:1,borderColor: 'green'}}
                        >
                            <Image style={(this.state.selected != ele.name && this.state.first == false)?styles.thumbnail2:styles.thumbnail} source={{uri:ele.photo}} />
                        </View>
                        {/* <View>
                            <Text style={styles.greeting}>
                                {ele.name}
                            </Text>
                        </View> */}
                    </VrButton>
                </View>
            )
        })
        return(
          <View style={styles.panel}>
            <View style={styles.header}>
                <Text style={styles.greeting}>
                  {"Welcome, " + this.props.username}
                </Text>
            </View>
          
            <View style={styles.flexPanel} >
              {list}
            </View>
          <View style={{width: 500, height:50, flexDirection:'row',justifyContent:"space-between"}}>
            {/* <AnimatedBtn text={"nitin"}/> */}
            <AnimatedBtn onClick={() => this.handleredirect()} text={"Create Party"}/>
            {/* <VrButton style={styles.buttons} disabled={this.state.visible} onClick={() => this.handleredirect()}>
                <Text style={styles.greeting}>Create Party</Text>
            </VrButton> */}
            <VrButton onClick={()=>{this.handleSearch()}}>
                <Image source={search} style={{width:50,height:50}}/>
            </VrButton>
            <AnimatedBtn onClick={alert("enter")} text={"Suggest Party"} />
            {/* <VrButton style={styles.buttons}>
               <Text style={styles.greeting}>Suggest Party</Text>
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
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      // justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    header:{
         height: 50,
        //  borderWidth:1,
        //  borderColor: 'green'

    },
    flexPanel:{
      flexDirection: 'row',
      flexWrap:'wrap',
      width: 980,
      height: 500,
      // borderWidth:1,
      // borderColor: 'green',

    },
    greetingBox: {
      width: 160,
      height: 210,
      // width: 310,
      // height: 100, 
      // padding: 10,
      // margin:5,
      // backgroundColor: '#000000',
      // borderColor: '#639dda',
      // borderColor: 'green',
      // borderWidth: 5,
    },
    greeting: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight:'bold'
    },
    card:{
      // width:275,
      // flexDirection:"row"
      // height: 50
    },
    thumbnail:{
      width: 160,
      height: 210,
    },
    thumbnail2:{
      width:160,
      height:210,
      opacity: 0.5
    },
    buttons:{
      height:50,
      width:200,
      backgroundColor:"#0690ba",
      borderRadius:5
    },
  });

export default Home;