// jshint devel:true
"use strict";

/*
	Index section
*/
$.material.init();
$("#inputLocalization").geocomplete().bind("geocode:result", function (event, result) {
	$("#inputLat").val(result.geometry.location.lat());
	$("#inputLng").val(result.geometry.location.lng());
	$("#share-localization").text("Añadir posición");
});

$("#share-localization").click(function getLocation() {
	$(this).text("Cargando...");
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(function (position) {
			//$("#inputLat").val(position.coords.latitude);
			//$("#inputLng").val(position.coords.longitude);
			var inputLoc = $("#inputLocalization");
			inputLoc.geocomplete("find", position.coords.latitude + ", " + position.coords.longitude, function () {
				console.log("finish");
			});
			if (inputLoc.val()) {
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
			var myFirebaseRef = new Firebase("https://encuentra-me.firebaseio.com/locs");

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
});

/**
	Admin section
*/
$('#loginForm').submit(function login(event) {
	event.preventDefault();
	var user = $("#inputUser").val();
	var pass = $("#inputPass").val();
	var ref = new Firebase("https://encuentra-me.firebaseio.com");
	$("#loginError").hide();
	ref.authWithPassword({
		email: user,
		password: pass
	}, function (error, authData) {
		if (error) {
			$("#loginError").show();
		} else {
			$("#loginError").hide();
			$('#loginForm').hide();
			loadAdminPanel();
		}
		/* create token */
		/*var tokenGenerator = new FirebaseTokenGenerator("UEkT2QZhNed3IaHONfy7jw70bZjnUAwyijOaCWXN");
  var token = tokenGenerator.createToken({ uid: "uniqueId1", some: "arbitrary", data: "here" }); 	*/
	});

	event.preventDefault();
});

//# sourceMappingURL=main.js.map

function loadAdminPanel() {
	var locs = new Firebase("https://encuentra-me.firebaseio.com/locs");
	locs.on("value", function (registry) {
		/* init localizations table*/
		var tableRows;
		var locations = [];
		registry.forEach(function (data) {
			tableRows += '<tr id="' + data.key() + '"><td>' + convertDate(data.val().date) + '</td><td>' + data.val().description + '</td></tr>';
			var loc = ['[' + convertDate(data.val().date) + '] ' + data.val().description, data.val().latitude, data.val().longitude, 1];
			locations.push(loc);
		});
		if (locations.length === 0) {
			tableRows += '<tr id="empty"><td>N/D</td><td>Ninguna localización guardada</td></tr>';
		}

		/* init map with localizations */
		generateMap(locations);
		$('#tableBody').append(tableRows);
	}, function (errorObject) {
		console.log("Failed reading localizations: " + errorObject.code);
	});
	$('#adminPanel').show();
}

/**
 - Utils -
 */
function convertDate(inputFormat) {
	function pad(s) {
		return s < 10 ? '0' + s : s;
	}
	var d = new Date(inputFormat);
	return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}

function generateMap(locations) {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: new google.maps.LatLng(37.388736, -5.971162),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var infowindow = new google.maps.InfoWindow();

	var marker, i;

	for (i = 0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			map: map,
			title: locations[i][0]
		});

		google.maps.event.addListener(marker, 'click', (function (marker, i) {
			return function () {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			};
		})(marker, i));
	}
}
//# sourceMappingURL=main.js.map
