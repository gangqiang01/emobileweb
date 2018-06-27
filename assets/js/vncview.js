// var ftpurl = "http://47.95.248.121:30010/";

import * as WebUtil from '../../noVNC/app/webutil.js';
import RFB from '../../noVNC/core/rfb.js';
//onload page
$(function() {
    var  SelectedDeviceId, SelectedAgentId, desktopName, rfb;
    var vnc_mode = 3;
    var repeaterId = Math.floor(Math.random()*9000) + 1000;
    
	LoginStatus("vncview.html"); 
    SetHTML("barset_vncview");
   $('#VNC_enter').on("click",'#VNC_connect_button', function(){
        getVNCpropertys();
    })
    document.getElementById("VNC_closed").onclick = disconnectVNC;
    getDeviceGroup();
});



function getDeviceDetails(agentid, deviceid){
    if(agentid == false){
        console.log("agentid:","is null")
        return;
    }
    if(rfb != undefined){
        disconnectVNC();
    }
    SelectedDeviceId = deviceid;
    SelectedAgentId = agentid;
    if(SelectedDeviceId == undefined || SelectedAgentId == undefined){
        if(deviceMonitorTimer != undefined){
            window.clearInterval(deviceMonitorTimer);
        }
    }

}

function disconnectVNC(){
    if(rfb != undefined){rfb._sock.close()};
}
// init device
function getDeviceGroup(){
    var devgetdata = {};
    devgetdata.pageSize = 10000;
    devgetdata.no = 1;
    devgetdata.orderType = "aid";
    devgetdata.like = "";
    devgetdata._ = new Date().getTime();
    apiget("rmm/v1/accounts", devgetdata).then(function(data){
        var accountsid = data.accounts[0].aid;
        setCookie("aid",accountsid,60);
        console.log(accountsid);
        var groupgetdata = {};
        groupgetdata._ = new Date().getTime();
        apiget("rmm/v1/accounts/"+accountsid+"/groups", groupgetdata).then(
            function(data){
                var devicegroupmsg='';
                var groupids=[]
                if(data.accounts[0].groups.length != 0){
                    data.accounts[0].groups.forEach(function(val){
                        devicegroupmsg += '<option value="'+val.gid+'">'+val.name+"</option>";
                    });
                }else{
                    devicegroupmsg += '<option >Device group is null</option>';
                }
                $("#groupId").html(devicegroupmsg).selectpicker('refresh');
                GetAllDevices();
            }
        )
    })
}

function GetAllDevices(){

    var groupid = $("#groupId").val();
    var devicegetdata = {};
    devicegetdata.pageSize = 10000;
    devicegetdata.no = 1;
    devicegetdata.orderType = "did";
    devicegetdata.like = "";
    devicegetdata._ = new Date().getTime();
    apiget("rmm/v1/devicegroups/"+groupid+"/devices", devicegetdata).then(function(data){
        $(".loading").hide();
        console.log(data);
        var DeviceDetails = [];
        var DeviceData = data.groups[0].devices;
        for(var i=0, len=DeviceData.length;i<len;i++){
            DeviceDetails.push([DeviceData[i].agentid,DeviceData[i].name,DeviceData[i].connected,DeviceData[i].did]); 
        }
        GetDevicesId(DeviceDetails);
    })
}

function GetDevicesId(data){
    var txtdevice = ""; var txtOnline="";
    var txtOffline = "";
    var tmpCheck=false;
	for(var i=0,len=Object.keys(data).length;i<len;i++){
        if(data[i][2] === true){
            txtOnline = txtOnline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
        }
        else{
            txtOffline = txtOffline+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
        }
        txtdevice = txtdevice+ '<option data-subtext='+data[i][0]+'>'+data[i][1]+'</option>';
		
	}
	txtOnline = '<optgroup label="Online" class="color-green" >'+ txtOnline +'</optgroup>';
    txtOffline =  '<optgroup label="Offline" class="color-red" disabled >'+ txtOffline +'</optgroup>';	
	
    txtdevice = txtOnline + txtOffline;
    // console.log($("#devIdone"))
	$("#devId").html(txtdevice).selectpicker('refresh');
	$("#devId").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		var AgentId = $(this).find('option').eq(clickedIndex).attr("data-subtext");
		getDeviceDetails(AgentId, changeAidtoDid(data, AgentId));
	});
}

