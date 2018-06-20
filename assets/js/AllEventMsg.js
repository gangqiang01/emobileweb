$(function(){
    var gid;
    LoginStatus("index.html");
    SetHTML("barset_eventMsg");
    getDeviceCategory();
    GetDeviceGroup();
    attachChangeEvent()
})

function attachChangeEvent(){
    $("#categorySelect").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		getEventMessages();
    });
    
    $("#severitySelect").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		getEventMessages();
    });

    $("#devicegroup").on("changed.bs.select", function(e, clickedIndex, newValue, oldValue) {
		getEventMessages();
    });
}

function getDeviceCategory(){
    var categoryData = {};
    categoryData.type = "Device";
    categoryData._ = new Date().getTime();
    apiget("rmm/v1/notifymgmt/category", categoryData).then(function(data){
        if(data.result != null || data.result != undefined){
            var catopts = '<option value="all">All</option>';
            data.result.forEach(function(catObj){
                catopts += '<option value="'+catObj.tag.toLowerCase() +'">'+ catObj.Description +'</option>' 
            })
            $("#categorySelect").html(catopts).selectpicker('refresh');
        }
    })
}

function GetDeviceGroup(){
    var devgetdata = {};
    devgetdata.pageSize = 10000;
    devgetdata.no = 1;
    devgetdata.orderType = "aid";
    devgetdata.like = "";
    devgetdata._ = new Date().getTime();
    $(".loading").show();
    apiget("rmm/v1/accounts", devgetdata).then(function(data){
        var accountsid = data.accounts[0].aid;
        setCookie("aid",accountsid,60);
        console.log(accountsid);
        groupgetdata = {};
        groupgetdata._ = new Date().getTime();
        apiget("rmm/v1/accounts/"+accountsid+"/groups", groupgetdata).then(
            function(data){
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
                getEventMessages();
            }
        )
    })
}

function getEventMessages(){
    var table;
    if ( $.fn.dataTable.isDataTable('#DataTables') ) {
        table = $('#DataTables').DataTable();
    }else {
        $('#DataTables').dataTable({
            "columnDefs": 
            [{
                "targets": 2,
                "className": "dt-center",
                "data": null,
                "render": function ( data, type, full, meta ) {
                    if(data[2] == "Error"){
                        var fa ='<span class="bg-danger" style="padding:5px;border-radius:3px">'+data[2]+'</span>';
                    }else if(data[2]  == "Warning"){
                        var fa = '<span class="bg-warning" style="padding:5px;border-radius:3px">'+data[2]+'</span>';
                    }else{
                        var fa = '<span class="bg-success" style="padding:5px;border-radius:3px">'+data[2]+'</span>';
                    }
    
                return fa;
                }
            }],
            "order": [[ 1, "desc" ]],
            responsive: true
        });
    }

    var eventMsgData = {};
    eventMsgData.severity = $("#severitySelect").val();
    eventMsgData.groupId = $('#devicegroup').val();
    eventMsgData.beginTs = getFromNowTimes(7, 0);
    eventMsgData.endTs =  getFromNowTimes(0, 0);
    eventMsgData.orderType = "desc";
    if($("#categorySelect").val() != "all"){
        eventMsgData.category =  $("#categorySelect").val();
    }
    eventMsgData.amount = 20;
    eventMsgData._ = new Date().getTime();
    $(".loading").show();
    apiget("rmm/v1/events/devices", eventMsgData).then(function(data){
        $(".loading").hide();
        var eventMsgs = data.events;
        if ( $.fn.dataTable.isDataTable('#DataTables') ) {
            table = $('#DataTables').DataTable();
        }else {
            table = $('#DataTables').DataTable( {
                paging: false
            } );
        }
        table.clear();
        if( eventMsgs.length == 0|| eventMsgs == undefined){
            table.clear().draw();
        //	return;
        }else{
            var  eventMsgsLength = Object.keys( eventMsgs).length
            for(var i=0;i< eventMsgsLength;i++){
                var nowtime, devicename, severify,subtype, eventmsg;
                nowtime =  UnixToTime(eventMsgs[i].unix_ts);
                devicename =  eventMsgs[i].agent_name;
                severify =  eventMsgs[i].severity;
                subtype =  eventMsgs[i].subtype.toLowerCase();
                eventmsg = eventMsgs[i].message;
                //add row in table
                var rowNode = table.row.add( [
                nowtime,
                devicename,
                severify,
                subtype,
                eventmsg,
                ] ).draw( false ).node();
                $( rowNode ).addClass('demo4TableRow');
                $( rowNode ).attr('data-row-id',i);
            }
        }
    })
}


