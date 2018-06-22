var checkOnlineTimer;
var eventData = [];
function isObjectValueEqual(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
        return false;
    }
 
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}
Array.prototype.in_array = function (element) { 
　　for (var i = 0; i < this.length; i++) { 
        if(typeof(element)== "object"){
            if(isObjectValueEqual(this[i], element)){
                return true
            }
        }else if(typeof(element) == "number" || typeof(element) ==  "string"){
            if (this[i] == element) { 
                return true; 
            } 
        }
	} 
	return false; 
	 
}

Array.prototype.removeObjWithArr = function (_obj) {
    var length = this.length;
    for(var i = 0; i < length; i++)
    {
        if(isObjectValueEqual(this[i], _obj))
        {
            if(i == 0)
            {
                this.shift(); //删除并返回数组的第一个元素
                return;
            }
            else if(i == length-1)
            {
                this.pop();  //删除并返回数组的最后一个元素
                return;
            }
            else
            {
                this.splice(i,1); //删除下标为i的元素
                return;
            }
        }
    }
};

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

function connectWebsocket(){
    if(window.WebSocket){
        var ws = new WebSocket("wss://portal-rmm.wise-paas.com/event/-1");
        ws.onopen = function(evt) { 
            console.log("Connection open ..."); 
        };
        
        ws.onmessage = function(eventJson) {
            console.log(eventJson);
            var msgData = JSON.parse(eventJson.data);
            localEventMsgJson = window.localStorage["eventMsg"] == undefined ? JSON.stringify([]): window.localStorage['eventMsg'];
            localEventMsg = JSON.parse(localEventMsgJson);
            eventData = localEventMsg.concat(msgData.events);
            window.localStorage["eventMsg"] = JSON.stringify(eventData);
            SetNotificationBell(eventData);
            // var inviteContent = SetSubscribeNotification(eventData);
            // document.getElementById("notification_content").innerHTML = inviteContent
        };
    
        ws.onclose = function(evt) {
            console.log("Connection closed.");
            ws = undefined;
        };
    }else{
        swal("","Your browser is not support WebSocket","error")
    }
    
    
}
//verify user and save in page
function LoginStatus(page) {
    if(checkCookie("SessionId")){
        console.log(page);
        var url = "rmm/v1/accounts/login"
        apiget(url).then(
            function(data){
                if(data.result){
                    connectWebsocket();
					if(page != undefined){            
                        setCookie("page", page, 60);
                        setCookie("aid", data.aid, 60);
                        // 启动设备在线检测
                        // var checkOnlineTimer = window.setInterval(function(){CheckOnlineDevice()},7000);
                    }
                }
            }
        )
    }else{
        if(location.pathname.indexOf("index.html") >-1 || location.pathname.indexOf("html") == -1){
            loginout();
        }else{
            window.location.href = "Login.html"
        }
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
function　loginout(){
    setCookie('SessionId','000', 0);
    setCookie('connectcount','000', 0);
    setCookie('aid','000',0)
    sessionStorage.removeItem("groupids");
    clearInterval(checkOnlineTimer);
    localStorage.removeItem("eventMsg");
    return true;
}

//set HTML (notification bell, profile card)
var AllDevices = [];
var ProfileInfo;

function SetHTML(html){
	SetNavbar();
    //SetAlertNotification();
    localEventMsgJson = window.localStorage["eventMsg"] == undefined ? JSON.stringify([]): window.localStorage['eventMsg'];
    localEventMsg = JSON.parse(localEventMsgJson);
    SetNotificationBell(localEventMsg);

	var UserName = getCookie('UserName');
	$("#btnCollapse").on("click", function(){

		if (localStorage.getItem("col") === "in"){
			localStorage.removeItem("col");
		}else{
			localStorage["col"] = "in";
		}
	});
	$('.notification-body').css( 'cursor', 'pointer' );
	//document.getElementById(html).className = "menu-top-active";
	console.log("html",html)
    $('#'+html).addClass('menu-top-active');
    var data = {};
    data._now =  new Date().getTime();
    if(checkCookie("SessionId")){
        apiget("rmm/v1/accounts/myself",data).then(function(data){
            document.getElementById("card-email").innerHTML+=data["accounts"][0].mail;
            document.getElementById("card-name").innerHTML='<h1>'+data["accounts"][0].name+'</h1>';
            localStorage["accountname"] = data["accounts"][0].name
            document.getElementById("card-login").innerHTML = '<p>Last Accessed : '+UnixToTime(data["accounts"][0].login_unix_ts)+'</p>';
        })
        var dvdata = {};
        dvdata._ = new Date().getTime();
        apiget("rmm/v1/devices/own/status/number", dvdata).then(
            function(data){
                setCookie("connectcount",data.connected,60);
                document.getElementById("card-deives").innerHTML = "device connected :" +data.connected;
            }
        )
    }
	// });

}
//check online device 
function CheckOnlineDevice(){
    var dvdata = {};
    dvdata._ = new Date().getTime();
    apiget("rmm/v1/devices/own/status/number", dvdata).then(
        function(data){
            var prevent_connectcount = data.connected;
            var old_connectcount = getCookie("connectcount");
            if(prevent_connectcount > old_connectcount){
                setCookie("connectcount",prevent_connectcount,60);
                if(location.pathname.indexOf("AllDevice.html") >-1){
                    setTimeout(function(){
                        GetAllDevices();
                    },15000);
                }
            }else if(prevent_connectcount < old_connectcount){
                setCookie("connectcount",prevent_connectcount,60);
                GetAllDevices()
            }
            document.getElementById("card-deives").innerHTML = "device connected :" +data.connected;
        }
    )
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
// get date form now fday and fmonth
function getFromNowTimes(fday, fmonth){
    var now = new Date();
    fday = parseInt(fday);
    var d = new Date(now.getTime() - fday * 24 * 3600 * 1000);
    var time = "";
    fmonth = parseInt(fmonth);
    var Day = d.getUTCDate();if(Day<10) Day = "0"+Day;
    var Month = (d.getUTCMonth()+1);
    var Year = d.getUTCFullYear();
    if(Month<10) Month = "0"+Month;
    var Hours = d.getHours();
    if(Hours<10) Hours = "0"+Hours;var Min = d.getUTCMinutes();if(Min<10) Min = "0"+Min;
    var Sec = d.getUTCSeconds().toFixed(3);if(Sec<10) Sec = "0"+Sec;
    if(Month - fmonth <= 0)  
    {  
        Year -= 1;  
        Month = 12 + Month - fmonth;  
    }  
    else  
    {  
        Month -= fmonth;  
    } 
    time = d.getUTCFullYear()+"-"+Month+"-"+Day+" "+Hours+":"+Min+":"+Sec;
    return time;
}


//set notification bell
function SetNotificationBell(eventData){
    var el = document.querySelector('.notification');
    var count = eventData.length;
    el.setAttribute('data-count', count);
    el.classList.remove('notify');
    el.offsetWidth = el.offsetWidth;
    el.classList.add('notify');
    if(count !== 0){
        el.classList.add('show-count');
        $( ".notification_content" ).remove( ":contains('No New Notifications!')" );
        var inviteContent = SetSubscribeNotification(eventData);
        document.getElementById("notification_content").innerHTML = inviteContent
    }else if(count === 0){
        el.classList.remove('show-count');
        var invitecontent = SetNoneNotification();
        document.getElementById("notification_content").innerHTML = invitecontent;	
    }
    $('[data-toggle="tooltip"]').tooltip({html : true,container: 'body'}); 
}

function SetSubscribeNotification(notifyMsgData){
    var notifyMsg = '';
    notifyMsgData.forEach(function(notifyMsgJson){
        notifyMsgObj = JSON.parse(notifyMsgJson);
        var tableMsg = '';
        for(var key in notifyMsgObj){
            if(key == "agent_name") tableMsg += `<tr><td  style='text-align:left;'>device:</td><td  style='text-align:left;'>${notifyMsgObj[key]}</td></tr>`;
            if(key == "ts") tableMsg += `<tr><td  style='text-align:left;'>Date:</td><td  style='text-align:left;'>${UnixToTime(notifyMsgObj[key]["$date"])}</td></tr>`;
            if(key == "type") tableMsg += `<tr><td  style='text-align:left;'>type:</td><td  style='text-align:left;'>${notifyMsgObj[key].toLowerCase()}</td></tr>`;
            // if(key == "message") tableMsg += `<tr><td  style='text-align:left;'>message:</td><td  style='text-align:left;'>${notifyMsgObj[key].toLowerCase()}</td></tr>`;
        }
        if(notifyMsgObj.severity == "ERROR"){
            notifyMsg += `<div class="item-line" data-toggle="tooltip" data-placement="bottom" title="<table style='border:0'>${tableMsg}<table/>">
                <i class="fa fa-times-circle fa-x text-danger" style="padding-right:5px;"></i>
                ${notifyMsgObj.subtype.toLowerCase()}
            </div>`;
        }else if(notifyMsgObj.severity == "WARNING"){
            notifyMsg += `<div class="item-line"  data-toggle="tooltip" data-placement="bottom" title="<table style='border:0'>${tableMsg}<table/>">
                <i class="fa fa-exclamation-triangle fa-x text-warning" style="padding-right:5px;"></i>
                ${notifyMsgObj.subtype.toLowerCase()}
            </div>`;
        }else{
            notifyMsg += `<div class="item-line"  data-toggle="tooltip" data-placement="bottom" title="<table style='border:0'>${tableMsg}<table/>">
                <i class="fa fa-info-circle fa-x text-success" style="padding-right:5px;"></i>
                ${notifyMsgObj.subtype.toLowerCase()}
            </div>`;
        }
        
    })
	var content = '<li class="notification_content">'+
		'<div class="text-center title-line">'+
			'you have '+notifyMsgData.length+' new notifications'+
		'</div>'+
		'<div class="notification_content-title">'+notifyMsg+'</div>'+
		'<div class="notification_content-button">'+
			'<button class="btn btn-success "  onclick="SetSubscribe(\'allview\')"><i class="fa fa-eye" style="padding-right:5px;" aria-hidden="true"></i>View all event</button>'+
			'<button class="btn btn-danger"   onclick="SetSubscribe(\'markview\')"><i class="fa fa-eye-slash" style="padding-right:5px;" aria-hidden="true"></i>Mark all as read</button>'+
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

function SetSubscribe(cid){
    if(cid == "allview"){
        window.location.href="AllEventMsg.html";
        localStorage.removeItem("eventMsg");
    }else if(cid == "markview"){
        SetNotificationBell([]);
        localStorage.removeItem("eventMsg");
    }
}


function SetNavbar(){
    var loginStatusMsg;
    if(checkCookie('SessionId')){
        loginStatusMsg = '<a href="Login.html" class="btn btn-danger card-bottom-right" onclick="loginout();">LOG ME OUT</a>'
    }else{
        loginStatusMsg = '<a href="Login.html" class="btn btn-success card-bottom-right";">LOGIN</a>'
    }
	$('.navbar-fixed-top').append( ' <div class="navbar navbar-inverse set-radius-zero " >'+
			'<div class="container">'+
				'<div class="navbar-header">'+
					'<a class="navbar-brand" href="index.html">'+

                        '<img src="assets/img/aimlink_logo.png" style="width:310px;margin:10px" />'+
                        // '<span style="display:inline-block;position:relative;top:5px;left:10px;color:#337ab7;font-size:23px">Android Control</span>'+
					'</a>'+

                    '<ul id="menu-top" class="nav navbar-nav navbar-right">'+
                        '<li>'+
                            '<a id="barset_index" href="index.html">Main</a>'+
                        '</li>'+
                        '<li>'+
                            '<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="barset_devicemanagement">Device Management<span class="caret"></span></a>'+
                            '<ul class="dropdown-menu" role="menu" aria-labelledby="ddlmenuItem">'+
                                '<li><a id="barset_alldevice" href="AllDevice.html">Device List</a></li>'+
                                '<li><a id="barset_devicegroup" href="DeviceGroup.html">Device Group</a>'+
                            '</ul>'+
                        '</li>'+
                        '<li><a id="barset_devicesetting" href="DeviceSetting.html">Device Control</a></li>'+
                        '<li><a id="barset_batchcontrol" href="BatchControl.html">Batch Control</a></li>'+
                        '<li><a id="barset_vncview" href="vncview.html">KVM</a></li>'+
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
                                // '<a href="profile.html" class="btn btn-primary card-bottom-left">PROFILE</a>'+
                                  loginStatusMsg+
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
		'</div>'
    );
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






