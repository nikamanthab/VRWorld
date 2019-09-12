import {validateCommand,getCommand} from './../../../speech-recognition/p5speech/trie';
// import p5 from './../../../speech-recognition/p5speech/p5/p5';

export const mainspeechlogic = (callbackfunc) => {
    //UTIL
    console.log("yyyyyyyyoooooooooooooo")
     
    //MAIN
     gotSpeech =()=> {
      if(speechRec.resultValue){
        clearTimeout(timeoutID);
        speechString = speechRec.resultString;
        timeoutID = setTimeout(() => {
          console.log("hullo",speechString);
          var command = getCommand(validateCommand(speechString));
        //   console.log(this._ctx.executor.invoke);
        //   console.log(this._ctx.executor._worker);

        callbackfunc(command);

        //   var msg = JSON.stringify({
        //     cmd: 'invoke',
        //     id: id,
        //     args: [command]
        //   });

        //   this._ctx.executor._worker.postMessage(msg);

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