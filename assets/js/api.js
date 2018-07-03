var baseurl = "https://portal-rmm.wise-paas.com"
var ftpurl = ""
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
            // timeout:60000,
            success:function(data){
                // $("#page_loading").hide();
                if(data.result||data.result == undefined){
                    resolve(data)
                }else{
                    swal("","network timeout","error")
                }
            },
            error:function(err){
                $("#page_loading").hide();
                if(err.status == 401){
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html";
                        })
                }else if(err.status == 403){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error");
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error");
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else if(err.status = 400){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error");
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error");
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                }else{
                    console.log(err);
                }
            },
            complete: function (XMLHttpRequest,status) {
                $("#page_loading").hide();
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    swal("","network timeout","error")
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
               
                if(data.result||data.result == undefined){
                    resolve(data)
                }else{
                    $("#page_loading").hide();
                    swal("","network timeout","error")
                }  
            },
            error:function(err){
                $("#page_loading").hide();
                if(err.status == 401){
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html"
                        })
                }else if(err.status == 403){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error")
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error")
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else if(err.status = 400){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error");
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error");
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else{
                    console.log(err);
                }
            },
            complete: function (XMLHttpRequest,status) {
                $("#page_loading").hide();
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
                $("#page_loading").hide();
                if(data.result||data.result == undefined){
                    resolve(data)
                }
            },
            error:function(err){
                $("#page_loading").hide();
                if(err.status == 401){
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html"
                        })
                }else if(err.status == 403){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error")
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error")
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else if(err.status = 400){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error");
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error");
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else{
                    console.log(err);
                }
            },
            complete: function (XMLHttpRequest,status) {
                $("#page_loading").hide();
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    swal("","network timeout","error")
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
            timeout:20000,
            success:function(data){
                if(data.result||data.result == undefined){
                    resolve(data)
                }else{
                    $("#page_loading").hide();
                    swal("","network timeout","error");
                }  
            },
            error:function(err){
                $("#page_loading").hide();
                if(err.status == 401){
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html"
                        })
                }else if(err.status == 403){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error")
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error")
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else if(err.status = 400){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error");
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error");
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else{
                    console.log(err);
                }
            },
            complete: function (XMLHttpRequest,status) {
                $("#page_loading").hide();
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
    var geturl = encodeURI(geturl);
    return new Promise(function(resolve,reject){
        $.ajax({
            type:"get",
            url: geturl,
            timeout:20000,
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
                    $("#page_loading").hide();
                }         
            },
            error:function(err){
                $("#page_loading").hide();
                if(err.status == 401){
                        swal("","Login expired","error").then(function(){
                            window.location.href = "Login.html"
                        })
                }else if(err.status == 403){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error")
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error")
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else if(err.status = 400){
                    if(JSON.parse(err.responseText).Description != undefined){
                        swal("",JSON.parse(err.responseText).Description,"error");
                    }else if(JSON.parse(err.responseText).Field != undefined){
                        swal("",JSON.parse(err.responseText).Field,"error");
                    }else{
                        console.log(JSON.parse(err.responseText));
                    }
                    
                }else{
                    console.log(err);
                }
            },
            complete: function (XMLHttpRequest,status) {
                $("#page_loading").hide();
                if(status == 'timeout') {
                    XMLHttpRequest.abort();  
                      // 超时后中断请求
                    if(location.pathname.indexOf("DeviceSetting.html")<0){
                        swal("","network timeout","error")
                    } else{
                        console.log("network timeout")
                    }  
                }
            }
        });
    })
}

function repoapiget(myurl, object, token){
    var array = [];
    if(object != undefined){
        for(key in object){
            array.push(key+"="+object[key]);
        }
        var parameter = array.join("&")
        var geturl = myurl+ "?" + parameter;
    }else{
        var geturl = myurl;
    }

    var geturl = encodeURI(myurl);
    return new Promise(function(resolve,reject){
        $.ajax({
            type:"get",
            url: geturl,
            timeout:10000,
            // dataType:'jsonp',
            contentType:'application/json',
            beforeSend: function(request) {  
                request.setRequestHeader("accesstoken", token);  
            },
            success:function(data){
                resolve(data)           
            },
        });
    })
}

function repoapipost(myurl, object){
        var array = [];
    if(object != undefined){
        for(key in object){
            array.push(key+"="+object[key]);
        }
        var parameter = array.join("&")
    }
    return new Promise(function(resolve, reject){
       $.ajax({
            type:"post",
            url: myurl,
            data: {username:"jinxin",passwd:"jinxin"},
            timeout:10000,
            success:function(data){
                resolve(data)
            }
       });
   })
}