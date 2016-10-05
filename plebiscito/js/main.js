'use strict'

var digit0 = d3.format(".0%");

/* ------------------- MAPA ------------------*/
var map = L.map('map', {
        maxZoom: 18,
        minZoom: 3
    }),
    topoLayer = new L.TopoJSON()
;

map.setView([4.5, -73.0], 6);

cartoLight.addTo(map);

var smallIcon = new L.Icon({
     iconSize: [22, 22],
     iconAnchor: [13, 27],
     popupAnchor:  [1, -24],
     iconUrl: 'images/capital.png'
 });

L.geoJson(Capitales, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, {
          icon: smallIcon
        });
      },
      onEachFeature: onEachFeature
}).addTo(map);

$.getJSON('data/Departamentos.topo.json').done(addTopoData);

function addTopoData(topoData) {
    topoLayer.addData(topoData);
    topoLayer.addTo(map);
    topoLayer.eachLayer(handleLayer);
}

function handleLayer(layer) {

    var datoSi = layer.feature.properties.Si;
    var datoNo = layer.feature.properties.No;

    var fillColor = datoSi > datoNo ? '#00C285' : '#FF894C';

    layer.setStyle({
        fillColor: fillColor,
        fillOpacity: 0.8,
        color: '#555',
        weight: 1,
        opacity: .5
    });

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var caption = d3.select('#caption'),
    starter = caption.html();

function showCaption(titulo, d, i) {
    barData = [d.properties.Si, d.properties.No];
    redraw();
    caption.html("<b>"+titulo+[d.properties.NOMBRE,"<br />Votos Si: ", digit(d.properties.Si),
      "Votos No: ", digit(d.properties.No)].join("")+"</b>");
}

// Controles
L.control.defaultExtent().addTo(map);

var control = L.control.zoomBox({
    modal: true
});
map.addControl(control);

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

    showCaption("Dpto: ", layer.feature);
}

function resetHighlight(e) {
    //topoLayer.resetStyle(e.target);

    var datoSi = e.target.feature.properties.Si;
    var datoNo = e.target.feature.properties.No;

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

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    feature.layer = layer;
    layer.on({
        mouseover: highlightFeatureCapital,
        mouseout: resetHighlightCapital
    });
}

map.attributionControl.addAttribution('Plebiscito &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
