'use strict'

var digit = d3.format(".1%");
var digit0 = d3.format(".0%");
var caption = d3.select('#caption'),
    starter = caption.html();

function showCaptionNodo(titulo, d) {
	var texto = d.properties.NODO ? d.properties.NODO : '';
	texto = texto !== 'Resto' ? titulo + texto : '';
	caption.html('<b>' + texto + '</b>');
}

function showCaptionMpio(titulo, d) {
	var texto = d.properties.NOMBRE ? titulo + d.properties.NOMBRE : '';
	caption.html('<b>' + texto + '</b>');
}

/* ------------------- MAPA ------------------*/
var map = L.map('map', {
        maxZoom: 18,
        minZoom: 5
    }),
    NodosLayer = new L.TopoJSON(),
    DptosNodosLayer = new L.TopoJSON(),
    MpiosCaribeLayer = new L.TopoJSON(),
    MpiosCentroLayer = new L.TopoJSON(),
    MpiosSurLayer = new L.TopoJSON();
    

map.setView([4.5, -73.0], 6);


cartoLight.addTo(map);

/* ------------------- NODOS ------------------*/

$.getJSON('data/Nodos.topo.json').done(addNodosData);

function addNodosData(topoData) {
    NodosLayer.addData(topoData);
    NodosLayer.addTo(map);
    NodosLayer.setStyle(styleNodos);
    NodosLayer.eachLayer(handleLayerNodos);
}

function handleLayerNodos(layer) {
    layer.on({
        mouseover: highlightFeatureNodos,
        mouseout: resetHighlightNodos,
        click: zoomToFeature
    });
}

function highlightFeatureNodos(e) {

    var layer = e.target;
	
	if (layer.feature.properties.NODO !== 'Resto') {
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
}
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    showCaptionNodo("Nodo: ", layer.feature);
}

function resetHighlightNodos(e) {

    NodosLayer.resetStyle(e.target);
    NodosLayer.setStyle(styleNodos);

}

/* ------------------- DPTOS NODOS ------------------*/

$.getJSON('data/Dptos_Nodos.topo.json').done(addDptosNodosData);

function addDptosNodosData(topoData) {
    DptosNodosLayer.addData(topoData);
    DptosNodosLayer.setStyle(styleNodos);
    DptosNodosLayer.eachLayer(handleLayerDptosNodos);
}

function handleLayerDptosNodos(layer) {
    layer.on({
        mouseover: highlightFeatureDptosNodos,
        mouseout: resetHighlightDptosNodos,
        click: zoomToFeature
    });
}

function highlightFeatureDptosNodos(e) {

    var layer = e.target;
	
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    showCaptionNodo("Departamento: ", layer.feature);
}

function resetHighlightDptosNodos(e) {

    DptosNodosLayer.resetStyle(e.target);
    DptosNodosLayer.setStyle(styleNodos);

}

/* ------------------- CARIBE ------------------*/

$.getJSON('data/Mpios_Nodo_Caribe.topo.json').done(addMpiosCaribeData);


function addMpiosCaribeData(topoData) {
    MpiosCaribeLayer.addData(topoData);
    MpiosCaribeLayer.setStyle(styleMpiosCaribe);
    MpiosCaribeLayer.eachLayer(handleLayerMpiosCaribe);
}

function handleLayerMpiosCaribe(layer) {
    layer.on({
        mouseover: highlightFeatureMpios,
        mouseout: resetHighlightMpiosCaribe,
        click: zoomToFeature
    });
}

function highlightFeatureMpios(e) {

    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    showCaptionMpio("Municipio: ", layer.feature);
}

function resetHighlightMpiosCaribe(e) {

    MpiosCaribeLayer.resetStyle(e.target);
    MpiosCaribeLayer.setStyle(styleMpiosCaribe);

    caption.html(starter);
}

/* ------------------- CENTRO ------------------*/
$.getJSON('data/Mpios_Nodo_Centro.topo.json').done(addMpiosCentroData);


function addMpiosCentroData(topoData) {
    MpiosCentroLayer.addData(topoData);
    MpiosCentroLayer.setStyle(styleMpiosCentro);
    MpiosCentroLayer.eachLayer(handleLayerMpiosCentro);
}

