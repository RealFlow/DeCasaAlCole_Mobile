var config = {
	isMobile: true
	// isMobile: false
};


var device = {
	init: function (){

		if (config.isMobile) {
			var attachFastClick = Origami.fastclick;
			attachFastClick(document.body);
		}
	},
	isNetworkAvailable: function () {

		console.log("Getting Network status");
	    var networkState = navigator.network.connection.type;
	    console.log("Got Network status");

	    var isConnected = false;

		if (networkState != Connection.NONE)
			isConnected = true;

	    var states = {};
            states[navigator.connection.UNKNOWN]  = 'Unknown connection';
            states[navigator.connection.ETHERNET] = 'Ethernet connection';
            states[navigator.connection.WIFI]     = 'WiFi connection';
            states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
            states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
            states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
            states[navigator.connection.CELL]     = 'Cell generic connection';
            states[navigator.connection.NONE]     = 'No network connection';

        console.log("Network status: " + states[networkState]);
 		return isConnected;
	}
	
};

var layout = {

	mainlayoutHeight: 0,
	adjustLayout: function () {

		var headerHeight = $('.page-header').height();
		var footerHeight = $('.footer').height();
		var windowHeight = $(window).height();

		var main = $('#page-content-main');
		var mainHeight = windowHeight - (headerHeight + footerHeight);

		main.css("min-height", mainHeight);
		// main.height(mainHeight);
		this.mainlayoutHeight = mainHeight;
	},
	adjustLayoutIndex: function () {
		
		$(".intro-logo").css("max-height","50%");
		$(".intro-logo").css("max-width","50%");
		$(".intro-logo").css("display","block");
		$(".intro-logo").css("margin","auto");
		$(".intro-logo").css("vertical-align","middle");
	},
	initDropdownLayout: function () {
		var rowDropdownContainer = 60;

		var headerHeight = 92;
		var mainHeight = this.mainlayoutHeight - headerHeight;

		var numberOfRows = Math.floor(mainHeight / rowDropdownContainer);
		pagination.step = numberOfRows; 

	}


};


var pagination = {
	filteredData: new Array(),
	step: 10,
	current:0,
	showButtons: function () {

		var nextButton = $("#paginationNextButton");
		var previousButton = $("#paginationPreviousButton");

		if (this.current == 0){
			previousButton.fadeOut(0);
		} else {
			previousButton.fadeIn(300);
		}

		if (this.current < this.filteredData.length){
			nextButton.fadeIn(300);
		} else {
			nextButton.fadeOut(0);
		}

	},
	initData: function () {
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
	},
	showData: function () {

		layout.initDropdownLayout();

		var resultsSchoolsDiv = $(".page-content-results-school");
		resultsSchoolsDiv.empty();

		this.showButtons();
		
		for (var i = this.current; i < this.filteredData.length; i++){
    		if(i < this.current + this.step) {
	    		var elem = this.filteredData[i];
	    		var html = '<div class="container no-bottom"><div class="dropdown-menu"><a href="#" class="dropdown-deploy"><em class="left-dropdown bg-light"></em><span class="highlight bg-orange"><p style="display: inline; text-transform: lowercase; margin:15px; line-height:40px">' + elem.atimeabreviada + '</p></span><p style="display: inline;">' + '&nbsp;' +  elem.dabreviada +'</p></a><a href="#" class="dropdown-hidden"><em class="left-dropdown bg-light"></em>      </a><a class="dropdown-item-blue bg-light">' + elem.dabreviada + '</a><a class="dropdown-item-yellow bg-light" style="text-transform: lowercase;">' + elem.atime +'</a><a class="dropdown-item-yellow bg-light" style="text-transform: lowercase;">' + elem.adist + '</a><a class="dropdown-item bg-light">' + elem.dgenerica + '</a><a class="dropdown-item bg-light">' + elem.direccion + '</a><a class="dropdown-item bg-light">' + elem.telefono + '</a><a class="dropdown-item bg-light green">' + 'Mapa' +'</a><div class="dropdown-bottom-border"></div></div></div>';
	    		
	    		resultsSchoolsDiv.append( html );
    		}
			    		
		}

		this.initData();

		resultsSchoolsDiv.show();
		this.updateCounterPanel();

	},
	updateCounterPanel: function () {

		var counterPanel = $("#page-content-results-header-counter");
		var counter = this.current + this.step;

		var txt;
		if (this.filteredData.length == 0)
			txt = "No existen resultados";
		else
			txt = counter + " de " + this.filteredData.length;
		counterPanel.text(txt);

	},
	next: function () {

		this.current += this.step;
		this.showData();

	},
	previous: function () {
		this.current -= this.step;
		this.showData();
	} 
};


