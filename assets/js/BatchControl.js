var ftpurl = "http://47.95.248.121:30010/";
var timer, SelectedDeviceData;
var AimSdkPlugin = "AimSdk";
var ReturnCount = 0;
var AllOptions = "";
var GetSettingsStatusSensor = {
    wifi: "/devicectrl/ctrl-wifi",
    bluetooth: "/devicectrl/ctrl-bluetooth",
    lockscreen: "/securityctrl/ctrl-lockscreen"
};
var AppFuncSensor = {
    allappinfo: "/appctrl/get-all-app-info",
    disableapp: "/appctrl/disable-some-app",
    enableapp: "/appctrl/enable-some-app",
    installapp: "/appctrl/install-some-app",
    removeapp: "/appctrl/remove-some-app",
    startapp: "/appctrl/start-some-app"
}



//onload page
$(function() {
	LoginStatus("BatchControl.html"); 
    SetHTML("barset_batchcontrol");
    GetDeviceGroup();
});
// init device
function GetDeviceGroup(){
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
        groupgetdata = {};
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
        for(var i=0;i<DeviceData.length;i++){
            DeviceDetails.push([DeviceData[i].agentid,DeviceData[i].name,DeviceData[i].connected,DeviceData[i].did]); 
        }
        GetDevicesId(DeviceDetails);
    })
}

function GetDevicesId(data){
    var txtdevice = ""; var txtOnline="";
    var txtOffline="";
    var tmpCheck=false;
    var sign = 0;
	for(var i=0;i<Object.keys(data).length;i++){
        if(data[i][2] === true){
            txtOnline = txtOnline+ '<option value='+data[i][3]+'>'+data[i][1]+"/"+data[i][0]+'</option>';
        }
        else{
            txtOffline = txtOffline+ '<option value='+data[i][3]+'>'+data[i][1]+"/"+data[i][0]+'</option>';
        }
		
	}
	txtOnline = '<optgroup label="Online" class="color-green" >'+ txtOnline +'</optgroup>';
    txtOffline =  '<optgroup label="Offline" class="color-red" disabled >'+ txtOffline +'</optgroup>';	
	
    txtdevice = txtOnline + txtOffline;
    // console.log($("#devIdone"))
    $("#devId").html(txtdevice).multiselect({
        includeSelectAllOption: true,
        onChange: function(option, checked){
            if($('#devId option:selected').length > 0){
                if(sign == 0){
                    var SelectedAgentId = $('#devId option:selected').text().split("/")[1];
                    var SelectedDeviceid = ChangeAidtoDid(data, SelectedAgentId);
                    getappcontrol(SelectedAgentId, SelectedDeviceid);
                    getsensorstatus();
                    sign++;
                }
            }
        }
    });
}

function ChangeAidtoDid(data, aid){
	for(var i=0;i<Object.keys(data).length;i++){
		if(data[i][0] === aid){
			return data[i][3];
		}
	}
	return false;
}
function getsensorstatus(){
    $('.btnFunction').on("click",function() {
        if($('#devId option:selected').length == 0){
            swal("","Please select your device","info")
            return;
        }
        var type = $(this).attr('data-val');
        var setsensordata = {};
        var setsensorid,setsensorval;
        var sensorval = $(this).attr("data-type");
        if(sensorval == "on"){
            setsensorval = true;
        }else{
            setsensorval = false;
        }
		switch(type) {
			case "wifi":
                setsensorid = GetSettingsStatusSensor.wifi;
				break;
			case "bluetooth":
                setsensorid = GetSettingsStatusSensor.bluetooth;
				break;
			case "lockscreen":
                setsensorid = GetSettingsStatusSensor.lockscreen;
				break;
			default:
				break;
        }
        $('#devId option:selected').each(function() {
            var selectedagentid =　$(this).text().split("/")[1];
            setsensordata.agentId = selectedagentid;
            setsensordata.plugin = AimSdkPlugin;
            setsensordata.sensorIds = [];
            setsensordata.sensorIds[0]={"n":setsensorid, "bv":setsensorval};
            apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
                if(data.items[0].statusCode == "200"){
                    swal("","success","success").then(function(){
                        $('#myModal').modal('hide');
                    })
                }
            })
        });
		
      
    })
}

function powfunc(cid){
    if($('#devId option:selected').length == 0){
        swal("","Please select your device","info")
        return;
    }
    swal({
        title: "Are you sure?",
        text: cid+"all device",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then(function(willfunc){
        if (willfunc) {
            $('#devId option:selected').each(function() {
                var powdata = {};
                powdata.action = cid;
                powdata.did = $(this).val();
                apiput("rmm/v1/power/device", powdata).then(function(data){
                    if(data.result == true){
                        swal("", cid+" success", "success")
                    }
                })
            })
            
        }
    })  
}

// appcontrol setting
function getappcontrol(SelectedAgentId,  SelectedDeviceId){
    var GetSensorsData={};
        var deviceid;;
        GetSensorsData.agentId = SelectedAgentId;
        GetSensorsData.plugin = AimSdkPlugin;
        GetSensorsData.sensorId = AppFuncSensor['allappinfo'];
        deviceid = SelectedDeviceId;
        GetSensorsData._ = Date.parse(new Date());
        var myurl = "rmm/v1/devicectrl/"+deviceid+"/data";
        apiget(myurl, GetSensorsData).then(function(obj){
            console.log(JSON.parse(obj.sensorIds[0].sv))
            var apppackageinfo = JSON.parse(obj.sensorIds[0].sv);
            SetAppList(apppackageinfo.data);
        })
}

function SetAppList(data){
    var aptmsg  = '';
    data.forEach(function(val, index){
        aptmsg+="<option value='"+val.packageName+"'>"+val.appName+"</option>";
    });
    $(".applist").html(aptmsg);
}

function　appcontrol(cid){
    var setsensorval;
    if($('#devId option:selected').length == 0){
        swal("","Please select your device","info")
        return;
    }
    $('#devId option:selected').each(function() {
        setsensorid = AppfuncSensor[cid];
        if(cid == "installapp"){
            var appname= $("#installapp").find("option:selected").text();
            var setsensorval = ftpurl + appname;
        }else{
            var setsensorval = $("#"+cid).val();
        }
        var selectedagentid =　$(this).text().split("/")[1];
        setsensordata.agentId = selectedagentid;
        setsensordata.plugin = AimSdkPlugin;
        setsensordata.sensorIds = [];
        setsensordata.sensorIds[0]={"n":setsensorid, "sv":setsensorval};
        apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
            if(data.items[0].statusCode == "200"){
                swal("","success","success").then(function(){
                    $('#myModal').modal('hide');
                })
            }
        })
    })
}
