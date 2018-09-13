// South Platte Data Platform - Ditch Service Areas 2005
//id='mapbox7'

var ditch_service_areas_map = (function(){

// Set up outdoor base layer
	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	});
	
// Set up satellite base layer
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
	
	var map = L.map('mapbox7', {
		scrollWheelZoom: false,
		center:[40.072, -104.048], 
		zoom: 9,
		layers: [satellite]
	});	
	
// Create an object that contains the satellite and outdoors base layers
    var baseMaps = {
		"Outdoors": outdoors,
		"Satellite": satellite,
		"Streets": streets,
		"Streets & Satellite": streetsatellite
		};

// Create layer control that allows for switching between grayscale, outdoors and satellite base maps
    L.control.layers(baseMaps, null, {position:'topleft'}).addTo(map);

    /* Bottom Right corner. This shows the current lat and long
	of the mouse cursor.
	'º' used for the degree character when the latitude and longitude of the
	cursor is dispalyed. */
	L.control.mousePosition({position: 'bottomleft',lngFormatter: function(num) {
			var direction = (num < 0) ? 'W' : 'E';
			var formatted = Math.abs(L.Util.formatNum(num, 6)) + 'º ' + direction;
			return formatted;
	},
	latFormatter: function(num) {
			var direction = (num < 0) ? 'S' : 'N';
			var formatted = Math.abs(L.Util.formatNum(num, 6)) + 'º ' + direction;
			return formatted;
	}}).addTo(map);
	/* Bottom Right corner. This shows the scale in km and miles of
	the map. */
	L.control.scale({position: 'bottomleft',imperial: true}).addTo(map);

		
	// Add in IBCC basins layer
	basin1 = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(map)	
		
	// Control that shows ditch info on hover -- creates an info box
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

	// Method used to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h5>Ditch Service Areas</h5>' +  (props ?
			'<b>Ditch Name: </b>' + props.DITCH_NAME + '<br />' + 
			'<b>WDID: </b>' + props.WDID + '<br />' + 
			'<b>Acreage: </b>' + props.ACREAGE.toLocaleString('en', {maximumFractionDigits : 1})	
			: 'Hover over an area');
	};
	info.addTo(map);


	// Get color depending on 2005 acreage
	function getColor(d) {
		return d > 99999.9 ? '#6e016b' :
			   d > 699999.9  ? '#88419d' :
			   d > 49999.9  ? '#8c6bb1' :
			   d > 12999.9  ? '#8c96c6' :
			   d > 5999.9   ? '#9ebcda' :
			   d > 1999.9   ? '#bfd3e6' :
							'#edf8fb';
	}
	// Polygons will fill with colors based on 2005 acreage	
	function style(feature) {
		return {
		    fillColor: getColor(feature.properties.ACREAGE),
		    weight: 2,
		    opacity: 1,
		    color: 'white',
		    fillOpacity: 0.9
		};
	}

	// Highlight a polygon when it is hovered over on the map
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
	var ditchserviceareasmarkers;

	// Reset the color after hovering over
	function resetHighlight(e) {
		ditchserviceareasmarkers.resetStyle(e.target);
		info.update();
	} 		

// Zoom into the area when clicked on
	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}	
	
	// Initialize markers and bind data
	ditchserviceareasmarkers = L.geoJson(ditchserviceareas2005, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	map.attributionControl.addAttribution('Data &copy; <a href="http://water.state.co.us/Home/Pages/default.aspx">Division of Water Resources</a>');

	// Add a legend to the map
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 2000, 6000, 13000, 50000, 70000, 100000],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from.toLocaleString() + (to ? '&ndash;' + to.toLocaleString() : '+'));
		}

		div.innerHTML = "<h6>Service Area Acreage</h6>" + labels.join('<br>');
		return div;
	};
	legend.addTo(map);

	
})();