//onload page
var datatimes;

//for GetAllDevices
var GetUpdateDevice = ""; var m_Update = false;var m_devices = [];
//
var selectedrowids=[];

$(function() {
   
	LoginStatus("AllDevice.html");
	SetHTML("barset_management");
    $('.command-tag-yellow').on('click', function(e){
        m_Update = true;
        GetAllDevices();
    });
    drawData();
});


//get devicedata draw table    
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
            var SelectedDid = DeviceTable.row( this ).data()[1];
            if($(this).parent().hasClass("selected")){
                selectedrowids.remove(SelectedDid);
            }else{
                selectedrowids.push(SelectedDid); 
            }
            console.log(selectedrowids)
    });

    $('#LogTable').DataTable( {
        "scrollY":        "200px",
        "scrollCollapse": true,
        "paging":         false,
        "order": [[ 0, "desc" ]]
    } );
    GetAllDevices();
}

function AllSelect(){
	$("#dataTables-example tbody tr").addClass("selected");
}

function AllCancel(){
	$("#dataTables-example tbody tr").removeClass("selected");
}
function deletedevice(){
    var dddata = {};
    dddata.devices = [];
    if(!selectedrowids){
        return;
    }
    for (var i=0 ;i< selectedrowids.length;i++){
        dddata.devices[i] = {"did": selectedrowids[i], "groupIds":[]};
    }
    apiput("rmm/v1/devices", dddata).then(function(data){
        console.log("deletedevice",data);
        if (data.result){
            swal("","Delete device successfully","success").then(function(val){
                if(val){
                    GetAllDevices();
                }
            })
        }
    })
}

function GetAllDevices() {
  var devgetdata = {};
  devgetdata.pageSize = 10000;
  devgetdata.no = 1;
  devgetdata.orderType = "aid";
  devgetdata.like = "";
  devgetdata._ = new Date().getTime();
  apiget("rmm/v1/accounts", devgetdata).then(function(data){
	var accountsid = data.accounts[0].aid;
	sessionStorage["accoundsid"] = accountsid;
    console.log(accountsid);
    groupgetdata = {};
    groupgetdata._ = new Date().getTime();
    apiget("rmm/v1/accounts/"+accountsid+"/groups", groupgetdata).then(
      function(data){
		var groupid = data.accounts[0].groups[0].gid;
		sessionStorage["groupid"] = groupid;
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
            if(tableData === ""){
              table.clear().draw();
            //	return;
            }else{
              GetUpdateDevice = "";
              for(var i=0;i<Object.keys(tableData).length;i++){
                var agentid, devicename, agentversion,devicemodel,stat, did,time = "";
                agentid = tableData[i].agentid;
                devicename = tableData[i].name;
                agentversion = tableData[i].version;
                stat = tableData[i].connected;
                did = tableData[i].did;
                console.log("stat", stat);
                GetUpdateDevice += agentid +"/";
                m_devices.push([agentid,false]);
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
    )
  })
}

// single device control
function DeviceDataController(data){
    console.log("DeviceDataController",data);
    var ControlDevice = {};
    var ControlDevicesArray = data.split(",")
    ControlDevice.Did = ControlDevicesArray[1];
    ControlDevice.IgentId = ControlDevicesArray[3];
    ControlDevice.name = ControlDevicesArray[2];
    sessionStorage["ControlDevice"]=JSON.stringify(ControlDevice);
    window.location.href = "DeviceController.html"
}

//single device vcn
function DeviceVnc(data){
	console.log("vnc",data);
}