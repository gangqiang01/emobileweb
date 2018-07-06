//onload page

//for GetAllDevices

//
$(function() {
    var DatchControlData = []
    var selectedrowids=[];
	LoginStatus("AllDevice.html");
	SetHTML("barset_devicemanagement");
    $('.command-tag-yellow').on('click', function(e){
        GetAllDevices();
    });
    drawData();
    $("#devicegroup").on("change", function(){
        var groupid = $(this).val();
        GetAllDevices()
    })

    $("#BatchControl").on("click", function(){
        if (DatchControlData.length ==0){
            swal("","Please select the online device you want to control","info")
        }else{
            window.location.href="DeviceController.html?type=datch";
        }
    })
    $("#Deletedevice").on("click", function(){
        var dddata = {};
        dddata.devices = [];
        if(selectedrowids.length == 0){
            swal( "", "Please select the device you want to delete", "info")
        }else{
            swal({
                title: "Are you sure?",
                text: "delete this device",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then(function(willDelete){
                if (willDelete) {
                    for (var i=0 ;i< selectedrowids.length;i++){
                        dddata.devices[i] = {"did": selectedrowids[i], "groupIds":[]};
                    }
                    apiput("rmm/v1/devices", dddata).then(function(data){
                        console.log("deletedevice",data);
                        if (data.result){
                            swal("","Delete device successfully","success").then(function(){
                                GetAllDevices();
                            })
                        }
                    })
                } 
            })
        }
    })

    $("#allSelect").on("click", function(){
        allSelect();
    })

    $("#allCancel").on("click", function(){
        allCancel();
    })
    function drawData() {
        var DeviceTable ;
        //---- device table ----//
        $('#dataTables-example').dataTable( {
            "columnDefs": [
            {
    
                "targets": 5,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                    if(data[5]){
                        var fa ='<i class="fa fa-child" style="color:green">online</i>';
                    }else{
                        var fa ='<i class="fa fa-minus-circle" style="color:red">offline</i>';
                    }
    
                return fa;
                }
            },
            {
                "targets": 6,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                    var fa = '';
                    var id = "'"+data[1]+"'";
                    if(data[5]){
                        fa = `<a class="btn btn-info" onclick="DeviceVnc('${data}')"><i class="fa fa-television" style="padding-right:5px"></i>Control</a>`;
                    }else{
                        fa = `<a class="btn btn-info disabled" onclick="DeviceVnc('${data}')"><i class="fa fa-television" style="padding-right:5px"></i>Control</a>`;
                    }
                return fa;
                }
            },
            {
                "targets": 7,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                    var fa = '';
                    var id = "'"+data[1]+"'";
                    if(data[5]){
                        fa = `<a class="btn btn-info" onclick="DeviceDataController('${data}')"><i class="fa  fa-hand-lizard-o" style="padding-right:5px"></i>Get/Set</a>`;
                    }else{
                        fa = `<a class="btn btn-info disabled" onclick="DeviceDataController('${data}')"><i class="fa  fa-hand-lizard-o" style="padding-right:5px"></i>Get/Set</a>`;
                        
                    }
                    return fa;  
                }
            },
            {
                orderable: false,
                className: 'select-checkbox',
                targets:   0
            }],
            select: {
                style:    'multi',
                selector: 'td:first-child'
            }, 
            "order": [[ 5, "desc" ]],
            responsive: true
        } );
    
        DeviceTable = $('#dataTables-example').DataTable();
        $('#dataTables-example tbody').on( 'click', 'tr>td:first-child', function (e, dt, type, indexes) {
                var DatchControlObject = {};
                var SelectedDid = DeviceTable.row( this ).data()[1];
                var SelectedStatus = DeviceTable.row(this).data()[5];
                var devicename = DeviceTable.row(this).data()[2]
                var SelectedAgentId = DeviceTable.row(this).data()[3];
                var SelectedObject = {did:SelectedDid, agentid:SelectedAgentId, name:devicename};
                if($(this).parent().hasClass("selected")){
                    selectedrowids.remove(SelectedDid);
                    if(DatchControlData.in_array(SelectedObject)){
                        DatchControlData.removeObjWithArr(SelectedObject)
                    }
                }else{
                    selectedrowids.push(SelectedDid); 
                    if(SelectedStatus){
                        DatchControlData.push(SelectedObject)
                    }
                }
                DatchControlObject.DatchDevices = DatchControlData;
                DatchControlObject = JSON.stringify(DatchControlObject);
                sessionStorage["DatchControlObject"] =  DatchControlObject; 
        });
        GetDeviceGroup();
    }

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
                    $("#devicegroup").html(devicegroupmsg).selectpicker('refresh');
                    GetAllDevices();
                }
            )
        })
    }
    
    function GetAllDevices() {
        var groupid = $("#devicegroup").val();
        var devicegetdata = {};
        devicegetdata.pageSize = 10000;
        devicegetdata.no = 1;
        devicegetdata.orderType = "did";
        devicegetdata.like = "";
        devicegetdata._ = new Date().getTime();
        apiget("rmm/v1/devicegroups/"+groupid+"/devices", devicegetdata).then(function(data){
            console.log(data);
            var tableData = data.groups[0].devices;
            // sessionStorage["devicedata"] = tableData;
            var table = $('#dataTables-example').DataTable();
            table.column(1).visible( false );
            table.clear();
            if(tableData === ""|| tableData.length == 0){
            table.clear().draw();
            //	return;
            }else{
            for(var i=0;i<Object.keys(tableData).length;i++){
                var agentid, devicename, agentversion,devicemodel,stat, did,time = "";
                agentid = tableData[i].agentid;
                devicename = tableData[i].name;
                agentversion = tableData[i].version;
                stat = tableData[i].connected;
                did = tableData[i].did;
                console.log("stat", stat);
                //add row in table
                var rowNode = table.row.add( [
                "",
                did,
                devicename,
                agentid,
                agentversion,
                stat,
                "",
                "",
                ] ).draw( false ).node();
                $( rowNode ).addClass('demo4TableRow');
                $( rowNode ).attr('data-row-id',i);
            }
            }
            $($.fn.dataTable.tables(true)).DataTable()
            .columns.adjust()
            .responsive.recalc();
        })
    }

    function allSelect(){
        $("#dataTables-example tbody tr>td:first-child").each(function(){
            if(!$(this).parent().hasClass("selected")){
                $(this).click()
            }
        });
        // $("#dataTables-example tbody tr").click();
        // $("#dataTables-example tbody tr").addClass("selected");
    }
    
    function allCancel(){
        $("#dataTables-example tbody tr>td:first-child").each(function(){
            if($(this).parent().hasClass("selected")){
                $(this).click()
            }
        });
    }
});

// single device control
function DeviceDataController(data){
    var ControlDevice = {};
    var ControlDevicesArray = data.split(",")
    ControlDevice.Did = ControlDevicesArray[1];
    ControlDevice.AgentId = ControlDevicesArray[3];
    ControlDevice.name = ControlDevicesArray[2];
    sessionStorage["ControlDevice"]=JSON.stringify(ControlDevice);
    window.location.href = "DeviceController.html"
}

