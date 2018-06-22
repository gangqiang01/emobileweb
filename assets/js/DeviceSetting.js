// var ftpurl = "http://47.95.248.121:30010/";
var deviceMonitorTimer , SelectedDeviceId, SelectedAgentId;

var SystemMonitorPlugin = "ProcessMonitor";
var AimSdkPlugin = "AimSdk";
var DroidRoot = "DroidRoot";
var RepoAppBaseUrl = "http://172.21.73.109:30001/vuethink/php/index.php/admin/Restrepo/"
var RepoAppBaseDownloadUrl = "http://172.21.73.109:30002"
var SettingsStatusSensor = {
    wifi: "/devicectrl/ctrl-wifi",
    bluetooth: "/devicectrl/ctrl-bluetooth",
    lockscreen: "/securityctrl/ctrl-lockscreen", 
    systemversion: "/devicectrl/get-system-version",
    systemboard: "/devicectrl/get-system-board",
    systemmodel: "/devicectrl/get-system-model",
    agentversion: "/devicectrl/get-agent-version",
};
var cpudata = new Array(7);
var memorydata = new Array(7);
var AppFuncSensor = {
    allappinfo: "/appctrl/get-all-app-info",
    disableapp: "/appctrl/disable-some-app",
    enableapp: "/appctrl/enable-some-app",
    installapp: "/appctrl/download-install-some-app",
    upgradeapp: "/appctrl/download-install-some-app",
    removeapp: "/appctrl/remove-some-app",
    startapp: "/appctrl/start-some-app",
    stopapp: "/rootctrl/stop-some-app"
};



//onload page
$(function() {
	LoginStatus("DeviceSetting.html"); 
    SetHTML("barset_devicesetting");
    getDeviceGroup();
    initdraw();

});

function initdraw(){
    drawCpuChart(new Array(7));
    drawMemoryChart(new Array(7));
//    var apptable = $('#AppTables').DataTable();
//     apptable.clear().draw();
}


function getDeviceDetails(agentid, deviceid){
    if(agentid == false){
        console.log("agentid:","is null")
        return;
    }
    SelectedDeviceId = deviceid;
    SelectedAgentId = agentid;
    if(SelectedDeviceId == undefined || SelectedAgentId == undefined){
        if(deviceMonitorTimer != undefined){
            window.clearInterval(deviceMonitorTimer);
        }
    }

    // $('#AppTables').DataTable().destroy();
    startDeviceMonitor()
    // $("#device-tab a:first").tab("show");
    getSensorStatus();

}