function changeAidtoDid(data, aid){
	for(var i=0,len=Object.keys(data).length;i<len;i++){
		if(data[i][0] === aid){
			return data[i][3];
		}
	}
	return false;
}

// device settings

function getVNCpropertys(){
    if(!SelectedAgentId){
        swal("","Please select your device","info")
        return;
    }
    var getPatamsData={};
    getPatamsData.agentid = SelectedAgentId;
    getPatamsData.mode = vnc_mode;
    getPatamsData.repeaterid = repeaterId;
    apipost("rmm/v1/kvm",getPatamsData).then(function(data){
        startVNC(data.IP, data.port, data.password, "");
    })
}

function updateDesktopName(e) {
    desktopName = e.detail.name;
}


function status(text, level) {
    var vncContentMsg = `<h2 class="VNC_title">VNC To Your Device</h2>
    <a class="btn btn-info" id="VNC_connect_button">
        <i class="fa fa-link"></i> Connect
    </a>`;
    switch (level) {
        case 'normal':
        case 'warn':
        case 'error':{
            document.getElementById("VNC_enter").innerHTML=vncContentMsg;
            break;
        }
        default:
            level = "warn";
    }
    if(text == "Connecting"){
        document.getElementById("VNC_enter").innerHTML='<img src="assets/img/connect_vnc.gif" alt="loading">';
        document.getElementById("VNC_closed").style.display = "none"
    }else if(text == "Disconnected"){
        document.getElementById("VNC_closed").style.display = "none"
        document.getElementById("VNC_enter").innerHTML=vncContentMsg;
    }else{
        document.getElementById("VNC_enter").innerHTML='';
        document.getElementById("VNC_closed").style.display = ""
    }
    document.getElementById('noVNC_status_bar').className = "noVNC_status_" + level;
    document.getElementById('noVNC_status').textContent = text;
}

function connected(e) {
    if (WebUtil.getConfigVar('encrypt',true)) {
        status("Connected (encrypted) to " + desktopName, "normal");


    } else {
        status("Connected (unencrypted) to " + desktopName, "normal");
    }
}

function disconnected(e) {
    if (e.detail.clean) {
        status("Disconnected", "normal");
    } else {
        status("Something went wrong, connection is closed", "error");
    }
}



// By default, use the host and port of server that served this fil

      
function startVNC(host, port, password, path){
    var token = WebUtil.getConfigVar('token', null);
    if (token) {
        // if token is already present in the path we should use it
        path = WebUtil.injectParamIfMissing(path, "token", token);
    
        WebUtil.createCookie('token', token, 1)
    }

    status("Connecting", "normal");
    if ((!host) || (!port)) {
        status('Must specify host and port in URL', 'error');
    }

    var url  = 'wss';

    url += '://' + host;
    if(port) {
        url += ':' + port;
    }
    url += '/' + path;

    rfb = new RFB(document.getElementById('noVNC_content'), url,
                { repeaterID: repeaterId,
                    shared: true,
                    credentials: { password: password } });
    rfb.viewOnly = WebUtil.getConfigVar('view_only', false);
    rfb.addEventListener("connect",  connected);
    rfb.addEventListener("disconnect", disconnected);
    rfb.addEventListener("desktopname", updateDesktopName);
    rfb.scaleViewport = true;
    rfb.resizeSession = WebUtil.getConfigVar('resize', false);
}
// If a token variable is passed in, set the parameter in a cookie.
// This is used by nova-novncproxy.

    


