

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
						console.log(data)
					)
				}

			}
		)

		// apipost("auth", form).then(
		// 	function(data){
		// 			console.log(data)
		// 	}
		// )
		
		// $.post("/golang",
		// postdata,
		// function(data,status){
		// 	var ss = data.split("/");
		// 	console.log(ss[0])
		// 	if (data === "success"){
		// 		var UserName = document.getElementById("UserName").value;
		// 		var Password = document.getElementById("Password").value;
		// 		var encryptedUserName = CryptoJS.AES.encrypt(UserName, "AIM Secret Passphrase")
		// 		var encryptedPassword = CryptoJS.AES.encrypt(Password, "AIM Secret Passphrase")
		// 		var checkboxstatus = document.getElementById("check");
		// 		console.log(checkboxstatus.checked);
		// 		if(checkboxstatus.checked){
		// 			localStorage["isCheck"] = "true";
		// 			localStorage["UserName"] = encryptedUserName;
		// 			localStorage["Password"] = encryptedPassword;
		// 		}else{
		// 			localStorage.removeItem("UserName");
		// 			localStorage.removeItem("Password");
		// 		}
		// 		if(getCookie("page") === ""){
		// 			window.location.href = "index.html";
		// 		}else{
		// 			window.location.href =  ("page");
		// 		}
			
		// 		setCookie("page", "", 0);
		// 	}
		// });	
}

function setCookie(cname, cvalue, exmins) {
	var d = new Date();
	d.setTime(d.getTime() + (exmins*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
function RememberMe(){
	
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
	
}

//enterprise
function SetCompany(){
	document.getElementById("loginform").style.display="none";
	document.getElementById("signupform").style.display="none";
	document.getElementById("verificationform").style.display="none";
	document.getElementById("ResetPasswordform").style.display="none";
	document.getElementById("btnBack").style.display="none";
	document.getElementById("companyform").style.display="";
}

function GetCompany(){
	if (localStorage.getItem("Company") === null || localStorage.getItem("Company") === "") {
			FormSet("CheckCompanyform");
			document.getElementById("btnBack").style.display="none";
	}else{
		if (localStorage.getItem("Company") !==  "Guest") {
			document.getElementById("funcSignup").style.display="none";
			document.getElementById("subcompany").style.display="";
		}else{
			document.getElementById("funcSignup").style.display="";
			document.getElementById("subcompany").style.display="none";
		}
		FormSet("loginform");
		
		document.getElementById("btnBack").style.display="";
		document.getElementById("Company").value = localStorage.getItem("Company");
		document.getElementById("Company").disabled=true;
	}
	
}

//set register form
function SignUp() {
	document.getElementById("companyform").style.display="none";
	document.getElementById("loginform").style.display="none";		
	document.getElementById("verificationform").style.display="none";
	document.getElementById("signupform").style.display="";
	if (localStorage.getItem("Company") !== null){
		document.getElementById("SignCompany").value = localStorage.getItem("Company");
	//}else{
	//	document.getElementById("SignCompany").value = getCookie('Company');
	}
	document.getElementById("SignCompany").disabled=true;
	
}


