
/* Create a new file parser from the custom FileParser class */
var fp = new FileParser();
/* Convert your csv data to json */
fp.csvToJson("data/county-population-forecast-yearsinsinglecolumn.csv");

var map = L.map('mapbox2').setView([40.072, -104.048], 9);

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
var minyear = 1980;
var maxyear = 2016;

/* Set necessary globals */
curryear = minyear;
var playClick = true;
var intV;
var speed = 100;

var slider = L.control({position: 'bottomleft'});
slider.onAdd = function (map) {
	var currDate = new Date();
	this._div = L.DomUtil.create('div', 'slidercontainer'); // Creates a div with a class named "info"
	this._div.innerHTML = 
		"<button type='button' id='back' class='btn btn-deafult btn-xs' onclick='back()'><i class='fa fa-backward' style='padding:0px;'></i></button>" +
		"<button type='button' id='play' class='btn btn-deafult btn-xs' onclick='play()'><i class='fa fa-play' style='padding:0px;'></i></button>" +
		"<button type='button' id='play' class='btn btn-deafult btn-xs' onclick='forward()'><i class='fa fa-forward' style='padding:0px;'></i></button>" +
		"<p id='datelabel'>" + minyear +"</p>" +
	 	"<input type='range' min='" + minyear + "' max='" + maxyear + "' value='" + minyear + "' class='slider' id='timeslider' oninput='timesliderHelperFunction(this.value)'>" +
	 	" <p style='float:left;display:inline-block; margin:0px; margin-top: 3px; padding-left:5px;'> Speed:</p>" +
	 	"<input type='range' min='0' max='100' value='75' class='slider' id='speedslider' oninput='setSpeed(this.value)'>";
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
	var data = fp.getJsonData().data[curryear];
	this._div.innerHTML = "<h5 id='infoheader'>Historical Municipal Population, " + curryear + '</h5>' +  (props ?
		'<b>' + props.MunicipalityName + '</b><br />' + data[props.MunicipalityName]
		: 'Hover over a point');
};
info.addTo(map);


// Get color depending on 2015 population value
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
// Counties will fill with colors based on 2015 population	
function style(feature) {
return {
    fillColor: getColor(feature.properties.County_Population_2015Population),
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.9
};
}

// Get size based on percent change in population since 1980
	function getSize(point){
		if (point > 49.9)     sizeToUse = 28;
		else if (point > 29.9) sizeToUse = 20;
		else if (point > 19.9) sizeToUse = 16;
		else if (point > 4.9) sizeToUse = 14;
		else if (point > 0)  sizeToUse = 12;
		else sizeToUse = 8;
		
		return sizeToUse;
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

var munihistpopmarkers;

// Reset the color after hovering over
function resetHighlight(e) {
	munihistpopmarkers.resetStyle(e.target);
	info.update();
} 		

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
	});
}

munihistpopmarkers = L.geoJson(munihistpop, {
	
			pointToLayer: function(feature, latlng) {	

			return L.circleMarker(latlng, { 
				 color: '#5b5e55',
				 fillColor: getColor(feature.properties.Population),
				 weight: 1, 
				 radius: getSize(feature.properties.Percent_Change_1980),
				 fillOpacity: 1
				});
			},

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
			'<i class="circle" style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);

// HELPER FUNCTIONS FOR TIMESLIDER
function timesliderHelperFunction(year){
	if(playClick == false){
		playClick = true;
		$('#play').html("<span class='fa fa-play'></span>")
		pause();
	}
	geoJsonSetStyle(year)
}

function geoJsonSetStyle(year){
	curryear = year;
	$('#datelabel').html(curryear);
	geojson.setStyle(fillColorFromData);
}

function fillColorFromData(feature){
	var data = fp.getJsonData().data[curryear];
	return {
		fillColor: getColor(data[feature.properties.MunicipalityName])
	}
}

function play(){
	$('#play').html("<span class='fa fa-pause'></span>")
	if(playClick){
		playClick = false;
		intV  = setInterval(parseTime, speed);
	}else{
		playClick = true;
		$('#play').html("<span class='fa fa-play'></span>")
		pause();
	}
	
}

function parseTime(){
	curryear = parseInt(curryear) + 1;
	if(curryear > maxyear){
		playClick = true;
		$('#play').html("<span class='fa fa-play'></span>")
		pause();
		clearInterval(intV);
		curryear = minyear;
	}else{
		$('#datelabel').html(curryear);
		$('#infoheader').html('County Population, ' + curryear)
		$('#timeslider').val(curryear);
		geoJsonSetStyle(curryear);
	}
}

function pause(){
	clearInterval(intV);
}

function back(){
	curryear = parseInt(curryear) - 1;
	if(curryear >= minyear){
		$('#datelabel').html(curryear);
		$('#timeslider').val(curryear);
		timesliderHelperFunction(curryear);
	}else{
		curryear = minyear;
	}
}

function forward(){
	curryear = parseInt(curryear) + 1;
	if(curryear <= maxyear){
		$('#datelabel').html(curryear);
		$('#timeslider').val(curryear);
		timesliderHelperFunction(curryear);
	}else{
		curryear = maxyear;
	}
}

function setSpeed(value){
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