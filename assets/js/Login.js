

//form request(UserLogin, LoginCompany, AddNewUser, VerificationCode, ResetNewPassword)
function submitDB() {
	var form = {};
	form.username = $("#UserName").val();
	form.password = $("#PassWord").val();
	form._now = Date.parse(new Date());
	form.redirectUri = "172.21.73.144/emobile/login.html";
	apiget("rmm/v1/accounts/sso/login", form).then(
		function(data){
			if(data.status == "passed"){
				apiget("rmm/v1/accounts/login").then(
					function(data){
						if(data.result){
							var encryptedUserName = CryptoJS.AES.encrypt(form.username, "AIM Secret Passphrase")
							var encryptedPassword = CryptoJS.AES.encrypt(form.password, "AIM Secret Passphrase")
							var checkboxstatus = $("#check");
							console.log(checkboxstatus.checked);
							if(checkboxstatus.checked){
								localStorage["isCheck"] = "true";
								localStorage["UserName"] = encryptedUserName;
								localStorage["Password"] = encryptedPassword;
							}else{
								localStorage.removeItem("UserName");
								localStorage.removeItem("Password");
							}
							if(getCookie("page") === ""){
								window.location.href = "index.html";
							}else{
								window.location.href =  "index.html";
							}
						}
					}   
				)
			}

		}
	)
}
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			var cvalue = c.substring(name.length, c.length);
			return cvalue;
		}
	}
	return "";
}

// remember user name
(function RememberMe(){
	if(localStorage["UserName"]!==null && localStorage["Password"]!==null && localStorage["UserName"] !=="" && localStorage["Password"] !=="" && localStorage["Password"] !==undefined && localStorage["UserName"] !== undefined){
		var decryptedUserName = CryptoJS.AES.decrypt(localStorage["UserName"], "AIM Secret Passphrase");
	var decryptedPassword = CryptoJS.AES.decrypt(localStorage["Password"], "AIM Secret Passphrase")
	document.getElementById("UserName").value = decryptedUserName.toString(CryptoJS.enc.Utf8);
	document.getElementById("Password").value = decryptedPassword.toString(CryptoJS.enc.Utf8);
	}

	if(localStorage["isCheck"]==="true"){
		var checkboxstatus = document.getElementById("check");
		checkboxstatus.checked = true;
	}

})();


