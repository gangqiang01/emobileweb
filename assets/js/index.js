//onload page
$(function() {
	LoginStatus("UserDuedateCheck","index.html");
	SetHTML("barset_index");
	if(localStorage.getItem("Company") === "Guest"){
		document.getElementById("account").innerHTML = '<a class="alert-a" href="profile.html" style="color:#3c763d;">View Details <i class="fa fa-arrow-circle-right"></i></a>';
	}else{
		document.getElementById("account").innerHTML = '<a class="alert-a" href="management.html" style="color:#3c763d;">View Details <i class="fa fa-arrow-circle-right"></i></a>';
	}
	$('.alert').css( 'cursor', 'pointer' );
	$(".alert").hover(function () {
		$(this,".alert").addClass("bw");
	},function () {
		$(this,".alert").removeClass("bw");
		
	});
	$(".alert").on("click", function(){
		window.location.href = $(this).find( ".alert-a" ).attr('href');
	});
});
