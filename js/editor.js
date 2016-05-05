var listCurNum = 1;

$(document).ready(function(){
	addListener();
});

function addListener(){
	$('.time-input-m').change(function(){
		if($(this).val() > 59) $(this).val(59);
		else if($(this).val() < 0) $(this).val(0);
		else if($(this).val() == "") $(this).val(0);
	});
	$('.time-input-s').change(function(){
		if($(this).val() > 59) $(this).val(59);
		else if($(this).val() < 0) $(this).val(0);
		else if($(this).val() == "") $(this).val(0);
	});
	$('.time-input-h').change(function(){
		if($(this).val() > 10) $(this).val(10);
		else if($(this).val() < 0) $(this).val(0);
		else if($(this).val() == "") $(this).val(0);
	});
	$('#save-path').change(function () {
	    console.log($('#save-path').val());
	});
}

function addList(){
	listCurNum++;
	var text = 		'<div class="number" id="number-'+listCurNum+'">'+
						'<button onclick="deleteList('+listCurNum+');">delete</button>'+listCurNum+
					'</div>'+
					'<div class="file">'+
						'<label>File : </label>'+
						'<input type="file" id="file-'+listCurNum+'">'+
					'</div>'+
					'<div class="time">'+
						'<label> Start time : </label>'+
						'<input type="number" min="0" class="time-input time-input-h" id="h-'+listCurNum+'" value="0">: '+
						'<input type="number" min="0" class="time-input time-input-m" id="m-'+listCurNum+'" value="0">: '+
						'<input type="number" min="0" class="time-input time-input-s" id="s-'+listCurNum+'" value="0">'+
					'</div>'+
					'<div class="time">'+
						'<label> End time : </label>'+
						'<input type="number" min="0" class="time-input time-input-h" id="end-h-'+listCurNum+'" value="0">: '+
						'<input type="number" min="0" class="time-input time-input-m" id="end-m-'+listCurNum+'" value="0">: '+
						'<input type="number" min="0" class="time-input time-input-s" id="end-s-'+listCurNum+'" value="0">'+
					'</div><br><br>';

	var iDiv = document.createElement('div');
	iDiv.id = 'list-'+listCurNum;
	iDiv.className = 'list';
	iDiv.innerHTML = text;

	document.getElementById('list').appendChild(iDiv);
	addListener();
}

function deleteList(id){
	listCurNum--;
	document.getElementById('list-'+id).remove();

	var elements = document.getElementsByClassName('list'), 
	    length = elements.length;
	    console.log(length);

	var count = 0;
	while(count < length) {
		var curId = elements[count].id.split('-')[1];
		elements[count].id = 'list-'+(count+1);
		document.getElementById('number-'+curId).innerHTML = '<button onclick="deleteList('+(count+1)+');">delete</button>'+(count+1);
		document.getElementById('number-'+curId).id = 'number-'+(count+1);
		document.getElementById('file-'+curId).id = 'file-'+(count+1);
		document.getElementById('h-'+curId).id = 'h-'+(count+1);
		document.getElementById('m-'+curId).id = 'm-'+(count+1);
		document.getElementById('s-'+curId).id = 's-'+(count+1);
		document.getElementById('end-h-'+curId).id = 'end-h-'+(count+1);
		document.getElementById('end-m-'+curId).id = 'end-m-'+(count+1);
		document.getElementById('end-s-'+curId).id = 'end-s-'+(count+1);
	    count++;
	}
}

function exportToText() {
	//open tag

	var errorList = "";
	var text = 	'{'+
					'"audio" : [';


	var elements = document.getElementsByClassName('list'), 
	    length = elements.length;
	var count = 0;
	var insertNum = 0;

	while(count < length) {
		var curId = count+1
		var filepath = document.getElementById('file-'+curId).value.split('\\');
		var f = filepath[filepath.length-1];

		var h = parseInt(document.getElementById('h-'+curId).value);
		var m = parseInt(document.getElementById('m-'+curId).value);
		var s = parseInt(document.getElementById('s-'+curId).value);
		var startTime = (h*3600) + (m*60) + s;

		var eh = parseInt(document.getElementById('end-h-'+curId).value);
		var em = parseInt(document.getElementById('end-m-'+curId).value);
		var es = parseInt(document.getElementById('end-s-'+curId).value);
		var endTime = (eh*3600) + (em*60) + es;


		if(f !== "" && (h !== "" || m !== "" || s !== "") && (eh !== "" || em !== "" || es !== "")){

			if(endTime < startTime){
				errorList += "File Name : "+f+" ( end time ("+endTime+") < start time("+startTime+") )\n";
			}

			if(insertNum > 0) text += ",";
			text += 	'{' +
						'"file" : "audio/' + f + '",'+
						'"start" : ' + startTime + ',' +
						'"end" : ' + endTime +
					'}';
			insertNum++;
		}

	    count++;
	}

	//close tag
	text +=			']' +
				'}';
    
	if(errorList == "" && insertNum > 0){
	    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "audio_description.txt");
	}
	else if(insertNum == 0){
		alert("There is nothing to export");
	}
	else{
		alert("Error : \n"+errorList);
	}
}
