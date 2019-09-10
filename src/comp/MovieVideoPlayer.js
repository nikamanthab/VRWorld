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

  const speechRecognition = NativeModules.speechRecognition;

class Left extends React.Component{

    componentDidMount = ()=>{
      // console.log(validateCommand);
      speechRecognition.main();
    }

    render = ()=>{

        return(
                <View style={{flex: 1}}>
                  <VideoPlayer
                    muted={false}
                    source={{url: asset(`movies/${this.props.selectedMovie}.mp4`).uri}}
                    // source={{url: 'https://www.radiantmediaplayer.com/media/bbb-360p.mp4'}}
                    stereo={'2D'}
                    style={{
                      width: 1000,
                      height: 600,
                    }}
                  />
                </View>
              );
    }
}

const styles = StyleSheet.create({
    panel: {
      // Fill the entire surface
      width: 1000,
      height: 600,
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
    }
  });

export default Left;