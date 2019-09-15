import React from 'react';
import {friends} from './data/friends';
import {movies} from './data/allmovies';
import {global} from './data/global';
import {
    Environment,
    asset,
} from 'react-360';

console.log("hmmm",friends);

const State = {
    searchtext:"",
    page: "login",
    friends: friends,
    global: global,
    movies: movies,
    selectedMovie: "captainamerica",
    people:[],
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
    console.log("inside home")
    State.people = [];
}

setVideo = (movie)=>{
    console.log(movie);
    State.selectedMovie = movie;
    State.people = ["mohan","jo","rya"];
}

export const changeSearchText = (text)=>{
    State.searchtext = text;
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


export const connect = (Component)=>{
    return class Wrapper extends React.Component{
        state = {
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