import React from 'react';
import {friends} from './data/friends';
import {movies} from './data/allmovies';
import {global} from './data/global';
import {
    Environment,
    asset,
    NativeModules,
} from 'react-360';
// import {getFriends} from './firebase-lib';
const fbAuth = NativeModules.fbAuth;
const peerAudioModule = NativeModules.peerAudioModule;



console.log("hmmm",friends);

const State = {
    // someart:undefined,
    userid:undefined,
    friendlistpage: 1,
    // userid:452651015464681,
    friendsactive:true,
    searchtext:"",
    page: "login",
    friends: null,
    allfriends: null,
    people: null,
    global: global,
    movies: movies,
    selectedMovie: "captainamerica",
    globalfriends:[],
    myfriends:[],
}

const listeners = new Set();

const updateComponents = ()=>{
    console.log(listeners);
    for(const cb of listeners.values()){
        console.log(cb);
        cb();
    }
}

setHome = ()=>{
    console.log("inside home");
    getFriendsList();
    State.people = []; //have to change this shit
}

setVideo = (movie)=>{
    console.log(movie);
    // State.selectedMovie = movie;
    State.people = ["mohan","jo","rya"];
}

export const setUserId = (val)=>{
    State.userid = val;
    console.log("useridset:",val);
    updateComponents();
}

export const changeSearchText = (text)=>{
    State.searchtext = text;
    if(text == ""){
        State.friendsactive = true;
        State.friendlistpage = 1;
    }
    updateComponents();
}

export const changePage = (selectedpage,movie) => {
    let pageName = selectedpage;
    State.page = pageName;
    console.log("changing page to :",pageName)
    if(pageName==="home"){
        setHome()
    }
    if(pageName === "video"){
        setVideo(movie)
        Environment.setBackgroundImage(asset(`./360_world.jpg`));
    }
    updateComponents();
}

export const setSelectedMovieidInStore = (id)=>{
    State.selectedMovie = id;
    console.log("updating selected movie:",id);
    updateComponents();
}

friendsGen = (bobo)=>{
    console.log("yoyo2")
    fbAuth.getFriends(bobo,val => {
        console.log("Bangammmm:",val); //assumed
        State.allfriends = val;
        State.friends = val.slice(0,5);
        console.log("trouser:",val.slice(0,5))
        updateComponents(); // test this as inside callback - assumed
        friendsGen(false);
    })
}

getFriendsList = ()=>{
    console.log("yoyo")
    friendsGen(true);
    // fbAuth.getFriends(val => {
    //     console.log("Bangammmm:",val); //assumed
    //     State.allfriends = val;
    //     State.friends = val.slice(0,5);
    //     console.log("trouser:",val.slice(0,5))
    //     updateComponents(); // test this as inside callback - assumed
    // })
} 

export const acceptHandler = (id)=>{
    console.log("sucker")
    fbAuth.acceptFriendreq(id).then((data)=>{
        console.log("accepted:",id);
        // State.friends.forEach(ele=>{
        //     if(ele[1] == id){
        //         ele[0]["status"] = true;
        //     }
        // },()=>{
        //     updateComponents();
        // })
    }).catch(console.log);
}

export const addFriend = (uid)=>{
    console.log("uid:",uid);
    fbAuth.addFriend(uid).then(()=>{
        console.log("sent:",uid);
    })
}

export const getAllMovies =  ()=>{
  fbAuth.getMovies(value=>{
    State.movies = value;
    updateComponents()
  })
}

export const searchPeople = () => {
    fbAuth.search(State.searchtext,State.friendlistpage,val=>{
        State.people = val; 
        State.friendsactive = false;
        updateComponents();
    })
}

export const upClick = ()=>{
    if(State.friendsactive){
        State.friendlistpage = State.friendlistpage+1;
        State.friends = State.allfriends.slice(State.friendlistpage*5-5,(State.friendlistpage+1)*5);
        updateComponents();
    }
    else{
        fbAuth.search(State.searchtext,State.friendlistpage+1,val=>{
            State.people = val; 
            State.friendsactive = false;
            State.friendlistpage = State.friendlistpage + 1; 
            updateComponents();
        })
    }
}

