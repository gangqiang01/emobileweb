// var ftpurl = "http://47.95.248.121:30010/";


//onload page
$(function() {
    var  SelectedDeviceId, SelectedAgentId, desktopName, rfb;
    var vnc_mode = 3;
    var repeaterId = Math.floor(Math.random()*9000) + 1000;
    
	LoginStatus("vncview.html"); 
    SetHTML("barset_vncview");
    $('#open_terminal_button').on("click", function(){
        startTerminal();
    })
    document.getElementById("VNC_closed").onclick = disconnectVNC;
    getDeviceGroup();
    
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

    function getTerminalpropertys(){
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
        
    function startTerminal(){
            var container = document.getElementById("vt100");
            var agentid = SelectedAgentId;
            var sessionid = uuid();
            var type = "SSO";
            var host = "portal-rmm.wise-paas.com";
            new ShellInABox(container,agentid,sessionid,host,type);
        
    }
    // If a token variable is passed in, set the parameter in a cookie.
    // This is used by nova-novncproxy.

        

});
