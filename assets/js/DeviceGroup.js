$(function(){
    var selectedrowids=[];
    LoginStatus("DeviceGroup.html");
    SetHTML("barset_DeviceGroup");
    GetDeviceGroup();
})

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
        var GetDeviceGroupData = {};
        GetDeviceGroupData._ = new Date().getTime();
        var myurl = "rmm/v1/accounts/"+accountsid+"/groups"
        apiget(myurl, GetDeviceGroupData).then(function(data){
            $(".loading").hide();
            var DeviceGroups = data.accounts[0].groups;
            var table = $('#DataTables').DataTable();
            var DeviceGroupsLength = Object.keys(DeviceGroups).length
            for(var i=0;i<DeviceGroupsLength;i++){
                var gid,groupname,description,create_time,time = "";
                gid = DeviceGroups[i].gid;
                create_time = UnixToTime( DeviceGroups[i].create_unix_ts);
                description = DeviceGroups[i].description;
                groupname = DeviceGroups[i].name;
                //add row in table
                var rowNode = table.row.add( [
                gid,
                groupname,
                description,
                create_time,
                ] ).draw( false ).node();
                $( rowNode ).addClass('demo4TableRow');
                $( rowNode ).attr('data-row-id',i);
            }
        })
    })
}