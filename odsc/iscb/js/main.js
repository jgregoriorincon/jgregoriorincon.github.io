// var map, featureList;

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
        '<p align="right"><b>' + props.NOMBRE + '<br />Localidad ' + props.LOCALIDAD + ' - Codigo ' + props.CODIGO_FINAL + '</b><br />' + '<b></b><br />' + 'Factor Delitos: ' + props.Delitos + '<br />' + 'Factor Convivencia: ' + props.Convivencia + '<br />' + 'Factor Fenomenos: ' + props.Fenomenos + '<br />' + 'Factor Institucional: ' + props.Institucional + '<br />' + '<b>Total ISCB: ' + props.ISCB + '</p></b>' : 'Pase el cursor sobre un barrio');
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

// Leyendas de acuerdo al estilo seleccionado
var legendISCB = L.control({
    position: 'bottomright'
});

var legendDelitos = L.control({
    position: 'bottomright'
});

var legendConvivencia = L.control({
    position: 'bottomright'
});

var legendFenomenos = L.control({
    position: 'bottomright'
});

var legendInstitucional = L.control({
    position: 'bottomright'
});


// Ajusta la leyenda
legendISCB.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-1.0, 0, 1, 2, 3, 4, 6, 8],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColorISCB(from + 0.9) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendISCB.addTo(map);

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

    var leyenda = document.getElementById('selLeyenda');
    changeLeyenda(leyenda);

    info.update();
}

function zoomToFeature(e) {
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
    style: styleISCB,
    onEachFeature: onEachFeature
}).addTo(map);

localidad_02 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "02");
    },
    style: styleISCB,
    onEachFeature: onEachFeature
}).addTo(map);

localidad_03 = L.geoJson(Barrios, {
    filter: function (feature, layer) {
        return (feature.properties.LOCALIDAD == "03");
    },
    style: styleISCB,
    onEachFeature: onEachFeature
}).addTo(map);

//add layer controls/legend
var overlayMaps = {
    'Localidad 01': localidad_01,
    'Localidad 02': localidad_02,
    'Localidad 03': localidad_03
};

layerbox = L.control.layers(null, overlayMaps, {
    collapsed: false,
    position: 'bottomleft'
}).addTo(map);

map.attributionControl.addAttribution('Índice de Seguridad y Convivencia Barrial &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

// Cambiar leyenda
function changeLeyenda(selLeyenda) {
    var selLeyenda = selLeyenda.value;

    switch (selLeyenda) {
    case "ISCB":
        localidad_01.setStyle(styleISCB);
        localidad_02.setStyle(styleISCB);
        localidad_03.setStyle(styleISCB);

        map.removeControl(legendDelitos);
        map.removeControl(legendConvivencia);
        map.removeControl(legendFenomenos);
        map.removeControl(legendInstitucional);
        legendISCB.addTo(map);

        break;
    case "Delitos":

        localidad_01.setStyle(styleDelitos);
        localidad_02.setStyle(styleDelitos);
        localidad_03.setStyle(styleDelitos);

        map.removeControl(legendISCB);
        map.removeControl(legendConvivencia);
        map.removeControl(legendFenomenos);
        map.removeControl(legendInstitucional);

        legendDelitos.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 1, 2, 3, 4, 5],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColorDelitos(from + 0.9) + '"></i> ' +
                    from + (to === undefined ? '+' : '&ndash;' + to));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legendDelitos.addTo(map);

        break;
    case "Convivencia":

        localidad_01.setStyle(styleConvivencia);
        localidad_02.setStyle(styleConvivencia);
        localidad_03.setStyle(styleConvivencia);

        map.removeControl(legendISCB);
        map.removeControl(legendDelitos);
        map.removeControl(legendFenomenos);
        map.removeControl(legendInstitucional);

        legendConvivencia.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 0.5, 1, 1.5, 2],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColorConvivencia(from + 0.4) + '"></i> ' +
                    from + (to === undefined ? '+' : '&ndash;' + to));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legendConvivencia.addTo(map);

        break;
    case "Fenomenos":

        localidad_01.setStyle(styleFenomenos);
        localidad_02.setStyle(styleFenomenos);
        localidad_03.setStyle(styleFenomenos);

        map.removeControl(legendISCB);
        map.removeControl(legendConvivencia);
        map.removeControl(legendDelitos);
        map.removeControl(legendInstitucional);

        legendFenomenos.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 1, 2, 3],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColorFenomenos(from + 0.9) + '"></i> ' +
                    from + (to === undefined ? '+' : '&ndash;' + to));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legendFenomenos.addTo(map);

        break;
    case "Institucional":

        localidad_01.setStyle(styleInstitucional);
        localidad_02.setStyle(styleInstitucional);
        localidad_03.setStyle(styleInstitucional);

        map.removeControl(legendISCB);
        map.removeControl(legendConvivencia);
        map.removeControl(legendFenomenos);
        map.removeControl(legendDelitos);

        legendInstitucional.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 0.5, 1],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColorInstitucional(from + 0.4) + '"></i> ' +
                    from + (to === undefined ? '+' : '&ndash;' + to));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };

        legendInstitucional.addTo(map);

        break;
    };
}
