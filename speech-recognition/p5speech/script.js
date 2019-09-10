//IMPORTING
// validateCommand
// getCommand

//UTIL
function createPassage (string) {
	speechParagraph.innerText = string;
}

//MAIN
function gotSpeech () {
	if(speechRec.resultValue){
		clearTimeout(timeoutID);
		speechString = speechRec.resultString;
		timeoutID = setTimeout(function () {
			console.log(getCommand(validateCommand(speechString)));
			createPassage(speechString);
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

/*
go 245 ['go' , '245'] -LAST
*/