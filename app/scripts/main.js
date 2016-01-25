// jshint devel:true
$.material.init();
$("#inputLocalization").geocomplete()
.bind("geocode:result", function(event, result){
	$("#inputLat").val(result.geometry.location.lat());
	$("#inputLng").val(result.geometry.location.lng());
	$("#share-localization").text("Añadir posición");
});

$("#share-localization").click(function getLocation(){
	$(this).text("Cargando...");
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(function(position) {
  			//$("#inputLat").val(position.coords.latitude);
			//$("#inputLng").val(position.coords.longitude);
			var inputLoc = $("#inputLocalization");
			inputLoc.geocomplete("find", position.coords.latitude+", "+position.coords.longitude , function(){
				console.log("finish");
			});
			if(inputLoc.val()){
				inputLoc.attr('disabled', true);
			}
		});

	} else { 
		$("#no-loc-error").show();
		$("#share-localization").text("Añadir posición");
	}
	
});


$('#locationForm').validator().on('submit', function (e) {
	$("#sendBtn").text("Enviando...");
	if (e.isDefaultPrevented()) {
    // handle the invalid form...
} else {
  	// everything goes good
  	var myFirebaseRef = new Firebase("https://encuentra-me.firebaseio.com/adminp");

  	myFirebaseRef.push({
  		latitude: $("#inputLat").val(),
  		longitude: $("#inputLng").val(),
  		description: $("#inputDescription").val(),
  		date: Firebase.ServerValue.TIMESTAMP
  	});
  	e.preventDefault();
  	$("#locationForm :input").attr("disabled", true);
  	$("#share-localization").attr("disabled", true);
  	$("#sendBtn").remove();
  	$("#thankYou").show();
  }
})


$('#loginForm').submit(function login(event){
	var user = $("#inputUser").val();
	var pass = $("#inputPass").val();

	var ref = new Firebase("https://encuentra-me.firebaseio.com/");
	ref.authWithPassword({
		email    : user,
		password : pass
	}, function(error, authData) {
		if (error) {
			$("#loginError").show();
		} else {
			$('#loginForm').hide();

		}
	});
	event.preventDefault();
});