function getTimeOptions(){
    var options=[];
    var date = new Date();
	var time = "";
    var Hours =  date.getHours();if(Hours<10) Hours = "0"+Hours;
    var Min = date.getMinutes();if(Min<10) Min = "0"+Min;
	var Sec =  date.getSeconds();if(Sec<10) Sec = "0"+Sec;
    for (var i=0;i<=6;i++){
        time =  Hours+":"+Min+":"+Sec;
        options.unshift(time)
        Sec = Sec - 3;
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
function startDeviceMonitor(){
    var intervalReportData = {};
    intervalReportData.agentid = SelectedAgentId;
    intervalReportData.plugin = SystemMonitorPlugin;
    intervalReportData.interval = 1;
    intervalReportData.timeout = 30;
    apiput("rmm/v1/devicectrl/intermittent_report", intervalReportData).then(function(data){
        if(data.result = true){
            deviceMonitor();
            deviceMonitorTimer=window.setInterval(function(){
                deviceMonitor()
            },3000)
         }else{
            console.log("inetervalreport error")
        }
    })
}
function deviceMonitor(){
    var cpuNowPercentage, MemoryNowPercentage;
    var GetSystemMonitorData = {};
    GetSystemMonitorData.agentId = SelectedAgentId;
    GetSystemMonitorData.plugin = SystemMonitorPlugin;
    GetSystemMonitorData._ = new Date().getTime();
    DeviceId = SelectedDeviceId;
    var myurl = "rmm/v1/data/devices/"+DeviceId+"/latestdata";
    apiget(myurl, GetSystemMonitorData).then(function(data){
        if(data.connected == false){
            swal("","this Device has been offline","info").then(function(){
                window.clearInterval(deviceMonitorTimer);
                return;
            });

        }else if(data.ProcessMonitor == undefined){
            swal("","your data miss","info").then(
                function(){
                    window.clearInterval(deviceMonitorTimer)
                    return;
                }
            ); 
        }
        cpuNowPercentage = data.ProcessMonitor["System Monitor Info"]["e"][0].v;
        var ToMemoryData = data.ProcessMonitor["System Monitor Info"]["e"][1].v
        var NewMemoryData = ToMemoryData-data.ProcessMonitor["System Monitor Info"]["e"][2].v;
        MemoryNowPercentage = parseInt(NewMemoryData/ToMemoryData*100);
        cpudata.push(cpuNowPercentage);
        cpudata.shift();
        memorydata.push(MemoryNowPercentage);
        memorydata.shift();
        drawCpuChart(cpudata,cpuNowPercentage)
        drawMemoryChart(memorydata, MemoryNowPercentage)
    })
}

function drawCpuChart(cpudata, cpuNowPercentage){
    var labelOptions = getTimeOptions();
    if(cpuNowPercentage == undefined){
        cpuNowPercentage = 0;
    }
    var ctx = document.getElementById("cpu_chart").getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'CPU Usage('+cpuNowPercentage+'%)',
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

function drawMemoryChart(memorydata, MemoryNowPercentage){
    if(MemoryNowPercentage == undefined){
        MemoryNowPercentage = 0;
    }
    var labelOptions = getTimeOptions();
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
function getSensorStatus(){
    var sensorids = "";
    var AppManagementInfoArray = [];
    var deviceapparray = [];
    var deviceid;
    for(var key in SettingsStatusSensor){
            sensorids += SettingsStatusSensor[key]+"|";
    }
    sensorids+= "/appctrl/get-all-app-info"
    var GetSensorsData={};
    GetSensorsData.agentId = SelectedAgentId;
    GetSensorsData.plugin = AimSdkPlugin;
    GetSensorsData.sensorId = sensorids;
    deviceid = SelectedDeviceId;
    GetSensorsData._ = Date.parse(new Date());
    var myurl = "rmm/v1/devicectrl/"+deviceid+"/data";
    apiget(myurl, GetSensorsData).then(function(obj){
        var sensorarray = obj.sensorIds;
        sensorarray.forEach(function(val){
            var sensorid = val.sensorId;
            for(var sensor_key in SettingsStatusSensor){
                if(sensorid == AimSdkPlugin+SettingsStatusSensor[sensor_key] ){
                    if(val.bv != undefined){
                        var sensorval = val.bv;
                        if(sensorval == "true"){
                            $("#"+sensor_key).bootstrapToggle('on'); 
                        }else if(sensorval == "false"){
                            $("#"+sensor_key).bootstrapToggle('off');
                        }
                    }else if(val.sv != undefined){
                        var sensorval = val.sv;
                        $("#"+sensor_key).val(sensorval);
                    }
                   
                }
            }
            if(sensorid == AimSdkPlugin+AppFuncSensor.allappinfo){
                var apppackageinfo = JSON.parse(val.sv);
                setAppControlList(apppackageinfo.data, AppManagementInfoArray, deviceapparray);
                getRepoApps(AppManagementInfoArray, deviceapparray);
            }
            
        })  
    })

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
                setsensorid = SettingsStatusSensor.wifi;
                setsensorval = !$("#wifi").prop('checked');
				break;
			case "bluetooth":
                setsensorid = SettingsStatusSensor.bluetooth;
                setsensorval = !$("#bluetooth").prop('checked');
				break;
			case "lockscreen":
                setsensorid = SettingsStatusSensor.lockscreen;
                setsensorval = !$("#lockscreen").prop('checked');
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
                swal("","success","success")
            }else{
                $("#"+type).bootstrapToggle(setsensorval);
            }
        })
      
    })
}

//get repo apps
function getRepoApps(AppManagementInfoArray, deviceapparray){
    var token;
    var InstallAppManagementInfo = {};
    var UpgradeAppManagementInfo = {};
    var AppInfoUrl = RepoAppBaseUrl + "getapkinfo/reponame/aim-market";
    var repourl = RepoAppBaseUrl + "gettoken";

    var formData = {username:"jinxin",passwd:"jinxin"};
    var info_data;
    repoapipost(repourl, formData).then(function(token_data){
        token = token_data.token;
        repoapiget(AppInfoUrl, info_data , token).then(function(installappdata){
            console.log(installappdata);
            if(installappdata.data){
                var installappopt = "";
                var upgradeappopt = "";
                var lastVersionCode = [];
                installappdata.data.forEach(function(val){
                    var version = val.versionName != null ? val.versionName:"";
                    InstallAppManagementInfo = {type : "installapp", appname: val.filename, package: val.pkgname, versioncode: val.versioncode, version: val.versionname};
                    AppManagementInfoArray.push(InstallAppManagementInfo);
                    deviceapparray.forEach(function(deviceapp_val){
                        if(val.pkgname === deviceapp_val.package){
                            if (val.versioncode > deviceapp_val.versioncode){
                                if(lastVersionCode[val.pkgname] === undefined || val.versioncode > lastVersionCode[val.pkgname]){
                                    lastVersionCode[val.pkgname] = val.versioncode;
                                    AppManagementInfoArray.pop(); 
                                    removeObjInArray(AppManagementInfoArray, val.pkgname);
                                    // upgradeappopt+="<option value='"+val.pkgname+"' data-subtext='"+val.versionname+"'>"+val.filename+"</option>";
                                    UpgradeAppManagementInfo = {
                                        type : "upgradeapp", 
                                        appname: deviceapp_val.appname,
                                        upgradeapk : val.filename, 
                                        package: val.pkgname, 
                                        versioncode: val.versioncode,
                                        latestversion: val.versionname, 
                                        version: deviceapp_val.version};
                                    AppManagementInfoArray.push(UpgradeAppManagementInfo);     
                                }
                            }else{
                                AppManagementInfoArray.pop(); 
                            }
                             
                        }
                        
                    })
                })
            }
            drawAppManagement(AppManagementInfoArray);
        })
    })
}

