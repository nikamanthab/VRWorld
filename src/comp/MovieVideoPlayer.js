import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    VrButton,
    Image,
    NativeModules,
    asset
  } from 'react-360';
  import {validateCommand,getCommand} from './../../speech-recognition/p5speech/trie';
  import {VideoPlayer} from './../videoModules/index';
  // const peerAudioModule = NativeModules.peerAudioModule;


  // const speechRecognition = NativeModules.speechRecognition;

class Left extends React.Component{

    componentWillMount = ()=>{
      console.log("suzzuka")
      // console.log(validateCommand);
      // speechRecognition.main();
      // peerAudioModule.socketconnection();
    }

    render = ()=>{
        console.log("movies yoyo:",this.props.movies,this.props.selectedMovie);
        let movie = this.props.movies.filter(ele => ele.id == this.props.selectedMovie)
        console.log("video:",movie);
        return(
                <View style={[styles.border,{flex: 1}]}>
                  <VideoPlayer
                    muted={false}
                    // source={{url: asset(`movies/${this.props.selectedMovie}.mp4`).uri}}
                    source={{url: movie[0].video}}
                    stereo={'2D'}
                    style={{
                      width: 1200,
                      height: 720,
                    }}
                  />
                </View>
              );
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 1200,
      height: 720,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    //   flexDirection: 'column'
    },
    greetingBox: {
      padding: 20,
      margin:10,
      backgroundColor: '#000000',
      borderColor: '#639dda',
      borderWidth: 2,
    },
    greeting: {
      fontSize: 30,
    },
    card:{
        width:300,
        flexDirection:"row"
        // height: 50
    },
    thumbnail:{
        width:100,
        height:50
    },
    border:{
      // borderColor:"white",
      // borderWidth:5
    }
  });

export default Left;