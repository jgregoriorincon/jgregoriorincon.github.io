var Localidad, Nombre, Codigo;
var barriosSMLayer;

/* ------------------- MAPA BASE ------------------*/
var mapBase = L.map('mapBase').setView([11.17, -74.20], 12);

Esri_WorldStreetMap.addTo(mapBase);

// Controles
L.control.defaultExtent().addTo(mapBase);

var control = L.control.zoomBox({
    modal: true
});
mapBase.addControl(control);

mapBase.attributionControl.addAttribution('Observatorio Distrital de Seguridad y Convivencia &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

/* --------------------------------------------------------------- */


/* ---------------------------------------------------------------
                    MAPA CALOR
   --------------------------------------------------------------- */
//var mapHeat = L.map('mapHeat').setView([11.17, -74.20], 12);
var densidadLayer;

// Mapa asociado a los atributos de la variable InfoMapaV2 
var mapHeat = L.map("mapHeat", {
    zoom: InfoMapaV2.zoom,
    center: [InfoMapaV2.Lat, InfoMapaV2.Lon],
    zoomControl: true,
    attributionControl: true,
    maxZoom: 18, 
    minZoom: 12
});

cartoLight.addTo(mapHeat);

// Controles
L.control.defaultExtent().addTo(mapHeat);

var control = L.control.zoomBox({
    modal: true
});
mapHeat.addControl(control);

mapHeat.attributionControl.addAttribution('Observatorio Distrital de Seguridad y Convivencia &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
/* --------------------------------------------------------------- */

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    cargarHeat();
  }
};

// Informacion
var info = L.control();

info.onAdd = function (mapBase) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h3>Barrios de Santa Marta</h3>' + (props ?
        '<p align="right"><b>' + props.NOMBRE + '<br />Localidad ' + props.LOCALIDAD + '<br /> Codigo ' + props.CODIGO + '</b><br />' + '</p></b>' : 'Pase el cursor sobre un barrio');
};

info.addTo(mapBase);

// Carga de la informacion
barriosSMLayer = L.geoJson(barriosSM, {
    onEachFeature: onEachFeature
}).addTo(mapBase);

function onEachFeature(feature, layer) {
    feature.layer = layer;
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

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

function resetHighlight(e) {

	barriosSMLayer.resetStyle(e.target);
	
    info.update();
}

function zoomToFeature(e) {
    var layer = e.target;

	// Daniel
	// Almaceno los valores para usarlos 
	Localidad =layer.feature.properties.LOCALIDAD;
	Codigo = layer.feature.properties.CODIGO;
	Nombre = layer.feature.properties.NOMBRE;
    
    document.getElementById("dataBarrio").innerHTML = "LOCALIDAD: " + Localidad + '<br />' + "CODIGO: " + Codigo + '<br />' + "NOMBRE: " + Nombre + '<br /><br />';
    
    mapBase.fitBounds(e.target.getBounds());
}

function cargarHeat(){
     // Se parsean los datos de InfoMapaV2 en un GeoJSON
    var eventos = GeoJSON.parse(InfoMapaV2.infoMapa, {
        Point: ['Lat', 'Lon']
    });

    // Se llama a la funcion geoJson2heat, que esta en la parte inferior
    // se le pasan como argumentos los puntos y la intensidad
    // La cual va de 0.0 a 1.0
    var geoData = geoJson2heat(eventos, 0.7);

    // Se define el mapa de calor, con los geodatos
    // radius: Ancho de cada punto en el mapa, por defecto 25, pero 15 me parecio adecuado
    // blur: La cantidad d desenfoque
    densidadLayer = L.heatLayer(geoData, {
        radius: 15,
        blur: 15,
        maxZoom: 19
    })

    // Se adiciona el mapa de calor como un Layer
    mapHeat.addLayer(densidadLayer); 
}

// Funcion que convierte el GeoJSON en geodatos
function geoJson2heat(geojson, intensity) {
    return geojson.features.map(function (feature) {
        return [parseFloat(feature.geometry.coordinates[1]), parseFloat(feature.geometry.coordinates[0]), intensity];
    });
}

function borrarDatos() {
    mapHeat.hasLayer(densidadLayer) === true && mapHeat.removeLayer(densidadLayer);
}

function recargarDatos() {    
    cargarHeat();
}