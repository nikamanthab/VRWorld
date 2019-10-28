// This file contains the boilerplate to execute your React app.
// If you want to modify your application's content, start in "index.js"

const url = "peerjs-server-api.herokuapp.com";
// const url = "192.168.0.103:3000";
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
  mainSurface.resize(1200, 720)
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
  r360.compositor.setBackground(r360.getAssetURL('milky2.jpg'));
}

// var socket;
// var mypeers = [];
var room = "room";
var gate = true;
var manover = false;
var seeked = false;

//speech recognition
class speechRecognition extends Module{
  constructor(ctx){
    super('speechRecognition')
    this._ctx = ctx;
    this.speechRec = null;
    // console.log(ctx);

  }
   

  main(id){
    //UTIL
     
    //MAIN
     gotSpeech =()=> {
      if(this.speechRec.resultValue){
        clearTimeout(timeoutID);
        speechString = this.speechRec.resultString;
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
    this.speechRec = new p5.SpeechRec(lang ,gotSpeech);
    var continuous = true;
    var interim = true;
    this.speechRec.start(continuous, interim);
    console.log("speechrec",this.speechRec)

  }

  stopMic(){
    this.speechRec.continuous = false;
    console.log("after",this.speechRec);
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
    this.username = "";
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

  getColdStatus(uid,callbackid){
    console.log("uid received",uid)
      this.db.collection("users").doc(uid).get().then((sn)=>{
        console.log(sn.data(),"EE");
        let d = sn.data().isCold;
        console.log(d);
        this._ctx.invokeCallback(
          callbackid, // callback id, passed to the method
          [d]
        );

      });
  
     
    
  }

  firstBoot(categories, uid,callid) {
    const col = this.db.collection('movies');
    this.db.collection("users").doc(uid).update({isCold:false});
    categories.forEach((x, j) => {
      let query = col.where('categories', 'array-contains', x);
      query.get().then((qs) => {
        qs.forEach((docr) => {
          let id = docr.id;
          this.db.collection("ratings").doc(uid + id).set({
            rating: "5",
            movieid:id,
            uid
          },{merge:true})
          
        });
        this._ctx.invokeCallback(
          callid, // callback id, passed to the method
          [false]
        );
      })
   
    });
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
              // this.username = response.name;
              this.username = response.name.toLowerCase().replace(/\s+/,"");
              this.controller(this.firlibConfig,response.id)
              


              this._ctx.invokeCallback(
                id, // callback id, passed to the method
                [true,response.id,this.username]
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
      this.db.collection("users").doc(this.u).get().then((sn)=>{
        if(sn.data()==undefined){
          console.log("int ");
          this.db.collection("users").doc(this.u).set({
            name,profilepic,onlineStatus:true,isCold:true
        }).then(()=>{
            res(true);
        });
        }else{
          this.db.collection("users").doc(this.u).set({
            name,profilepic,onlineStatus:true,isCold:false
        }).then(()=>{
            res(true);
        });
          
        }
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
  var switcher = false;
  let counter = 0;
  this.db.collection("friends").where("fuid", "==", this.u)
      .onSnapshot( (querySnapshot) => {
          switcher = true;
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
              this.db.collection("users").doc(doc.data().uid).onSnapshot((docs) => {
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
                      this._ctx.invokeCallback(
                        callbackid,
                        [friends]
                      )
                  }
                      // callback(friends);
                  if (switcher) {
                      if (arr.length == i+1) {
                          this._ctx.invokeCallback(
                            callbackid,
                            [friends]
                          );
                          // callback(friends);
                          switcher = false;
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

rateMovie(uid, movieid, rating){
     this.db.collection("ratings").doc(uid + movieid).set({
      movieid,
      rating,
      uid
    }, {
      merge: true
    }).then(() => {
      console.log("Added")
    }).catch(() => {
      console.log("Exit")
    });

}


$acceptFriendreq(friend){
  return new Promise((res, rej) => {
      this.db.collection("friends").where("fuid", "==", this.u).where("uid", "==",friend).get().then((docs) => {
          docs.forEach((docr) => {
              this.db.collection("friends").doc(docr.id).update({
                  status: true
              }).then(() => {
                this.db.collection("friends").doc().set({uid:this.u,status:true,fuid:friend});
                res(true);
              }).catch((err) => {
                  rej(err);
              })
          })
      })
  })
}

getMovies(callbackid){
    this.db.collection("movies").get().then((qs)=>{
      let arr=[];
      qs.forEach((doc)=>{
        let payload={};
        payload.id=doc.id;
          arr.push(Object.assign(doc.data(),payload));
      });
      this._ctx.invokeCallback(
        callbackid,
        [arr]
      )
    }).catch((err)=>rej(err));
}
createWatchParty(arr,movieid,friends,moviename,photo){
     console.log("atwatch",photo);
     this.db.collection("watchparty").doc(this.u+movieid).set({movieid,invited:arr,initiator:this.u,friends,name:this.username,moviename,photo}).then(()=>{
     })

}

filter(arr,friends) {
  return arr.filter((x) => {
   if(x.friends===friends){
       return true;
   }
   })
};

listenWatchParty(bobo,friends,callbackid){
  let counter = 0;
  this.db.collection("watchparty").where("invited", "array-contains",this.u).onSnapshot((snapshot)=>{
         snapshot.forEach((doc)=>{
             parties.push(doc.data());
         });
         if(counter == 1 || bobo){
          if(friends){
            this._ctx.invokeCallback(
              callbackid,
              [this.filter(parties,true)]
            )
           // callback(filter(parties,true));
          }else{
           this._ctx.invokeCallback(
             callbackid,
             [this.filter(parties,false)]
           )
           //  callback(filter(parties,false));
          }
         }
         else{counter++;}
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
            userid = response.id;
            // this.username= response.name;
            this.controller(this.firlibConfig,response.id);
            // console.log(fireregister);
            let resname=response.name.toLowerCase().replace(/\s+/,"");
            this.username = resname;
            this.register(resname,"http://graph.facebook.com/"+response.id+"/picture?type=large&width=720&height=720").then(data =>{
              if(data){
              console.log("registered:",response.id);
              this._ctx.invokeCallback(
                fbid, // callback id, passed to the method
                [true,response.id,resname ]
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
    this.socket = {};
    this.mypeers = [];
    this.callStreams = [];
    this.peerx ={};
    this.room = "";
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
      this.socket.emit("controls", {
        action: "seek",
        id: this.socket.id,
        room: this.room,
        currentTime: event.position
    });
    }
    else if(event.status == "paused"){
      this.socket.emit("controls", {
        action: "pause",
        id: this.socket.id,
        room: this.room,
        currentTime: event.position
    });
    }
    else if(event.status == "playing"){
      this.socket.emit("controls", {
        action: "play",
        id: this.socket.id,
        room:this.room,
        currentTime: event.position
    });
      console.log("ememited playing");
    }
  }

  socketPause(id){
    this.socket.on("controlUpdate", (obj) => {
      // this._ctx.invokeCallback(
      //   manoverid, // callback id, passed to the method
      //   []
      // );
      console.log("In socket")
      if (obj.id === this.socket.id)
          return;
      if (obj.action === "play") {
        console.log("play triggered")
        this._ctx.invokeCallback(
          id, // callback id, passed to the method
          ["play",obj.currentTime]
        );
      } 
      if (obj.action === "pause") {
          console.log("pause triggered")
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
  socketemit(word,data){
    if(word == "joinRoom" && this.socket.firstVisit){
      console.log("wrong-place",this.socket.listeners("roomJoinSuccess"));

      this.socket.removeEventListener("controlUpdate");
      this.socket.removeEventListener("signal");
      this.socket.removeEventListener("newLeaving");
      // this.socket.on("roomJoinSucess", () => this.roomJoinLogic());
      console.log("wrongplace",this.socket.listeners("roomJoinSuccess"),this.socket);
    }
    console.log("check",this.roomJoinLogic);
    this.room=data;
    return this.socket.emit(word,data);
  }


  ///
  
  deletePeerData(peerid, mypeers) {
    console.log(peerid,mypeers.filter(x => x.peer != peerid),"checkyu");
    return mypeers.filter(x => x.peer != peerid);
  }
  //  socket connection establish
  socketconnection(uid) {
      this.socket = io.connect(url);

    //   function deletePeerData(peerid, mypeers) {
    //     console.log(peerid,mypeers.filter(x => x.peer != peerid),"checkyu");
    //     return mypeers.filter(x => x.peer != peerid);
    // }

      this.socket.on("connect", () => {
          console.log("connected");
          this.socketemit("onlineStatus",uid)
          // this.socket.emit("joinRoom", room);
          // this.socketemit("joinRoom",room);
          this.socket.on("onlineStatus",(uid)=>{
            console.log("domeel domeeel",uid);
          })

          this.socket.on("roomJoinSuccess", () => {
            if(!(this.socket.firstVisit)){
              this.socket.firstVisit=true;
            }
            console.log("Room joined");
            var peer = new Peer({
              // host:'192.168.0.103:3000',
              host: 'peerjs-server-api.herokuapp.com',
              path:'/peer',
              secure: true,
              port: 443,
              // port: 3000,
              config: {
                'iceServers': [{
                  url: 'stun:stun1.l.google.com:19302'
                }]
              }
            });
            this.peerx = peer;
            console.log("peerx:",peer) 
        
            peer.on("connection", (c) => {
              // sel("#conn").innerHTML += c.peer + ",";
        
              //PUSH CONN TO CONN LIST FINALLY
              this.mypeers=this.deletePeerData(c.peer,this.mypeers);
              this.mypeers.push(c);
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
              this.socket.emit('signal', {
                peerid: peer.id
              });
            });
        
              callPeer = (id) => {
              console.log(id + "call");
              var call;
              navigator.mediaDevices.getUserMedia({
                audio: true,
              }).then((stream) => {
                this.callStreams.push(stream);
                call = peer.call(id, stream);
                var callpeer = this.mypeers.filter(x => x.peer == call.peer)[0];
                if (callpeer) {
                    callpeer.call = call;
                }
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
            peer.on('call', (call) => {
              // inject(newchip("call received"));
              var callpeer = this.mypeers.filter(x => x.peer == call.peer)[0];
              if (callpeer) {
                          callpeer.call = call;
                  }
              navigator.mediaDevices.getUserMedia({
                audio: true,
              }).then((stream) => {
                this.callStreams.push(stream);
                console.log("mystreamsIT",this.callStreams);
                call.answer(stream);
                call.on('stream', function (stream) {
                  console.log("received stream");
                  var audio = new Audio();
                  audio.srcObject = stream;
                  audio.play();
                });
              });
            });
            peer.on('data', function (data) {
              // inject(newchip(`! Peer message, ${data}`));
            });
            this.socket.on("signal", (d) => {
              console.log(d + "signalled");
              if (d.peerid == peer.id) {
                console.log("hit oops");
                return;
              }
              var conn = peer.connect(d.peerid, {
                reliable: true
              });
              console.log("peer added");
              conn.on('open', () => {
                console.log("connectedtopeer");
                console.log(conn);
                this.mypeers.push(conn);
                console.log("pushed to no of peers");
                // sel("#conn").innerHTML += conn.peer + ",";
                conn.on('data', function (data) {
                  // inject(newchip(`Peer message, ${data}`));
                });
              });
            });
        
            this.socket.on('newLeaving', (data) => {
              if(this.mypeers.find(x=>x.peer==data.leftPeerid))
              {
              this.mypeers.filter(x =>{return x.peer == data.leftPeerid})[0].call.close();
              this.mypeers=this.deletePeerData(data.leftPeerid, this.mypeers);
              console.log("deletepeers",this.mypeers)
              }
              console.log(`${data.leftPeerid} LEFT THE ROOM`);                      
            });
          } )

        })
      }
      sockLeave(){
        console.log("mystreams",this.callStreams);
      console.log("mypeers",this.mypeers);
        this.mypeers.forEach(x => {
          x.call.close();
          x.close();
      });
      
      this.callStreams.forEach(micstream => {
          micstream.getTracks().forEach(x => x.stop());
      });
      console.log("mypeers1",this.mypeers);
      console.log("mystreams1",this.callStreams,this.peerx);
      this.socket.emit('leaving', {
          peerid: this.peerx.id
      });
      console.log("mystreams12",this.peerx);
      this.peerx.destroy();
      this.mypeers=[];
      this.callStreams=[];
      }


      }

      window.React360 = {
        init
      };