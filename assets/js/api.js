var baseurl = "https://portal-rmm.wise-paas.com"
function apipost(myurl,object){
    var posturl = baseurl+"/"+myurl
    return new Promise(function(resolve, reject){
       $.ajax({
            type:"post",
            url: posturl,
            data: JSON.stringify(object),
            contentType:'application/json;charset=utf-8', 
            crossDomain: true,
            xhrFields: { withCredentials: true },
            timeout:10000,
            success:function(data){
                resolve(data)
            },
            error:function(err){
                if(err.status == 401){
                    swal("","Login expired","error").then(function(){
                          window.location.href = "Login.html"
                    }) 
                }else if(err.status == 403){
                    swal("",JSON.parse(err.responseText).Description,"error")
                }
            },
            complete: function (XMLHttpRequest,status) {
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    swal("","network timeout","error").then(
                        function(){
                            location.reload();
                        }
                    );
                }
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
            },
            error:function(err){
                if(err.status == 401){
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html"
                        })
                }else if(err.status == 403){
                    swal("",JSON.parse(err.responseText).Description,"error")
                }
            },
            complete: function (XMLHttpRequest,status) {
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    swal("","network timeout","error").then(
                        function(){
                            location.reload();
                        }
                    );
                }
            }
       });
   })
}

function apidelete(myurl){
    var posturl = baseurl+"/"+myurl
    return new Promise(function(resolve, reject){
       $.ajax({
            type:"delete",
            url: posturl,
            crossDomain: true,
            xhrFields: { withCredentials: true },
            timeout:10000,
            success:function(data){
                resolve(data)
            },
            error:function(err){
                if(err.status == 401){
                    swal("","Login expired","error").then(function(){
                          window.location.href = "Login.html"
                    }) 
                }else if(err.status == 403){
                    swal("",JSON.parse(err.responseText).Description,"error")
                }
            },
            complete: function (XMLHttpRequest,status) {
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    swal("","network timeout","error").then(
                        function(){
                            location.reload();
                        }
                    );
                }
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
            timeout:10000,
            success:function(data){
                resolve(data)
            },
            error:function(err){
                if(err.status == 401){
                    swal("","Login expired","error").then(function(){
                        window.location.href = "Login.html"
                    }) 
                }else if(err.status == 403){
                    swal("",JSON.parse(err.responseText).Description,"error")
                }
            },
            complete: function (XMLHttpRequest,status) {
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    swal("","network timeout","error").then(
                        function(){
                            location.reload();
                        }
                    );
                }
            }
        });
   })
}

function apiget(myurl, object, isasync){
    if(isasync ==  undefined){
        isasync = true
    }
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
            timeout:15000,
            crossDomain: true,
            async: isasync,
            contentType:'application/json',
            xhrFields: {
                withCredentials: true
            }, 
            success:function(data){
                if(data.result||data.result == undefined){
                    resolve(data)
                }else{
                    $(".loading").hide();
                }               
            },
            error:function(err){
                $(".loading").hide();
                if(err.status == 401){
                    if(location.pathname.indexOf("index.html") >-1){
                        window.location.href = "Login.html" 
                    }else if(location.pathname.indexOf("Login.html") >-1){
                        swal("","Username and Password is error","error")
                    }else{
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html"
                        })
                    } 
                }else if(err.status == 403){
                    swal("",JSON.parse(err.responseText).Description,"error")
                }
            },
            complete: function (XMLHttpRequest,status) {
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    if(location.pathname.indexOf("DeviceSetting.html")<0){
                        swal("","network timeout","error").then(
                            function(){
                                    location.reload();
                        });
                    } else{
                        console.log("network timeout")
                    }  
                }
            }
        });
    })
}
