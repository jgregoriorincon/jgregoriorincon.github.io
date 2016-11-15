'use strict';

var Localidad, Nombre, Codigo;

/* ------------------- MAPA ------------------*/
var map = L.map('map').setView([11.17, -74.20], 12);

cartoLight.addTo(map);

// Informacion
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h3>Barrios de Santa Marta</h3>' + (props ?
        '<p align="right"><b>' + props.NOMBRE + '<br />Localidad ' + props.LOCALIDAD + '<br /> Codigo ' + props.CODIGO + '</b><br />' + '</p></b>' : 'Pase el cursor sobre un barrio');
};

info.addTo(map);

function zoomToFeature(e) {
    var layer = e.target;

	// Daniel
	// Almaceno los valores para usarlos 
	Localidad =layer.feature.properties.LOCALIDAD;
	Codigo = layer.feature.properties.CODIGO;
	Nombre = layer.feature.properties.NOMBRE;
    
    console.log(Localidad);
    console.log(Codigo);
    console.log(Nombre);
    
    map.fitBounds(e.target.getBounds());
}

// Controles
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true
});
map.addControl(control);


map.attributionControl.addAttribution('Observatorio Distrital de Seguridad y Convivencia &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');


function highlightFeature(e) {
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

    info.update(layer.feature.properties);
}

//var geojson;
var localidad_01;
var localidad_02;
var localidad_03;

function resetHighlight(e) {
    localidad_01.resetStyle(e.target);
    localidad_02.resetStyle(e.target);
    localidad_03.resetStyle(e.target);

    info.update();
}

function zoomToFeature(e) {
    var layer = e.target;
    
    // Daniel
	// Almaceno los valores para usarlos 
	Localidad =layer.feature.properties.LOCALIDAD;
	Codigo = layer.feature.properties.CODIGO;
	Nombre = layer.feature.properties.NOMBRE;
    
    console.log(Localidad);
    console.log(Codigo);
    console.log(Nombre);
    
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    feature.layer = layer;
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

localidad_01 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "01");
    },
    onEachFeature: onEachFeature
}).addTo(map);

localidad_02 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "02");
    },
    onEachFeature: onEachFeature
}).addTo(map);

localidad_03 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "03");
    },
    onEachFeature: onEachFeature
}).addTo(map);

//add layer controls/legend
var overlayMaps = {
    'Localidad 01': localidad_01,
    'Localidad 02': localidad_02,
    'Localidad 03': localidad_03
};

var layerbox = L.control.layers(null, overlayMaps, {
    collapsed: false,
    position: 'bottomleft'
}).addTo(map);
