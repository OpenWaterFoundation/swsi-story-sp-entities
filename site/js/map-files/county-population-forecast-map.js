// County Population Projections, 2018-2050</title>
// Map contains slider to move through each year

//id='mapbox5'

(function(){

	var map = L.map('mapbox5').setView([39.14, -105.40], 7);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(map);
		

// Control that shows county info on hover -- creates an info box
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

// Method used to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h5>County Population Forecasts</h5>' +  (props ?
			'' + '<b>County: </b>' + props.County + '<br/>' + '<b>2050 Population: </b>' + props.Pop_2050 
			: 'Hover over a county');
	};
	info.addTo(map);

	
// Get color depending on 2050 population value
	function getColor(d) {
		return d > 500000 ? '#B10026' :
				d > 100000  ? '#E31A1C' :
				d > 50000  ? '#FC4E2A' :
				d > 20000  ? '#FD8D3C' :
				d > 10000   ? '#FEB24C' :
				d > 5000   ? '#FED976' :
				d > 1000   ? '#FFEDA0' :
							'#FFFFCC';
	}
// Counties will fill with colors based on 2050 population	
	function style(feature) {
    return {
        fillColor: getColor(feature.properties.Pop_2050),
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
	
	var countypopforecast;

// Reset the color after hovering over
	function resetHighlight(e) {
		countypopforecast.resetStyle(e.target);
		info.update();
	} 		

// Zoom into the county when clicked on
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

	countypopforecast = L.geoJson(countypopforecast, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

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
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);

})();	
