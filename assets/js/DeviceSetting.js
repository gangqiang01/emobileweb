var ftpurl = "http://47.95.248.121:30010/";
var timer, timer1, SelectedDeviceId, SelectedAgentId;
var cpudata = new Array(7);
var memorydata = new Array(7);
var SystemMonitorPlugin = "ProcessMonitor";
var AimSdkPlugin = "AimSdk";
var ReturnCount = 0;
var AllOptions = "";
var setting_sign = 0;
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
};



//onload page
$(function() {
	LoginStatus("DeviceSetting.html"); 
    SetHTML("barset_devicesetting");
    GetDeviceGroup();
    initdrawchart();
});

function initdrawchart(){
    drawcpuchart(cpudata)
    drawmemorychart(memorydata)
}


function GetDeviceDetails(agentid, deviceid){
    if(agentid == false){
        console.log("agentid:","is null")
        return;
    }
    SelectedDeviceId = deviceid;
    SelectedAgentId = agentid;
    if(SelectedDeviceId == undefined || SelectedAgentId == undefined){
        if(timer != undefined){
            window.clearInterval(timer);
        }
    }
    devicemonitor();
    timer=window.setInterval(function(){
        devicemonitor()
    },3000)
    $("#device-tab a:first").tab("show");
    // getsensorstatus();
    getappcontrol();
    timer1= window.setTimeout(function(){
        getsensorstatus()
    },1000)
}

// function funcchange(){
//     if(!SelectedAgentId){
//         return;
//     }
//     getsensorstatus()();

// }
// devicemonitor set
function gettimeoptions(){
    var options=[];
    var date = new Date();
	var time = "";
    var Hours =  date.getHours();if(Hours<10) Hours = "0"+Hours;
    var Min = date.getMinutes();if(Min<10) Min = "0"+Min;
	var Sec =  date.getSeconds();if(Sec<10) Sec = "0"+Sec;
    for (var i=0;i<=6;i++){
        time =  Hours+":"+Min+":"+Sec;
        options.unshift(time)
        Sec = Sec - 5;
        if(Sec<10&&0<=Sec){
            Sec = "0"+Sec;
        }else if(Sec<0){
            Sec=60+Sec;
            Min--;
            if(Min<10){
                Min = "0"+Min;
            }
        }
    }
    return options;
	
}

function devicemonitor(){
    var CpuNowPercentage, MemoryNowPercentage;
    var GetSystemMonitorData = {};
    GetSystemMonitorData.agentId = SelectedAgentId;
    GetSystemMonitorData.plugin = SystemMonitorPlugin;
    GetSystemMonitorData._ = new Date().getTime();
    DeviceId = SelectedDeviceId;
    var myurl = "rmm/v1/data/devices/"+DeviceId+"/latestdata";
    apiget(myurl, GetSystemMonitorData).then(function(data){
        if(data.connected == false){
            swal("","this Device has been offline","info");
            window.clearInterval(timer);
            return;
        }else if(data.ProcessMonitor == undefined){
            swal("","your data miss","info");
            window.clearInterval(timer);
            return;
        }
        CpuNowPercentage = data.ProcessMonitor["System Monitor Info"]["e"][0].v;
        var ToMemoryData = data.ProcessMonitor["System Monitor Info"]["e"][1].v
        var NewMemoryData = ToMemoryData-data.ProcessMonitor["System Monitor Info"]["e"][2].v;
        MemoryNowPercentage = parseInt(NewMemoryData/ToMemoryData*100);
        cpudata.push(CpuNowPercentage);
        cpudata.shift();
        memorydata.push(MemoryNowPercentage);
        memorydata.shift();
        drawcpuchart(cpudata,CpuNowPercentage)
        drawmemorychart(memorydata, MemoryNowPercentage)
    })
}

function drawcpuchart(cpudata, CpuNowPercentage){
    var labelOptions = gettimeoptions();
    if(CpuNowPercentage == undefined){
        CpuNowPercentage = 0;
    }
    var ctx = document.getElementById("cup_chart").getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'CPU Usage('+CpuNowPercentage+'%)',
                data: cpudata,
                backgroundColor: "transparent",
                borderColor : "rgba(51,122,183,0.5)",
            }],
            labels: labelOptions
        },
        options: {
            animation: {
                duration: 0
            },
            title: {
                display: true,
                text: 'CPU Monitor',
                fontColor: "#428bca",
                lineHeight: "1.2",
                fontSize: "17"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        stepSize: 10
                    }
                }]
            }
        }
    });

}

