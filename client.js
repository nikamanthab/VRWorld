// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

// const url = "peerjs-server-api.herokuapp.com";
const url = "peerjs-server-api.herokuapp.com";
import io from 'socket.io-client';
import {validateCommand,getCommand} from './speech-recognition/p5speech/trie';
// import {controller} from "./firebase-lib";

// import Peer from 'peerjs';
// import React from 'react';

// import {
//   Text,
// } from 'react-360';

import {
  ReactInstance,
  Surface,
  Module
} from 'react-360-web';
// import WebVRPolyfill from 'webvr-polyfill';
// const polyfill = new WebVRPolyfill();

// console.log("Peer:", Peer);
console.log("io:", io);

function init(bundle, parent, options = {}) {
   r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    nativeModules: [
      ctx => new peerAudioModule(ctx),
      ctx => new speechRecognition(ctx),
      ctx => new fbAuth(ctx),
    ],
    ...options,
  });

  //video panel 
  const videoSurface = r360.getDefaultSurface()
  videoSurface.resize(1000, 600)
  r360.renderToSurface(
    r360.createRoot('ConnectedVideoPanel', {
      /* initial props */ }),
    videoSurface
  );


  // Main center panel 
  const mainSurface = r360.getDefaultSurface()
  mainSurface.resize(1000, 600)
  r360.renderToSurface(
    r360.createRoot('ConnectedMain', {
      /* initial props */ }),
    mainSurface
  );

  const leftPanel = new Surface(400, 600, Surface.SurfaceShape.Flat)
  leftPanel.setAngle(-1.2, 0)
  r360.renderToSurface(
    r360.createRoot('ConnectedLeftPanel', {
      /* initial props */ }),
    leftPanel
  );

  const rightPanel = new Surface(400, 600, Surface.SurfaceShape.Flat)
  rightPanel.setAngle(1, 0)
  r360.renderToSurface(
    r360.createRoot('ConnectedRightPanel', {
      /* initial props */ }),
    rightPanel
  );

  const friendsRoomPanel = new Surface(400, 600, Surface.SurfaceShape.Flat)
  friendsRoomPanel.setAngle(1.6, 0)
  r360.renderToSurface(
    r360.createRoot('ConnectedFriendsPanel', {
      /* initial props */ }),
      friendsRoomPanel
  );

  const closePanel = new Surface(1000, 500, Surface.SurfaceShape.Flat)
  closePanel.setAngle(0, 0.6)
  r360.renderToSurface(
    r360.createRoot('ConnectedClose', {}),
    closePanel

  )

  //info panel
  const InfoPanel = new Surface(500, 300, Surface.SurfaceShape.Flat)
  InfoPanel.setAngle(0, -0.65)
  r360.renderToSurface(
    r360.createRoot('ConnectedInfo', {}),
    InfoPanel

  )

  const PeoplePanel = new Surface(400, 600, Surface.SurfaceShape.Flat)
  PeoplePanel.setAngle(-1.2, 0)
  r360.renderToSurface(
    r360.createRoot('ConnectedPeople', {}),
    PeoplePanel

  )

  //rating surface
  const ratingSurface = r360.getDefaultSurface()
  // ratingSurface.resize(1000,600)
  r360.renderToSurface(
    r360.createRoot('ConnectedRatingPanel', {
      /* initial props */ }),
    ratingSurface
  );

  const KeyboardPanel = new Surface(1000, 300, Surface.SurfaceShape.Flat)
  KeyboardPanel.setAngle(0, -0.75)
  r360.renderToSurface(
    r360.createRoot('ConnectedKeyboard', {}),
    KeyboardPanel

  )

  // Load the initial environment
  r360.compositor.setBackground(r360.getAssetURL('tv-room.jpg'));
}

var socket;
var mypeers = [];
var room = "room";
var gate = true;
var manover = false;
var seeked = false;

//speech recognition
class speechRecognition extends Module{
  constructor(ctx){
    super('speechRecognition')
    this._ctx = ctx;
    // console.log(ctx);

  }
   

