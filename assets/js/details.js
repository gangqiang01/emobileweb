var tconfig;
var myObj = "";
//onload page
$(function() {
	LoginStatus("UserDuedateCheck","details.html"); 
	
	
});
var company = localStorage.getItem("Company");	var type="";
if(company === "Guest"){
	type = "assets/json/lite.txt";
}else{
	type = "assets/json/pro.txt";
}
function setup() {
	//load json file (path: assets/json/)
	loadJSON(type, drawData);
}
var myObj = "";
function drawData(data) {
	myObj = data;
	SetHTML("barset_management");
	
	//$("#appFilter").html(filter).selectpicker('refresh');
	var filter = [];
	
	
}
var selectedDeviceId;
function GetDeivceDetails(deviceid){
	selectedDeviceId = deviceid;
	SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;1;;;2000;;;10;;;10", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;1;;;2000;;;10;;;10", "1;;;2000;;;10;;;10", "system");	
	
	var sub = "GetDeviceDetails"; var postdata = {submit: sub};
	var company = localStorage.getItem("Company");
	var name = getCookie('UserName');
	postdata = {
		company: company,
		name: name,
		deviceid: deviceid,
		submit: sub
	}
	$.post("/golang",
	postdata,
	function(data,status){
		SendByGolang(deviceid+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;requireStopAPP;;;1;;;2000;;;10", GetCommand(27, "CommTitle"), "Stop", "system");	
	});
	
	SendByGolang(deviceid+"/", GetCommand(97, "Comm")+"@%@"+GetCommand(97, "Path")+"@%@;;;"+GetCommand(97, "Param"), GetCommand(27, "CommTitle"), "", "system");	
	
	
	// device management
	
	$('.btnFunction').change(function() {
		console.log('Toggle: ' + $(this).prop('checked'));
		var type = $(this,'.btnFunction').attr('value');var numCommandEnable;var numCommandDisable;
		switch(type) {
			case "wifi":
				numCommandEnable = 56;numCommandDisable = 57;
				break;
			case "bluetooth":
				numCommandEnable = 54;numCommandDisable = 55;
				break;
			case "nfc":
				numCommandEnable = 83;numCommandDisable = 84;
				break;
			case "airplane":
				numCommandEnable = 44;numCommandDisable = 45;
				break;
			case "location":
				numCommandEnable = 69;numCommandDisable = 70;
				break;
			case "mobiledata":
				numCommandEnable = 87;numCommandDisable = 88;
				break;
			case "developer":
				numCommandEnable = 73;numCommandDisable = 74;
				break;
			case "unknownsource":
				numCommandEnable = 71;numCommandDisable = 72;
				break;
			default:
				break;
		}
		var checked;
		checked = $(this).prop('checked');
		if(checked){
			SendByGolang(selectedDeviceId+"/", GetCommand(numCommandEnable, "Comm")+"@%@"+GetCommand(numCommandEnable, "Path")+"@%@;;;"+GetCommand(numCommandEnable, "Param"), GetCommand(numCommandEnable, "CommTitle"), checked, "user");
		}else{
			SendByGolang(selectedDeviceId+"/", GetCommand(numCommandDisable, "Comm")+"@%@"+GetCommand(numCommandDisable, "Path")+"@%@;;;"+GetCommand(numCommandDisable, "Param"), GetCommand(numCommandDisable, "CommTitle"), checked, "user");
		}
      
    })
}
function PackagesNameReceived(){
	var options = {
	  valueNames: [ 'name', 'born', 'type' ]
	};

	var userList = new List('app', options);
	$('#appFilter').on('changed.bs.select', function (e) {
		var FilterList = $('#appFilter').val();
		userList.filter(function(item) {
			console.log(FilterList);
			if(jQuery.isEmptyObject(FilterList)){
				return true;
			}else{
				for(var i=0;i<FilterList.length;i++){
					if(FilterList[i] === "system"){
						if (item.values().type === "System app ") {
						   return true;
						} else {
						   return false;
						}
					}else if(FilterList[i] === "Third-party"){
						if (item.values().type === "Third-party ") {
						   return true;
						} else {
						   return false;
						}
					}
					return false;
				}
			}
			
			
		});
	});
}

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('%');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function GetDevicesId(data){
	var txtdevice = "";
	var getDevice = getUrlVars()["d"];
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === getDevice){
			txtdevice = '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>'+ txtdevice;
			GetDeivceDetails(data[i][0]);
		}else{
			txtdevice = txtdevice+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
		}
	}
	if(jQuery.isEmptyObject(getDevice)){
		txtdevice = '<option class="bs-title-option" value="">select device</option>'+ txtdevice;
	}
	$("#devId").html(txtdevice).selectpicker('refresh');
	$("#devId").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var selectedD = $(this).find('option').eq(clickedIndex).text();
		document.getElementById("AllPackage").innerHTML = '';
		GetDeivceDetails(ChangeNametoId(data, selectedD));
	});
}

