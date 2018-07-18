// South Platte Data Platform - Map of Municipalities in the South Platte and Metro Basins
// color-coded by 2016 population and sized by percent change in population from 2006 to 2016

//id='mapbox1'

var municipalites_southplatte_metro_map = (function(){
	
	var municipalitygeneralmap = L.map('mapbox1').setView([40.072, -104.048], 9);
		
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
			'' + '<b>Name: </b>' + props.MunicipalityName + '<br/>' + '<b>IBCC Basin: </b>' + props.IBCC_Basin_CSV + '<br />' + '<b>County(s): </b>' + props.County_CSV + '<br />' +
			'<b>Website: </b>' + props.Website + '<br/>' + '<b>FIPS ID: </b>' + props.FIPS_ID + '<br/>' + '<b>DOLA ID: </b>' + props.DOLA_LG_ID  + '<br/>' + '<b>GNIS ID: </b>' + props.GNIS_ID 
			  + '<br/>' + '<b>PWS ID: </b>' + props.PWS_ID + '<br/>' + '<b>2006 Population: </b>' + props.Pop2006 + '<br/>' + '<b>2016 Population: </b>' + props.Pop2016  
			  + '<br/>' + '<b>Percent Change in Population, 2006-2016: </b>' + props.Percent_Change
			: 'Hover on a circle for more information');
	};
	info.addTo(municipalitygeneralmap);

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
				d > 100000  ? '#E31A1C' :
				d > 50000  ? '#FC4E2A' :
				d > 20000  ? '#FD8D3C' :
				d > 10000   ? '#FEB24C' :
				d > 5000   ? '#FED976' :
				d > 1000   ? '#FFEDA0' :
							'#FFFFCC';
	}

// Get size based on percent change in population from 2006 to 2016
	function getSize(point){
		if (point > 49.9)     sizeToUse = 28;
		else if (point > 29.9) sizeToUse = 20;
		else if (point > 19.9) sizeToUse = 16;
		else if (point > 4.9) sizeToUse = 14;
		else if (point > 0)  sizeToUse = 12;
		else sizeToUse = 8;
		
		return sizeToUse;
	}
	
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

	spmunicipalities.bindPopup(function(d){
		var props = d.feature.properties;
		var str = ""
		for(var key in props){
			if(props.hasOwnProperty(key)){
				console.log(key + ": " + props[key])
				str += "<span style='font-weight:bold'>" + key + "</span>: " + props[key] + "<br>";
			}
		}
		return str
	}).addTo(municipalitygeneralmap);


// Add a legend to the map
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
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(municipalitygeneralmap);			
		
})();