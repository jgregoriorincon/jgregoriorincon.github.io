// var map, featureList, barriosSearch = [];

/* ------------------- MAPA ------------------*/
var map = L.map('map').setView([11.17, -74.20], 12);

cartoLight.addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h3>Índice de Seguridad y <br />Convivencia Barrial</h3>' + (props ?
        '<p align="right"><b>' + props.NOMBRE + '<br />Localidad ' + props.LOCALIDAD + ' - Codigo ' + props.CODIGO_FINAL + '</b><br />' + '<b></b><br />' + 'Factor Delitos: ' + props.Delitos + '<br />' + 'Factor Convivencia: ' + props.Convivencia + '<br />' + 'Factor Fenomenos: ' + props.Fenomenos + '<br />' + 'Factor Institucional: ' + props.Institucional + '<br />' + '<b>Total ISDC: ' + props.ISCD + '</p></b>' : 'Pase el cursor sobre un barrio');
};

info.addTo(map);

// Controles
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true, // If false (default), it deactivates after each use.
    // If true, zoomBox control stays active until you click on the control to deactivate.
    // position: "topleft",
    // className: "customClass"  // Class to use to provide icon instead of Font Awesome
    // title: "My custom title" // a custom title
});
map.addControl(control);

// get color depending on population density value
function getColor(d) {
    return d > 8.1 ? '#FF0000' :
        d > 6.1 ? '#EA0700' :
        d > 4.1 ? '#CC5A00' :
        d > 3.1 ? '#B86E00' :
        d > 2.1 ? '#A2821C' :
        d > 1.1 ? '#8B932E' :
        d > 0.1 ? '#6BA83E' :
        '#50B547';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.ISCD)
    };
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

//var geojson;
var localidad_01;
var localidad_02;
var localidad_03;

function resetHighlight(e) {
    //geojson.resetStyle(e.target);
    localidad_01.resetStyle(e.target);
    localidad_02.resetStyle(e.target);
    localidad_03.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
/*
geojson = L.geoJson(Barrios, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);
*/
localidad_01 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "01");
    },
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

localidad_02 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "02");
    },
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

localidad_03 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "03");
    },
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

//add layer controls/legend
var overlayMaps = {
    'Localidad 01': localidad_01,
    'Localidad 02': localidad_02,
    'Localidad 03': localidad_03
};

layerbox = L.control.layers(null, overlayMaps, {collapsed: false, position: 'bottomleft'}).addTo(map);

map.attributionControl.addAttribution('Índice de Seguridad y Convivencia Barrial &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');


var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-1.0, 0, 1, 2, 3, 4, 6, 8],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
