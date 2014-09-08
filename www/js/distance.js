var distance = {

	requestDistance: function() {

		var isPublicChecked = $("#form_checker_public").hasClass( "checked-v1" ) ? true : false;
		var isPrivateChecked = $("#form_checker_private").hasClass( "checked-v1" ) ? true : false;
		var cp = $("#form_input_cp").val();

		var filter = {};
		filter.cp = cp;
		if(isPublicChecked && isPrivateChecked) {

		} else {
			if (isPublicChecked) {
				filter.regimen = "Púb.";
			} 
			if (isPrivateChecked) {
				filter.regimen = "Priv.";
			}
		}

		var localUrl = cartojs('http://decasaalcole.cartodb.com', filter);



		var defaultSettings = {
			url : localUrl,
			type: "GET",
			    // data : formData,
			    dataType: 'json',
			    success: function(data, textStatus, jqXHR)
			    {

			    	console.log("Distance App: requestGeometry SUCCESS");
		    		$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.

			    	$(".page-content-distance").hide();
			    	var resultsDiv = $(".page-content-results");

			    	var filteredData = new Array();
			    	for (var i = 0; i < data.rows.length; i++){
			    		var elem = data.rows[i];
			    		var savedData = {};
			    		savedData.localidad = elem.localidad;
			    		savedData.cp = elem.cp;
			    		savedData.despecific = elem.despecific;
			    		savedData.adist = validation.formatDistance(elem.adist);
			    		savedData.atime = validation.formatTime(elem.atime);
			    		savedData.dgenerica = elem.dgenerica;
			    		savedData.direccion = elem.direccion + ", " + elem.numero + ". " + elem.provincia;
			    		savedData.telefono = elem.telefono;


			    		filteredData.push(savedData);


			    	}

			    	var tableNode = $("#distance_table_results");
			    	var borrame = resultsDiv.html();

			    	for (var i = 0; i < filteredData.length; i++){
			    		if(i < 100) {
				    		var elem = filteredData[i];
				    		// var html = "<tr><td>" + elem.atime+ "</td><td>" + elem.adist + "</td><td>" + elem.despecific + "</td></tr>";
				    		// tableNode.append( html );
				    		 
				    		// var html = '<div class="container no-bottom"><div class="dropdown-menu"><a href="#" class="dropdown-deploy"><em class="left-dropdown bg-light"></em><p style="display: inline; text-transform: lowercase;">' + elem.atime + '</p><p style="display: inline;">' + ' -- ' +  elem.despecific +'</p></a><a href="#" class="dropdown-hidden"><em class="left-dropdown bg-light"></em>Ocultar</a><a class="dropdown-item-yellow bg-light">' + elem.despecific + '</a><a class="dropdown-item-blue bg-light" style="text-transform: lowercase;">' + elem.atime +'</a><a class="dropdown-item-blue bg-light" style="text-transform: lowercase;">' + elem.adist + '</a><a class="dropdown-item bg-light">' + elem.dgenerica + '</a><a class="dropdown-item bg-light">' + elem.direccion + '</a><a class="dropdown-item bg-light">' + elem.telefono + '</a><div class="dropdown-bottom-border"></div></div></div>';
				    		var html = '<div class="container no-bottom"><div class="dropdown-menu"><a href="#" class="dropdown-deploy"><em class="left-dropdown bg-light"></em><p style="display: inline; text-transform: lowercase;">' + elem.atime + '</p><p style="display: inline;">' + ' -- ' +  elem.despecific +'</p></a><a href="#" class="dropdown-hidden"><em class="left-dropdown bg-light"></em><span class="stat-background"><span class="stat-cleaner"></span><span class="percent green-minimal  p100"></span></span></a><a class="dropdown-item-yellow bg-light">' + elem.despecific + '</a><a class="dropdown-item-blue bg-light" style="text-transform: lowercase;">' + elem.atime +'</a><a class="dropdown-item-blue bg-light" style="text-transform: lowercase;">' + elem.adist + '</a><a class="dropdown-item bg-light">' + elem.dgenerica + '</a><a class="dropdown-item bg-light">' + elem.direccion + '</a><a class="dropdown-item bg-light">' + elem.telefono + '</a><div class="dropdown-bottom-border"></div></div></div>';
				    		
				    		resultsDiv.append( html );


							// style="text-transform: lowercase;"
				    		// <span class="stat-background"><span class="stat-cleaner"></span><span class="percent red-minimal  p20"></span></span>
			    		}
			    		
			    	}

			    	$('.dropdown-hidden').hide();
					$('.dropdown-item').hide();
					$('.dropdown-item-yellow').hide();
					$('.dropdown-item-blue').hide();

					$('.dropdown-deploy').click(function(){
						$(this).parent().parent().find('.dropdown-item').show(200);
						$(this).parent().parent().find('.dropdown-item-yellow').show(200);
						$(this).parent().parent().find('.dropdown-item-blue').show(200);
						$(this).parent().parent().find('.dropdown-hidden').show();
						$(this).hide();
						return false;
					});
					
					$('.dropdown-hidden').click(function(){
						$(this).parent().parent().find('.dropdown-item').hide(200);
						$(this).parent().parent().find('.dropdown-item-yellow').hide(200);
						$(this).parent().parent().find('.dropdown-item-blue').hide(200);
						$(this).parent().parent().find('.dropdown-deploy').show();
						$(this).parent().parent().find(this).hide();
						return false;		
					});

			    	resultsDiv.show();

			    },
			    error: function (jqXHR, textStatus, errorThrown)
			    {
			    	$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.
			    	console.error("Distance App Error: ", errorThrown);
			    	console.error("Distance App Error: ", textStatus);

			    	var errorField = $("#form_field_error");
			    	errorField.text("Error: " + textStatus + ". Inténtelo de nuevo");
					errorField.show();

			    }
			};

		$("#status").show();
		$("#preloader").show();
	
		$.ajax(defaultSettings);
	}
};


