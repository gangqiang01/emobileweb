//onload page
var demo4Rows = [];
var datatimes;

//for GetAllDevices
var GetUpdateDevice = ""; var m_Update = false;var m_devices = [];
//
var selectedrowids=[];

$(function() {
   
	LoginStatus("UserDuedateCheck","AllDevice.html");
	SetHTML("barset_management");
	$('.panel-commands').css( 'cursor', 'pointer' );
		$('.command-tag-red').slideUp();
		$('.panel-commands').on('click', function(e){

			var $this = $(this).find('.command-clickable');
			if(!$this.hasClass('panel-collapsed')) {
				$this.parents('.panel-command-col').slideUp();
				$this.addClass('panel-collapsed');
				$this.find('i').removeClass('fa fa-angle-double-right fa-2x').addClass('fa fa-angle-double-left fa-2x');
				$('.command-tag-red').show( "slow" );
				$(".panel-devices-col").removeClass("col-md-8");
				$(".panel-devices-col").addClass("col-md-12");
			} else {
				$this.parents('.panel').find('.panel-body').slideDown();
				$this.removeClass('panel-collapsed');
				$this.find('i').removeClass('fa fa-angle-double-left fa-2x').addClass('fa fa-angle-double-right fa-2x');

			}


		});
		$('.command-tag-yellow').on('click', function(e){
			m_Update = true;
			GetAllDevices();
		});

		$(".clickable").addClass('panel-collapsed');
		$(".clickable").parents('.panel').find('.panel-body').slideUp();
		$(".clickable").find('i').removeClass('fa fa-angle-double-down fa-2x').addClass('fa fa-angle-double-up fa-2x');
		$('.panel-logs').css( 'cursor', 'pointer' );
		$('.panel-logs').on('click', function(e){
			if($('#days').has(e.target).length === 0){
				var $this = $(this).find('.clickable');
				if(!$this.hasClass('panel-collapsed')) {
					$this.parents('.panel').find('.panel-body').slideUp();
					$this.addClass('panel-collapsed');
					$this.find('i').removeClass('fa fa-angle-double-down fa-2x').addClass('fa fa-angle-double-up fa-2x');
				} else {
					$this.parents('.panel').find('.panel-body').slideDown();
					$this.removeClass('panel-collapsed');
					$this.find('i').removeClass('fa fa-angle-double-up fa-2x').addClass('fa fa-angle-double-down fa-2x');
				}
			}

        });
        drawData();
});


//get devicedata draw table    
function drawData() {
    var DeviceTable ;
    //---- device table ----//
    $('#dataTables-example').dataTable( {
        "columnDefs": [ {

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
    },{
        "targets": 6,
        "className": "dt-center",
        "data": null,
        "render": function ( data, type, full, meta ) {
            var fa = '';

            var id = "'"+data[1]+"'";
            fa = '<a class="btn btn-info" onclick="DeviceControl()">Control</a>';

        return fa;
        }
    },{
        "targets": 7,
        "className": "dt-center",
        "data": null,
        "render": function ( data, type, full, meta ) {
            var fa = '';

            var id = "'"+data[1]+"'";
            fa = '<a class="btn btn-info" onclick="alert(‘ok’)">Get/Set</a>';

        return fa;
        }
    },
    {
        orderable: false,
        className: 'select-checkbox',
        targets:   0
    } ],
    select: {
        style:    'os',
        selector: 'td:first-child'
    }, 
    "order": [[ 5, "desc" ]],
    responsive: true
    } );

    DeviceTable = $('#dataTables-example').DataTable();
    $('#dataTables-example tbody').on( 'click', 'tr', function (e, dt, type, indexes) {
            var rowid = DeviceTable.row( this ).index();
            if($(this).hasClass("selected")){
                selectedrowids.remove(rowid);
            }else{
                selectedrowids.push(rowid); 
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
    var groupid = sessionStorage["groupid"]
    for (var i=0 ;i< selectedrowids.length;i++){
        dddata.devices[i] = {"did": demo4Rows[selectedrowids[i]].deviceid, "groupIds":[]};
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
                devicemodel = tableData[i].ostype;
                stat = tableData[i].connected;
                did = tableData[i].did;
                console.log("stat", stat);

                time = UnixToTime(tableData[i].create_unit_ts);

                GetUpdateDevice += agentid +"/";
                m_devices.push([agentid,false]);
                //add row in table
                var rowNode = table.row.add( [
                  "",
                  agentid,
                  devicename,
                  agentversion,
                  devicemodel,
                  stat,
                  "",
                  "",
                ] ).draw( false ).node();
                $( rowNode ).addClass('demo4TableRow');
                $( rowNode ).attr('data-row-id',i);
                demo4Rows.push({ deviceid: did });
                var tmp;
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