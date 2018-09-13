// South Platte Data Platform - Map of Municipalities in the South Platte and Metro Basins
// color-coded by 2016 population and sized by percent change in population from 2006 to 2016

//id='mapbox1'

var municipalites_southplatte_metro_map = (function(){
	
	var municipalitygeneralmap = L.map('mapbox1', {scrollWheelZoom: false}).setView([40.072, -104.048], 9);
	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(municipalitygeneralmap);
		
	// Add in IBCC basins layer
	basin1 = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(municipalitygeneralmap)		
		
	// Control that shows municipality info on hover -- creates an info box
	var info = L.control();
	info.onAdd = function (municipalitygeneralmap) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};
	// Method used to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h5>South Platte and Metro Basin Municipalities</h5>' +  (props ?
			'<b>Name: </b>' + ((props.MunicipalityName) ? props.MunicipalityName : "") + '<br/>' + 
			'<b>IBCC Basin: </b>' + ((props.IBCC_Basin_CSV) ? props.IBCC_Basin_CSV : "") + '<br />' + 
			'<b>County(s): </b>' + ((props.County_CSV) ? props.County_CSV : "") + '<br />' +
			'<b>Website: </b>' + ((props.Website) ? hasHttp(props.Website) : "") + '<br/>' + 
			'<b>FIPS ID: </b>' + ((props.FIPS_ID) ? props.FIPS_ID : "") + '<br/>' + 
			'<b>DOLA ID: </b>' + ((props.DOLA_LG_ID) ? props.DOLA_LG_ID : "")  + '<br/>' + 
			'<b>GNIS ID: </b>' + ((props.GNIS_ID) ? props.GNIS_ID : "") + '<br/>' + 
			'<b>PWS ID: </b>' + ((props.PWS_ID) ? props.PWS_ID : "") + '<br/>' + 
			'<b>2006 Population: </b>' + ((props.Pop2006) ? props.Pop2006.toLocaleString() : "") + '<br/>' + 
			'<b>2016 Population: </b>' + ((props.Pop2016) ? props.Pop2016.toLocaleString() : "")  + '<br/>' + 
			'<b>Percent Change in Population, 2006-2016: </b>' + ((props.Percent_Change) ? props.Percent_Change : "")
			: 'Hover on a circle for more information');
	};
	info.addTo(municipalitygeneralmap);

	function hasHttp(url){
		if(url == "") return "";
		var pattern = /^((http|https|ftp):\/\/)/;

		if(!pattern.test(url)) {
		    url = "http://" + url;
		}

		return url;
	}

	// Highlight a point when it is hovered over on the map
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
	
	//create markers variable
	var spmunicipalities;
	
	// Reset the color after hovering over
	function resetHighlight(e) {
		spmunicipalities.resetStyle(e.target);
		info.update();
	} 

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}

	// Get color depending on 2016 population
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

	// Get size based on percent change in population from 2006 to 2016
	function getSize(point){
		if      (point > 49.9) sizeToUse = 28;
		else if (point > 29.9) sizeToUse = 20;
		else if (point > 19.9) sizeToUse = 16;
		else if (point > 4.9 ) sizeToUse = 14;
		else if (point > 0   ) sizeToUse = 12;
		else                   sizeToUse = 8;

		return sizeToUse;
	}
	
	// Initialize markers
	spmunicipalities = L.geoJson(munipop20062016, {
		pointToLayer: function(feature, latlng) {	

		return L.circleMarker(latlng, { 
			 color: '#5b5e55',
			 fillColor: getColor(feature.properties.Pop2016),
			 weight: 1, 
			 radius: getSize(feature.properties.Percent_Change),
			 fillOpacity: 1
			});
		},

		onEachFeature: onEachFeature
	});
	// Add popup to Markers
	spmunicipalities.bindPopup(function(d){
		var props = d.feature.properties;
		var str =
		'<b>Name: </b>' + ((props.MunicipalityName) ? props.MunicipalityName : "") + '<br/>' + 
		'<b>IBCC Basin: </b>' + ((props.IBCC_Basin_CSV) ? props.IBCC_Basin_CSV : "") + '<br />' + 
		'<b>County(s): </b>' + ((props.County_CSV) ? props.County_CSV : "") + '<br />' +
		"<b>Website: </b><a href='" + ((props.Website) ? hasHttp(props.Website) : "") + "' target='_blank'>" + ((props.Website) ? hasHttp(props.Website) : "") + "</a> <i style='font-size:9px;' class='fa fa-external-link'></i><br/>" + 
		'<b>FIPS ID: </b>' + ((props.FIPS_ID) ? props.FIPS_ID : "") + '<br/>' + 
		'<b>DOLA ID: </b>' + ((props.DOLA_LG_ID) ? props.DOLA_LG_ID : "")  + '<br/>' + 
		'<b>GNIS ID: </b>' + ((props.GNIS_ID) ? props.GNIS_ID : "") + '<br/>' + 
		'<b>PWS ID: </b>' + ((props.PWS_ID) ? props.PWS_ID : "") + '<br/>' + 
		'<b>2006 Population: </b>' + ((props.Pop2006) ? props.Pop2006.toLocaleString() : "") + '<br/>' + 
		'<b>2016 Population: </b>' + ((props.Pop2016) ? props.Pop2016.toLocaleString() : "")  + '<br/>' + 
		'<b>Percent Change in Population, 2006-2016: </b>' + ((props.Percent_Change) ? props.Percent_Change : "");
		return str
	})
	// Add Markers to map
	spmunicipalities.addTo(municipalitygeneralmap);


	// Create legend variable
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (municipalitygeneralmap) {
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 1000, 5000, 10000, 20000, 50000, 100000, 500000],
			labels = [],
			from, to;
		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];
			labels.push(
				'<i class="circle" style="background:' + getColor(from + 1) + '"></i> ' +
				from.toLocaleString() + (to ? '&ndash;' + to.toLocaleString() : '+'));
		}
		div.innerHTML = "<h6>Population</h6>" + labels.join('<br>');
		return div;
	};
	// Add legend to map
	legend.addTo(municipalitygeneralmap);			


	// Add a legend to the map
	var scrollbutton = L.control({position: 'topleft'});

	scrollbutton.onAdd = function (municipalitygeneralmap) {

		var div = L.DomUtil.create('div', 'scrollbutton');

		div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
						" style='width:20px; cursor:pointer;' onclick='municipalites_southplatte_metro_map.scrollButtonClickFunction()'></image>";

		return div;
	};

	scrollbutton.addTo(municipalitygeneralmap);		


	function scrollButtonClick(){
	 	if (municipalitygeneralmap.scrollWheelZoom.enabled()) {
	    	municipalitygeneralmap.scrollWheelZoom.disable();
	    	var title = "Click to toggle mouse scroll wheel behavior.<br> [ x ] Mouse scroll pages forward/back. <br> [ &nbsp; ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	  	}
	  	else {
	    	municipalitygeneralmap.scrollWheelZoom.enable();
	    	var title = "Click to toggle mouse scroll wheel behavior.<br> [ &nbsp; ] Mouse scroll pages forward/back. <br> [ x ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	    }
	}

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
        
    L.control.layers(baseMaps, null, {position:'topleft'}).addTo(municipalitygeneralmap);	

	// Return function that need to be accessed by the DOM 
	return{
		scrollButtonClickFunction: scrollButtonClick,
		maplayer: municipalitygeneralmap
	}

})();