  main(id){
    //UTIL
     
    //MAIN
     gotSpeech =()=> {
      if(speechRec.resultValue){
        clearTimeout(timeoutID);
        speechString = speechRec.resultString;
        timeoutID = setTimeout(() => {
          var command = getCommand(validateCommand(speechString));
          console.log("hullo",command);
          console.log(this._ctx.executor.invoke);
          console.log(this._ctx.executor._worker);
          if(command){
          var msg = JSON.stringify({
            cmd: 'invoke',
            id: id,
            args: [command]
          });

          this._ctx.executor._worker.postMessage(msg);
        };

          // this._ctx.executor.invoke(
          //   id, // callback id, passed to the method
          //   [command]
          // );
        }, 1400);
      }
    }

    var timeoutID;
    var speechString = "";

    var lang = 'en-IN';
    var speechRec = new p5.SpeechRec(lang ,gotSpeech);
    var continuous = true;
    var interim = true;
    speechRec.start(continuous, interim);

  }

}

var friends = [];
var pendingreq = [];
var parties=[];

class fbAuth extends Module{

  constructor(ctx){
    super('fbAuth');
    this._ctx = ctx;
    this.db = undefined;
    this.u = undefined;
    // this.someart = undefined;
    // this.userid = 452651015464681;    
    // this.userid = undefined;
    // console.log(ctx);
    this.firlibConfig = {
      apiKey: "AIzaSyDxUdsBOiWl41ASEHweGZdhdCZtXDvPOg8",
      authDomain: "vr-theatre.firlibapp.com",
      databaseURL: "https://vr-theatre.firlibio.com",
      projectId: "vr-theatre",
      storageBucket: "",
      messagingSenderId: "69732209271",
      appId: "1:69732209271:web:72b6bf3a671d3b8f43ec72"
    };

  }

  getUserid(){
    return this.userid;
  }

  fbsetup(id){

   window.fbAsyncInit = () => {
    FB.init({
      appId      : '1139153696273726',
      cookie     : true,
      xfbml      : true,
      version    : 'v4.0'
    });
      
    FB.AppEvents.logPageView();   

    
    FB.getLoginStatus((response) => {
      console.log("check status",response.status);
      if (response.status == 'connected'){  
        FB.api(
          response.authResponse.userID,
          (response) => {
            if (response && !response.error) {
              // console.log("here",data);
              console.log("hi theeee",response);
              this.userid = response.id;
              this.controller(this.firlibConfig,response.id)
        
              this._ctx.invokeCallback(
                id, // callback id, passed to the method
                [true,response.id]
              );
            }
          }
      );
      }
      else{
        this._ctx.invokeCallback(
          id, // callback id, passed to the method
          [false]
        );
      }
    });
  };


  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

}

controller = (config, uid) => {
  firebase.initializeApp(config);
  this.db = firebase.firestore();
  this.u = uid;
  console.log("firebase domeel");
}

register= (name,profilepic)=>{
  return new Promise((res,rej)=>{
      console.log("in there",this.u,name,profilepic,this.db);
       this.db.collection("users").doc(this.u).set({
          name,profilepic
      }).then(()=>{
          res(true);
      });
  });
};

filter(arr,friends) {
  return arr.filter((x) => {
   if(x.friends===friends){
       return true;
   }
   })
};

$addFriend(f) {
  return new Promise((res, rej) => {
      this.db.collection("friends").doc().set({
          uid: this.u,
          fuid: f,
          status: false
      }).then(() => {
          res("Friend added successfully");
      }).catch((err) => rej(err));
  })
}

getFriends(flag,callbackid){
  console.log("umbru2");
  var switcher = false;
  let counter = 0;
  this.db.collection("friends").where("uid", "==", this.u)
      .onSnapshot( (querySnapshot) => {
          switcher = true;
          console.log("achaaa:");
          if(querySnapshot.docs.length==0){
            console.log("query0");
            console.log("counter:",counter);
            if(counter == 1 || flag){
              this._ctx.invokeCallback(
                callbackid,
                [[]]
              );
              return ;
            }
            else{
              counter++;
            }
          }
          if(counter == 1 || flag){
            querySnapshot.docs.forEach( (doc, i,arr) => {
              let requestStatus=doc.data().status;
              this.db.collection("users").doc(doc.data().fuid).onSnapshot((docs) => {
                  friends = friends.filter(x => {
                      return x[1] != docs.id
                  }) || [];
                  let payload=docs.data();
                  payload.status=requestStatus;
                  friends.push([payload, docs.id]);
                  console.log("switcher:",switcher);
                  console.log(querySnapshot.docs.length,i);
                  console.log("hittt",!switcher);
                  console.log(!switcher);
                  if (!switcher){
                    console.log("gumahuma1")
                      this._ctx.invokeCallback(
                        callbackid,
                        [friends]
                      )
                      console.log("called gummahuma1")
                  }
                      // callback(friends);
                  if (switcher) {
                      if (arr.length == i+1) {
                        console.log("guma2");
                          this._ctx.invokeCallback(
                            callbackid,
                            [friends]
                          );
                          // callback(friends);
                          switcher = false;
                          console.log("called gummahuma2")

                      }
                  }
              });

          });
          }
          else{counter++;}
          
      });
}


search(frname,page,callbackid){
  this.db.collection("users").where("name","==",frname).limit(5*page).get().then((snap)=>{
      var myarr=[];
      snap.forEach((doc)=>{
        let payload=doc.data();
        payload.uid=doc.id;
          myarr.push(payload);
      });
      myarr.slice(page*5-4,page*5+1);
      this._ctx.invokeCallback(
        callbackid,
        [myarr]
      )
      // callback(myarr);  
  });
}

$acceptFriendreq(friend){
  return new Promise((res, rej) => {
      this.db.collection("friends").where("uid", "==", this.u).where("fuid", "==",friend).get().then((docs) => {
          docs.forEach((docr) => {
              this.db.collection("friends").doc(docr.id).update({
                  status: true
              }).then(() => {
                  res(true);
              }).catch((err) => {
                  rej(err);
              })
          })
      })
  })
}

fbAuthenticate(fbid){
  // let id = 452651015464681
  // console.log(this.someart)
  FB.login((response) => {
    if (response.status === 'connected') {
      console.log("login hit");
      FB.api(
        response.authResponse.userID,
        (response) => {
          if (response && !response.error) {
            console.log("hi theeee",response.name,response.id);// code here
            userid = response.id;
            this.controller(this.firlibConfig,response.id);
            console.log("after init");
            // console.log(fireregister);
            this.register(response.name,"http://graph.facebook.com/"+response.id+"/picture?type=large&width=720&height=720").then(data =>{
              if(data){
              console.log("registered:",response.id);
              this._ctx.invokeCallback(
                fbid, // callback id, passed to the method
                [true,response.id ]
              );
            }
            })
          }
        }
      );

      console.log(response.authResponse);
     } 
     else {
       // The person is not logged into your webpage or we are unable to tell. 
       this._ctx.invokeCallback(
        fbid, // callback id, passed to the method
        [false]
      );
     }
   });
}
}


