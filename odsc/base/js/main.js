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

// Carga de la informacion
BarriosSM = L.geoJson(Barrios, {
    onEachFeature: onEachFeature
}).addTo(map);

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

	BarriosSM.resetStyle(e.target);
	
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

// Controles
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true
});
map.addControl(control);


map.attributionControl.addAttribution('Observatorio Distrital de Seguridad y Convivencia &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
