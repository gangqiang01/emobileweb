$(function(){
    var unassigneddid = [];
    var selectedrowids=[];
    LoginStatus("UserDuedateCheck","AllDevice.html");
	SetHTML("barset_management");
	$('.panel-commands').css( 'cursor', 'pointer' );
    getunassigneddevices();
    function AllSelect(){
        $("#UnassignedDevicesTables tbody tr").addClass("selected");
    }
    
    function AllCancel(){
        $("#UnassignedDevicesTables tbody tr").removeClass("selected");
    }
    function getunassigneddevices(){

        //---- device table ----//
        $('#UnassignedDevicesTables').dataTable({
            "columnDefs": 
            [{
            orderable: false,
            className: 'select-checkbox',
            targets:   0
            }],
            select: {
                style:    'os',
                selector: 'td:first-child'
            }, 
            "order": [[ 0, "desc" ]],
            rowReorder: {
                selector: 'td:nth-child(0)'
            },
            responsive: true
        });
        var table = $('#UnassignedDevicesTables').DataTable()
        $('#UnassignedDevicesTables tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
            console.log(table.row( this ).index() )
            var rowid = table.row( this ).index();
            // $(this).toggleClass('selected');
            // console.log($(this).hasClass("selected"))
            if($(this).hasClass("selected")){
                selectedrowids.remove(rowid);
            }else{
                selectedrowids.push(rowid); 
            }
        });


        var devgetdata = {};
        devgetdata.pageSize = 10000;
        devgetdata.no = 1;
        devgetdata.orderType = "did";
        devgetdata.like = "";
        devgetdata._ = new Date().getTime();
        apiget("rmm/v1/devices/unassigned", devgetdata).then(function(data){
            var tableData = data.devices;
            var table = $('#UnassignedDevicesTables').DataTable();
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
                      devicename,
                      Agentid,
                    ] ).draw( false ).node();
                    $( rowNode ).addClass('demo4TableRow');
                    $( rowNode ).attr('data-row-id',i);
                    unassigneddid.push({ deviceid: did });
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
            adddata.devices[i].did = unassigneddid[selectedrowids[i]].deviceid; 
            adddata.devices[i].groupIds = []
            adddata.devices[i].groupIds[0] = groupid+"";
        }    
        apiput("rmm/v1/devices", adddata).then(function(data){
            if (data.result){
                swal( "", "Add device successfully!", "success").then(function(val){
                    if(val){
                        window.location.href = "AllDevice.html";
                    }
                });
            }
        })
    })
})
