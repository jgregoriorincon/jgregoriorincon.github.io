var NodoSeleccionado, DptoSeleccionado, MpioSeleccionado;
var DptosLayer;

/* ------------------- MAPA ------------------*/
var map = L.map('map', {
    maxZoom: 18,
    minZoom: 5,
    zoomControl: false,
    scrollWheelZoom: false
});

map.setView([4.5, -73.0], 6);

map.createPane('labels');

// This pane is above markers but below popups
map.getPane('labels').style.zIndex = 650;

// Layers in this pane are non-interactive and do not obscure mouse/touch events
map.getPane('labels').style.pointerEvents = 'none';


var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution
}).addTo(map);

var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution,
    pane: 'labels'
});

// Capa de NODOS
var NodosLayer = L.geoJson(undefined, {
    style: styleNodos,
    onEachFeature: function (feature, layer) {
        if (feature.properties.NODO !== "Resto") {
            layer.bindTooltip("Nodo " + feature.properties.NODO, {
                permanent: true,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightNodos);
            layer.on('click', zoomToFeatureNodos);
        }
    }
})

// Resaltado
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
}

// Quitar Resaltado NODOS
function resetHighlightNodos(e) {
    NodosLayer.resetStyle(e.target);
    NodosLayer.setStyle(styleNodos);
}

// Quitar Resaltado DEPARTAMENTOS
function resetHighlightDptos(e) {
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleNodos);
}

// Zoom al elemento
function zoomToFeatureNodos(e) {
    var layer = e.target;

    map.fitBounds(e.target.getBounds());

    NodoSeleccionado = layer.feature.properties.NODO;

    map.removeLayer(NodosLayer);

    // Capa de DEPARTAMENTOS
    DptosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.NODO === NodoSeleccionado)
        },
        style: styleNodos,
        onEachFeature: function (feature, layer) {

            layer.bindTooltip(feature.properties.DEPTO, {
                permanent: true,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);
            layer.on('click', zoomToFeatureDptos);
        }

    })

    DptosLayer.addData(Dptos);
    map.addLayer(DptosLayer);
}

// Zoom al elemento
function zoomToFeatureDptos(e) {
    var layer = e.target;

    map.fitBounds(e.target.getBounds());

    //NodoSeleccionado = layer.feature.properties.NODO;

    //map.removeLayer(NodosLayer);
}

NodosLayer.addData(Nodos);

NodosLayer.addTo(map);


/* ------------------- CONTROLES ------------------*/
L.control.defaultExtent().addTo(map);

map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
