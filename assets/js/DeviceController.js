$(function(){
    var DatchControlData = [];
    var isdatach=false;
    LoginStatus("AllDevice.html");
    SetHTML("barset_alldevice");
    var ControlDevicesObject= sessionStorage["ControlDevice"];
    if(ControlDevicesObject != undefined){
        var ControlDevicesObject = JSON.parse(ControlDevicesObject);
        var devicedid = ControlDevicesObject.Did;
        var AgentId =ControlDevicesObject.AgentId;
    }

    var devicecontrolplugins=[];
    getdevicename();
    getdeviceplugin();
    // getdevicesensors();

    function　getdevicename(){
        var pagetype = getUrlVars()
        var  DatchControl =　sessionStorage["DatchControlObject"]
        if(DatchControl != undefined){
            DatchControl　=　JSON.parse(DatchControl);
        }

        DatchControlData = DatchControl.DatchDevices;
        console.log(DatchControlData);
        if(pagetype.type == "datch"){
            isdatach = true;
            $("#ControlDevices").html("<input type='text' id='DevicesControl'>")
            $('#DevicesControl').tagsinput({
                itemValue: 'value',
                itemText: 'text',
                source: function(query) {
                    return $.getJSON('cities.json');
                }
            });
            if(DatchControlData.length > 0){
                DatchControlData.forEach(function(DeviceObject){
                    $('#DevicesControl').tagsinput('add', { "value": DeviceObject.did , "text": DeviceObject.name});
                })
            }

        }else{
            isdatach = false;
            $("#ControlDevices").html("<i class='fa fa-desktop fa-x' style='padding:5px'></i>"+ControlDevicesObject.name); 
        }
    }
 
    function getUrlVars(){
        var vars = {}, hash;
        if(window.location.href.indexOf('?')>-1){
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
       
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars[hash[0]] = $.trim(hash[1]);
            }
        }
        return vars;
    } 

    function getdeviceplugin(){
        var getpluginform = {};
        getpluginform._ = Date.parse(new Date());
        if(isdatach){
            devicedid = DatchControlData[0].did;
        }
        var myurl = "rmm/v1/devices/"+devicedid+"/plugins"
        apiget(myurl,getpluginform).then(function(data){
            var txtplugins="";
            var deviceallplugins = data.Plugins;
            if(deviceallplugins){
                deviceallplugins.forEach(function(value,index){
                    if(value.analysis){
                        txtplugins = txtplugins+"<option data-subtext="+value.plugin+">"+value.plugin+"</option>" ;
                        devicecontrolplugins.push(value.plugin);
                    }
                })

                DrawSensors(devicecontrolplugins[0]);
            }else{
                txtplugins = '<option class="bs-title-option" value="">no plugin</option>'+ txtplugins;
            }
          
            $("#pluginId").html(txtplugins);
        })
    }
    function AllSelect(){
        $("#DeviceSensorsTables tbody tr").addClass("selected");
    }
    
    function AllCancel(){
        $("#DeviceSensorsTables tbody tr").removeClass("selected");
    }
    function DrawSensors(deviceplugin){
        var table;
        if ( $.fn.dataTable.isDataTable('#DeviceSensorsTables') ) {
            table = $('#DeviceSensorsTables').DataTable();
        }else {
            $('#DeviceSensorsTables').dataTable({
                "columnDefs": 
                [{
                    "targets": 1,
                    "className": "dt-center",
                    "data": null,
                    "width": '15%',
                    "render": function ( data, type, full, meta ) {
                        if(data[1] == 'rw'){
                            var fa ="<a class='btn btn-info'  data-toggle='modal' data-target='#myModal'><i class='fa fa-hand-lizard-o' style='padding-right:5px' ></input>Read/Update</a>"
                        }else{
                            var fa ="<a class='btn btn-info'  data-toggle='modal' data-target='#myModal'><i class='fa fa-hand-lizard-o' style='padding-right:5px'></i>Read</a>"
                        };
                    return fa;
                    }
                },
                {
                    "targets": 4,
                    "className": "dt-center",
                    "data": null,
                    "width": '15%',
                    "render": function ( data, type, full, meta ) {
                        if(data[1] == 'rw'){
                            var fa ="<a>Read/write</a>"
                        }else{
                            var fa ="<a>Read</a>"
                        };
                    return fa;
                    }
                }
            ], 
                "order": [[ 0, "desc" ]],
                responsive: true
            });
        }
        $('#DeviceSensorsTables tbody').on( 'click', 'tr>td:first-child', function (e, dt, type, indexes) {
            if ( $.fn.dataTable.isDataTable('#DeviceSensorsTables') ) {
                table = $('#DeviceSensorsTables').DataTable();
            }
            else {
                table = $('#DeviceSensorsTables').DataTable( {
                    paging: false
                });
            }
            var sensortype = table.row(this).data()[0];
            var  PluginId = table.row( this ).data()[2];
            var sensorId = table.row(this).data()[3];
            var sensorpower = table.row(this).data()[1];
            var GetSensorsData = {};
            if(!isdatach){
                GetSensorsData.agentId = AgentId;
            }else{
                devicedid = DatchControlData[0].did;
                GetSensorsData.agentId = DatchControlData[0].agentid;
            }

            GetSensorsData.plugin = PluginId;
            GetSensorsData.sensorId = sensorId;
            GetSensorsData._ = Date.parse(new Date());
            var myurl = "rmm/v1/devicectrl/"+devicedid+"/data";
            $(".loading").show();
            apiget(myurl, GetSensorsData).then(function(obj){
                $(".loading").hide();
                $("#sensor_dialog_title").html(PluginId);
                $("#dialog_plugin").html(PluginId);
                $("#dialog_sensorid").html(sensorId);
                if(sensorpower == 'rw'){
                    var sensorvalue = obj.sensorIds[0].vl|| obj.sensorIds[0].v || obj.sensorIds[0].bv
                    var sensorboolean = obj.sensorIds[0].bv;
                    if(sensortype == "bv"){
                        var sensorupdate = " <input id='sensorvalue' type='checkbox'>";
                        $("#dialog_sensorvalue").html(sensorupdate);
                        // if(sensorboolean == "true"){
                        //     $("#sensorvalue").attr("checked","checked");
                        // }
                        if(sensorboolean == "true"){
                            $("#sensorvalue").bootstrapSwitch('state',true); 
                        }else if(sensorboolean == "false"){
                            $("#sensorvalue").bootstrapSwitch('state',false);
                        }
                        

                    }else if(sensortype == "v"){
                        var sensorupdate = "<input type='text' id='sensorvalue' value="+sensorvalue+">";
                        $("#dialog_sensorvalue").html(sensorupdate);
                    }
                  
                }else{
                    var sensorvalue = obj.sensorIds[0].vl || obj.sensorIds[0].v || obj.sensorIds[0].bv;
                    $("#dialog_sensorvalue").html(sensorvalue);
                    $("#sensor_dialog_save").hide();
                }
            })
        });
        // var DeviceSensorData = getdevicesensors(plugin);
        // if(DeviceSensorData){
        //     return;
        // }
        var getsensorsdata = {};
        if(!isdatach){
            getsensorsdata.agentId = AgentId;
        }else{
            devicedid = DatchControlData[0].did;
            getsensorsdata.agentId = DatchControlData[0].agentid;
        }
        getsensorsdata._ = new Date().getTime();
        var myurl = "rmm/v1/devices/"+devicedid+"/"+deviceplugin+"/sensors";
        $(".loading").show();
        apiget(myurl, getsensorsdata).then(function(data){
            $(".loading").hide();
            var tableData = data.sensorIds;
            if ( $.fn.dataTable.isDataTable('#DeviceSensorsTables') ) {
                table = $('#DeviceSensorsTables').DataTable();
            }
            else {
                table = $('#DeviceSensorsTables').DataTable( {
                    paging: false
                } );
            }
            table.column(0).visible( false );
            table.clear();
            if(tableData === ""){
                table.clear().draw();
            //	return;
            }else{
                for(var i=0;i<Object.keys(tableData).length;i++){
                    var exit, plugin , sensor , privilege, type, time = "";
                    type = tableData[i].type;
                    exit = tableData[i].asm;
                    plugin = deviceplugin;
                    sensor = tableData[i].sensorId;
                    privilege = tableData[i].asm;
                    //add row in table
                    var rowNode = table.row.add( [
                    type,
                    exit,
                    plugin,
                    sensor,
                    privilege,
                    ] ).draw( false ).node();
                    $( rowNode ).addClass('demo4TableRow');
                    $( rowNode ).attr('data-row-id',i);
                }
            }
        })
    }
    function getdevicesensors(plugin){

        //---- device table ----//
        var getsensorsdata = {};
        getsensorsdata._ = new Date().getTime();
        var myurl = "rmm/v1/devices/"+devicedid+"/"+plugin+"/sensors";
        apiget(myurl, getsensorsdata).then(function(data){
            console.log(data);
            return data;
            
        })
    }
//change sensor by change plugin 
    $("#pluginId").on("change", function(e){
        // var adddata = {devices:[{did: did.deviceid, groupIds:[]}]};
        DrawSensors(e.target.value);
       
    })
    $('#sensor_dialog_update').on("click",function(){
        var setsensordata = {};
        if(!isdatach){
            setsensordata.agentId = AgentId;
            setsensordata.plugin = $("#dialog_plugin").text();
            var sensorId = $("#dialog_sensorid").text();
            var sensorvalue =   $("#sensorvalue").bootstrapSwitch("state");
            setsensordata.sensorIds = [];
            setsensordata.sensorIds[0]={"n":sensorId, "bv":sensorvalue};
            apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
                if(data.items[0].statusCode == "200"){
                    swal("","success","success").then(function(){
                        $('#myModal').modal('hide');
                    })
                }
            })
        }else{
            DatchControlData.forEach(function(object){
                setsensordata.agentId = object.agentid;
                setsensordata.plugin = $("#dialog_plugin").text();
                var sensorId = $("#dialog_sensorid").text();
                var sensorvalue =   $("#sensorvalue").bootstrapSwitch("state");
                setsensordata.sensorIds = [];
                setsensordata.sensorIds[0]={"n":sensorId, "bv":sensorvalue};
                apipost("rmm/v1/devicectrl/data",setsensordata).then(function(data){
        
                    if(data.items[0].statusCode == "200"){
                        swal("","success","success").then(function(){
                            $('#myModal').modal('hide');
                        })
                    }
                })
            })

        }   
    })

})