//audio module
class peerAudioModule extends Module {
  constructor(ctx) {
    super('peerAudioModule')
    this._ctx = ctx;
    // console.log(ctx);
  }

  kandavel(id){
    // console.log("ctx:",ctx);
    // console.log("this._ctx...........",this._ctx)
    // console.log("aids of mohan:",id);
    this._ctx.invokeCallback(
      id, // callback id, passed to the method
      [50]
    );
    // callback();
  }

  socketControll(event){
    if(event.status == "ready"){
      socket.emit("controls", {
        action: "seek",
        id: socket.id,
        room,
        currentTime: event.position
    });
    }
    else if(event.status == "paused"){
      socket.emit("controls", {
        action: "pause",
        id: socket.id,
        room,
        currentTime: event.position
    });
    }
    else if(event.status == "playing"){
      socket.emit("controls", {
        action: "play",
        id: socket.id,
        room,
        currentTime: event.position
    });
    }
  }

  socketPause(id){
    console.log("huo",id)
    socket.on("controlUpdate", (obj) => {
      // this._ctx.invokeCallback(
      //   manoverid, // callback id, passed to the method
      //   []
      // );
      if (obj.id === socket.id)
          return;
      console.log(obj);
      if (obj.action === "play") {
        // console.log("play triggered")
        this._ctx.invokeCallback(
          id, // callback id, passed to the method
          ["play",obj.currentTime]
        );
      } 
      if (obj.action === "pause") {
          // this._ctx.invokeCallback(
          //   seekid, // callback id, passed to the method
          //   [obj.currentTime]
          // );
          this._ctx.invokeCallback(
            id, // callback id, passed to the method
            ["pause"]
          );
          // vid.pause();
      }
      if (obj.action === "seek") {
          // vid.currentTime = obj.seektime;
          this._ctx.invokeCallback(
            id, // callback id, passed to the method
            ["seek",obj.currentTime]
          );
      }
  });
  }

  // socketPlay(playid){
  //   socket.on("controlUpdate", (obj) => {
      
  //     if (obj.id === socket.id)
  //         return;
  //     console.log(obj);
  //     if (obj.action === "play") {
  //         this._ctx.invokeCallback(
  //           playid, // callback id, passed to the method
  //           [obj.currentTime]
  //         );
  //     }
  // });
  // }