function ChangeNametoId(data, name){
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][1] === name){
			return data[i][0];
		}
	}
	return false;
}

function SetAppList(AppName, AppPackageName, AppType){
	var AllBtn;
	if(AppType === "System app "){
		AllBtn = '<i value="'+AppPackageName+'" class="fa fa-hand-o-up fa-2x fa-btn AppLaunch" aria-hidden="true"></i>'+
						'<i class="fa fa-unlock-alt fa-2x fa-btn" aria-hidden="true"></i>';
	}else if(AppType === "Third-party "){
		AllBtn = '<i value="'+AppPackageName+'" class="fa fa-hand-o-up fa-2x fa-btn AppLaunch" aria-hidden="true"></i>'+
					'<i value="'+AppPackageName+'" class="fa fa-trash fa-2x fa-btn AppUninstall" aria-hidden="true"></i>'+
					'<i class="fa fa-unlock-alt fa-2x fa-btn" aria-hidden="true"></i>';
	}
	document.getElementById("AllPackage").innerHTML += 
		'<tr >'+
			'<td class="col-md-1 col-sm-3 col-xs-4">'+
				'<img src="assets/img/icon_apk.png" class="img-btn" align="left">'+
			'</td >'+
			'<td class="col-md-6 col-sm-9 col-xs-8">'+
				'<div class="media">'+
					'<div class="media-body">'+
						
						'<h4 class="title name">'+
							AppName+
						'</h4>'+
						'<div class="table-btn pull-right">'+
							AllBtn+
						'</div>'+
						'<p class="summary born">'+AppPackageName+'</p>'+
						
					'</div>'+
				'</div>'+
			'</td>'+
			'<td class="hide">'+
				'<p class="type">'+AppType+'</p>'+
			'</td >'+
		'</tr>';
		
	$(".AppLaunch").on("click", function(){
		var appid = $(this,".AppLaunch").attr('value');
		appid = appid.trim();
		
		//SendByGolang(selectedDeviceId+"/", GetCommand(75, "Comm")+"@%@"+GetCommand(75, "Path")+"@%@;;;"+GetCommand(75, "Param")+appid, GetCommand(75, "CommTitle"), appid, "user");	
		SendByGolang(selectedDeviceId+"/", GetCommand(10, "Comm")+"@%@"+appid+"@%@"+appid+".MainActivity", GetCommand(10, "CommTitle"), appid, "user");
		
	});
	$(".AppUninstall").on("click", function(){
		var appid = $(this,".AppUninstall").attr('value');
		appid = appid.trim();
		
		SendByGolang(selectedDeviceId+"/", GetCommand(86, "Comm")+"@%@"+GetCommand(86, "Path")+"@%@;;;"+GetCommand(86, "Param")+appid, GetCommand(86, "CommTitle"), appid, "user");			
		GetDeivceDetails(selectedDeviceId);
		document.getElementById("AllPackage").innerHTML = '';
	});
}

//Get Json command to myObj
//e.g. GetCommand(3,"CommTitle")
function GetCommand(number, title){
	var str = ""+number+""; 
	var dd = myObj[str];
	if(title === "CommTitle"){ 
		command = dd[0].CommTitle;
	}else if(title === "Enabled"){
		command = dd[1].Enabled;
	}else if(title === "Comm"){
		command = dd[2].Comm;
	}else if(title === "Param"){
		command = dd[3].Param;
	}else if(title === "Resultdelay"){
		command = dd[4].Resultdelay;
	}else if(title === "Path"){
		command = dd[5].Path;
	}else if(title === "Icon"){
		command = dd[6].Icon;
	}
	return command;
}