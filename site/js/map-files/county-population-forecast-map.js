
var county_population_forecast_map = (function(){

	var map = L.map('mapbox3', {scrollWheelZoom: false}).setView([39, -106], 7);

	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(map);

	// Adding Slider for Years

	/* Set min and max dates for slider */
	var minyear = 2018;
	var maxyear = 2050;

	/* Set necessary globals */
	var curryear = maxyear;
	var playClick = true;
	var intV;
	var speed = 100;

	var slider = L.control({position: 'bottomleft'});
	slider.onAdd = function (map) {
		var currDate = new Date();
		this._div = L.DomUtil.create('div', 'slidercontainer'); // Creates a div with a class named "info"
		this._div.innerHTML = 
			"<button type='button' id='county_pop_back' class='backbutton btn btn-deafult btn-xs' onclick='county_population_forecast_map.backFunction()'><i class='fa fa-backward' style='padding:0px;'></i></button>" +
			"<button type='button' id='county_pop_play' class='playbutton btn btn-deafult btn-xs' onclick='county_population_forecast_map.playFunction()'><i class='fas fa-play' style='padding:0px;'></i></button>" +
			"<button type='button' id='county_pop_forward' class='forwardbutton btn btn-deafult btn-xs' onclick='county_population_forecast_map.forwardFunction()'><i class='fa fa-forward' style='padding:0px;'></i></button>" +
			"<p id='county_pop_datelabel' class='datelabel'>" + curryear +"</p>" +
		 	"<input type='range' min='" + minyear + "' max='" + maxyear + "' value='" + curryear + "' class='timeslider slider' id='county_pop_timeslider' oninput='county_population_forecast_map.timesliderHelper(this.value)'>" +
		 	" <p style='float:left;display:inline-block; margin:0px; margin-top: 3px; padding-left:5px;'> Speed:</p>" +
		 	"<input type='range' min='0' max='100' value='75' class='speedslider slider' id='county_pop_speedslider' oninput='county_population_forecast_map.setSpeedFunction(this.value)'>";
		L.DomEvent.disableClickPropagation(this._div);
		return this._div;
	};
	slider.addTo(map);
		

	// Control that shows county info on hover -- creates an info box
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

	// Method used to update the control based on feature properties passed
	info.update = function (props) {
		var data = fp2.getJsonData().data[curryear];
		this._div.innerHTML = "<h4 id='county_pop_infoheader'>County Population, " + curryear + '</h4>' +  (props ?
			'<b>' + ((props.NAME) ? props.NAME : "") + '</b><br />' + 
			((data[props.NAME]) ? data[props.NAME].toLocaleString() : "")
			: 'Hover over a county');
	};
	info.addTo(map);


	// Get color depending on 2015 population value
	function getColor(d) {
		return d > 500000 ? '#B10026' :
			   d > 100000 ? '#E31A1C' :
			   d > 50000  ? '#FC4E2A' :
			   d > 20000  ? '#FD8D3C' :
			   d > 10000  ? '#FEB24C' :
			   d > 5000   ? '#FED976' :
			   d > 1000   ? '#FFEDA0' :
							'#FFFFCC';
	}
	// Counties will fill with colors based on 2015 population	
	function style(feature) {
		var data = fp2.getJsonData().data[curryear];
		return {
		    fillColor: getColor(data[feature.properties.NAME]),
		    weight: 2,
		    opacity: 1,
		    color: 'white',
		    fillOpacity: 0.9
		};
	}


	// Highlight a county when it is hovered over on the map
	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 4,
			color: '#252525',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
		info.update(layer.feature.properties);
	}

	// Create variable for markers
	var geojson;

	// Reset the color after hovering over
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	} 		

	// Zoom into the county when clicked on
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}

	// Initialize markers and bind data
	geojson = L.geoJson(CountyData, {
		style: style,
		onEachFeature: onEachFeature
	})
	// Add pop-ups to markers
	geojson.bindPopup(function(d){
		var props = d.feature.properties;
		var data = fp2.getJsonData().data[curryear];
		var str =
		'<b>' + ((props.NAME) ? props.NAME : "") + '</b><br />' + 
		((data[props.NAME]) ? data[props.NAME].toLocaleString() : "")
		return str
	})
	// Add markers to map
	geojson.addTo(map);

	map.attributionControl.addAttribution('Population data &copy; <a href="https://demography.dola.colorado.gov/population/">DOLA</a>');

	// Add a legend to the map
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1000, 5000, 10000, 20000, 50000, 100000, 500000],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from.toLocaleString() + (to ? '&ndash;' + to.toLocaleString() : '+'));
		}

		div.innerHTML = "<h6>Population</h6>" + labels.join('<br>');
		return div;
	};
	legend.addTo(map);

	// Add a legend to the map
	var scrollbutton = L.control({position: 'topleft'});
	scrollbutton.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'scrollbutton');

		div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
						" style='width:20px; cursor:pointer;' onclick='county_population_forecast_map.scrollButtonClickFunction()'></image>";

		return div;
	};
	scrollbutton.addTo(map);	

    var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
        maxZoom: 18,
        attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.satellite'
    }); 

    var streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
        maxZoom: 18,
        attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    });

    var streetsatellite = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
        maxZoom: 18,
        attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets-satellite'
    });

	var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Streets": streets,
        "Streets & Satellite": streetsatellite
    }
        
    L.control.layers(baseMaps, null, {position:'topleft'}).addTo(map);


	function scrollButtonClick(){
	 	if (map.scrollWheelZoom.enabled()) {
	    	map.scrollWheelZoom.disable();
	    	var title = "Click to toggle mouse scroll wheel behavior.<br> [ x ] Mouse scroll pages forward/back. <br> [ &nbsp; ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	  	}
	  	else {
	    	map.scrollWheelZoom.enable();
	    	var title = "Click to toggle mouse scroll wheel behavior.<br> [ &nbsp; ] Mouse scroll pages forward/back. <br> [ x ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	    }
	}

	// HELPER FUNCTIONS FOR TIMESLIDER
	function timesliderHelperFunction(year){
		if(playClick == false){
			playClick = true;
			$('#county_pop_play').html("<span class='fa fa-play'></span>")
			pause();
		}
		geoJsonSetStyle(year)
	}

	function geoJsonSetStyle(year){
		curryear = year;
		$('#county_pop_datelabel').html(curryear);
		$('#county_pop_infoheader').html('County Population, ' + curryear);
		geojson.setStyle(fillColorFromData);
	}

	function fillColorFromData(feature){
		var data = fp2.getJsonData().data[curryear];
		return {
			fillColor: getColor(data[feature.properties.NAME])
		}
	}

	function play(){
		if(curryear == maxyear){
			curryear = minyear;
		}
		$('#county_pop_play').html("<span class='fa fa-pause'></span>")
		if(playClick){
			playClick = false;
			intV  = setInterval(parseTime, speed);
		}else{
			playClick = true;
			$('#county_pop_play').html("<span class='fa fa-play'></span>")
			pause();
		}
	}

	function parseTime(){
		curryear = parseInt(curryear) + 1;
		if(curryear > maxyear){
			playClick = true;
			$('#county_pop_play').html("<span class='fa fa-play'></span>")
			pause();
			clearInterval(intV);
			curryear = maxyear;
		}else{
			$('#county_pop_datelabel').html(curryear);
			$('#county_pop_infoheader').html('County Population, ' + curryear)
			$('#county_pop_timeslider').val(curryear);
			geoJsonSetStyle(curryear);
		}
	}

	function pause(){
		clearInterval(intV);
	}

	function back(){
		curryear = parseInt(curryear) - 1;
		if(curryear >= minyear){
			$('#county_pop_datelabel').html(curryear);
			$('#county_pop_timeslider').val(curryear);
			timesliderHelperFunction(curryear);
		}else{
			curryear = minyear;
		}
	}

	function forward(){
		curryear = parseInt(curryear) + 1;
		if(curryear <= maxyear){
			$('#county_pop_datelabel').html(curryear);
			$('#county_pop_timeslider').val(curryear);
			timesliderHelperFunction(curryear);
		}else{
			curryear = maxyear;
		}
	}

	function setSpeed(value){
		console.log(value)
		var speedScale = d3.scaleLinear()
			.domain([0, 100])
			.range([300, 50]);
		speed = speedScale(value);	
		if(playClick == false){
			pause();
			playClick = true;
			play();
		}
	}

	return {
		playFunction: play,
		pauseFunction: pause,
		forwardFunction: forward,
		backFunction: back,
		timesliderHelper: timesliderHelperFunction,
		setSpeedFunction: setSpeed,
		scrollButtonClickFunction: scrollButtonClick,
		maplayer:map
	}
})();