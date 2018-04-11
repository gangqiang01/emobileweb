
Array.prototype.in_array = function (element) { 
　　for (var i = 0; i < this.length; i++) { 
		if (this[i] == element) { 
			return true; 
		} 
	} 
	return false; 
	 
}
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
//verify user and save in page
function LoginStatus(page) {
    if(checkCookie("SessionId")){
        var url = "rmm/v1/accounts/login"
        apiget(url).then(
            function(data){
                if(data.result){
					if(page != undefined){
                        setCookie("page", page, 60);
                    }
                }
            }
        )
    } 
}

//get user cookie without decrypt
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

//check out cookie exist or not
//if cookie is null then return true
function checkCookie(cname) {
	var username = getCookie(cname);
	if (username) {
		return true;
	} else {
		return false;
	}
}

//set cookie with cookie name ,value and timeout
function setCookie(cname, cvalue, exmins) {
	var d = new Date();
	d.setTime(d.getTime() + (exmins * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// delete user cookies
function DeleteCookie() {
	setCookie('UserName', '000', 0);
	setCookie('Password', '000', 0);
}

//set HTML (notification bell, profile card)
var AllDevices = [];
var ProfileInfo;

function SetHTML(html){
	SetNavbar();
	//SetAlertNotification();
	SetNotificationBell(0);
	var UserName = getCookie('UserName');
	if(localStorage.getItem("Company") === "Guest"){
		document.getElementById("dropdown-management").style.display = "none";
	}
	if (localStorage.getItem("col") === "in"){
		$("#collapse").addClass("in");
	}else{
		$("#collapse").removeClass("in");
	}
	$("#btnCollapse").on("click", function(){

		if (localStorage.getItem("col") === "in"){
			localStorage.removeItem("col");
		}else{
			localStorage["col"] = "in";
		}
	});
	$('.notification-body').css( 'cursor', 'pointer' );
	//document.getElementById(html).className = "menu-top-active";
    $('#'+html).addClass('menu-top-active');
    var data = {};
    data._now =  new Date().getTime();
    if(checkCookie("SessionId")){
        apiget("rmm/v1/accounts/myself",data).then(function(data){
            console.log("user",data);
            document.getElementById("card-email").innerHTML+=data["accounts"][0].mail;
            document.getElementById("card-name").innerHTML='<h1>'+data["accounts"][0].name+'</h1>';
    
            document.getElementById("card-login").innerHTML = '<p>Last Accessed : '+UnixToTime(data["accounts"][0].login_unix_ts)+'</p>';
    
    
            if(location.pathname === "/profile.html"){
                GetAccountInfo();
            }else if(location.pathname === "/management.html"){
                SetPermissionContent();
            }else if(location.pathname === "/contact-us.html"){
                GetQuestion();
            }
        })
        var dvdata = {};
        dvdata._ = new Date().getTime();
        apiget("rmm/v1/devices/own/status/number", dvdata).then(
            function(data){
            document.getElementById("card-deives").innerHTML = "device connected :" +data.connected;
            }
        )
    }

    if(location.pathname === "/details.html"){
        var groupid = sessionStorage["groupid"]
        if(groupid != undefined){
            var devicegetdata = {};
            devicegetdata.pageSize = 10000;
            devicegetdata.no = 1;
            devicegetdata.orderType = "did";
            devicegetdata.like = "";
            devicegetdata._ = new Date().getTime();
            apiget("rmm/v1/devicegroups/"+groupid+"/devices", devicegetdata).then(function(data){
                var device = data.groups[0].devices;
                console.dir(device);

                var AllDevices = [];
                var id,name;
                for(var j=0; j< device.length;j++){
                AllDevices.push([device[j]["agentid"],device[j]["name"]]);
                }
                
                GetDevicesId(AllDevices);
            })
        }else{
            window.location.href = "index.html";
        }
        
    
    }
	// });

}

//date to time (e.g. date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)] to time(2017/9/24 10:18:17))
function DateToTime(date){
	var d = date;
	var time = "";
	var Day = d.getUTCDate();if(Day<10) Day = "0"+Day;var Month = (d.getUTCMonth()+1);if(Month<10) Month = "0"+Month;
	var Hours = d.getHours();if(Hours<10) Hours = "0"+Hours;var Min = d.getUTCMinutes();if(Min<10) Min = "0"+Min;
	var Sec = d.getUTCSeconds();if(Sec<10) Sec = "0"+Sec;
	time = d.getUTCFullYear()+"/"+Month+"/"+Day+" "+Hours+":"+Min+":"+Sec;
	return time;
}

//date to ori time(e.g. date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)] to ori(20170924101817))
function GetInputTimeToOriginal(date){

	var d = date;
	var time = "";
	var Day = d.getDate();if(Day<10) Day = "0"+Day;var Month = (d.getMonth()+1);if(Month<10) Month = "0"+Month;
	var Hours = d.getHours();if(Hours<10) Hours = "0"+Hours;var Min = d.getMinutes();if(Min<10) Min = "0"+Min;
	var Sec = d.getSeconds();if(Sec<10) Sec = "0"+Sec;
	time = d.getFullYear()+""+Month+""+Day+""+Hours+""+Min+""+Sec;
	return time;

}

//time stamp to time (e.g. unix(1511489897579) to time(2017/9/24 10:18:17))
function UnixToTime(unix){
	var date = new Date(parseInt(unix));
	return DateToTime(date);
}

//time stamp to date (e.g. unix(1511489897579) to date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)])
function UnixToDate(unix){
	var date = new Date(parseInt(unix)*1000);
	return date;
}

//date to time stamp(e.g. date:[Fri Nov 24 2017 10:18:17 GMT+0800 (台北標準時間)] to unix(1511489897579))
function DateToUnix(date){
	var d = new Date(moment(date).seconds(0).milliseconds(0).toString());
	return Math.round((d.getTime() / 1000));
}

//get time stamp(e.g. unix(1511489897579))
function GetNowUnix(){
	var d = new Date();
	return Math.round((d.getTime() / 1000));
}
// get new time (2018/4/10)
function GetNowTimes(){
	var d = new Date();
	var time = "";
	var Day = d.getUTCDate();if(Day<10) Day = "0"+Day;var Month = (d.getUTCMonth()+1);if(Month<10) Month = "0"+Month;
	var Hours = d.getHours();if(Hours<10) Hours = "0"+Hours;var Min = d.getUTCMinutes();if(Min<10) Min = "0"+Min;
	var Sec = d.getUTCSeconds();if(Sec<10) Sec = "0"+Sec;
	time = d.getUTCFullYear()+"/"+Month+"/"+Day+" "+Hours+":"+Min+":"+Sec;
	return time;
}


//set notification bell
function SetNotificationBell(value){
	if(value === "add"){
		var el = document.querySelector('.notification');
		var count = Number(el.getAttribute('data-count')) || 0;
		el.setAttribute('data-count', count + 1);
		el.classList.remove('notify');
		el.offsetWidth = el.offsetWidth;
		el.classList.add('notify');
		if(count === 0){
			el.classList.add('show-count');
			$( ".notification_content" ).remove( ":contains('No New Notifications!')" );
		}

	}else if(value === "subtract"){
		var el = document.querySelector('.notification');
		var count = Number(el.getAttribute('data-count')) || 0;
		el.setAttribute('data-count', count - 1);
		el.classList.remove('notify');
		el.offsetWidth = el.offsetWidth;
		el.classList.add('notify');
		if(count-1 === 0){
			el.classList.remove('show-count');
			var invitecontent = SetNoneNotification();
			document.getElementById("notification_content").innerHTML += invitecontent;
		}
	}else{
		var el = document.querySelector('.notification');
		var count = value;
		el.setAttribute('data-count', count);
		el.classList.remove('notify');
		el.offsetWidth = el.offsetWidth;
		el.classList.add('notify');
		if(count !== 0){
			el.classList.add('show-count');
		}else if(count === 0){
			el.classList.remove('show-count');
			var invitecontent = SetNoneNotification();
			document.getElementById("notification_content").innerHTML += invitecontent;
		}
	}

}

//write notification bell content
function SetSubscribeNotification(inviter, unix, device, accept, refuse){
	var content = '<li class="notification_content">'+
		'<div class="notification_content-icon">'+
			'<i class="fa fa-rss-square fa-2x" aria-hidden="true"></i>'+
		'</div>'+
		'<div class="notification_content-title">'+
			'<h4>'+inviter+'</h4>'+
			'<p>'+UnixToTime(unix)+'</p>'+
		'</div>'+
		'<div class="notification_content-button">'+
			'<button class="btn btn-success" style="width:50%;" onclick="SetSubscribe('+device+','+accept+')"><i class="fa fa-check" style="padding-right:5px;" aria-hidden="true"></i>accept</button>'+
			'<button class="btn btn-danger" style="width:50%;"  onclick="SetSubscribe('+device+','+refuse+')"><i class="fa fa-times" style="padding-right:5px;" aria-hidden="true"></i>refuse</button>'+
		'</div>'+
	'</li>';
	return content;
}

function SetNoneNotification(){
	var content = '<li class="notification_content">'+
			'<div class="notification_content-icon">'+
				'<i class="fa fa-bell fa-2x" aria-hidden="true"></i>'+
			'</div>'+
			'<div class="notification_content-title">'+
				'<h3>No New Notifications!</h3>'+
				'<p>all caught up</p>'+
			'</div>'+
		'</li>';
	return content;
}


function GetAllDevicesName(id){
	for(var i=0;i<Object.keys(AllDevices).length;i++){
		if(AllDevices[i][0] === id)
			if(AllDevices[i][1] === "-"){
				return AllDevices[i][0];
			}else{
				return AllDevices[i][1];
			}

	}
	return id;
}


function SetNavbar(){
	$('.navbar-fixed-top').append( ' <div class="navbar navbar-inverse set-radius-zero " >'+
			'<div class="container">'+
				'<div class="navbar-header">'+
					'<a class="navbar-brand" href="index.html">'+

						'<img src="assets/img/AIMobile-Logo-3.png" />'+
					'</a>'+

					'<ul class="nav navbar-nav navbar-right">'+
						'<button id="btnCollapse" type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse" style="margin-top:25px;">'+
						'<span class="icon-bar"></span>'+
						'<span class="icon-bar"></span>'+
						'<span class="icon-bar"></span>'+
					'</button>'+

						'<li class="card-body" style="padding-top:18px;margin-right:5px;float:right;" >'+
							'<button id="user-circle" class="btn btn-info" style="background-color: Transparent;border: none;"><i class="fa fa-user-circle-o" aria-hidden="true"	style="color:#337ab7;font-size:2.5em;" ></i></button>'+

							'<div class="card dropdown-menu" id="card">'+
								'<div class="card-pic">'+
								'<img src="./assets/img/face_black.png" style="width:120px;">'+
								'</div>'+
								'<div class="card-info">'+
									'<div class="card-name" id="card-name">'+
										'<h1></h1>'+
									'</div>'+
									'<div class="card-title">'+
										'<a href="#" id="card-email"><i class="fa fa-envelope"></i></a> '+
										'<p id="card-deives">device bound : </p>'+
                  '</div>'+
                  '<div id="card-login">'+
									'<p>Last Accessed :</p>'+

								  '</div>'+
								'</div>'+
								'<div class="card-bottom">'+
									'<a href="profile.html" class="btn btn-primary card-bottom-left">PROFILE</a>'+
									'<a href="Login.html" class="btn btn-danger card-bottom-right" onclick="DeleteCookie();">LOG ME OUT</a>'+
								'</div>'+
							'</div>'+
						'</li>'+
						'<li class="notification-body" style="padding-top:25px;float:right;padding-right:10px;" >'+

							'<div class="container-bell">'+
								'<div class="notification" ></div>'+
							'</div>'+
							'<ul class="dropdown-menu scrollable-menu" id="notification_content">'+
							'</ul>'+

						'</li>'+
					'</ul>'+



				'</div>'+



			'</div>'+
		'</div>'+

		'<section class="menu-section">'+
			'<div class="container">'+
				'<div class="row ">'+
					'<div class="col-md-12">'+
						'<div id="collapse" class="navbar-collapse collapse in">'+
							'<ul id="menu-top" class="nav navbar-nav navbar-right">'+
								'<li><a id="barset_index" href="index.html">MainPage</a></li>'+

								'<li>'+
									'<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="barset_management">Management<i class="fa fa-angle-down"></i></a>'+
									'<ul class="dropdown-menu" role="menu" aria-labelledby="ddlmenuItem">'+
										'<li id="dropdown-management" role="presentation"><a role="menuitem" tabindex="-1" href="management.html">Account Managemnet</a></li>'+
										'<li id="dropdown-alldevice" role="presentation"><a role="menuitem" tabindex="-1" href="AllDevice.html">Device Managemnet</a></li>'+
										'<li id="dropdown-alldevice" role="presentation"><a role="menuitem" tabindex="-1" href="details.html">Device Details</a></li>'+
									'</ul>'+

								'</li>'+
								'<li>'+

									'<a id="barset_analysis" href="analysis.html">Analysis</a></li>'+

								'</li>'+
								'<li><a id="barset_schedule" href="schedule.html">Schedule</a></li>'+
								'<li><a id="barset_instructions" href="index.html">Instructions</a></li>'+
								'<li><a id="barset_contact" href="contact-us.html">Contact Us</a></li>'+

							'</ul>'+
						'</div>'+

					'</div>'+

				'</div>'+
			'</div>'+
		'</section>');
		$('#user-circle').click(function(e) {
			$(this).parent().toggleClass('open');
		});
		$('.container-bell').click(function(e) {
			$(this).parent().toggleClass('open');
		});
		$('html').on('click', function (e) {
			if (!$('#user-circle').is(e.target)
				&& $('div.card').has(e.target).length === 0
				&& $('li.card-body').has(e.target).length === 0
			) {
				$('li.card-body').removeClass('open');
			}
			if (!$('.notification').is(e.target)
				&& $('#notification_content').has(e.target).length === 0
			) {
				$('li.notification-body').removeClass('open');
			}
		});
}

function SetAlertNotification(){
	$('#myModal').append(
			'<div class="modal-dialog">'+
				'<div class="modal-content">'+
					'<div class="modal-header">'+
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
						'<h4 class="modal-title" id="myModalLabel"></h4>'+
					'</div>'+
					'<div id="AlertMsgEvent" class="modal-event" style = "display:none">'+
					'</div>'+
					'<div id="AlertMsgTools" class="modal-tools" style = "display:none">'+
						'<div id="EnterPassword" class="form-group" style="display:none;">'+
							'<input type="password" class="form-control" id="password" placeholder="Please enter the password :">'+
						'</div>'+
						'<div id="timepicker" style="display:none;" ng-app="mwl.calendar.docs">'+
							'<div ng-controller="TimepickerDemoCtrl">'+
								'<p class="input-group">'+
								  '<input type="text" class="form-control" datepicker-popup="{{format}}" ng-model="dt" is-open="popup.opened" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close" />'+
								  '<span class="input-group-btn">'+
									'<button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>'+
								  '</span>'+
								'</p>'+
								'<uib-timepicker ng-model="mytime" ng-change="changed()" hour-step="hstep" minute-step="mstep" show-meridian="ismeridian"></uib-timepicker>		'+
							'</div>'+
						'</div>'+

					'</div>'+
					'<div id="AlertMsgBody" class="modal-body">'+

					'</div>'+
					'<div class="modal-footer" id="AlertMsgFooter">'+
						'<button type="button" class="btn btn-default" data-dismiss="modal">cancel</button>'+
						'<button id="AlertMsgBtn"type="button" style = "display:none" class="btn btn-primary" data-dismiss="modal" >ok</button>'+
						'<button id="ShowInfoBtn"type="button" class="btn btn-primary" style = "display:none">ok</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>');

		$('#password').numpad({
			displayTpl: '<input class="form-control" type="password" />',
			hidePlusMinusButton: true,
			hideDecimalButton: true
		});
}

function SliderShow(){
	// Without JQuery
	var slider = new Slider('#ex1', {
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});
}

function SetSubscribe(device, value){

	if(value === "accept"){

        var d = "'"+device+"'";
        var s = ':contains('+d+')';
        $( ".notification_content" ).remove( s );
        SetNotificationBell("subtract");
        if(location.pathname === "/AllDevice.html"){
            GetAllDevices();
        }
	}else if(value === "refuse"){
		SetNotificationBell("subtract");
	}

}

function DeviceDataController(data){
	console.log("DeviceDataController",data);
	var ControllerDevices = data.split(",")
}

function DeviceVcn(data){
	console.log("vcn",data);
}
