
// remember user name
$(function (){
    loginout();
    initLoginPage();

    $("#login").on("click",function(){
        submitDB();
    })
    function initLoginPage(){
        if(localStorage["UserName"] && localStorage["Password"]){
            var decryptedUserName = CryptoJS.AES.decrypt(localStorage["UserName"], "AIM Secret Passphrase");
            var decryptedPassword = CryptoJS.AES.decrypt(localStorage["Password"], "AIM Secret Passphrase")
            document.getElementById("UserName").value = decryptedUserName.toString(CryptoJS.enc.Utf8);
            document.getElementById("Password").value = decryptedPassword.toString(CryptoJS.enc.Utf8);
        }
    
        if(localStorage["isCheck"]==="true"){
            var checkboxstatus = document.getElementById("check");
            checkboxstatus.checked = true;
        }
    }
    
    function submitDB() {
        var form = {};
        form.username = $("#UserName").val();
        form.password = $("#Password").val();
        form._now = Date.parse(new Date());
        form.redirectUri = "172.21.73.144/emobile/login.html";
        apiget("rmm/v1/accounts/sso/login", form).then(
            function(data){
                if(data.status == "passed"){
                    apiget("rmm/v1/accounts/login").then(
                        function(data){
                            if(data.result){
                                setCookie("SessionId",data.sessionId,60);
                                var encryptedUserName = CryptoJS.AES.encrypt(form.username, "AIM Secret Passphrase")
                                var encryptedPassword = CryptoJS.AES.encrypt(form.password, "AIM Secret Passphrase")
                                var checkboxstatus =  document.getElementById("check");
                                // console.log(checkboxstatus.checked);
                                if(checkboxstatus.checked){
                                    localStorage["isCheck"] = "true";
                                    localStorage["UserName"] = encryptedUserName;
                                    localStorage["Password"] = encryptedPassword;
                                }else{
                                    localStorage.removeItem("UserName");
                                    localStorage.removeItem("Password");
                                    localStorage.removeItem("isCheck");
                                }
                                if(checkCookie("page")){
                                    var originhtml = getCookie('page');
                                    window.location.href =  originhtml;
                                    
                                }else{
                                    window.location.href = "index.html";
                                }
                            }
                        }   
                    )
                }
    
            }
        )
    }
});


