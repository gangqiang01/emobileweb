$(function(){
    LoginStatus("UserDuedateCheck","AllDevice.html");
	SetHTML("barset_management");
	$('.panel-commands').css( 'cursor', 'pointer' );
    getunassigneddevices();
    function AllSelect(){
        $("#dataTables-example tbody tr").addClass("selected");
    }
    
    function AllCancel(){
        $("#dataTables-example tbody tr").removeClass("selected");
    }
    function getunassigneddevices(){

        //---- device table ----//
        $('#dataTables-example').dataTable({
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
    
        DeviceTable = $('#dataTables-example').DataTable();
        $('#dataTables-example tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
                 $(this).toggleClass('selected');
        });


        var devgetdata = {};
        devgetdata.pageSize = 10000;
        devgetdata.no = 1;
        devgetdata.orderType = "did";
        devgetdata.like = "";
        devgetdata._ = new Date().getTime();
        apiget("rmm/v1/devices/unassigned", devgetdata).then(function(data){
            var tableData = data.devices;
            var table = $('UnassignedDevicesTables').DataTable();
            table.clear();
            if(tableData === ""){
              table.clear().draw();
            //	return;
            }else{
                for(var i=0;i<Object.keys(tableData).length;i++){
                    var devicename, Agentid , did , time = "";
                    Agentid = tableData[i].agentid;
                    devicename = tableData[i].name;
    
                    time = UnixToTime(tableData[i].create_unit_ts);
                    //add row in table
                    var rowNode = table.row.add( [
                      "",
                      devicename,
                      Agentid,
                    ] ).draw( false ).node();
                    $( rowNode ).addClass('demo4TableRow');
                    $( rowNode ).attr('data-row-id',i);
                    // demo4Rows.push({ deviceid: did });
                }
            }
        })
    }
})
