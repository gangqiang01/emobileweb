		
function SetCommandItem(sub,purpose) {
	var Title = ""+GetCommand(sub, "CommTitle")+":";
	var CommandTitltName = GetCommand(sub, "CommTitle");
	var AllDevicesID = "";
	switch (sub) {
		case 1:
			var MsgBody = 'Do you want to get all your devices?';
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}	
				if(purpose === "device-management"){
					
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "Comm"), "", "user");
					
						
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "Comm"), "", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
			};
			break;
		case 2:
			var MsgBody = 'Please Set Volume :<br>'+'<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="0" data-slider-max="300" data-slider-step="1" data-slider-value="0" style="display:none"/>';
			SetAlertMsgInnerHTML(Title, MsgBody);
			SliderShow();
			
			document.getElementById("ex1Slider").style.display = "";
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
					
				
				var value = document.getElementById("ex1").value;
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}	
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user");
					//NewSendByGolang(AllDevicesID, GetCommand(sub, "Comm"), "", value, GetCommand(sub, "Comm"), value, "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			};
			break;
		case 3:
			
			var MsgBody= "Do you want to set volume to minimum? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;0", GetCommand(sub, "Comm"), "0", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;0", GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 4:
			var MsgBody= "Do you want to get coordinates? ";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
			document.getElementById("AlertMsgFooter").innerHTML = '<i id="SignUpLoading" class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
				var items = $('#devicetag').tagsinput('items');
				var device = "";
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length)){
						for (var i = 0; i < items.length; i++) {
							device += items[i].value + "###";
						}
						window.location.href = "googlemap3.html?devices%"+device+"&";
					}
					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "Comm"), "", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
			}
			break;
		case 5:
			var MsgBody= "";
			SetAlertMsgInnerHTML(Title, MsgBody);
			
			document.getElementById("AlertMsgTools").style.display = "";
			document.getElementById("EnterPassword").style.display = "";
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var value = document.getElementById("password").value;
				var items = $('#devicetag').tagsinput('items');
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user");	
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 6:
			var MsgBody= "Do you want to reset your device?";
			SetAlertMsgInnerHTML(Title, MsgBody);
			
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var value = document.getElementById("text-basic").value;
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "Comm"), value, "user");		
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm"), GetCommand(sub, "Comm"), value, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;	
		case 7:
			var MsgBody= '<form id="DownloadType"><label style="margin-right:5px;"><input onclick="selectDownloadType()" name="platform" type="radio" value="GoogleDrive" checked>GoogleDrive</label><label><input onclick="selectDownloadType()" name="platform" type="radio" value="URL">URL</label></form>Select file from Google drive, and download to your cellphone. <div class="fatooltip" style="color:red;">*<span class="falargetooltiptext">In order to make sure file can be downloaded,  please click <i class="fa fa-link" aria-hidden="true"></i> when uploading or downloading.</span></div><br>';		
			MsgBody += '<div class="btn-group"><button class="btn btn-black" onclick="initPicker();" data-dismiss="modal"><img style="padding-right:3px;"height="20" weight="20" src="https://avatars3.githubusercontent.com/u/3708359?v=4&s=200">Google Drive</button></button><button type="button"  class="btn btn-black dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul id="GoogledriveSelect" class="dropdown-menu"></ul></div><br>';							
			SetAlertMsgInnerHTML(Title, MsgBody);
				
				
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
			var items = $('#devicetag').tagsinput('items');
			
			//var value = document.getElementById("DownloadURL").value;
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}		
				var form = document.getElementById("DownloadType");
				//取得radio的值
				for (var i=0; i<form.platform.length; i++)
				{
					if (form.platform[i].checked)
					{
						var platform = form.platform[i].value;
						if(platform === "GoogleDrive"){
							
						}else if(platform === "URL"){
							console.log("url");
							var url = document.getElementById("download_url").value;
							var filename = document.getElementById("download_filename").value;
							if(purpose === "device-management"){
								SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+url+";;;"+filename, "", "", "user");	
							}else if(purpose === "schedule"){
								CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+url+";;;"+filename, GetCommand(sub, "Comm"), "url:"+url+"<br>File name:"+filename, "user", true]);
								SetCommandAction(GetCommand(sub, "CommTitle"));
							}
							
						}
					}
				}
				
			}
			break;
		case 13:
			var MsgBody= 'Do you want to get system version? <br><div id="GetDeviceVersion" value=0></div>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("ShowInfoBtn").style.display = "";
			document.getElementById("AlertMsgBtn").style.display = "none";
			document.getElementById("ShowInfoBtn").onclick = function(e){
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "Comm"), "0", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
				document.getElementById("ShowInfoBtn").style.display = "none";
			}
			
			break;
		case 14:
			var MsgBody= "Do you want to Enable location Monitor? ";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
			document.getElementById("AlertMsgFooter").innerHTML = '<i id="SignUpLoading" class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
				
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;start:10:5", GetCommand(sub, "Comm"), "", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;start:10:5", GetCommand(sub, "Comm"), "", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 19:
			var MsgBody= "Please select Time Zone? <br>";		
			MsgBody+= '<select id="TimeZone" class="form-control"></select>';
			
			SetAlertMsgInnerHTML(Title, MsgBody);
			var buildings = [];
			buildings = ['Pacific/Midway', 'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 'America/Tijuana', 'America/Phoenix', 'America/Chihuahua', 'America/Denver', 'America/Costa_Rica', 'America/Chicago', 'America/Mexico_City', 'America/Regina', 'America/Bogota', 'America/New_York', 'America/Caracas', 'America/Barbados', 'America/Halifax', 'America/Manaus', 'America/Santiago', 'America/St_Johns', 'America/Recife', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Godthab', 'America/Montevideo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Africa/Casablanca', 'Europe/London', 'Europe/Amsterdam', 'Europe/Belgrade', 'Europe/Brussels', 'Europe/Madrid', 'Europe/Sarajevo', 'Africa/Windhoek', 'Africa/Brazzaville', 'Asia/Amman', 'Europe/Athens', 'Europe/Istanbul', 'Asia/Beirut', 'Africa/Cairo', 'Europe/Helsinki', 'Asia/Jerusalem', 'Europe/Minsk', 'Africa/Harare', 'Asia/Baghdad', 'Europe/Moscow', 'Asia/Kuwait', 'Africa/Nairobi', 'Asia/Tehran', 'Asia/Baku', 'Asia/Tbilisi', 'Asia/Yerevan', 'Asia/Dubai', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Oral', 'Asia/Yekaterinburg', 'Asia/Calcutta', 'Asia/Colombo', 'Asia/Katmandu', 'Asia/Almaty', 'Asia/Rangoon', 'Asia/Krasnoyarsk', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Irkutsk', 'Asia/Kuala_Lumpur', 'Australia/Perth', 'Asia/Taipei', 'Asia/Seoul', 'Asia/Tokyo', 'Asia/Yakutsk', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Brisbane', 'Australia/Hobart', 'Australia/Sydney', 'Asia/Vladivostok', 'Pacific/Guam', 'Asia/Magadan', 'Pacific/Noumea', 'Pacific/Majuro', 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Tongatapu'];
			$.each(buildings, function (index, value) {
				$('#TimeZone').append($('<option/>', { 
					value: value,
					text : value 
				}));
			});  
	
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var timezone = $( "#TimeZone" ).val();
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;SetZone;;"+timezone, GetCommand(sub, "Comm"), timezone, "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;SetZone;;"+timezone, GetCommand(sub, "Comm"), timezone, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 20:
			var MsgBody= "Please select Time? <br>";		
			
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgTools").style.display = "";
			document.getElementById("timepicker").style.display = "";
			
			
	
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap']);
				angular.module('ui.bootstrap.demo').controller('TimepickerDemoCtrl', function ($scope, $log) {
					console.log($scope.dt);
					console.log($scope.mytime);
				});
				var dt = angular.element('[ng-controller=TimepickerDemoCtrl]').scope().dt;
				var mytime = angular.element('[ng-controller=TimepickerDemoCtrl]').scope().mytime;
				var year = dt.getFullYear();
				var month = dt.getMonth()+1;
				var day = dt.getDate();
				var hour = mytime.getHours();
				var minute = mytime.getMinutes();
				var second = mytime.getSeconds();
				//SetData;;2017/1/10;;SetTime;;12:59:33
				var SetData = "SetData;;"+year+"/"+month+"/"+day+";;SetTime;;"+hour+":"+minute+":"+second;
				var time = year+"/"+month+"/"+day+"  "+hour+":"+minute+":"+second;
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+SetData, GetCommand(sub, "Comm"), time, "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+SetData, GetCommand(sub, "Comm"), time, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				document.getElementById("AlertMsgTools").style.display = "none";
				document.getElementById("timepicker").style.display = "none";
			}
			break;
		case 22:
			var MsgBody = 'Please Set brightness :<br>'+'<input id="ex1" data-slider-id="ex1Slider" type="text" data-slider-min="0" data-slider-max="255" data-slider-step="1" data-slider-value="0" style="display:none"/>';
			SetAlertMsgInnerHTML(Title, MsgBody);
			SliderShow();
			document.getElementById("ex1Slider").style.display = "";
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				var value = document.getElementById("ex1").value;
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user");				
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			};
			break;
		case 21:
			var MsgBody= "Do you want to unlock the device?";
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;reset", GetCommand(sub, "Comm"), "reset", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;reset", GetCommand(sub, "Comm"), "reset", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			}
			break;
		case 27:
			var MsgBody= "Do you want to view device information? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 28:
			var MsgBody= "Do you want to disable system status monitor? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 41:
			var MsgBody= "Do you want to hide widget page? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 42:
			var MsgBody= "Do you want to shutdown device? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 43:
			var MsgBody= "Do you want to reboot device? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 44:
			var MsgBody= "Do you want to enable flight mode? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 45:
			var MsgBody= "Do you want to disable flight mode? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 46:
			var MsgBody= "Do you enable device admin? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 47:
			var MsgBody= "Do you disable device admin? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 48:
			var MsgBody= "Do you enable adb? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 49:
			var MsgBody= "Do you disable adb? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), "reboot", "true", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 50:
			var MsgBody= "Do you want to hide widget page? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 51:
			var MsgBody= "Do you want to display widget page? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 52:
			document.getElementById("AlertMsgEvent").style.display = "none";
			var MsgBody = 'Please Set Device name :<br>';		
			var DeviceID=[];var strDevice = "";
			var table = $('#dataTables-example').DataTable();
			document.getElementById("AlertMsgBtn").style.display = "";
			for (var i = 0; i < table.rows('.selected').data().length; i++) {
				DeviceID.push( table.rows('.selected').data()[i][1]);
				MsgBody += '<p>'+DeviceID[i]+'  :   <input type="text" class="pull-right"style="margin-right: 100px;" id="DeviceName'+i+'"></p>';
				strDevice+=DeviceID[i]+"/";
			}
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				for (var i = 0; i < table.rows('.selected').data().length; i++) {
					var device = "DeviceName"+i;
					var devicenvalue = document.getElementById(device).value
					if(localStorage.getItem("Company") === "Guest"){
						SetDeviceName(DeviceID[i], devicenvalue);
					}else{
						SendByGolang(DeviceID[i]+"/", GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param")+devicenvalue, GetCommand(sub, "Comm"), devicenvalue, "user");		
						SetDeviceName(DeviceID[i], devicenvalue);
					
						
					}
				}
							
			}
			break;
		case 53:
			var MsgBody = 'Send Message :<br>';		
			var DeviceID=[];
			MsgBody += '<p><input type="text"style="margin-right: 5px;" id="txtMsg"><button class="btn btn-primary" id="btnSendMessage"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></p>';
			document.getElementById("AlertMsgBtn").style.display = "none";
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("btnSendMessage").onclick = function(e){
				var value = document.getElementById("txtMsg").value;
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+value, GetCommand(sub, "Comm"), value, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
				
				document.getElementById("txtMsg").value = "";
			}
			break;
		case 54:
			var MsgBody= "Do you want to Enable Bluetooth? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "enable", "user");			
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 55:
			var MsgBody= "Do you want to Disable Bluetooth? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "disable", "user");			
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 56:
			var MsgBody= "Do you want to Enable wifi? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "enable", "user");		
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 57:
			var MsgBody= "Do you want to Disable wifi? \r\n";		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "disable", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
			}
			break;
		case 58:
			var MsgBody= 'Do you want to get root status? <br><div id="GetRoot"></div>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("ShowInfoBtn").style.display = "";
			document.getElementById("AlertMsgBtn").style.display = "none";
			document.getElementById("ShowInfoBtn").onclick = function(e){
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
				document.getElementById("ShowInfoBtn").style.display = "none";
			}
			
			break;
		case 59:
			var MsgBody= 'Do you want to get top activity? <br> <div id="GetTopActivity"></div>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "none";
			document.getElementById("ShowInfoBtn").style.display = "";
			document.getElementById("ShowInfoBtn").onclick = function(e){
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				
				document.getElementById("ShowInfoBtn").style.display = "none";
			}
			
			break;
		case 60:
			var MsgBody= 'Do you want to get running service? <br> <div id="GetRunningService"></div>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "none";
			document.getElementById("ShowInfoBtn").style.display = "";
			document.getElementById("ShowInfoBtn").onclick = function(e){
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "0", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
				document.getElementById("ShowInfoBtn").style.display = "none";
			}
			
			break;
		case 61:
			var MsgBody= 'Do you want to terminate process? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "terminate top activity", "user");
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "terminate top activity", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
								
			};
			break;
		case 62:
			var MsgBody= 'Do you want to restart agent? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "restart agent", "user");	
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "restart agent", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 63:
			var MsgBody= 'Do you want to Enable camera? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;1", GetCommand(sub, "Comm"), "enable", "user");	
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;1", GetCommand(sub, "Comm"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 64:
			var MsgBody= 'Do you want to disable camera? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;888", GetCommand(sub, "Comm"), "disable", "user");	
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;888", GetCommand(sub, "Comm"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 66:
			var MsgBody= 'Do you want to get coordinates continuously ? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "enable", "user");	
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 67:
			var MsgBody= 'Do you want to stop getting coordinates? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
					AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "disable", "user");	
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, AllDevicesID, GetCommand(sub, "Comm")+";;;"+GetCommand(sub, "Param"), GetCommand(sub, "Comm"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 69:
			var MsgBody= 'Do you want to enable gps? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 70:
			var MsgBody= 'Do you want to disable gps? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 71:
			var MsgBody= 'Do you want to enable unknown sources? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 72:
			var MsgBody= 'Do you want to disable unknown sources? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 73:
			var MsgBody= 'Do you want to enable developer option? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 74:
			var MsgBody= 'Do you want to disable DeveloperOption? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 77:
			var MsgBody= 'Do you want to enable auto time? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 78:
			var MsgBody= 'Do you want to disable auto time? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 79:
			var MsgBody= 'Do you want to enable auto time zone? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 80:
			var MsgBody= 'Do you want to disable auto time zone? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 81:
			var MsgBody= 'Do you want to enable home button? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 82:
			var MsgBody= 'Do you want to disable home button? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 83:
			var MsgBody= 'Do you want to enable NFC? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 84:
			var MsgBody= 'Do you want to disable NFC? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 87:
			var MsgBody= 'Do you want to enable mobile data? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 88:
			var MsgBody= 'Do you want to disable mobile data? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 89:
			var MsgBody= 'Do you want to enable data roaming? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "enable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 90:
			var MsgBody= 'Do you want to disable data roaming? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "disable", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 91:
			var MsgBody= 'Do you want to get prohibit install app list? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 92:
			var MsgBody= 'Do you want to get allow install app list? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 93:
			var MsgBody= 'Do you want to get prohibit launch app list? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "prohibit", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 94:
			var MsgBody= 'Do you want to get allow launch app list? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 95:
			var MsgBody= 'Please set property name and value? <br>Property: <input id="PropertyName" class="form-control" type="text"><br>value: <input id="Value" class="form-control" type="text">';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				var PropertyName = document.getElementById("PropertyName").value;
				var PropertyValue = document.getElementById("Value").value;
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;SetProperty;;"+PropertyName+";;"+PropertyValue, PropertyName, PropertyValue, "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), PropertyName, "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 97:
			var MsgBody= 'Do you want to get all package name? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "true", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 98:
			var MsgBody= 'Do you want to Hide back button? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "hide", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
		case 99:
			var MsgBody= 'Do you want to Show back button? <br>';		
			SetAlertMsgInnerHTML(Title, MsgBody);
			document.getElementById("AlertMsgBtn").style.display = "";
			document.getElementById("AlertMsgBtn").onclick = function(e) {
				var items = $('#devicetag').tagsinput('items');
				
				for (var i = 0; i < items.length; i++) {
						AllDevicesID += items[i].value +"/"; 
				}
				if(purpose === "device-management"){
					if(noTagSelect(items.length))
						SendByGolang(AllDevicesID, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "show", "user");					
				}else if(purpose === "schedule"){
					CommandSelected.push([sub, CommandTitltName, GetCommand(sub, "Comm")+"@%@"+GetCommand(sub, "Path")+"@%@;;;"+GetCommand(sub, "Param"), GetCommand(sub, "CommTitle"), "allow", "user", true]);
					SetCommandAction(GetCommand(sub, "CommTitle"));
				}
							
			};
			break;
	}
}
