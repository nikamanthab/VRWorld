
/*
PLAY
PAUSE 
GO 		TO 	 time.	time.
VOLUME 	UP
		DOWN
*/

class TrieNode {
	constructor(string, homophones){
		this.string = string;
		this.homophones = homophones;
		this.children = [];
		this.end = false;
	}
}

var trieroot = new TrieNode("*",[]);
//LAYER 1
var play = new TrieNode("play",["play", "they", "way", "say", "pay", "pray", "away"]);
play.end = true;
var pause = new TrieNode("pause",["pause", "boss","horse","pass","laws", "claws", "paws", "flaws", "paus", "shaws", "was", "cause"]);
pause.end = true;
var go = new TrieNode("go", ["go", "hoe", "doe"])
var volume = new TrieNode("volume", ["volume", "toluene", "column", "solemn", "costume", "on whom", "washroom", "was room"]);
//APPEND LAYER 1
trieroot.children.push(play,pause,go,volume);
//LAYER 2
var to = new TrieNode("to", ["to", "tu", "too", "two", "2", "do", "doo", "boo"]);
var up = new TrieNode("up", ["up", "cup", "sup", "pup", "yup", "upp", "supp", "krupp", "dupp", "rupp"]);
up.end = true;
var down = new TrieNode("down", ["down", "town", "around", "brown", "crown", "crowne", "noun", "frown", "clown", "drown"]);
down.end = true;
//APPEND LAYER 2
go.children.push(to);
volume.children.push(up,down);
//LAYER 3
var time = new TrieNode("NUM", ["1","2","3","4","5","6","7","8","9","0","."]);
time.end = true;
//APPEND LAYER 3
to.children.push(time);



//RETURN FILTERED COMMAND FROM SPEECH
export const validateCommand =(string) => {
	var speechList = string.toLowerCase().split(" ");
	if(speechList.length > 4){ return false; }
	else {
		var curChildren = trieroot.children;
		var temp = [];
		for(var i =  0; i< speechList.length ; i++){
			if( i > 1){ //IN NUMBERS
				for(var k = i; k < speechList.length; k++){
					if(!isNaN(speechList[k])){
						if(k == 2){
                            temp.push(speechList[k]);
                        }else {
                            temp[2] = temp[2].concat(speechList[k]);
                        }
					}else {
						if(k === 2){ return false;}
						else{
							return temp;
						}
					}
				}
				return temp;
			}
			else{ //IN WORDS
				var flag = false;
				for(var j = 0; j< curChildren.length ; j++){
					if(curChildren[j].homophones.indexOf(speechList[i])!== -1){
						flag = true;
						temp.push(curChildren[j].string);
						if(curChildren[j].end){
							return temp;
						}else{
							curChildren = curChildren[j].children;
						}
					}
				}
				if(!flag){
					return false;
				}
			}
		};
        return false;
	}
}

//GET COMMAND
export const getCommand = (commandList) =>{
    if(commandList[0] === "play" || commandList[0] === "pause"){
        return commandList[0];
    }
    else if(commandList[0] === "volume"){
        if(commandList[1] === "up") {return "v+"}
        else { return "v-" }
    }
    else if(commandList[0] === "go"){
        timeStamp = commandList[2];
        timeStampArr = timeStamp.split(".");
        if(timeStampArr.length === 1) {return parseInt(timeStampArr[0]);}
        else{return (parseInt(timeStampArr[0])*60)+(parseInt(timeStampArr[1]));}
    }
}

