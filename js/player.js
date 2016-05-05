var interval = 0.2;
var textAudio = "";
var isAdMuted = false;

// READ TEXT FROM FILE TO 'str' //

//var str = "";
//var audioList = JSON.parse(str).audio;
var audioList;
var audioPlaying = false;

/*var audioList = [ 
	{"file":"A.wav", "start":2, "end":6}, 
	{"file":"B.wav", "start":10, "end":16}, 
	{"file":"C.wav", "start":20, "end":24} 
];*/

var vidPlayer = document.getElementById("vid1");
var audPlayer = document.getElementById("aud1");

vidPlayer.addEventListener("seeked", function() {
	audPlayer.pause();
}, true);
vidPlayer.addEventListener("volumechange", function() {
	if(!isAdMuted) audPlayer.volume = vidPlayer.volume;
}, true);



var timer = setInterval(function() {

	if (!isPlaying(vidPlayer)) {
		audPlayer.pause();
		return;
	}

	if(audioList != undefined){

		var curVidTime = vidPlayer.currentTime;
		
		var aIdx = -1;
		for (aIdx = 0; aIdx < audioList.length; aIdx++) {
			st = audioList[aIdx].start;
			en = audioList[aIdx].end;
			if (st <= curVidTime && curVidTime <= en)
				break;
		}

		// NO AUDIO DESC NOW
		if (aIdx == -1) {
			audPlayer.pause();
			audPlayer.src = "";
			return;
		}
		var curAud = audioList[aIdx];

		//  
		var source = audPlayer.src.split('/');
		if(curAud !== undefined){
			if (source[source.length - 1] === curAud.file.split('/')[1]) {console.log('hi');

				if (!isPlaying(audPlayer) || Math.abs(curVidTime - curAud.start - audPlayer.currentTime) > interval) {
					audPlayer.pause();
					audPlayer.currentTime = curVidTime - curAud.start;
					audPlayer.play();
				}
			}
			else {
				audPlayer.pause();
				audPlayer.src = curAud.file;
				audPlayer.currentTime = curVidTime - curAud.start;
				audPlayer.play();
			}
		}
	}

}, interval * 1000);

function isPlaying(media) {
	return !!(media.currentTime > 0 && !media.ended && !media.paused && media.readyState > 2);
}

function uploadAudioDescription(){

	var files = document.getElementById('audio-des').files;
	console.log(files);
    if (!files.length) {
      alert('Please select a file!');
    }

	var file = files[0];
	var start = 0;
	var stop = file.size - 1;

	var reader = new FileReader();

	// If we use onloadend, we need to check the readyState.
	reader.onloadend = function(evt) {
	  if (evt.target.readyState == FileReader.DONE) { // DONE == 2
	  	textAudio = evt.target.result + "";
	  }
	};

	var blob = file.slice(start, stop + 1);
	reader.readAsBinaryString(blob);
}

function setAudioDescription(){
	if(textAudio != ""){
		var cutText = textAudio.split('{"audio"')[1];
		textAudio = '{"audio"' + cutText;
		audioList = JSON.parse(textAudio).audio;
	}
	vidPlayer.play();
}

function muteAudioDescription(){
	document.getElementById('mute').style.display = 'none';
	document.getElementById('unmute').style.display = 'block';
	isAdMuted = true;
	audPlayer.volume = 0;
}

function unmuteAudioDescription(){
	document.getElementById('mute').style.display = 'block';
	document.getElementById('unmute').style.display = 'none';
	isAdMuted = false;
	audPlayer.volume = vidPlayer.volume;
}