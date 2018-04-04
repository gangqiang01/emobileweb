var CommandSelected = []; //two dimension array [CommandNumber, CommandTitle, DeviceSelected, CommandComm;;;CommandParam, LogCommandComm, LogCommandContent, CommandFrom , (selected true/false)]
$(function() {
	LoginStatus("UserDuedateCheck","profile.html"); 
	SetHTML("barset_schedule");
});
function SetCommand(sub){
	document.getElementById("AlertMsgEvent").innerHTML = '<i class="fa fa-tags" aria-hidden="true" style="color:#428bca;padding-right:5px;"></i>Devices selected:<br><input type="text" id="devicetag" />';
	var AllDevicesID = "";
	$('#devicetag').tagsinput({
		tagClass: function(item) {
			return 'label label-primary';
		},
		itemValue: 'value',
		itemText: 'text',
		tagChar: 'o',
	});
	
	if(DevicesSelected.length === 0){
		var Title = "Error Message!"
		var MsgBody = "Please select devices before adding command";
		SetAlertMsgInnerHTML(Title, MsgBody);
		document.getElementById("AlertMsgEvent").style.display = "none";
		document.getElementById("AlertMsgBtn").style.display = "none";
		return false;
	}else{
		for (var i = 0; i < DevicesSelected.length; i++) {
			var name = GetDevicesName(DevicesSelected[i]);
			$('#devicetag').tagsinput('add', { "value": DevicesSelected[i] , "text": name});
			
			
		}
		$('.bootstrap-tagsinput').find('.tag').removeClass('tag');
		document.getElementById("AlertMsgEvent").style.display = "";
		document.getElementById("devicetag").disabled = true;
		
		SetCommandItem(sub, "schedule");		
		 
		 return false;
	}
	
		
	
		

		

}


function GetDevicesName(id){
	console.log(ArrayDevice);
	for(var i=0;i<Object.keys(ArrayDevice).length;i++){
		if(ArrayDevice[i][0] === id){
			if(ArrayDevice[i][1] === "-"){
				return id;
			}else{
				return ArrayDevice[i][1];
			}
		}
			
	}
	return id;
}

function GetCommandNumber(command){
	for(var i=0;i<Object.keys(AllCommand).length;i++){
		if(AllCommand[i][1] === command)
			return AllCommand[i][0];
	}	
	return false;	
}

function SliderShow(){
	// Without JQuery
	var slider = new Slider('#ex1', {
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
}