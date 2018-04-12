$(function(){
    var selectedrowids=[];
    LoginStatus();
    SetHTML("barset_management");
    var ControlDevices = JSON.parse(sessionStorage["ControlDevice"]);
    var devicedid = ControlDevices.Did;
    var deviceplugins=[];
    getdevicename();
    getdeviceplugin();
    DrawSensors()
    // getdevicesensors();

    function　getdevicename(){
        
        $("#ControlDevices").html("<i class='fa fa-desktop fa-x' style='padding:5px'></i>"+ControlDevices.name); 
    }
 
    function getdeviceplugin(){
        var getpluginform = {};
        getpluginform._ = Date.parse(new Date());
        var myurl = "rmm/v1/devices/"+devicedid+"/plugins"
        apiget(myurl,getpluginform).then(function(data){
            var txtplugins="";
            deviceplugins = data.Plugins;
            if(!deviceplugins){
                txtplugins = '<option class="bs-title-option" value="">no plugin</option>'+ txtplugins;
            }else{
                deviceplugins.forEach(function(value,index){
                    if(value.analysis){
                        txtplugins = "<option data-subtext="+value.plugin+">"+value.plugin+"</option>"+ txtplugins;
                    }
                })
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
    function DrawSensors(){
        $('#DeviceSensorsTables').dataTable({
            "columnDefs": 
            [{
                "targets": 1,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                        var fa ="<i class='fa fa-hand-lizard-o' ></i><a class='btn btn-info'>"+data[0]+"</a>";
    
                return fa;
                }
            }], 
            "order": [[ 0, "desc" ]],
            responsive: true
        });
        var table = $('#DeviceSensorsTables').DataTable()
        $('#DeviceSensorsTables tbody').on( 'click', 'tr>td:first-child', function (e, dt, type, indexes) {
            
            var SelectedUnassignedDid = table.row( this ).data()[1];
            if($(this).parent().hasClass("selected")){
                selectedrowids.remove(SelectedUnassignedDid);
            }else{
                selectedrowids.push(SelectedUnassignedDid); 
            }
            console.log(selectedrowids)
        });
        var plugin = deviceplugins[0].plugin;
        var DeviceSensorData = getdevicesensors(plugin);
        if(DeviceSensorData){
            return;
        }
        var tableData = data.devices;
        var table = $('#DeviceSensorsTables').DataTable();
        table.clear();
        if(tableData === ""){
          table.clear().draw();
        //	return;
        }else{
            for(var i=0;i<Object.keys(tableData).length;i++){
                var exit, plugin , sensor , privilege, time = "";
                Agentid = tableData[i].agentId;
                devicename = tableData[i].name;
                did = tableData[i].did;
                time = UnixToTime(tableData[i].create_unit_ts);
                //add row in table
                var rowNode = table.row.add( [
                  exit,
                  plugin,
                  sensor,
                  privilege,
                ] ).draw( false ).node();
                $( rowNode ).addClass('demo4TableRow');
                $( rowNode ).attr('data-row-id',i);
            }
        }
    }
    function getdevicesensors(plugin){

        //---- device table ----//
        var getsensorsdata = {};
        getsensorsdata._ = new Date().getTime();
        var myurl = "rmm/v1/devices/"+devicedid+"/"+plugin+"/sensor";
        apiget(myurl, getsensorsdata).then(function(data){
            console.log(data);
            return data;
            
        })
    }

    $("#pluginId").on("change", function(e){
        // var adddata = {devices:[{did: did.deviceid, groupIds:[]}]};
        console.log(e.value());
       
    })
})
