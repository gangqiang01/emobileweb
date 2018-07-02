$(function(){
    var selectedrowids=[];
    var accountsid, deivcedecription, groupname;
    LoginStatus("DeviceGroup.html");
    SetHTML("barset_devicemanagement");
    GetDeviceGroup();
    dialogmodel();

    $("#delete-group").on("click",function(){
        if(selectedrowids.length == 0){
            swal( "", "Please select the device you want to delete", "info")
        }else{
            selectedrowids.forEach(function(gid){
                var myurl = "rmm/v1/devicegroups/"+gid;
                apidelete(myurl).then(function(data){
                    swal( "", "Delete group successfully!", "success").then(function(val){
                        GetDeviceGroup();
                    });
                })
            })
        }
     
    })
    

    function dialogmodel(){
        $("#AccountName").val(localStorage['accountname']);
        var verifyname, verifydescription;
        $("#GroupName").on("change",function(){
            var namereg = /^[0-9a-zA-Z]+$/
            groupname = $("#GroupName").val();
            if(!namereg.test(groupname)){
                $("#GroupNameAlert").show();
                verifyname = false;
            }else{
                $("#GroupNameAlert").hide();
                verifyname = true;
            }
            
        })

        $("#Description").on("change",function(){
            var descriptionreg = /^[0-9a-zA-Z]{0,30}$/
            deivcedecription = $("#Description").val();
            if(!descriptionreg.test(deivcedecription)){
                $("#DecriptionAlert").show();
                verifydescription = false;
            }else{
                $("#DecriptionAlert").hide();
                verifydescription = true;
            }
        
        })

        $("#DialogAdd").on("click",function(){
            var groupname = $("#GroupName").val();
            if(verifyname || verifydescription){
                var groupdata = {}
                groupdata.devicegroups=[{aid:accountsid,gid:'',name:groupname,description:deivcedecription}];
                apipost("rmm/v1/devicegroups", groupdata).then(function(data){
                    if(data.result == true){
                        swal( "", "Add group successfully!", "success").then(function(val){
                            GetDeviceGroup();
                            $('#myModal').modal('hide');
                        });
                    }
                })
            }
        })
    }
    function GetDeviceGroup(){
        var table;
        if ( $.fn.dataTable.isDataTable('#DataTables') ) {
            table = $('#DataTables').DataTable();
        }else {
            $('#DataTables').dataTable({
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
                "order": [[ 1, "desc" ]],
                rowReorder: {
                    selector: 'td:nth-child(0)'
                },
                responsive: true
            });
        }
        
        $('#DataTables tbody').on( 'click', 'tr>td:first-child', function (e, dt, type, indexes) {
            
            var SelectedUnassignedDid = table.row( this ).data()[1];
            $(this).parent().hasClass("selected")?selectedrowids.remove(SelectedUnassignedDid):selectedrowids.push(SelectedUnassignedDid); 
            console.log(selectedrowids)
        });

        var devgetdata = {};
        devgetdata.pageSize = 10000;
        devgetdata.no = 1;
        devgetdata.orderType = "aid";
        devgetdata.like = "";
        devgetdata._ = new Date().getTime();
        $("#page_loading").show();
        apiget("rmm/v1/accounts", devgetdata).then(function(data){
            accountsid = data.accounts[0].aid;
            var GetDeviceGroupData = {};
            GetDeviceGroupData._ = new Date().getTime();
            var myurl = "rmm/v1/accounts/"+accountsid+"/groups"
            apiget(myurl, GetDeviceGroupData).then(function(data){
                $("#page_loading").hide();
                var DeviceGroups = data.accounts[0].groups;
                if ( $.fn.dataTable.isDataTable('#DataTables') ) {
                    table = $('#DataTables').DataTable();
                }else {
                    table = $('#DataTables').DataTable( {
                        paging: false
                    } );
                }
                table.clear();
                if(DeviceGroups === ""){
                    table.clear().draw();
                //	return;
                }else{
                    var DeviceGroupsLength = Object.keys(DeviceGroups).length
                    for(var i=0;i<DeviceGroupsLength;i++){
                        var gid,groupname,description,create_time,time = "";
                        gid = DeviceGroups[i].gid;
                        create_time = UnixToTime( DeviceGroups[i].create_unix_ts);
                        description = DeviceGroups[i].description;
                        groupname = DeviceGroups[i].name;
                        //add row in table
                        var rowNode = table.row.add( [
                        "",
                        gid,
                        groupname,
                        description,
                        create_time,
                        ] ).draw( false ).node();
                        $( rowNode ).addClass('demo4TableRow');
                        $( rowNode ).attr('data-row-id',i);
                    }
                }
            })
        })
    }
})
