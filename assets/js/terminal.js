// var ftpurl = "http://47.95.248.121:30010/";


//onload page
$(function() {
    var  SelectedDeviceId, SelectedAgentId;

    
	LoginStatus("terminal.html"); 
    SetHTML("barset_terminal");
    $('#open_terminal_button').on("click", function(){
        startTerminal();
    })

    $("#groupId").on("change", function(){
        GetAllDevices();
    })
    
    document.getElementById("Terminal_closed").onclick = disconnectTerminal;
    getDeviceGroup();
    
    function getDeviceDetails(agentid, deviceid){
        if(agentid == false){
            console.log("agentid:","is null")
            return;
        }
// disconnect websocket of terminal
        disconnectTerminal();

        SelectedDeviceId = deviceid;
        SelectedAgentId = agentid;
        

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
    function startTerminal(){
        if(!SelectedAgentId){
            swal("","Please select your device","info");
            return;
        }
        var container = document.getElementById("vt100");
        var agentid = SelectedAgentId;
        var sessionid = uuid();
        var type = "SSO";
        var host = "portal-rmm.wise-paas.com";
        
        $("#vt100").hide();
        var iframeSrcMsg=`./shellinabox/webshell.html?agentID=${agentid}&sessionID=${sessionid}&host=${host}&type=SSO`;
        console.log($("#terminal_iframe").attr("attr"));
        $("#terminal_iframe").attr("src",iframeSrcMsg);
        $("#Terminal_closed").show();
        $("#Terminal_closed").on('click', function(){
            disconnectTerminal();
        })
    }

    function disconnectTerminal(){
        var disconnectTerminalMsg = `
            <div id="vt100">          
                <div id="Terminal_enter">
                    <h2 class="Terminal_title">Open Your Device's Terminal</h2>
                    <a class="btn btn-info" id="open_terminal_button">
                        <i class="fa fa-link"></i> Open
                    </a>
                </div>   
            </div>
            <i class="fa fa-times fa-x pointer" id="Terminal_closed" style="display:none" ></i>
            <iframe src="" frameborder="0" id="terminal_iframe"></iframe>
        `;
        $("#terminal").html( disconnectTerminalMsg);
        // _terminalWebsocket.closeTerminal();
        $('#open_terminal_button').on("click", function(){
            startTerminal();
        })
    }
});
