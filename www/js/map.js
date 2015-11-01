var map = {
	instance: null,
	init: function () {
		this.instance = L.map('map');
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(this.instance);
		this.instance.setView([39.25, 0], 7);
	},
	addMapLegend: function () {
			var html = '<div clas="legElem"><div class="icon icon30"></div><div class="legElem">hasta 30 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon60"></div><div class="legElem">hasta 60 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon90"></div><div class="legElem">hasta 90 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon120"></div><div class="legElem">hasta 120 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon150"></div><div class="legElem">hasta 150 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon180"></div><div class="legElem">m&aacute;s de 150 min</div></div>';
			html += '<div clas="legElem"><div class="iconPin iconPinBlue"></div><div class="legElem">Código postal</div></div>';
			html += '<div clas="legElem"><div class="iconPin iconPinRed"></div><div class="legElem">Colegio</div></div>';
			$('#legend').html(html);
	},
	adjustLayout: function () {

		var headerHeight = $('.page-header').height();
		var footerHeight = $('.footer').height();
		var windowHeight = $(window).height();
		var marginTop = 10;
		var marginBottom = 80;
		var mapHeight = windowHeight - (headerHeight + footerHeight + marginTop + marginBottom);

		var map = $('#map');
		map.css("min-height", mapHeight);
	}
};
