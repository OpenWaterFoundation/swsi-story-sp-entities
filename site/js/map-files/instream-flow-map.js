// South Platte Data Platform - Map of Instream Flow Rights in the South Platte and Metro Basins

//id='mapbox9'

var instream_flow_map = (function(){


// Set up outdoor base layer
	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.outdoors'
	});

// Set up grayscale base layer	
	var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.light'
	});	

	var instreamflowmap = L.map('mapbox9', {
		center: [39.972, -104.348], 
		zoom: 9,
		layers: [grayscale]
	});	

// Create an object that contains the outdoors and grayscale base layers
    var baseMaps = {
	    "Grayscale": grayscale,
		"Outdoors": outdoors
		};

// Create layer control that allows for switching between grayscale and outdoors base maps
    L.control.layers(baseMaps).addTo(instreamflowmap);
		
// Add in IBCC basins layer
	basin1 = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(instreamflowmap)		
		
// Control that shows municipality info on hover -- creates an info box
	var info = L.control();

	info.onAdd = function (instreamflowmap) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

// Method used to update the control based on feature properties passed
	info.update = function (props) {
		this._div.innerHTML = '<h5>Instream Flow Reaches in the South Platte and Metro Basins</h5>' +  (props ?
			'' + '<b>Stream Name: </b>' + props.Name + '<br/>' + '<b>Miles of Stream: </b>' + props.MILES.toFixed(1) + '<br />' +
			'<b>August Decreed Flow (cfs): </b>' + props.August + '<br/>' + '<b>Watershed: </b>' + props.Watershed + '<br/>' + '<b>Case No.: </b>' + props.Case_Numbe
			: 'Hover on a line for more information');
	};
	info.addTo(instreamflowmap);

// Create function of color based on amount of water right
    	function getflowcolor(x){
    	   return x > 40   ? '#002966' :  
		          x > 20.1 ? '#003d99' :
				  x > 10.1 ? '#0052cc' :
		          x > 5.1  ? '#0066ff' :
    	   	      x > 1.1  ? '#66a3ff' :
				  x > 0    ? '#cce0ff' :
    	                     '#595959';
    	};

// Lines will be colored based on August flow right
	function flowstyle(feature) {
    return {
        color: getflowcolor(feature.properties.August),
        weight: 2,
        opacity: 1
    };
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
	
	var instreamflowlines;
	
// Reset the color after hovering over
	function resetHighlight(e) {
		instreamflowlines.resetStyle(e.target);
		info.update();
	} 	
	
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
	}

	
// Add in instream flow layer			
	instreamflowlines = L.geoJson(instreamflow, {		
            style: flowstyle, 
			onEachFeature: onEachFeature
			}).addTo(instreamflowmap);
			
	instreamflowmap.attributionControl.addAttribution("Data &copy; Colorado's Decision Support Systems");			
			
// Add a legend to the map
    var legend = L.control ({position: 'bottomright'});
    legend.onAdd = function (instreamflowmap) {
	
	   var div = L.DomUtil.create('div', 'info legend'),
	       categories = [1, 5, 10, 20, 40, 60 ],
		   labels = ['0-1', '1-5', '5-10', '10-20', '20-40', '> 40'];

		   div.innerHTML = "<h6>Decreed Flows (cfs)</h6>";		   
		   for (var i = 0; i < categories.length; i++) {
		        div.innerHTML +=
				   '<i style="background:' + getflowcolor(categories[i]) + '"></i>  ' +
				   (labels[i] ? labels[i] + '<br>' : '+');
		   }
		   
           return div;
		}; 
   legend.addTo(instreamflowmap);
		
})();