function removeObjInArray(OriginData, rem_apk_val){
    OriginData.forEach(function(obj_val, index){
        if(obj_val.package === rem_apk_val){
            OriginData.splice(index ,1)
        }
    })
}

function setAppControlList(data, AppManagementInfoArray, deviceapparray){
　　  var optmsg  = '';
    var upgradeoptmsg = "";
    var UninstallAppManagementInfo = {};
    data.forEach(function(val, index){

        var version = val.versionName != null?val.versionName:"";
        UninstallAppManagementInfo = {type : "uninstallapp", appname: val.appName, package: val.packageName, versioncode: val.versionCode, version: val.versionName};
        AppManagementInfoArray.push(UninstallAppManagementInfo);
        deviceapparray.push(UninstallAppManagementInfo);
        optmsg+="<option value='"+val.packageName+"' data-subtext='"+val.versionName+"'>"+val.appName+"</option>";
    });
    $("select.applist").html(optmsg).selectpicker('refresh');
}
    
// html trigger func 
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
// html trigger
function appcontrol(cid){
    var setsensorval;
    if(!SelectedAgentId){
        swal("","Please select your device","info")
        return;
    }
    setsensorval = $("#"+cid).val();
    setAppSensor(cid, setsensorval)
}

function　setAppSensor(cid, setsensorval){
    if(cid === "removeapp" || cid === "disableapp" || cid === "installapp" || cid === "upgradeapp"){
        swal({
            title: "Are you sure?",
            text: cid,
            icon: "warning",
            buttons: true,  
            dangerMode: true,
        })
        .then(function(willfunc){
            if (willfunc) {
                $(".loading").show();
                var setsensordata = {};
                setsensorid = AppFuncSensor[cid]; 
                setsensordata.agentId = SelectedAgentId;
                setsensordata.plugin = AimSdkPlugin;
                setsensordata.sensorIds = [];
                setsensordata.sensorIds[0]={"n":setsensorid, "sv":setsensorval};
                apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
                    if(data.items[0].statusCode == "200"){
                        $(".loading").hide();
                        swal("","success","success").then(function(){
                            var interval = cid == "installapp" ? 5000 : 1000;
                            window.setTimeout(function(){
                                getSensorStatus();
                            }, interval);
                        })
                    }
                })
            }
        })
    }else if(cid == "stopapp"){
        var setsensordata = {};
        setsensorid = AppFuncSensor[cid]; 
        setsensordata.agentId = SelectedAgentId;
        setsensordata.plugin = DroidRoot;
        setsensordata.sensorIds = [];
        setsensordata.sensorIds[0]={"n":setsensorid, "sv":setsensorval};
        apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
            if(data.items[0].statusCode == "200"){
                swal("","success","success")
            }
        })
    }else{
        var setsensordata = {};
        setsensorid = AppFuncSensor[cid]; 
        setsensordata.agentId = SelectedAgentId;
        setsensordata.plugin = AimSdkPlugin;
        setsensordata.sensorIds = [];
        setsensordata.sensorIds[0]={"n":setsensorid, "sv":setsensorval};
        apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
            if(data.items[0].statusCode == "200"){
                swal("","success","success")
            }
        })
    }
}

