// South Platte Data Platform - Water Providers Map with Population and Water Use from the Water Efficiency Data Portal (WEDP)
//id='mapbox5'

var water_providers_1051_map = (function(){

	var map = L.map('mapbox5', {scrollWheelZoom: false}).setView([40.072, -104.048], 9);
	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	}).addTo(map);		

	// Control that shows IPP info on hover -- creates an info box
	var info = L.control();
	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

	// Create array list of dates to display
	var dates = ['2013', '2014', '2015', '2016', '2017']
	var baselayers = {};

	dates.forEach(function(year){
		// ADD A LAYER OF YEAR POPULATION AND WATER USE DATA 	
		// variable name will be wedp + year ex. wedp2013
		window['wedp' + year];

		// Reset the color after hovering over
		function resetHighlight(e) {
			window['wedp' + year].resetStyle(e.target);
			info.update();
		} 	

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight
			});
		}

		// Create a function that calls for colors
		function style(feature) {
		   var point = feature.properties['Population_Served_' + year];
		   
		   return getColor(point);
		}

		// Create a function that calls for point size based on water use
		function sizeByWaterUse(feature) {
		   var point = feature.properties['WaterUse_' + year];
		   return getSize(point);
		}

		window['wedp' + year] = L.geoJson(ProviderWEDPData, {		
			
			pointToLayer: function(feature, latlng) {	

			return L.circleMarker(latlng, { 
				 fillColor: style(feature),
				 color: style(feature),
				 weight: 1, 
				 radius: sizeByWaterUse(feature),
				 fillOpacity: 0.8 
				});
			},

			onEachFeature: onEachFeature
		});

		window['wedp' + year].bindPopup(function(d){
			var props = d.feature.properties;
			if(typeof props != "undefined"){				var str =
				'<b>Name: </b>' + props.WaterProviderName + '<br/>' + 
				'<b>IBCC Basin: </b>' + props.IBCC_Basin + '<br />' + 
				'<b>County(s): </b>' + props.County_CSV + '<br />' +
				'<b>Provider Type: </b>' + props.LocalGovtType + '<br />' + 
				"<b>Website: </b><a href='" + props.Website + "' target='_blank'>" + props.Website  + "</a> <i style='font-size:9px;' class='fa fa-external-link'></i><br />" + 
				'<b>Population Served: </b>' + props['Population_Served_' + year].toLocaleString() + 
				'<br />' + '<b>Water Use (acre-feet): </b>' + props['WaterUse_' + year].toFixed(0)
				return str
			}else{
				return null;
			}
			
		})

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
			info.update(layer.feature.properties, year);
		}

		baselayers[year + ' Data'] = window['wedp' + year];

	})

// Method used to update the control based on feature properties passed
	info.update = function (props, year) {
		this._div.innerHTML = '<h5>Water Providers</h5>' +  (props ?
			'<b>Name: </b>' + props.WaterProviderName + '<br/>' + 
			'<b>IBCC Basin: </b>' + props.IBCC_Basin + '<br />' + 
			'<b>County(s): </b>' + props.County_CSV + '<br />' +
			'<b>Provider Type: </b>' + props.LocalGovtType + '<br />' + 
			'<b>Website: </b>' + props.Website  + '<br />' + 
			'<b>Population Served: </b>' + props['Population_Served_' + year].toLocaleString() + 
			'<br />' + '<b>Water Use (acre-feet): </b>' + props['WaterUse_' + year].toFixed(0)
			: 'Hover on a circle for more information');
	};
	info.addTo(map);

// Create function of colors for population
	function getColor(point){
		return  point > 500000 ? '#B10026' :
				point > 100000 ? '#E31A1C' :
				point > 50000  ? '#FC4E2A' :
				point > 20000  ? '#FD8D3C' :
				point > 10000  ? '#FEB24C' :
				point > 5000   ? '#FED976' :
				point > 1000   ? '#FFEDA0' :
							'#595959';
	}

// Create function of size
	function getSize(point){
		if (point > 100000)     sizeToUse = 24;
		else if (point > 50000) sizeToUse = 20;
		else if (point > 20000) sizeToUse = 16;
		else if (point > 10000) sizeToUse = 12;
		else if (point > 5000)  sizeToUse = 8;
		else sizeToUse = 6;
		
		return sizeToUse;
	}

// Add 2013 data as default
	wedp2013.addTo(map);

// Add method to layer control class
	L.Control.Layers.include({
	    getActiveOverlays: function () {

	        // Create array for holding active layers
	        var active = [];

	        // Iterate all layers in control
	        this._layers.forEach(function (obj) {

	        	console.log(obj)

	            // Check if it's an overlay and added to the map
	            if (obj.overlay && this._map.hasLayer(obj.layer)) {
	                // Push layer to active array
	                active.push(obj.layer);
	            }
	        });

	        // Return array
	        return active;
	    }
	});
			
	map.attributionControl.addAttribution('Data &copy; SWSI2010 & Water Efficiency Data Portal');

// Add baselayers to layerControl
	var layerControl = L.control.layers(baselayers, null, {collapsed: false}).addTo(map);

// Add a legend to the map
	var legend = L.control ({position: 'bottomright'});

    legend.onAdd = function (map) {
	
    var div = L.DomUtil.create('div', 'info legend'),
       categories = [1000, 5000, 10000, 20000, 50000, 100000, 500000, 1500000],
	   labels = ['No data','1000-5000','5000-10,000','10,000-20,000', '20,000-50,000', '50,000-100,000', '100,000-500,000', '> 500,000'];
	   
	   div.innerHTML = "<h5>Population Served:</h5>";
	   for (var i = 0; i < categories.length; i++) {
	        div.innerHTML +=
			   '<i class="circle" style="background:' + getColor(categories[i]) + '"></i>  ' +
			   (labels[i] ? labels[i] + '<br>' : '+');
	   }  
       return div;
	}; 

    legend.addTo(map);

    // Add a legend to the map
	var scrollbutton = L.control({position: 'topleft'});
	scrollbutton.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'scrollbutton');
		div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
						" style='width:20px; cursor:pointer;' onclick='water_providers_1051_map.scrollButtonClickFunction()'></image>";
		return div;
	};
	scrollbutton.addTo(map);		
	function scrollButtonClick(){
	 	if (map.scrollWheelZoom.enabled()) {
	    	map.scrollWheelZoom.disable();
	    	var title = "Click to enable/disable scroll zoom.<br>[ x ] Mouse scroll zooms page. <br>[ &nbsp; ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	  	}
	  	else {
	    	map.scrollWheelZoom.enable();
	    	var title = "Click to enable/disable scroll zoom.<br>[ &nbsp; ] Mouse scroll zooms page. <br>[ x ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	    }
	}

   	// Return function that need to be accessed by the DOM 
	return{
		scrollButtonClickFunction: scrollButtonClick,
		maplayer: map
	}

})();	
	

