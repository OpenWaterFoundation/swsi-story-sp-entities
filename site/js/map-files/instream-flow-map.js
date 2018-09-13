// South Platte Data Platform - Map of Instream Flow Rights in the South Platte and Metro Basins

//id='mapbox9'

var instream_flow_map = (function(){

	var instreamflowmap = L.map('mapbox9', {scrollWheelZoom: false}).setView([39.972, -104.348], 9);

// Set up satellite base layer
	var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', {
		maxZoom: 18,
		attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
		'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.satellite'
	}).addTo(instreamflowmap);	

// Add in IBCC basins layer
	basin1 = L.geoJson(basins, {
	  color: 'black',
	  weight: 1,
	  fillOpacity: 0
	}).addTo(instreamflowmap)		

// Control that shows decreed amounts info on hover -- creates an info box
	var info = L.control();

	info.onAdd = function (instreamflowmap) {
		this._div = L.DomUtil.create('div', 'info'); // Creates a div with a class named "info"
		this.update();
		return this._div;
	};

// Create array list of months to display as layers to toggle on or off		
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	var baselayers = {};		

	
	months.forEach(function(month){
		// Add a layer of monthly decreed amounts	
		// Variable name will be flow + month; ex. =  flowJanuary
		window['flow' + month];	

// Reset the color after hovering over
	function resetHighlight(e) {
		window['flow' + month].resetStyle(e.target);
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
			return {
		     color:  getColor(feature.properties[month]),
			 weight: 2,
			 opacity:1
			};
		}
	
// Add in instream flow layer			
	window['flow' + month] = L.geoJson(instreamflow, {		
				    style: style,
					onEachFeature: onEachFeature	
					});	
			
	
// Highlight a line when it is hovered over on the map
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
		info.update(layer.feature.properties, month);
	}
	
		baselayers[month] = window['flow' + month];

	})	

// Create function of colors based on amount of water right (do this outside of "month" function so that the legend will show the colors)
    	function getColor(point){
    	   return point > 40   ? '#002966' :  
		          point > 20.1 ? '#003d99' :
				  point > 10.1 ? '#0052cc' :
		          point > 5.1  ? '#0066ff' :
    	   	      point > 1.1  ? '#66a3ff' :
				  point > 0    ? '#cce0ff' :
    	                     '#595959';
    	};	

// Method used to update the control based on feature properties passed
	info.update = function (props, month) {
		this._div.innerHTML = '<h5>Instream Flow Reaches in the South Platte and Metro Basins</h5>' +  (props ?
			     '<b>Stream Name: </b>' + ((props.Name) ? props.Name : "") + '<br/>' 
			   + '<b>Miles of Stream: </b>' + ((props.MILES.toFixed(1)) ? props.MILES.toFixed(1) : "") + '<br />' 
			   + '<b>Decreed Flow (cfs): </b>' + ((props[month]) ? props[month] : "") + '<br/>' 
			   + '<b>Watershed: </b>' + ((props.Watershed) ? props.Watershed : "") + '<br/>' 
			   + '<b>Case No.: </b>' + ((props.Case_Numbe) ? props.Case_Numbe : "")
			: 'Hover on a line for more information');
	};
	info.addTo(instreamflowmap);	


// Add January amounts as default
	flowJanuary.addTo(instreamflowmap);	

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
	
	instreamflowmap.attributionControl.addAttribution("Data &copy; Colorado's Decision Support Systems");

// Add baselayers to layerControl
	var layerControl = L.control.layers(baselayers, null, {collapsed: false}).addTo(instreamflowmap);
	
			
// Add a legend to the map
    var legend = L.control ({position: 'bottomright'});
    legend.onAdd = function (instreamflowmap) {
	
	   var div = L.DomUtil.create('div', 'info legend'),
	       categories = [1, 5, 10, 20, 40, 60 ],
		   labels = ['0-1', '1-5', '5-10', '10-20', '20-40', '> 40'];

		   div.innerHTML = "<h6>Decreed Flows (cfs)</h6>";		   
		   for (var i = 0; i < categories.length; i++) {
		        div.innerHTML +=
				   '<i style="background:' + getColor(categories[i]) + '"></i>  ' +
				   (labels[i] ? labels[i] + '<br>' : '+');
		   }
		   
           return div;
		}; 
   legend.addTo(instreamflowmap);

    // Add a scroll button to the map
	var scrollbutton = L.control({position: 'topleft'});
	scrollbutton.onAdd = function (instreamflowmap) {
		var div = L.DomUtil.create('div', 'scrollbutton');
		div.innerHTML = "<image id='scrollbutton' src='images/mouse.svg' class='scrollbutton-tooltip'" +
						" style='width:20px; cursor:pointer;' onclick='instream_flow_map.scrollButtonClickFunction()'></image>";
		return div;
	};
	scrollbutton.addTo(instreamflowmap);		

	var outdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=' +
        'pk.eyJ1Ijoia3Jpc3RpbnN3YWltIiwiYSI6ImNpc3Rjcnl3bDAzYWMycHBlM2phbDJuMHoifQ.vrDCYwkTZsrA_0FffnzvBw', 
    {
        maxZoom: 18,
        attribution: 'Created by the <a href="http://openwaterfoundation.org">Open Water Foundation. </a>' + 
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.outdoors'
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
        
    L.control.layers(baseMaps, null, {position:'topleft'}).addTo(instreamflowmap);

	function scrollButtonClick(){
	 	if (instreamflowmap.scrollWheelZoom.enabled()) {
	    	instreamflowmap.scrollWheelZoom.disable();
	    	var title = "Click to toggle mouse scroll wheel behavior.<br> [ x ] Mouse scroll pages forward/back. <br> [ &nbsp; ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	  	}
	  	else {
	    	instreamflowmap.scrollWheelZoom.enable();
	    	var title = "Click to toggle mouse scroll wheel behavior.<br> [ &nbsp; ] Mouse scroll pages forward/back. <br> [ x ] Mouse scroll zooms map."
			mousetooltip.setContent(title)
	    }
	}

   	// Return function that need to be accessed by the DOM 
	return{
		scrollButtonClickFunction: scrollButtonClick,
		maplayer: instreamflowmap
	}
		
})();