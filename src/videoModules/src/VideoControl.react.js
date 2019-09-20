/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
import React from 'react';
import {View, Text, Image, VrButton,NativeModules} from 'react-360';
import {VideoPlayerInstance} from 'VideoModule';
import {StyleSheet} from 'react-native';
import createGlyph from 'createGlyph';
import type {VideoPlayerStatus, VideoStatusEvent} from 'VideoModule';
import io from 'socket.io-client';
// const peerAudioModule = NativeModules.peerAudioModule;
const speechRecognition = NativeModules.speechRecognition;

import {controlsocket,socTrigger} from './../../../store';

import type {ViewStyleProp} from 'StyleSheetTypes';


const IMAGE_PLAY = createGlyph({
  width: 128,
  height: 128,
  color: '#999999',
  instructions: [['begin'], ['move', 20, 11], ['line', 108, 64], ['line', 20, 117], ['end']],
});

const IMAGE_PAUSE = createGlyph({
  width: 128,
  height: 128,
  color: '#999999',
  instructions: [['begin'], ['rect', 24, 10, 24, 108], ['rect', 80, 10, 24, 108], ['end']],
});

// MUTE and UNMUTE share the majority of their shape
const speaker = [
  ['begin'],
  ['move', 12, 46],
  ['line', 46, 46],
  ['line', 76, 26],
  ['line', 76, 102],
  ['line', 46, 82],
  ['line', 12, 82],
  ['end'],
  ['begin'],
  ['arc', 79, 66, 18, 1.28, -1.28, true],
  ['arc', 78, 66, 28, -1.28, 1.28, false],
  ['end'],
  ['begin'],
  ['arc', 76, 66, 36, 1.28, -1.28, true],
  ['arc', 76, 66, 44, -1.28, 1.28, false],
  ['end'],
];

const IMAGE_UNMUTE = createGlyph({
  width: 128,
  height: 128,
  color: '#999999',
  instructions: speaker,
});

const IMAGE_MUTE = createGlyph({
  width: 128,
  height: 128,
  color: '#999999',
  instructions: speaker.concat([
    ['begin'],
    ['move', 4.25, 21.24],
    ['line', 10.38, 13.66],
    ['line', 124.83, 106.34],
    ['line', 118.7, 113.92],
    ['end'],
  ]),
});

export function videoTimeFormat(time) {
  if (!time) {
    return '--:--';
  }

  const timeS = Math.floor(time);
  const seconds = timeS % 60;
  const minutes = Math.floor(timeS / 60) % 60;
  const h = Math.floor(timeS / 3600);
  // Mandate two digit minutes only if h is non-zero
  const mm = h ? `0${minutes}`.slice(-2) : minutes;
  const ss = `0${seconds}`.slice(-2);
  const timertext = h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  return timertext;
}

type ControlButtonProps = {
  style: ViewStyleProp,
  icon: {uri: string},
  onClick?: ?() => any,
};
type ControlButtonState = {
  isFocused: boolean,
};
class VideoControlButton extends React.PureComponent<ControlButtonProps, ControlButtonState> {
  state: ControlButtonState = {
    focused: false,
  };
  _onEnter = () => {
    this.setState({isFocused: true});
  };
  _onExit = () => {
    this.setState({isFocused: false});
  };
  render() {
    return (
      <VrButton
        style={[this.props.style, {backgroundColor: this.state.isFocused ? '#444' : '#222'}]}
        onClick={this.props.onClick}
        onEnter={this._onEnter}
        onExit={this._onExit}>
        <Image style={styles.icon} source={this.props.icon} />
      </VrButton>
    );
  }
}

type SliderBarProps = {
  fillColor: string,
  style: any,
  progress: number,
  onClickProgress?: ?(position: number) => any,
};
class VideoSliderBar extends React.PureComponent<SliderBarProps> {
  _gazedPosition: number = -1;

  _onExit = () => {
    this._gazedPosition = -1;
  };

  _onClick = () => {
    this._gazedPosition >= 0 &&
      this.props.onClickProgress &&
      this.props.onClickProgress(this._gazedPosition);
  };

  _onFillMove = (e: Object) => {
    this._gazedPosition = this.props.progress * e.nativeEvent.offset[0];
  };

  _onEmptyMove = (e: Object) => {
    this._gazedPosition = this.props.progress + (1 - this.props.progress) * e.nativeEvent.offset[0];
  };

  render() {
    return (
      <VrButton
        style={[this.props.style, styles.barContainer]}
        onExit={this._onExit}
        onClick={this._onClick}>
        <View
          style={[
            styles.barFill,
            {flex: this.props.progress, backgroundColor: this.props.fillColor},
          ]}
          onMove={this._onFillMove}
        />
        <View
          style={[styles.barEmpty, {flex: 1 - this.props.progress}]}
          onMove={this._onEmptyMove}
        />
      </VrButton>
    );
  }
}

/**
 * Component for controling video playback and volume. Appears as a horizontal
 * bar that can be placed below the VideoPlayer component (2D video) or anywhere
 * in the scene, as when used with the background 360 video.
 *
 * Contains the following UI elements:
 *
 * - buttons for play/pause, unmute/mute, and volume
 * - progress bar and timer showing both elapased and total time
 */
