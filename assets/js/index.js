//onload page
$(function() {
    LoginStatus("index.html");
	SetHTML("barset_index");
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
