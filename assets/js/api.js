var baseurl = "https://portal-rmm-wise-paas-dev-rmm.wise-paas.com.cn"
function apipost(myurl,object){
    var posturl = baseurl+"/"+myurl
    return new Promise(function(resolve, reject){
       $.ajax({
            type:"post",
            url: posturl,
            data: object,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            timeout:10000,
            success:function(data){
                resolve(data)
            }
       });
   })
}

function apiput(myurl,object){
    var posturl = baseurl+"/"+myurl;
    return new Promise(function(resolve, reject){
       $.ajax({
            type:"put",
            url: posturl,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            contentType:'application/json;charset=utf-8', 
            data: JSON.stringify(object),
            timeout:10000,
            success:function(data){
                resolve(data)
            }
       });
   })
}

function apifile(myurl,data){
    return new Promise(function(resolve, reject){
        $.ajax({
            type:"post",
            url: myurl,
            data:formData,
            contentType:false,
            processData: false,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            timeout:5000,
            success:function(data){
                resolve(data)
            },
            error:function(err){
                alert("网络连接失败,稍后重试",err);
            }
        });
   })
}

function apiget(myurl,object){
    var array = [];
    if(object != undefined){
        for(key in object){
            array.push(key+"="+object[key]);
        }
        var parameter = array.join("&")
        var geturl = baseurl +"/"+myurl+ "?" + parameter;
    }else{
        var geturl = baseurl + "/"+myurl;
    }

    return new Promise(function(resolve,reject){
        $.ajax({
            type:"get",
            url: geturl,
            timeout:5000,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success:function(data){
                resolve(data)
            },
            error:function(err){
                if(err.status == 401){
                  window.location.href = "Login.html"
                }else{
                  alert("网络错误")
                }
            }
        });
    })
}
