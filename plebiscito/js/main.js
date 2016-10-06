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
    ZonasCampamentariasLayer = new L.TopoJSON()
;

map.setView([4.5, -73.0], 6);

cartoLight.addTo(map);

$.getJSON('data/Departamentos.topo.json').done(addDptosData);

function addDptosData(topoData) {
    DepartamentosLayer.addData(topoData);
    DepartamentosLayer.addTo(map);
    DepartamentosLayer.eachLayer(handleLayerDepartamento);
}

$.getJSON('data/Municipios.topo.json').done(addMpiosData);

function addMpiosData(topoData) {
    MunicipiosLayer.addData(topoData);
    //MunicipiosLayer.addTo(map);
    //MunicipiosLayer.eachLayer(handleLayer);
}

function handleLayerDepartamento(layer) {

    var datoSi = layer.feature.properties.PorcSi;
    var datoNo = layer.feature.properties.PorcNo;

    var fillColor = datoSi > datoNo ? '#00C285' : '#FF894C';

    layer.setStyle({
        fillColor: fillColor,
        fillOpacity: 0.8,
        color: '#555',
        weight: 1,
        opacity: .5
    });

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
    caption.html("<b>"+titulo+[d.properties.NOMBRE,"<br />Votos Si: ", digit(d.properties.PorcSi),
      "Votos No: ", digit(d.properties.PorcNo)].join("")+"</b>");
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
    //DepartamentosLayer.resetStyle(e.target);

    var datoSi = e.target.feature.properties.PorcSi;
    var datoNo = e.target.feature.properties.PorcNo;

    var fillColor = datoSi > datoNo ? '#00C285' : '#FF894C';

    e.target.setStyle({
        fillColor: fillColor,
        fillOpacity: 0.8,
        color: '#555',
        weight: 1,
        opacity: .5
    });

    caption.html(starter);
    barData = [.5021, .4978];
    redraw();

}

function highlightFeatureCapital(e) {
    var layer = e.target;

    showCaption("Capital: ", layer.feature);
}

function resetHighlightCapital(e) {
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