export type VideoControlProps = {
  fontSize: number,
  player: ?VideoPlayerInstance,
  style: any,
  onEnter?: ?() => void,
  onExit?: ?() => void,
};
export type VideoControlState = {
  volume: number,
  isMuted: boolean,
  playStatus: VideoPlayerStatus,
  duration: number,
  position: number,
};
class VideoControl extends React.PureComponent<VideoControlProps> {
  static defaultProps = {
    fontSize: 16,
  };
  state: VideoControlState;
  _videoEventListenerSubscription: ?EmitterSubscription = null;

  constructor(props: VideoControlProps) {
    super(props);
    this.state = {
      // nitin:10,
      manover: false,
      volume: 1.0,
      isMuted: false,
      playStatus: 'loading',
      duration: -1,
      position: -1,
      counter: 0,
      isBuffering: null,
    };
    if (props.player) {
      this._registerEventListener(null, props.player);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.player !== nextProps.player) {
      this._registerEventListener(this.props.player, nextProps.player);
    }
  }

  _registerEventListener(prePlayer: ?VideoPlayerInstance, nextPlayer: ?VideoPlayerInstance) {
    if (prePlayer && this._videoEventListenerSubscription) {
      prePlayer.removeSubscription(this._videoEventListenerSubscription);
      this._videoEventListenerSubscription = null;
    }

    if (nextPlayer) {
      this._videoEventListenerSubscription = nextPlayer.addListener(
        'onVideoStatusChanged',
        this._onVideoStatusChanged
      );
    }
  }

  incVol(val){
    if(val >= 1)
    return 1;
    else if(val <= 0)
    return 0;
    else
    return val;
  }

  speechLogic = ()=>{
    speechRecognition.main( (val) => {
      console.log(val);
      if(val == "play"){
        this.props.player.resume();
        // peerAudioModule.socketControll({status: "playing",position: this.state.position});
        controlsocket({status: "playing",position: this.state.position});

      }
      else if(val == "pause"){
        this.props.player.pause();
        // peerAudioModule.socketControll({status: "paused",position: this.state.position});
        controlsocket({status: "paused",position: this.state.position})
      }
      else if(val == "v+"){
        this.props.player.setVolume(this.incVol(this.state.volume + 0.2));
        // this.setState({volume:1})

      }
      else if(val == "v-"){
        this.props.player.setVolume(this.incVol(this.state.volume - 0.2));
        // this.setState({volume:0})

      }
      else if(! isNaN(val)){
        // this.props.player.seek(this.state.duration*val/100);

        // peerAudioModule.socketControll({status: "ready",position: val});
        controlsocket({status: "ready",position: val});
        this.props.player.seek(val);
        // this.setState({position: val});

        // this.props.player.resume();
      }

      this.speechLogic();
    });
  }

  // socTrigger = ()=>{
  //   peerAudioModule.socketPause((type,val)=>{
  //     if(type == "pause"){
  //       this.props.player.pause()
  //     }
  //     else if(type == "play" ){
  //       console.log("play triggered")
  //       this.props.player.seek(val);
  //       this.props.player.resume();
  //     }
  //     else if(type == "seek"){
  //       this.props.player.seek(val);
  //     }
  //    this.socTrigger();
  //   })
  // }

  mainsocTrigger = ()=>{
    console.log("mainsock triger");
    socTrigger((type,val)=>{
      if(type == "pause"){
        this.props.player.pause()
      }
      else if(type == "play" ){
        console.log("play triggered")
        this.props.player.seek(val);
        this.props.player.resume();
      }
      else if(type == "seek"){
        this.props.player.seek(val);
      }
    //  sockTrigger();
    this.mainsocTrigger();
    })
  }

  componentDidMount = ()=> {
    // this.props.player.pause();
    console.log("Fuckkkkkkkkkkkkkkkk Jooooooooooooo");
    // console.log();
    this.mainsocTrigger();
    this.speechLogic()
    // this.socSeek()
    // this.socPlay()
    
  }

  // componentDidUpdate = ()=>{
  //   console.log("videomodule updating...")
  //   speechRecognition.main( (val) => {
  //     if(val == "play"){
  //       this.props.player.resume();

  //     }
  //     else if(val == "pause"){
  //       this.props.player.pause();
  //     }
  //     else if(val == "v+"){
  //       this.props.player.setVolume(this.incVol(this.state.volume + 0.2));

  //     }
  //     else if(val == "v-"){

  //       this.props.player.setVolume(this.incVol(this.state.volume - 0.2));
  //     }
  //     else if(! isNaN(val)){

  //       this.props.player.seek(val);
  //     }
  //   });
  // }
    
    myplay = (arg)=>{
      this.props.player.seek(arg);
      this.props.player.resume();
    }
    // mypause = ()=>{
    //   this.props.player.pause();
    // }

    // myresume = ()=>{
    //   this.props.player.resume();
    // }

    // myseek = (arg)=>{
    //   this.props.player.seek(arg);
    // }



