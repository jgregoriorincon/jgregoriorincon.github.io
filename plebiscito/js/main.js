'use strict'

var digit0 = d3.format(".0%");

/* ------------------- MAPA ------------------*/
var map = L.map('map', {
        maxZoom: 18,
        minZoom: 3
    }),
    DepartamentosLayer = new L.TopoJSON(),
    MunicipiosLayer = new L.TopoJSON(),
    ELNLayer = new L.TopoJSON(),
    ZonasVeredalesLayer = new L.TopoJSON(),
    ZonasCampamentariasLayer = new L.TopoJSON();

map.setView([4.5, -73.0], 6);

cartoLight.addTo(map);

$.getJSON('data/Departamentos.topo.json').done(addDptosData);

function addDptosData(topoData) {
    DepartamentosLayer.addData(topoData);
    DepartamentosLayer.addTo(map);
    DepartamentosLayer.setStyle(styleFinal);
    DepartamentosLayer.eachLayer(handleLayerDepartamento);
}

$.getJSON('data/Municipios.topo.json').done(addMpiosData);

function addMpiosData(topoData) {
    MunicipiosLayer.addData(topoData);
    //MunicipiosLayer.addTo(map);
    //MunicipiosLayer.eachLayer(handleLayer);
}

function handleLayerDepartamento(layer) {

    layer.on({
        mouseover: highlightFeatureDepartamento,
        mouseout: resetHighlightDepartamento,
        click: zoomToFeatureDepartamento
    });
}

var caption = d3.select('#caption'),
    starter = caption.html();

function showCaption(titulo, d, i) {
    barData = [d.properties.PorcSi, d.properties.PorcNo];
    redraw();
    caption.html("<b>" + titulo + [d.properties.NOMBRE, "<br />Votos Si: ", digit(d.properties.PorcSi),
      "Votos No: ", digit(d.properties.PorcNo)].join("") + "</b>");
}

// Controles
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true
});
map.addControl(control);

function highlightFeatureDepartamento(e) {

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

    showCaption("Dpto: ", layer.feature);
}

function resetHighlightDepartamento(e) {

    DepartamentosLayer.resetStyle(e.target);
    DepartamentosLayer.setStyle(styleFinal);

    var leyenda = document.getElementById('selLeyenda');
    changeLeyenda(leyenda);

    caption.html(starter);
    barData = [.5021, .4978];
    redraw();

}

function zoomToFeatureDepartamento(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    feature.layer = layer;
    layer.on({
        mouseover: highlightFeatureCapital,
        mouseout: resetHighlightCapital
    });
}

$.getJSON('data/ELN.topo.json').done(addELNData);

function addELNData(topoData) {
    ELNLayer.addData(topoData);
    //ELNLayer.addTo(map);
    //ELNLayer.eachLayer(handleLayer);
}

$.getJSON('data/ZonasVeredales.topo.json').done(addZonasVeredales);

function addZonasVeredales(topoData) {
    ZonasVeredalesLayer.addData(topoData);
    //ZonasVeredalesLayer.addTo(map);
    //ZonasVeredalesLayer.eachLayer(handleLayer);
}

$.getJSON('data/ZonasCampamentarias.topo.json').done(addZonasCampamentarias);

function addZonasCampamentarias(topoData) {
    ZonasCampamentariasLayer.addData(topoData);
    //ZonasCampamentariasLayer.addTo(map);
    //ZonasCampamentariasLayer.eachLayer(handleLayer);
}

//add layer controls/legend
var overlayMaps = {
    'Presencia ELN': ELNLayer,
    'Zonas Veredales': ZonasVeredalesLayer,
    'Zonas Campamentarias': ZonasCampamentariasLayer
};

var layerbox = L.control.layers(null, overlayMaps, {
    collapsed: false,
    position: 'bottomleft'
}).addTo(map);

map.attributionControl.addAttribution('Plebiscito &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

// Leyendas de acuerdo al estilo seleccionado
var legendaFinal = L.control({
    position: 'bottomright'
});

var legendParticipacion = L.control({
    position: 'bottomright'
});

var legendSi = L.control({
    position: 'bottomright'
});

var legendNo = L.control({
    position: 'bottomright'
});

var legendNulos = L.control({
    position: 'bottomright'
});

var legendNoMarcados = L.control({
    position: 'bottomright'
});

// Ajusta la leyenda
legendaFinal.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['SI', 'NO'],
        labels = [];

    for (var i = 0; i < grades.length; i++) {

        labels.push(
            '<i style="background:' + getColorFinal(grades[i]) + '"></i> ' +
            grades[i]);
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendParticipacion.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColorParticipacion(from + 0.1) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendSi.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColorSi(from + 0.1) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendNo.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColorNo(from + 0.1) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendNulos.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.0, 0.01, 0.02, 0.03],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColorNulos(from + 0.01) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendNoMarcados.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.0, 0.01, 0.02],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColorNoMarcados(from + 0.01) + '"></i> ' +
            from + (to === undefined ? '+' : '&ndash;' + to));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legendaFinal.addTo(map);

// Cambiar leyenda
function changeLeyenda(selLeyenda) {
    var selLeyenda = selLeyenda.value;

    switch (selLeyenda) {
    case "ResultadosFinalesDepartamento":
        DepartamentosLayer.setStyle(styleFinal);

        map.removeControl(legendParticipacion);
        map.removeControl(legendSi);
        map.removeControl(legendNo);
        map.removeControl(legendNulos);
        map.removeControl(legendNoMarcados);

        legendaFinal.addTo(map);

        break;
    case "ParticipacionDepartamento":

        DepartamentosLayer.setStyle(styleParticipacion);

        map.removeControl(legendaFinal);
        map.removeControl(legendSi);
        map.removeControl(legendNo);
        map.removeControl(legendNulos);
        map.removeControl(legendNoMarcados);

        legendParticipacion.addTo(map);

        break;
    case "SiDepartamento":

        DepartamentosLayer.setStyle(styleSi);

        map.removeControl(legendaFinal);
        map.removeControl(legendParticipacion);
        map.removeControl(legendNo);
        map.removeControl(legendNulos);
        map.removeControl(legendNoMarcados);

        legendSi.addTo(map);

        break;
    case "NoDepartamento":

        DepartamentosLayer.setStyle(styleNo);

        map.removeControl(legendaFinal);
        map.removeControl(legendParticipacion);
        map.removeControl(legendSi);
        map.removeControl(legendNulos);
        map.removeControl(legendNoMarcados);

        legendNo.addTo(map);

        break;
    case "NulosDepartamento":

        DepartamentosLayer.setStyle(styleNulos);

        map.removeControl(legendaFinal);
        map.removeControl(legendParticipacion);
        map.removeControl(legendSi);
        map.removeControl(legendNo);
        map.removeControl(legendNoMarcados);

        legendNulos.addTo(map);

        break;
    case "NoMarcadosDepartamento":

        DepartamentosLayer.setStyle(styleNoMarcados);

        map.removeControl(legendaFinal);
        map.removeControl(legendParticipacion);
        map.removeControl(legendSi);
        map.removeControl(legendNo);
        map.removeControl(legendNulos);

        legendNoMarcados.addTo(map);

        break;            
    };
}