export const downClick = ()=>{
    if(State.friendsactive){
        State.friendlistpage = State.friendlistpage-1;
        State.friends = State.allfriends.slice(State.friendlistpage*5-5,(State.friendlistpage+1)*5);
        updateComponents();
    }
    else{
        fbAuth.search(State.searchtext,State.friendlistpage-1,val=>{
            State.people = val; 
            State.friendsactive = false;
            State.friendlistpage = State.friendlistpage - 1; 
            updateComponents();
        })
    }
}

export const watchParty = (arr,movieid,friends,moviename,photo) =>{
    console.log("Instantiated");
    fbAuth.createWatchParty(arr,movieid,friends,moviename,photo);
}

listenRecursive = (bobo,friends) => {
    fbAuth.listenWatchParty(bobo,friends,(arr)=>{
        console.log("listening party arr:",arr);
        let lol=[];
        arr.forEach(y=>{ 
            let p =lol.filter(x=>{ 
                return x.initiator==y.initiator && x.movieid==y.movieid 
            }); 
            if(p.length==0){ 
                lol.push(y); 
            } 
        });
        if(friends){
            State.myfriends= lol;
        } 
        else{
            State.globalfriends = lol;
        }
        console.log("listening party new updated arr:",lol,friends,State.globalfriends,State.myfriends);
        updateComponents();
        listenRecursive(false,friends)
    })
}

export const listenParty = (friends)=>{
    console.log("buubuu:",friends);
    listenRecursive(true,friends)
}

export const ratingByClient = (ratingarr)=>{
    rateMovie(ratingarr);
}

export const handleAuth = ()=>{
    console.log("ole:",fbAuth)
    fbAuth.fbsetup( (val,val2) => {
        console.log("in comp",val,val2)
        // this.setState({
        //   checkStatus: val,
        //   uid: val2
        // });

        if(val) {
            setUserId(val2);
            changePage("home");
            console.log("in comp222:",val2);
            peerAudioModule.socketconnection(val2);
        }
        else{
            // console.log("blah",this.state.checkStatus)
            fbAuth.fbAuthenticate((val,val2) => {
                if(val){
                    console.log("boomboom:",val2);
                    setUserId(val2);
                    changePage("home")
                    console.log("in comp222:",val2);
                    peerAudioModule.socketconnection(val2);
                }
            });
            // this.props.login();
        }
      });
}

export const emitJoin = (movieid,userid) =>{
    if(userid == "")
     let word = State.userid + "-" + movieid;
    else
     let word = userid + "-" + movieid; 
    console.log("word",word);
    peerAudioModule.socketemit("joinRoom", word);
}


export const connect = (Component)=>{
    return class Wrapper extends React.Component{
        state = {
            friendsactive: State.friendsactive,
            searchtext: State.searchtext,
            page: State.page,
            friends: State.friends,
            global: State.global,
            movies: State.movies,
            selectedMovie: State.selectedMovie,
            people: State.people,
            globalfriends: State.globalfriends,
            myfriends: State.myfriends,
        }

        _listener = ()=>{
            console.log("hmmm....")
            this.setState({
                friendsactive: State.friendsactive,
                searchtext: State.searchtext,
                page: State.page,
                friends: State.friends,
                global: State.global,
                movies: State.movies,
                selectedMovie: State.selectedMovie,
                people: State.people,
                globalfriends: State.globalfriends,
                myfriends: State.myfriends,
                })
        }

        componentDidMount = ()=>{
            listeners.add(this._listener)
        }

        render = ()=>{
            return(
                <Component
                    {...this.props}
                    friendsactive = {this.state.friendsactive}
                    searchtext = {this.state.searchtext}
                    page = {this.state.page}
                    global = {this.state.global}
                    friends = {this.state.friends}
                    movies = {this.state.movies}
                    selectedMovie = {this.state.selectedMovie}
                    people = {this.state.people}
                    globalfriends = {this.state.globalfriends}
                    myfriends = {this.state.myfriends}
                />
            )
        }
    }
}