function drawmemorychart(memorydata, MemoryNowPercentage){
    if(MemoryNowPercentage == undefined){
        MemoryNowPercentage = 0;
    }
    var labelOptions = gettimeoptions();
    var ctx = document.getElementById("memory_chart").getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Memory Usage('+ MemoryNowPercentage+'%)',
                data: memorydata,
                backgroundColor: "transparent",
                borderColor : "rgba(45,213,179,0.5)",
            }],
            labels: labelOptions
        },

        options: {
            animation: {
                duration: 0
            },
            title: {
                display: true,
                text: 'Memory Monitor',
                fontColor: "#337ab7",
                lineHeight: "1.2",
                fontSize: "17"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        stepSize: 10
                    }
                }]
            }
        }
    });
}

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
	for(var i=0;i<Object.keys(data).length;i++){
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
		GetDeviceDetails(AgentId, ChangeAidtoDid(data, AgentId));
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

function initsettings(count){
    if(count<0){
        return;
    }
    var GetSensorsData={};
    var deviceid;
    console.log(Object.keys(GetSettingsStatusSensor))
    var eleid = Object.keys(GetSettingsStatusSensor)[count];
    var sensorid =  GetSettingsStatusSensor[eleid];
    GetSensorsData.agentId = SelectedAgentId;
    GetSensorsData.plugin = AimSdkPlugin;
    GetSensorsData.sensorId = sensorid;
    deviceid = SelectedDeviceId;
    GetSensorsData._ = Date.parse(new Date());
    var myurl = "rmm/v1/devicectrl/"+deviceid+"/data";
    apiget(myurl, GetSensorsData).then(function(obj){
        console.log(obj.sensorIds[0].sensorId,eleid);
        var sensorval = obj.sensorIds[0].bv;
        if(sensorval == "true"){
            $("#"+eleid).bootstrapToggle('on');
        }else if(sensorval == "false"){
            $("#"+eleid).bootstrapToggle('off');
        }
        count--;
        setting_sign++;
        initsettings(count);
    })
    
}
// device settings
function getsensorstatus(){
    if(!SelectedAgentId || setting_sign>0){
        return;
    }
    var count = Object.keys(GetSettingsStatusSensor).length-1;
    initsettings(count);
    window.clearTimeout(timer1);
// function getsensorstatus(){
//     var sensorids = "";
//     var deviceid;
//     for(var i=0;i<Object.keys(GetSettingsStatusSensor).length;i++){
//         var eleid = Object.keys(GetSettingsStatusSensor)[i];
//         if(i>Object.keys(GetSettingsStatusSensor).length-2){
//             sensorids += GetSettingsStatusSensor[eleid];
//         }else{
//             sensorids += GetSettingsStatusSensor[eleid]+"|";
//         }
//     }
//     sensorids+= "|/appctrl/get-all-app-info"
//     var GetSensorsData={};
//     GetSensorsData.agentId = SelectedAgentId;
//     GetSensorsData.plugin = AimSdkPlugin;
//     GetSensorsData.sensorId = sensorids;
//     deviceid = SelectedDeviceId;
//     GetSensorsData._ = Date.parse(new Date());
//     var myurl = "rmm/v1/devicectrl/"+deviceid+"/data";
//     apiget(myurl, GetSensorsData).then(function(obj){
//         console.log(obj);
//         // var sensorval = obj.sensorIds[0].bv;
//         // if(sensorval == "true"){
//         //     $("#"+eleid).bootstrapToggle('on'); 
//         // }else if(sensorval == "false"){
//         //     $("#"+eleid).bootstrapToggle('off');
//         // }
//     })
        
 
    console.log($('.btnFunction').next(".toggle-group"))
    $('.btnFunction').next(".toggle-group").on("click",function() {
        if(!SelectedAgentId){
            swal("","Please select your device","info")
            return;
        }
        var type = $(this).prev(".btnFunction").attr('value');
        var setsensordata = {};
        var setsensorid,setsensorval;
		switch(type) {
			case "wifi":
                setsensorid = GetSettingsStatusSensor.wifi;
                setsensorval = $("#wifi").prop('checked')
				break;
			case "bluetooth":
                setsensorid = GetSettingsStatusSensor.bluetooth;
                setsensorval = $("#bluetooth").prop('checked')
				break;
			case "lockscreen":
                setsensorid = GetSettingsStatusSensor.lockscreen;
                setsensorval = $("#lockscreen").prop('checked')
				break;
			default:
				break;
		}
		setsensordata.agentId = SelectedAgentId;
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
      
    })
}

function powfunc(cid){
    if(!SelectedDeviceId){
        swal("","Please select your device","info")
        return;
    }
    swal({
        title: "Are you sure?",
        text: cid+" this device",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then(function(willfunc){
        if (willfunc) {
            var powdata = {};
            powdata.action = cid;
            powdata.did = SelectedDeviceId;
            apiput("rmm/v1/power/device", powdata).then(function(data){
                if(data.result == true){
                    swal("", cid+" success", "success")
                }
            })
        }
    })  
}

// appcontrol setting
function getappcontrol(){
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
    var setsensordata = {};
    if(!SelectedAgentId){
        swal("","Please select your device","info")
        return;
    }
    
    if(cid == "installapp"){
        // var select = document.getElementById("installapp");
        // var appname = select.options[select.selectedIndex].text;
        var appname= $("#installapp").find("option:selected").text();
        var setsensorval = ftpurl + appname;
    }else{
        var setsensorval = $("#"+cid).val();
    }
    setsensorid = AppFuncSensor[cid];
    setsensordata.agentId = SelectedAgentId;
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
}
