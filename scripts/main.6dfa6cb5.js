"use strict";function loadAdminPanel(){var a=new Firebase("https://encuentra-me.firebaseio.com/locs");a.on("value",function(a){var b,c=[];a.forEach(function(a){b+='<tr id="'+a.key()+'"><td>'+convertDate(a.val().date)+"</td><td>"+a.val().description+"</td></tr>";var d=["",a.val().latitude,a.val().longitude,1];c.push(d)}),0===c.length&&(b+='<tr id="empty"><td>N/D</td><td>Ninguna localización guardada</td></tr>'),generateMap(c),$("#tableBody").append(b)},function(a){console.log("Failed reading localizations: "+a.code)}),$("#adminPanel").show()}function convertDate(a){function b(a){return 10>a?"0"+a:a}var c=new Date(a);return[b(c.getDate()),b(c.getMonth()+1),c.getFullYear()].join("/")}function generateMap(a){var b,c,d=new google.maps.Map(document.getElementById("map"),{zoom:15,center:new google.maps.LatLng(37.388736,-5.971162),mapTypeId:google.maps.MapTypeId.ROADMAP}),e=new google.maps.InfoWindow;for(c=0;c<a.length;c++)b=new google.maps.Marker({position:new google.maps.LatLng(a[c][1],a[c][2]),map:d}),google.maps.event.addListener(b,"click",function(b,c){return function(){e.setContent(a[c][0]),e.open(d,b)}}(b,c))}$.material.init(),$("#inputLocalization").geocomplete().bind("geocode:result",function(a,b){$("#inputLat").val(b.geometry.location.lat()),$("#inputLng").val(b.geometry.location.lng()),$("#share-localization").text("Añadir posición")}),$("#share-localization").click(function(){$(this).text("Cargando..."),navigator.geolocation?navigator.geolocation.getCurrentPosition(function(a){var b=$("#inputLocalization");b.geocomplete("find",a.coords.latitude+", "+a.coords.longitude,function(){console.log("finish")}),b.val()&&b.attr("disabled",!0)}):($("#no-loc-error").show(),$("#share-localization").text("Añadir posición"))}),$("#locationForm").validator().on("submit",function(a){if($("#sendBtn").text("Enviando..."),a.isDefaultPrevented());else{var b=new Firebase("https://encuentra-me.firebaseio.com/locs");b.push({latitude:$("#inputLat").val(),longitude:$("#inputLng").val(),description:$("#inputDescription").val(),date:Firebase.ServerValue.TIMESTAMP}),a.preventDefault(),$("#locationForm :input").attr("disabled",!0),$("#share-localization").attr("disabled",!0),$("#sendBtn").remove(),$("#thankYou").show()}}),$("#loginForm").submit(function(a){a.preventDefault();var b=$("#inputUser").val(),c=$("#inputPass").val(),d=new Firebase("https://encuentra-me.firebaseio.com");$("#loginError").hide(),d.authWithPassword({email:b,password:c},function(a){a?$("#loginError").show():($("#loginError").hide(),$("#loginForm").hide(),loadAdminPanel())}),a.preventDefault()});