  componentWillUnmount() {
    if (this.props.player) {
      this._registerEventListener(this.props.player, null);
    }
    console.log("removed video!");
    speechRecognition.stopMic();

  }

 

  changeManOver = (bool)=>{
    this.setState({manover:bool})
  }


  _onVideoStatusChanged = (event: VideoStatusEvent) => {
    const {duration, isMuted, position, status, volume, isBuffering} = event;
    
    if(isBuffering !== this.state.isBuffering){
      if(isBuffering){
        // this.props.player.pause();
        // peerAudioModule.socketControll({status: "paused",position: this.state.position})
      }
      else{
        // this.props.player.resume();
        // peerAudioModule.socketControll({status: "playing",position: this.state.position})
      }
    }
    console.log(position,this.state.position);
    
    if(status == "ready" && this.state.counter == 0){
      this.props.player.pause();
      this.setState({counter : this.state.counter + 1});
    }
    if(this.state.manover){
      this.changeManOver(false)
    }
  
    
    if (
      duration !== this.state.duration ||
      isMuted !== this.state.isMuted ||
      status !== this.state.playStatus ||
      // position !== this.state.position ||
      volume !== this.state.volume
    ) {
    console.log(event);
    // this.speechLogic();
    }

    if (
      duration !== this.state.duration ||
      isMuted !== this.state.isMuted ||
      status !== this.state.playStatus ||
      position !== this.state.position ||
      volume !== this.state.volume ||
      isBuffering !== this.state.isBuffering
    ) {
      this.setState({
        volume: volume,
        isMuted: isMuted,
        playStatus: status,
        duration: duration,
        position: position,
        isBuffering: isBuffering,
      }); 
    }
  };

  _isPlaying() {
    return this.state.playStatus === 'playing';
  }

  _onPlayButtonClick = () => {
    // this.props.player.seek(0.8*this.state.duration);
    if (this.props.player) {
      if (this._isPlaying()) {
        // peerAudioModule.socketControll({status: "paused",position: this.state.position});
        controlsocket({status: "paused",position: this.state.position})
        this.props.player.pause();
      } else {
        // peerAudioModule.socketControll({status: "playing",position: this.state.position});
        controlsocket({status: "playing",position: this.state.position});
        this.props.player.resume();
      }
    }
  };

  _onMuteButtonClick = () => {
    if (this.props.player) {
      const newMuted = !this.state.isMuted;
      if (!this._isPlaying()) {
        this.setState({
          isMuted: newMuted,
        });
      }
      this.props.player.setMuted(newMuted);
    }
  };

  _onVolumeClick = volume => {
    if (this.props.player) {
      if (!this._isPlaying()) {
        this.setState({
          volume: volume,
        });
      }
      this.props.player.setVolume(volume);
    }
  };

  _onClickProgress = progress => {
    if (this.props.player && this.state.duration) {
      console.log("clicked hhbdhbdhbhdb")
      this.props.player.seek(this.state.duration * progress);
      controlsocket({status: "ready",position: this.state.duration * progress});
    }
  };

  render() {
    // this.props.player.pause(); 
    const playButtonIcon = this._isPlaying() ? IMAGE_PAUSE : IMAGE_PLAY;
    const muteButonIcon = this.state.isMuted ? IMAGE_MUTE : IMAGE_UNMUTE;
    const videoProgress =
      this.state.position > 0 && this.state.duration > 0
        ? this.state.position / this.state.duration
        : 0;
    return (
      <View
        onEnter={this.props.onEnter}
        onExit={this.props.onExit}
        style={[this.props.style, styles.container]}>
        <VideoControlButton
          onClick={this._onPlayButtonClick}
          style={styles.button}
          icon={playButtonIcon}
        />
        <View style={styles.timerContainer}>
          <VideoSliderBar
            fillColor={'#1099eb'}
            onClickProgress={this._onClickProgress}
            progress={videoProgress}
            style={styles.progressBar}
          />
          <Text style={[styles.text, styles.timerText, {fontSize: this.props.fontSize}]}>
            {`${videoTimeFormat(this.state.position)}/${videoTimeFormat(this.state.duration)}`}
          </Text>
        </View>
        <VideoControlButton
          onClick={this._onMuteButtonClick}
          style={styles.button}
          icon={muteButonIcon}
        />
        <View style={styles.volumeContainer}>
          <VideoSliderBar
            fillColor={'#888'}
            onClickProgress={this._onVolumeClick}
            progress={this.state.volume}
            style={styles.volumeBar}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#999',
  },
  button: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: '70%',
    maxWidth: '100%',
    aspectRatio: 1.0,
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: '2%',
  },
  timerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '2%',
  },
  timerText: {
    paddingLeft: '2%',
    paddingRight: 0,
  },
  progressBar: {
    flex: 1,
  },
  barContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  barFill: {
    height: '30%',
  },
  barEmpty: {
    height: '30%',
    backgroundColor: '#333',
  },
  volumeContainer: {
    flex: 0.3,
    paddingHorizontal: '2%',
    backgroundColor: '#222',
  },
  volumeBar: {
    flex: 1,
  },
});

module.exports = VideoControl;