var distance = {

	createCartoURL: function() {

		var isPublicChecked = $("#formPublicSchoolChecker").hasClass( "checked-v1" ) ? true : false;
		var isPrivateChecked = $("#formPrivateSchoolChecker").hasClass( "checked-v1" ) ? true : false;
		var cp = $("#formPostalCodeInput").val();

		var filter = {};
		filter.cp = cp;
		if(isPublicChecked && isPrivateChecked) {
			filter.regimen = "2"
		} else {
			if (isPublicChecked) {
				filter.regimen = "0";
			} 
			if (isPrivateChecked) {
				filter.regimen = "1";
			}
		}

		var localUrl = cartojs('http://decasaalcole.cartodb.com', filter);
		return localUrl

	},

	requestDistance: function() {

		
		var localUrl = this.createCartoURL();


		var defaultSettings = {
			url : localUrl,
			type: "GET",
			    // data : formData,
			    dataType: 'jsonp',
			    success: function(data, textStatus, jqXHR)
			    {

			    	console.log("Distance App: requestGeometry SUCCESS");
		    		$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.

			    	$(".page-content-distance").hide(); // hides form
			    	

			    	pagination.filteredData = new Array();
			    	for (var i = 0; i < data.rows.length; i++){
			    		var elem = data.rows[i];
			    		var savedData = {};
			    		savedData.localidad = elem.localidad;
			    		savedData.cp = elem.cp;
			    		savedData.dabreviada = elem.dabreviada;
			    		savedData.dgenerica = elem.dgenerica;
			    		savedData.adist = validation.formatDistance(elem.kms);
			    		savedData.atime = validation.formatTime(elem.minutes);
			    		savedData.atimeabreviada = validation.formatTime(elem.minutes, true);
			    		savedData.direccion = elem.direccion + ", " + elem.numero + ". " + elem.localidad;
			    		savedData.telefono = elem.telefono;

			    		pagination.filteredData.push(savedData);

			    	}

			    	var tableNode = $("#distance_table_results");

			    	var resultsDiv = $(".page-content-results");
			    	resultsDiv.show();

			    	pagination.showData()

			    },
			    error: function (jqXHR, textStatus, errorThrown)
			    {
			    	$("#status").fadeOut(); // will first fade out the loading animation
					$("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.

			    	console.error("Distance App Error: ", errorThrown);
			    	console.error("Distance App Error: ", textStatus);

			    	var errorField = $("#formAjaxError");
			    	// errorField.text("Error: " + textStatus + ". Inténtelo de nuevo");
					errorField.fadeIn(300);

			    }
			};

		$("#status").show();
		$("#preloader").show();

		$.ajax(defaultSettings);
	}
};


var validation = {

	formatTime: function(timeInMinutes, isAbreviated){
		var min_num = parseInt(timeInMinutes, 10);
	    var hours   = Math.floor(min_num / 60);
	    var minutes = Math.floor(min_num - (hours * 60));
	    

	    if (hours  == 0) {hours = null;}
	    if (minutes == 0) {minutes = null;}

	    var time;
	    if (!hours && !minutes){
	    	if (isAbreviated)
	    		time = '< 1 min'
	    	else
	    		time = 'menos de 1 min';
	    } else {
		    var textHour = hours ? hours + 'h ' : '';
		    var textMin = minutes ? minutes + ' min ' : '';
		   
		    time = textHour + textMin;  
		}
	    return time;
	},


	formatDistance: function(distanceInKm) {

		distanceInKm = parseInt(distanceInKm);
		var distance;
		if ( !distanceInKm ) {
			distance = 'menos de 1 km';
		} else {
			
			distance = distanceInKm + ' km';
			// distance = distance.replace(".", ",");	
		}

		return distance
	
	}
	
};
