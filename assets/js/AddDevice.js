$(function(){
    var selectedrowids=[];
    LoginStatus("AllDevice.html");
	SetHTML("barset_alldevice");
    GetDeviceGroup();
    drawunassigneddevices();

    function drawunassigneddevices(){
        $('#UnassignedDevicesTables').dataTable({
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
        var table = $('#UnassignedDevicesTables').DataTable()
        $('#UnassignedDevicesTables tbody').on( 'click', 'tr>td:first-child', function (e, dt, type, indexes) {
            
            var SelectedUnassignedDid = table.row( this ).data()[1];
            if($(this).parent().hasClass("selected")){
                selectedrowids.remove(SelectedUnassignedDid);
            }else{
                selectedrowids.push(SelectedUnassignedDid); 
            }
            console.log(selectedrowids)
        });
        getunassigneddevices()
    }

    function getunassigneddevices(){

        //---- device table ----//
        var devgetdata = {};
        devgetdata.pageSize = 10000;
        devgetdata.no = 1;
        devgetdata.orderType = "did";
        devgetdata.like = "";
        devgetdata._ = new Date().getTime();
        $("#page_loading").show();
        apiget("rmm/v1/devices/unassigned", devgetdata).then(function(data){
            $("#page_loading").hide();
            var tableData = data.devices;
            var table = $('#UnassignedDevicesTables').DataTable();
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

    $("#DialogAdd").on("click", function(){
        // var adddata = {devices:[{did: did.deviceid, groupIds:[]}]};
        var adddata = {};
        groupid = $("#devicegroups").val();
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

    function GetDeviceGroup(){
        var devgetdata = {};
        devgetdata.pageSize = 10000;
        devgetdata.no = 1;
        devgetdata.orderType = "aid";
        devgetdata.like = "";
        devgetdata._ = new Date().getTime();
        $("#page_loading").show();
        apiget("rmm/v1/accounts", devgetdata).then(function(data){
            var accountsid = data.accounts[0].aid;
            setCookie("aid",accountsid,60);
            console.log(accountsid);
            groupgetdata = {};
            groupgetdata._ = new Date().getTime();
            apiget("rmm/v1/accounts/"+accountsid+"/groups", groupgetdata).then(
                function(data){
                    $("#page_loading").hide();
                    var devicegroupmsg='';
                    var groupids=[]
                    if(data.accounts[0].groups.length != 0){
                        data.accounts[0].groups.forEach(function(val){
                            devicegroupmsg += '<option value="'+val.gid+'">'+val.name+"</option>"
                        });
                    }else{
                        devicegroupmsg += '<option >Device group is null</option>'
                    }
                    $("#devicegroups").html(devicegroupmsg);
                }
            )
        })
    }
})

function AllSelect(){
    // $("#UnassignedDevicesTables tbody tr").addClass("selected");
    $("#UnassignedDevicesTables tbody tr>td:first-child").each(function(){
        if(!$(this).parent().hasClass("selected")){
            $(this).click()
        }
    });
}

function AllCancel(){
    // $("#UnassignedDevicesTables tbody tr").removeClass("selected");
    $("#UnassignedDevicesTables tbody tr>td:first-child").each(function(){
        if($(this).parent().hasClass("selected")){
            $(this).click()
        }
    });
}