  // socketSeek(seekid){
  //   socket.on("controlUpdate", (obj) => {
      
  //     if (obj.id === socket.id)
  //         return;
  //     console.log(obj);
  //     if (obj.action === "play") {
  //         this._ctx.invokeCallback(
  //          seekid, // callback id, passed to the method
  //           [obj.currentTime]
  //         );
  //       }
  //   });
  // }
  


  //  socket connection establish
  socketconnection() {
      socket = io.connect(url);

      function deletePeerData(peerid) {
        var index = -1;
        for (var i = 0; i < mypeers.length; i++) {
          if (mypeers[i].peerid === peerid)
            index = i;
        }
        if (index !== -1)
          mypeers.splice(index, 1);
      }

      socket.on("connect", () => {
          console.log("connected");
          socket.emit("joinRoom", room);

          console.log("Server:controls");

          socket.on("roomJoinSuccess", () => {
            console.log("Room joined");
            var peer = new Peer({
              host: 'peerjs-server-api.herokuapp.com',
              path:'/peer',
              secure: true,
              port: 443,
              config: {
                'iceServers': [{
                  url: 'stun:stun1.l.google.com:19302'
                }]
              }
            });

            peer.on("connection", (c) => {
              // sel("#conn").innerHTML += c.peer + ",";

              //PUSH CONN TO CONN LIST FINALLY
              deletePeerData(c.peer);
              mypeers.push(c);
              console.log(c);
              console.log("pushed");
              c.on('data', function (data) {
                console.log("hit");
                // inject(newchip(`Peer message, ${data}`));
              });
              callPeer(c.peer);
            });

            peer.on('open', (id) => {
              console.log("id generated");
              peer.id = id;
              // sel(".head").innerHTML = id;
              socket.emit('signal', {
                peerid: peer.id
              });
            });

            function callPeer(id) {
              console.log(id + "call");
              var call;
              navigator.mediaDevices.getUserMedia({
                audio: true,
              }).then((stream) => {
                call = peer.call(id, stream);
                call.on('stream', (stream) => {
                  console.log("received stream answered");
                  // var audio = document.createElement("audio");
                  var audio = new Audio();
                  audio.srcObject = stream;
                  // audio.style.display = "none";
                  // sel("#wrapper").appendChild(audio);
                  audio.play();
                  // let b = new Audio();
                  // b.muted = true;
                  // b.srcObject = stream;

                  // var peerInput = context.createMediaStreamSource(
                  //     stream);
                  // console.log("connecting to dest");
                  // peerInput.connect(context.destination);
                });
              })
            }
            peer.on('call', function (call) {
              // inject(newchip("call received"));
              navigator.mediaDevices.getUserMedia({
                audio: true,
              }).then((stream) => {
                call.answer(stream);
                call.on('stream', function (stream) {
                  console.log("received stream");
                  var audio = new Audio();
                  // var audio = document.createElement("audio");
                  audio.srcObject = stream;
                  // audio.style.display = "none";
                  // sel("#wrapper").appendChild(audio);
                  audio.play();
                  // let a = new Audio();
                  // a.muted = true;
                  // a.srcObject = stream;
                  // var peerInput = context
                  //     .createMediaStreamSource(
                  //         stream);
                  // console.log("connecting to dest");
                  // peerInput.connect(context.destination);
                  // inject(newchip("Done"));
                });
              });
            });
            peer.on('data', function (data) {
              console.log("hittedma");
              // inject(newchip(`! Peer message, ${data}`));
            });
            socket.on("signal", (d) => {
              console.log(d + "signalled");
              if (d.peerid == peer.id) {
                console.log("hit oops");
                return;
              }
              var conn = peer.connect(d.peerid, {
                reliable: true
              });
              console.log("peer added");
              conn.on('open', function () {
                console.log("connectedtopeer");
                console.log(conn);
                mypeers.push(conn);
                console.log("pushed to no of peers");
                // sel("#conn").innerHTML += conn.peer + ",";
                conn.on('data', function (data) {
                  console.log("hittedma");
                  // inject(newchip(`Peer message, ${data}`));
                });
              });
            });
          })

        })
      }





        //  peer logic
        // videostatus(status){
        //   if(status === 'playing'){

        //   }
        //   else if(status === 'loading'){

        //   }
        //   else if()
        // }

        stream() {
          navigator.mediaDevices.getUserMedia({
            audio: true,
          }).then((stream) => {
            window.stream = stream;
          });
          console.log(new Audio());
          console.log("loaded...")
        }


      }

      window.React360 = {
        init
      };