// app management
function drawAppManagement(AppManagementInfoArray) { 
    //---- device table ----//
    var table 
    if ( $.fn.dataTable.isDataTable('#AppTables') ) {
        table = $('#AppTables').DataTable();
    }else {
        $('#AppTables').dataTable({
            paging: false,
            "columnDefs": [
            {

                "targets": 0,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                    var fa ='<img src="assets/img/icon_apk.png" class="img-btn pull-left"  ><span class="img_span">'+data[0]+"</span>";
                    return fa;
                },
            },
            {
                "targets": 3,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                    var fa;
                    if(data[3] == "installapp"){
                        fa = '<div class="btn-group" role="group" >'+
                            '<a class="btn btn-success" data-type="installapp">'+
                            '<i class="fa fa-download fa-x" style="padding-right:5px"></i>Install</a>'+
                        '</div>';
                    }else if(data[3] == "uninstallapp"){
                        if(data[1] === "org.flyve.mdm.agent"){
                            fa = '<div class="btn-group" role="group" >'+
                            '<a class="btn btn-danger" data-type="removeapp" disabled>'+
                            '<i class="fa fa-trash fa-x" style="padding-right:5px"></i>Uninstall</a>'+
                        '</div>'; 
                        }else{
                            fa = '<div class="btn-group" role="group" >'+
                            '<a class="btn btn-danger" data-type="removeapp">'+
                            '<i class="fa fa-trash fa-x" style="padding-right:5px"></i>Uninstall</a>'+
                        '</div>'; 
                        }
                        
                    }else if(data[3] == "upgradeapp"){
                        if(data[1] === "org.flyve.mdm.agent"){
                            fa = '<div class="btn-group" role="group" >'+
                            '<a class="btn btn-info" data-type="upgradeapp">'+
                            '<i class="fa fa-arrow-circle-up fa-x" ></i>Upgrade</a>'+
                            '<a class="btn btn-danger" data-type="removeapp" disabled>'+
                            '<i class="fa fa-trash fa-x"></i>Uninstall</a>'+
                        '</div>'
                        }else{
                            fa = '<div class="btn-group" role="group" >'+
                            '<a class="btn btn-info" data-type="upgradeapp">'+
                            '<i class="fa fa-arrow-circle-up fa-x" ></i>Upgrade</a>'+
                            '<a class="btn btn-danger" data-type="removeapp">'+
                            '<i class="fa fa-trash fa-x"></i>Uninstall</a>'+
                        '</div>'
                        }
                        
                    }
                    return fa;
                }
            }], 
            "order": [[ 3, "desc" ]],
            responsive: true
        });  

    }
    $('#AppTables tbody').on( 'click', 'tr>td:last-child a', function (e, dt, type, indexes) {
        table = $('#AppTables').DataTable();
        var SelectedAppData = table.row($(this).parent().parent()).data();
        var cid = $(this).attr("data-type");
        if(cid == "installapp"){
            var appname= SelectedAppData[0];
            var pkgname= SelectedAppData[1];
            var versionname = SelectedAppData[2];
            var reponame = "95cbbb6613127668fdd633b2cc006d47";
            setsensorval = RepoAppBaseDownloadUrl + "/"+ reponame +"/" + pkgname +　"/" + versionname + "/" + appname;
        }else if(cid == "upgradeapp"){
            var appname= SelectedAppData[4];
            var pkgname= SelectedAppData[1];
            var versionname = SelectedAppData[5];
            var reponame = "95cbbb6613127668fdd633b2cc006d47";
            setsensorval = RepoAppBaseDownloadUrl + "/"+ reponame +"/" + pkgname +　"/" + versionname + "/" + appname;
        }else{
            setsensorval = SelectedAppData[1];
        }  
        setAppSensor(cid, setsensorval);
    });
   
    GetAppManagementData(AppManagementInfoArray);
}

function GetAppManagementData(AppManagementInfoArray){
    table = $('#AppTables').DataTable();
    table.column(4).visible( false );
    table.column(5).visible( false );
    table.clear();
    if(!AppManagementInfoArray || AppManagementInfoArray.length == 0){
        table.clear().draw();
    //	return;
    }else{
        for(var i=0, len=AppManagementInfoArray.length;i<len;i++){
            var versionname, appname, pkgname, action, upgradeapk,latestversion;
            versionname = AppManagementInfoArray[i].version;
            upgradeapk = AppManagementInfoArray[i].upgradeapk == undefined? "": AppManagementInfoArray[i].upgradeapk;
            latestversion = AppManagementInfoArray[i].latestversion == undefined? "": AppManagementInfoArray[i].latestversion;
            appname =AppManagementInfoArray[i].appname;
            pkgname =AppManagementInfoArray[i].package;
            action =AppManagementInfoArray[i].type;
            //add row in table
            var rowNode = table.row.add([
                appname,
                pkgname,
                versionname,
                action,
                upgradeapk,
                latestversion

            ]).draw( false ).node();
            $( rowNode ).addClass('demo4TableRow');
            $( rowNode ).attr('data-row-id',i);
        }
    }
    $($.fn.dataTable.tables(true)).DataTable()
    .columns.adjust()
    .responsive.recalc();
}
