import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  NativeModules,
  View,
} from 'react-360';
import HomePage from './src/pages/home';
import LoginPage from './src/pages/login';
import {connect,changePage} from './store';
import Left from './src/comp/leftPanel';
import Right from './src/comp/rightPanel';
import MovieVideoPlayer from './src/comp/MovieVideoPlayer';
import CloseButton from './src/comp/closebutton';
import InfoPanel from './src/comp/InfoPanel';
import People from './src/comp/People';
import Rate from './src/comp/Rate';
import Keyboard from './src/comp/keyboard';
// const Peer = require('./peermin');
// import Peer from 'peerjs';
const peerAudioModule = NativeModules.peerAudioModule;
import {getFriendsList} from './store';


export default class CooperPlaza extends React.Component {

  handleLogin = ()=>{
    // peerAudioModule.stream();
    // peerAudioModule.socketconnection();
    changePage("home");
  }

  render() {
    let page = <View></View>;
    if(this.props.page === "login"){
      page = (
        <LoginPage
          // login={this.handleLogin}
        />
      )
    }
    else if(this.props.page == "home"){
      page=(
        <HomePage
          changePage = {changePage}
          movies = {this.props.movies}
          searchtext={this.props.searchtext}
          friends ={this.props.friends}
          username = {this.props.username}
          coldStatus={this.props.coldStatus}
          userid={this.props.userid}
        />
      )
    }
    return (
      <View>
        {page}
      </View>
    );
  }
};

class RightPanel extends React.Component {

  render() {
    let page = <View></View>;
    if(this.props.page === "home"){
      page=(
        <View>
          <Right
            title={"global"}
            type={"global"}
            searchtext={this.props.searchtext}
            globalfriends = {this.props.globalfriends}
            changePage = {changePage}
            movies={this.props.global}
            friends={this.props.friends}
          />
        </View>
      )
    }
    // if(this.props.page === "video"){
    //   <View>
    //     <ConnectedPeople/>
    //   </View>
    // }
    return (
      <View>
        {page}
      </View>
    );
  }
};

class FriendsPanel extends React.Component{
  render() {
    let page = <View></View>;
    if(this.props.page === "home"){
      page=(
        <View>
          <Right
            title={"friends"}
            type={"friends"}
            searchtext={this.props.searchtext}
            globalfriends = {this.props.myfriends}
            changePage = {changePage}
            movies={this.props.global}
          />
        </View>
      )
    }
    return (
      <View>
        {page}
      </View>
    );
  }
}

class LeftPanel extends React.Component {

  render() {
    let page = <View></View>;
    if(this.props.page === "home"){
      page=(
        <View>
          <Left
            people={this.props.people||[]}
            changePage = {changePage}
            friends={this.props.friends||[]}
            friendsactive = {this.props.friendsactive}
            searchtext={this.props.searchtext}
          />
        </View>
      )
    }
    return (
      <View>
        {page}
      </View>
    );
  }
};


class VideoPanel extends React.Component{
  render = ()=>{
    let page = <View></View>
    if(this.props.page === "video"){
      page = (
      <MovieVideoPlayer
        movies={this.props.movies}
        selectedMovie={this.props.selectedMovie}
      />
      )
    }
    return(
      <View>
        {page}
      </View>
    )
  }
}

class Close extends React.Component{
  render = ()=>{
    let page = <View></View>
    if(this.props.page === "video"){
      page = (
      <CloseButton
        changePage = {changePage}
      />
      )
    }
    return(
      <View>
        {page}
      </View>
    )
  }
}

class Info extends React.Component{
  render = ()=>{
    let page = <View></View>
    if(this.props.page === "video"){
      // page = (
      // <InfoPanel
      // movie = {this.props.selectedMovie}
      // allmovies = {this.props.movies}
      // />
      // )
    }
    
    return(
      <View>
        {page}
      </View>
    )
  }
}

class PeoplePanel extends React.Component{
  render = ()=>{
    let page = <View></View>
    if(this.props.page === "video"){
      // page = (
        // <Left
        //     changePage = {changePage}
        //     movies={this.props.friends}
        //     searchtext={this.props.searchtext}
        //   />
      // <People
      //   people={this.props.people}
      // />
      // )
    }
    return(
      <View>
        {page}
      </View>
    )
  }
}

class RatingPanel extends React.Component{
  render = ()=>{
    let page = <View></View>
    if(this.props.page === "rating"){
      page = (
      <Rate
        people={this.props.people}
        changePage = {changePage}
      />
      )
    }
    return(
      <View>
        {page}
      </View>
    )
  }
}


class KeyboardPanel extends React.Component{
  render = ()=>{
    let page = <View></View>
    if(this.props.page === "home"){
      page = (
      <Keyboard
        text={this.props.searchtext}
      />
      )
    }
    
    return(
      <View>
        {page}
      </View>
    )
  }
}

const ConnectedMain = connect(CooperPlaza);
const ConnectedRightPanel = connect(RightPanel);
const ConnectedLeftPanel = connect(LeftPanel);
const ConnectedVideoPanel = connect(VideoPanel);
const ConnectedClose = connect(Close);
const ConnectedInfo = connect(Info);
const ConnectedPeople = connect(PeoplePanel);
const ConnectedRatingPanel = connect(RatingPanel);
const ConnectedKeyboard = connect(KeyboardPanel);
const ConnectedFriendsPanel = connect(FriendsPanel);



AppRegistry.registerComponent('ConnectedMain', () => ConnectedMain);
AppRegistry.registerComponent('ConnectedRightPanel', () => ConnectedRightPanel);
AppRegistry.registerComponent('ConnectedLeftPanel', () => ConnectedLeftPanel);
AppRegistry.registerComponent('ConnectedVideoPanel', ()=> ConnectedVideoPanel);
AppRegistry.registerComponent('ConnectedClose', ()=> ConnectedClose);
AppRegistry.registerComponent('ConnectedInfo', ()=> ConnectedInfo);
AppRegistry.registerComponent('ConnectedPeople', ()=> ConnectedPeople);
AppRegistry.registerComponent('ConnectedRatingPanel', ()=> ConnectedRatingPanel);
AppRegistry.registerComponent('ConnectedKeyboard', ()=> ConnectedKeyboard);
AppRegistry.registerComponent('ConnectedFriendsPanel', ()=> ConnectedFriendsPanel);

