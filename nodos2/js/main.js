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
        minZoom: 5 ,
        zoomControl:false 
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

/*
NodosLayer.bindTooltip("My polygon",
   {permanent: true, direction:"center"}
  ).openTooltip()
*/

function handleLayerNodos(layer) {
    layer.on({
        mouseover: highlightFeatureNodos,
        mouseout: resetHighlightNodos,
        click: zoomToFeatureNodos
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

function zoomToFeatureNodos(e) {
    map.fitBounds(e.target.getBounds());
    
    map.removeLayer(NodosLayer);
    
    map.removeLayer(clusterObservatoriosSur);
	map.removeLayer(clusterObservatoriosCentro);
	map.removeLayer(clusterObservatoriosCaribe);

    map.addLayer(DptosNodosLayer);
   
    map.addLayer(clusterObservatoriosSurCauca);
    map.addLayer(clusterObservatoriosSurValle);
	map.addLayer(clusterObservatoriosSurNarino);
    map.addLayer(clusterObservatoriosSurPutumayo);   
   
    map.addLayer(clusterObservatoriosCaribeAtlantico);
    map.addLayer(clusterObservatoriosCaribeBolivar);
	map.addLayer(clusterObservatoriosCaribeMagdalena);
    map.addLayer(clusterObservatoriosCaribeSucre);   
    
    
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
/*
map.on('zoomend', function () {
	if (map.getZoom() >= 10) // && map.hasLayer(NodosLayer)) 
	{
    	map.removeLayer(NodosLayer);
    	map.removeLayer(DptosNodosLayer);
    	map.addLayer(MpiosCaribeLayer);
    	map.addLayer(MpiosCentroLayer);
    	map.addLayer(MpiosSurLayer);
	}
	if (map.getZoom() < 7) // && map.hasLayer(NodosLayer) == false)
	{
    	map.addLayer(NodosLayer);
    	map.removeLayer(DptosNodosLayer);
    	map.removeLayer(MpiosCaribeLayer);
    	map.removeLayer(MpiosCentroLayer);
    	map.removeLayer(MpiosSurLayer);
	}  
	if (map.getZoom() == 7) // && map.hasLayer(NodosLayer) == false)
	{
    	map.removeLayer(NodosLayer);
    	map.addLayer(DptosNodosLayer);
    	map.removeLayer(MpiosCaribeLayer);
    	map.removeLayer(MpiosCentroLayer);
    	map.removeLayer(MpiosSurLayer);
	}   
}); 
*/
/* ------------------- OBSERVATORIOS X NODO ------------------*/
// SUR
var clusterObservatoriosSur = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 200});
var ObservatoriosSurLayer = L.geoJson(ObservatoriosSur);
clusterObservatoriosSur.addLayer(ObservatoriosSurLayer);

// CENTRO
var clusterObservatoriosCentro = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 200});
var ObservatoriosCentroLayer = L.geoJson(ObservatoriosCentro);
clusterObservatoriosCentro.addLayer(ObservatoriosCentroLayer);

// CARIBE
var clusterObservatoriosCaribe = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 200});
var ObservatoriosCaribeLayer = L.geoJson(ObservatoriosCaribe);
clusterObservatoriosCaribe.addLayer(ObservatoriosCaribeLayer);

// Add Data
map.addLayer(clusterObservatoriosSur);
map.addLayer(clusterObservatoriosCentro);
map.addLayer(clusterObservatoriosCaribe);

/* ------------------- OBSERVATORIOS X NODO X DEPARTAMENTO ------------------*/

// ---------------------------  SUR
// CAUCA
var clusterObservatoriosSurCauca = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 120});
var ObservatoriosSurCaucaLayer = L.geoJson(ObservatoriosSurCauca, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosSurCauca.addLayer(ObservatoriosSurCaucaLayer);

// VALLE DEL CAUCA
var clusterObservatoriosSurValle = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 40});
var ObservatoriosSurValleLayer = L.geoJson(ObservatoriosSurValle, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosSurValle.addLayer(ObservatoriosSurValleLayer);

// NARIÑO
var clusterObservatoriosSurNarino = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 120});
var ObservatoriosSurNarinoLayer = L.geoJson(ObservatoriosSurNarino, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosSurNarino.addLayer(ObservatoriosSurNarinoLayer);

// PUTUMAYO
var clusterObservatoriosSurPutumayo = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 120});
var ObservatoriosSurPutumayoLayer = L.geoJson(ObservatoriosSurPutumayo, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosSurPutumayo.addLayer(ObservatoriosSurPutumayoLayer);

// ---------------------------  CARIBE
// ATLANTICO
var clusterObservatoriosCaribeAtlantico = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 120});
var ObservatoriosCaribeAtlanticoLayer = L.geoJson(ObservatoriosCaribeAtlantico, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosCaribeAtlantico.addLayer(ObservatoriosCaribeAtlanticoLayer);

// BOLIVAR
var clusterObservatoriosCaribeBolivar = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 250});
var ObservatoriosCaribeBolivarLayer = L.geoJson(ObservatoriosCaribeBolivar, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosCaribeBolivar.addLayer(ObservatoriosCaribeBolivarLayer);

// MAGDALENA
var clusterObservatoriosCaribeMagdalena = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 120});
var ObservatoriosCaribeMagdalenaLayer = L.geoJson(ObservatoriosCaribeMagdalena, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosCaribeMagdalena.addLayer(ObservatoriosCaribeMagdalenaLayer);

// SUCRE
var clusterObservatoriosCaribeSucre = L.markerClusterGroup({showCoverageOnHover: false, maxClusterRadius: 120});
var ObservatoriosCaribeSucreLayer = L.geoJson(ObservatoriosCaribeSucre, {
			onEachFeature: function (feature, layer) {
				layer.bindPopup(feature.properties.IDENTIFICADOR);
			}
	});
clusterObservatoriosCaribeSucre.addLayer(ObservatoriosCaribeSucreLayer);

/* ------------------- CONTROLES ------------------*/
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true
});
map.addControl(control);

map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
