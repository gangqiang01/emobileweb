$(function(){
    var selectedrowids=[];
    LoginStatus();
    SetHTML("barset_management");
    getdeviceplugin();
    getdevicesensors();
    function getdeviceplugin(){

    }
    function AllSelect(){
        $("#DeviceSensorsTables tbody tr").addClass("selected");
    }
    
    function AllCancel(){
        $("#DeviceSensorsTables tbody tr").removeClass("selected");
    }
    function getdevicesensors(){

        //---- device table ----//
        $('#DeviceSensorsTables').dataTable({
            "columnDefs": 
            [{
            orderable: false,
            className: 'select-checkbox',
            targets:   0
            }],
            select: {
                style:    'multi',
                selector: 'td:first-child'
            }, 
            "order": [[ 0, "desc" ]],
            rowReorder: {
                selector: 'td:nth-child(0)'
            },
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


        var devgetdata = {};
        devgetdata.pageSize = 10000;
        devgetdata.no = 1;
        devgetdata.orderType = "did";
        devgetdata.like = "";
        devgetdata._ = new Date().getTime();
        apiget("rmm/v1/devices/unassigned", devgetdata).then(function(data){
            var tableData = data.devices;
            var table = $('#DeviceSensorsTables').DataTable();
            table.column( 1 ).visible( false )
            table.clear();
            if(tableData === ""){
              table.clear().draw();
            //	return;
            }else{
                for(var i=0;i<Object.keys(tableData).length;i++){
                    var devicename, Agentid , did , time = "";
                    Agentid = tableData[i].agentId;
                    devicename = tableData[i].name;
                    did = tableData[i].did;
                    time = UnixToTime(tableData[i].create_unit_ts);
                    //add row in table
                    var rowNode = table.row.add( [
                      "",
                      did,
                      devicename,
                      Agentid,
                    ] ).draw( false ).node();
                    $( rowNode ).addClass('demo4TableRow');
                    $( rowNode ).attr('data-row-id',i);
                }
            }
        })
    }

    $("#adddevice").on("click", function(){
        // var adddata = {devices:[{did: did.deviceid, groupIds:[]}]};
        var adddata = {};
        groupid = sessionStorage["groupid"]
        adddata.devices = [];
        if(!selectedrowids){
            return;
        }
        for (var i=0 ;i< selectedrowids.length;i++){
            adddata.devices[i] = {};
            adddata.devices[i].did = selectedrowids[i]; 
            adddata.devices[i].groupIds = []
            adddata.devices[i].groupIds[0] = groupid+"";
        }
        if(selectedrowids){
            apiput("rmm/v1/devices", adddata).then(function(data){
                if (data.result){
                    swal( "", "Add device successfully!", "success").then(function(val){
                        if(val){
                            window.location.href = "AllDevice.html";
                        }
                    });
                }
            })
        }else{
            swal( "", "please select the device you want to add!", "info")
        }
    })
})