var validation = {

	validateRequest: function () {

		var errorField = $("#form_field_error");
		errorField.hide();

		var cpText = $("#form_input_cp").val(); //.value()
		if (cpText == null || cpText == "") {
			errorField.text("Código Postal obligatorio");
			errorField.fadeIn();
		} else {
			var isnum = /^\d+$/.test(cpText);
			if (isnum) {
				var cpLength = cpText.length;
				if(cpLength != 5){
					errorField.text("Longitud de código postal distinta de 5");
					errorField.fadeIn();
				} else {
					distance.requestDistance();
				}
			} else {
				errorField.text("Carácter incorrecto en código postal");
				errorField.fadeIn();
			}
		}
	},
	formatTime: function(timeInSeconds){
		var sec_num = parseInt(timeInSeconds, 10);
	    var hours   = Math.floor(sec_num / 3600);
	    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    var seconds = sec_num - (hours * 3600) - (minutes * 60);

	    if (hours  == 0) {hours = null;}
	    if (minutes == 0) {minutes = null;}
	    if (seconds == 0) {seconds = null;}

	    var time;
	    if (!hours && !minutes && !seconds){
	    	time = '0 seg'
	    } else {
		    var textHour = hours ? hours + 'h ' : '';
		    var textMin = minutes ? minutes + 'min ' : '';
		    var textSec = seconds ? seconds + 'seg ' : '';

		    time = textHour + textMin + textSec;  
		}
	    return time;
	},
	formatDistance: function(distanceInMeter) {

		distanceInMeter = parseInt(distanceInMeter);
		var distance;
		var isBiggerThanKM = Math.floor(distanceInMeter/1000); 
		if ( !isBiggerThanKM ) {
			distance = isBiggerThanKM + ' m';
		} else {
			var km = distanceInMeter / 1000;
			var fixedKm = km.toFixed(1);
			distance = fixedKm + ' km';
			distance = distance.replace(".", ",");	
		}

		return distance
	
	}
	
};
