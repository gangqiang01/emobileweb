
(function(){


// called when the client connects
    function onConnect() {
        console.log("connect")
        // Once a connection has been made, make a subscription and send a message.
        client.subscribe(localStorage.getItem("Company")+";"+getCookie("UserName")+"jsAddress");

    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
        //getDevices/105097a64039f68bM77000221/devNAME:-/arAgentVer:1.0.0.0/devModel:AIM8I
        if(   message.payloadString.indexOf("getDevices") >=0){
            //devices information back from golang 
            //when: devices heartbeat every five minutes or update devices button from user
            if(location.pathname === "/AllDevice.html"){
                var tmp = message.payloadString;
                var MessageReceived = tmp.split("/");
                var name = MessageReceived[2].split(":");
                var version = MessageReceived[3].split(":");
                var model = MessageReceived[4].split(":");
            
                UpdateDevices(MessageReceived[1],name[1]);
                if(m_Update === true){
                    for(var i=0;i<Object.keys(m_devices).length;i++){
                        if(MessageReceived[1] === m_devices[i][0]){
                            m_devices[i][1] = true;
                        }
                    }
                }
            }
            
        }else if( message.payloadString.indexOf("gps") >=0){
            //command Get Coordinates (json file number:4)
            if(location.pathname === "/googlemap3.html"){
                var devicemap = [];
                var count = 0;
                var tmp = message.payloadString;
                var MessageReceived = tmp.split("/");
                var Lat = MessageReceived[1].split(":");
                var Lng = MessageReceived[2].split(":");
                var deviceid = MessageReceived[3].split(":");
                var tmp = true;
                for (var i=0; i<devicemap.length+1; i++){
                    if(devicemap[i] === deviceid[1]){
                        tmp = false;
                    }
                    
                }
                if(tmp === true ){
                    Setplace(parseFloat(Lat[1]), parseFloat(Lng[1]), deviceid[1]);
                    devicemap.push(deviceid[1]);
                    if(count === 0) {Panto(0, position[0], map);toggleBounce(0);}
                    count++;
                    document.getElementById("loading").style.display = "none";
                }
                
                if(count >= sdevice){
                    document.getElementById("spin").style.display = "none";
                }
            }else{
                var tmp = message.payloadString;
                var MessageReceived = tmp.split("/");
                var Lat = MessageReceived[1].split(":");
                var Lng = MessageReceived[2].split(":");
                var deviceid = MessageReceived[3].split(":");
                SetNotificationBell("add");
                var device = "'"+MessageReceived[1]+"'";var accept = "'accept'";var refuse = "'refuse'";
                // var invitecontent = SetSubscribeNotification(deviceid[0], MessageReceived[3], device, accept, refuse );
                // document.getElementById("notification_content").innerHTML += invitecontent;		
            }
            
        }else if( message.payloadString.indexOf("checkRoot") >=0){
            //command Get root status (json file number:58)
            if(location.pathname === "/AllDevice.html"){
                var tmp = message.payloadString;
                var MessageReceived = tmp.split("/");
                console.log(MessageReceived);
                if(MessageReceived[2] === "true"){
                    document.getElementById("GetRoot").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-check" aria-hidden="true" style="color:green;">already root</i></p><br>';
                }else{
                    document.getElementById("GetRoot").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-times" aria-hidden="true" style="color:red;">no root</i></p><br>';
                }
            }
            
        }else if( message.payloadString.indexOf("getTopActivity") >=0){
            //command Get top activity (json file number:59)
            if(location.pathname === "/AllDevice.html"){
                var tmp = message.payloadString;
                var MessageReceived = tmp.split("/");
                if(MessageReceived[2] === ""){
                    document.getElementById("GetTopActivity").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-rss" aria-hidden="true" style="color:red;padding-right:5px;"></i>No Top Activity received(in a minute)</p><br>';
                }else{
                    document.getElementById("GetTopActivity").innerHTML += '<p>'+MessageReceived[1]+':  <i class="fa fa-rss" aria-hidden="true" style="color:green;padding-right:5px;"></i>'+MessageReceived[2]+'</p><br>';
                }
            }
            
        }else if( message.payloadString.indexOf("getRunningServices") >=0){
            //command Get running services (json file number:60)
            if(location.pathname === "/AllDevice.html"){
                var tmp = message.payloadString;
                var Message = tmp.split("//");
                var MessageReceived = Message[0].split("/");
                var MessageData = Message[1].split("/");
                document.getElementById("GetRunningService").innerHTML += '<p>'+MessageReceived[1]+': '+MessageData.length+'<div style="margin:5px;" class="btn-toolbar"><div class="btn-group"><button class="btn btn-default">Details</button><button data-toggle="dropdown" class="btn btn-default dropdown-toggle"><span class="caret"></span></button><ul class="dropdown-menu" id="run-'+MessageReceived[1]+'"></ul></div></div><br>';
                var n = 'run-'+MessageReceived[1];
                for(var i=0;i<MessageData.length;i++){
                    document.getElementById(n).innerHTML += '<li style="padding-left:5px;">'+MessageData[i]+'</li>';
                }
            }
        }else if( message.payloadString.indexOf("setDeviceEnrollUser") >=0){
            //Managed request from device 
            var tmp = message.payloadString;
            var MessageReceived = tmp.split("/");
            SetNotificationBell("add");
            var device = "'"+MessageReceived[1]+"'";var accept = "'accept'";var refuse = "'refuse'";
            // var invitecontent = SetSubscribeNotification(MessageReceived[1], MessageReceived[3], device, accept, refuse );
            // document.getElementById("notification_content").innerHTML += invitecontent;				
        }else if( message.payloadString.indexOf("sendtaskcomplete") >=0){
            // task completed at schedule
            var tmp = message.payloadString;
            var MessageReceived = tmp.split("%*%");
            var time = MessageReceived[4].split(":");
            var logid = MessageReceived[5].split(":");
            SetNotificationBell("add");
            var accept = "'view'";
            var invitecontent = SetScheduleNotification("Task Completed", time[1], logid[1] );
            document.getElementById("notification_content").innerHTML += invitecontent;	
            
            if(location.pathname === "/schedule.html"){
                EditScheduleStatus(MessageReceived[1]);
                var data = vm.events;var tmp;
                for(var i=0;i<Object.keys(data).length;i++){
                    if(MessageReceived[1] === data[i].scheduleid){
                        var ColorPrimaryDevice = ['#808080','#006400','#FF0000'];
                        var ColorsecondaryDevice = ['#DCDCDC','#99FF99','#FFCCCC'];
                        data[i].color = {
                            primary: ColorPrimaryDevice[0], // the primary event color (should be darker than secondary)
                            secondary: ColorsecondaryDevice[0]};
                        vm.events[i] = data[i];
                    }
                }
                
            }				
        }else if( message.payloadString.indexOf("deviceversion") >=0){
            //command Get System Version (json file number:13)
            if(location.pathname === "/AllDevice.html"){
                var tmp = message.payloadString;
                var MessageReceived = tmp.split(";;");
                var v = MessageReceived[0].split("/");
                var DeviceVersion = v[2].split(":");
                var Product = MessageReceived[1].split(":");
                var AndroidVer = MessageReceived[2].split(":");
                var BuildVer = MessageReceived[3].split(":");
                var RadioVer = MessageReceived[4].split(":");
                var Serial = MessageReceived[5].split(":");
                var Bootloader = MessageReceived[6].split(":");
                if($("#GetDeviceVersion").attr('value') === "0"){
                    document.getElementById("GetDeviceVersion").innerHTML += ''+
                            '<table class="display responsive nowrap" cellspacing="0" width="100%" id="dataTables-version">'+
                                '<thead>'+
                                    '<tr>'+
                                        '<th>Device Version</th>'+
                                        '<th>Product</th>'+
                                        '<th>Android Version</th>'+
                                        '<th>Build Version</th>'+
                                        '<th>Radio Version</th>'+
                                        '<th>Serial</th>'+
                                        '<th>Bootloader</th>'+
                                    '</tr>'+
                            '</thead>'+
                                '<tbody>'+
                                        
                                '</tbody>'+
                            '</table>';
                    $('#dataTables-version').dataTable( {
                        "order": [[ 1, "asc" ]],
                        rowReorder: {
                            selector: 'td:nth-child(0)'
                        },
                        responsive: true
                    } );
                    var VersionTable = $('#dataTables-version').DataTable();
                    
                    var rowNode = VersionTable.row.add( [
                        DeviceVersion[1],
                        Product[1],
                        AndroidVer[1],
                        BuildVer[1],
                        RadioVer[1],
                        Serial[1],
                        Bootloader[1]
                    ] ).draw( false ).node();
                    $("#GetDeviceVersion").attr('value') = 1;							
                }else{
                    var VersionTable = $('#dataTables-version').DataTable();
                    
                    var rowNode = VersionTable.row.add( [
                        DeviceVersion[1],
                        Product[1],
                        AndroidVer[1],
                        BuildVer[1],
                        RadioVer[1],
                        Serial[1],
                        Bootloader[1]
                    ] ).draw( false ).node();
                    $("#GetDeviceVersion").attr('value') = 1;		
                }
                
            }
        }else if( message.payloadString.indexOf("SysAlarm") >=0){
            
            var tmp = message.payloadString;
            var MessageReceived = tmp.split("/");
            var CPUsage = MessageReceived[3].split("SecCPU_Usage:");
            if(location.pathname === "/details.html"){
                SendByGolang(MessageReceived[1]+"/", GetCommand(27, "Comm")+"@%@"+GetCommand(27, "Path")+"@%@;;;"+GetCommand(27, "Param"), GetCommand(27, "CommTitle"), "stop", "system");	
            }
        }else if( message.payloadString.indexOf("getAllPackage") >=0){
            var tmp = message.payloadString;
            var MessageReceived = tmp.split("/");
            if(location.pathname === "/details.html"){
                console.log(selectedDeviceId);
                if(MessageReceived[1] === selectedDeviceId){
                    var Alltopic = MessageReceived[2].split("{");
                    for(var i=1;i<Alltopic.length;i++){
                        var etopic = Alltopic[i].split("}");
                        var topic = etopic[0].split(",");
                        var AppName = "", AppPackageName = "", AppType = "";
                        for(var j=0;j<topic.length;j++){
                            var fin = topic[j].split(":");
                            
                            if(j===0){
                                console.log("AppName:"+fin[1]);
                                AppName = fin[1];
                            }else if(j===1){
                                AppPackageName = fin[1];
                            }else if(j===2){
                                AppType = fin[1];
                            }
                            
                        }
                        SetAppList(AppName,AppPackageName, AppType);
                    }
                    PackagesNameReceived();
                }
            }
            
            
        }
    }	

    // Send command to golang server	
    //value_topic : device id (e.g. 9cc84dacd9bb8e59d4be07/dc0cffdcefef9d4be7e/ )	  
    //value_msg: command (e.g. soundSet;;;20) call GetCommand(number, "comm")+";;;"+GetCommand(number, "param") from json file(assets/json/)
    //command_msg: command log (for user)
    //value_command: command content (for user)
    //command_from: whose call this command (user or system)
    g.SendByGolang = function(value_topic ,value_msg, command_msg, value_command, command_from) {
        var postdata = {
            topic: value_topic,
            msg: value_msg,
            name: getCookie("UserName"),
            company: localStorage.getItem("Company"),
            command: command_msg,
            value: value_command,
            commandfrom: command_from,
            submit: "SendByGolang"
        }

        $.post("/golang",
        postdata,
        function(data,status){
            if(data !== undefined){
                if(location.pathname === "/AllDevice.html"){
                    //update log record
                    var t = value_topic.split("/");var target="";
                    for(var i=0; i<t.length-1; i++){
                        target += t[i] + '<br>';
                    }
                    if(command_from === "user"){
                        var LogTable = $('#LogTable').DataTable();
                        var rowNode = LogTable.row.add( [
                            GetNowTimes(),
                            getCookie("UserName"),
                            target,
                            command_msg,
                            value_command,
                        ] ).draw( false ).node();
                    }
                }
            }
                
        });
        
    }

})()

