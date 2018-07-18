// South Platte Data Platform - Map of Municipal Water Providers in the South Platte and Metro Basins
// color-coded by type of water provider

//id='mapbox4'

var water_providers_southplatte_metro_map = (function(){

	var map = L.map('mapbox4').setView([40.072, -104.048], 9);

	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(map);
		
// Add in IBCC basins layer
	basin1 = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(map)		
		
// Control that shows municipality info on hover -- creates an info box
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

// Method used to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h5>South Platte and Metro Basin Municipal Water Providers</h5>' +  (props ?
			'' + '<b>Name: </b>' + props.WaterProviderName + '<br/>' + '<b>IBCC Basin: </b>' + props.IBCC_Basin + '<br />' +
			'<b>Website: </b>' + props.Website + '<br/>' + '<b>Type of Provider: </b>' + props.LocalGovtType
			: 'Hover on a circle for more information');
	};
	info.addTo(map);

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
	
	var spmetrowaterprovidersMarkers;
	
// Reset the color after hovering over
	function resetHighlight(e) {
		spmetrowaterprovidersMarkers.resetStyle(e.target);
		info.update();
	} 	
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}

// Create function of color based on provider type
    	function stylewaterprovider(feature) {
    	   var colorwaterprovider;
    	   var point = feature.properties.LocalGovtType;
    	   
    	   return getwaterprovidercolor(point);
    	}
    	function getwaterprovidercolor(point){
    		if (point === "Municipality") colorwaterprovider = "red";
    	   else if (point === "Water and Sanitation District") colorwaterprovider = "orange";
		   else if (point === "Water Authority") colorwaterprovider = "yellow";
    	   else if (point === "Water District") colorwaterprovider = "green";
    	   else if (point === "Metropolitan District") colorwaterprovider = "blue";
    	   else if (point === "Water Conservancy District") colorwaterprovider = "purple";
		   else if (point === "Company") colorwaterprovider = "brown";	
           else if (point === "Sanitation District") colorwaterprovider = "pink";		   
    	   else colorwaterprovider = "black";
    	    return colorwaterprovider;
    	}
	
	spmetrowaterprovidersMarkers = L.geoJson(spmetrowaterproviders, {		
		
			pointToLayer: function(feature, latlng) {	

			return L.circleMarker(latlng, { 
				 fillColor: stylewaterprovider(feature),
				 color: stylewaterprovider(feature),
				 weight: 1, 
				 radius: 7,
				 fillOpacity: 0.8
				});
			},

			onEachFeature: onEachFeature
			}).addTo(map);
			
// Add a legend to the map
    var legend = L.control ({position: 'bottomright'});
    legend.onAdd = function (map) {
	
	   var div = L.DomUtil.create('div', 'info legend'),
	       categories = ['Municipality', 'Water and Sanitation District', 'Water Authority', 'Water District', 'Metropolitan District', 'Water Conservancy District', 
		                 'Company', 'Sanitation District', 'Other/Cannot be Determined'],
		   labels = ['Municipality', 'Water and Sanitation District', 'Water Authority', 'Water District', 'Metropolitan District', 'Water Conservancy District', 
		                 'Company', 'Sanitation District', 'Other'];
		   
		   for (var i = 0; i < categories.length; i++) {
		        div.innerHTML +=
				   '<i class="circle" style="background:' + getwaterprovidercolor(categories[i]) + '"></i>  ' +
				   (labels[i] ? labels[i] + '<br>' : '+');
		   }   
           return div;
		}; 
   legend.addTo(map);
		
})();