function handleLayerMpiosCentro(layer) {
    layer.on({
        mouseover: highlightFeatureMpios,
        mouseout: resetHighlightMpiosCentro,
        click: zoomToFeature
    });
}

function resetHighlightMpiosCentro(e) {

    MpiosCentroLayer.resetStyle(e.target);
    MpiosCentroLayer.setStyle(styleMpiosCentro);

    caption.html(starter);
}

/* ------------------- SUR ------------------*/
$.getJSON('data/Mpios_Nodo_Sur.topo.json').done(addMpiosSurData);


function addMpiosSurData(topoData) {
    MpiosSurLayer.addData(topoData);
    MpiosSurLayer.setStyle(styleMpiosSur);
    MpiosSurLayer.eachLayer(handleLayerMpiosSur);
}

function handleLayerMpiosSur(layer) {
    layer.on({
        mouseover: highlightFeatureMpios,
        mouseout: resetHighlightMpiosSur,
        click: zoomToFeature
    });
}

function resetHighlightMpiosSur(e) {

    MpiosSurLayer.resetStyle(e.target);
    MpiosSurLayer.setStyle(styleMpiosSur);

    caption.html(starter);
}

/* ------------------- ZOOM ------------------*/
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

map.on('zoomend', function () {
	
	if (map.getZoom() < 7) // && map.hasLayer(NodosLayer) == false)
	{
    	map.addLayer(NodosLayer);
		
    	map.removeLayer(DptosNodosLayer);
		
    	map.removeLayer(MpiosCaribeLayer);
    	map.removeLayer(MpiosCentroLayer);
    	map.removeLayer(MpiosSurLayer);
		// Add Data
	map.removeLayer(clusterObservatoriosSur);
	map.removeLayer(clusterObservatoriosCentro);
	map.removeLayer(clusterObservatoriosCaribe);
	}  
	else if (map.getZoom() == 7) // && map.hasLayer(NodosLayer) == false)
	{
    	map.removeLayer(NodosLayer);
		
    	map.addLayer(DptosNodosLayer);
		
    	map.removeLayer(MpiosCaribeLayer);
    	map.removeLayer(MpiosCentroLayer);
    	map.removeLayer(MpiosSurLayer);
	}   
	else if (map.getZoom() >= 8) // && map.hasLayer(NodosLayer)) 
	{
    	map.removeLayer(NodosLayer);
		
    	map.removeLayer(DptosNodosLayer);
	
	map.hasLayer(MpiosCaribeLayer) == false ? map.addLayer(MpiosCaribeLayer): nothing;
	map.hasLayer(MpiosCentroLayer) == false ? map.addLayer(MpiosCentroLayer): nothing;
	map.hasLayer(MpiosSurLayer) == false ? map.addLayer(MpiosSurLayer): nothing;

	}
}); 

/* ------------------- OBSERVATORIOS ------------------*/
// SUR
var clusterObservatoriosSur = L.markerClusterGroup({maxClusterRadius: 150});
var ObservatoriosSurLayer = L.geoJson(ObservatoriosSur, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.OBSERVATORIO);
			}
	});
clusterObservatoriosSur.addLayer(ObservatoriosSurLayer);

// CENTRO
var clusterObservatoriosCentro = L.markerClusterGroup({maxClusterRadius: 150});
var ObservatoriosCentroLayer = L.geoJson(ObservatoriosCentro, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.OBSERVATORIO);
			}
	});
clusterObservatoriosCentro.addLayer(ObservatoriosCentroLayer);

// CARIBE
var clusterObservatoriosCaribe = L.markerClusterGroup({maxClusterRadius: 150});
var ObservatoriosCaribeLayer = L.geoJson(ObservatoriosCaribe, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.OBSERVATORIO);
			}
	});
clusterObservatoriosCaribe.addLayer(ObservatoriosCaribeLayer);

map.hasLayer(clusterObservatoriosSur) == false ? map.addLayer(clusterObservatoriosSur): nothing;
map.hasLayer(clusterObservatoriosCentro) == false ? map.addLayer(clusterObservatoriosCentro): nothing;
map.hasLayer(clusterObservatoriosCaribe) == false ? map.addLayer(clusterObservatoriosCaribe): nothing;

/* ------------------- CONTROLES ------------------*/
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true
});
map.addControl(control);

map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

