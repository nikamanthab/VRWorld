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
const fbAuth= NativeModules.fbAuth;


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
    State.selectedMovie = movie;
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
    if(pageName==="home"){
        setHome()
    }
    if(pageName === "video"){
        setVideo(movie)
    }
    // Environment.setBackgroundImage(asset(`./360_${house[`${roomName}`].img}`));
    updateComponents();
}

friendsGen = ()=>{
    // console.log("yoyo2")
    fbAuth.getFriends(val => {
        // console.log("Bangammmm:",val); //assumed
        State.allfriends = val;
        State.friends = val.slice(0,5);
        // console.log("trouser:",val.slice(0,5))
        friendsGen();
        updateComponents(); // test this as inside callback - assumed
    })
}

getFriendsList = ()=>{
    console.log("yoyo")
    friendsGen();
    // fbAuth.getFriends(val => {
    //     console.log("Bangammmm:",val); //assumed
    //     State.allfriends = val;
    //     State.friends = val.slice(0,5);
    //     console.log("trouser:",val.slice(0,5))
    //     updateComponents(); // test this as inside callback - assumed
    // })
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

export const handleAuth = ()=>{
    fbAuth.fbsetup( (val,val2) => {
        console.log("in comp",val)
        // this.setState({
        //   checkStatus: val,
        //   uid: val2
        // });

        if(val) {
            setUserId(val2);
            changePage("home");
        }
        else{
            // console.log("blah",this.state.checkStatus)
            fbAuth.fbAuthenticate((val,val2) => {
                if(val){
                console.log("boomboom:",val2);
                setUserId(val2);
                changePage("home")
                }
            });
            // this.props.login();
        }
      });
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
                people: State.people
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
                />
            )
        }
    }
}