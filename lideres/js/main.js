/* ------------------- MAPA ------------------*/
map = L.map('mapLideres', {
    maxZoom: 18,
    minZoom: 5,
    zoomControl: true,
    scrollWheelZoom: true
});

map.setView([4.5, -73.0], 6);

map.createPane('labels');

// This pane is above markers but below popups
map.getPane('labels').style.zIndex = 500;

// Layers in this pane are non-interactive and do not obscure mouse/touch events
map.getPane('labels').style.pointerEvents = 'none';

Stamen_Watercolor.addTo(map);
positronLabels.addTo(map);

var baseMaps = {
        "Base Acurela": Stamen_Watercolor,
        "Base Gris": positron,
        "Base OSM": OpenStreetMap_Mapnik,
        "Base Calles": Esri_WorldStreetMap
    };

    var overlays = {
        "Etiquetas": positronLabels
    };

    L.control.layers(baseMaps, overlays, {
        position: 'bottomright',
        collapsed: true
    }).addTo(map);

    map.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

// Capa de NODOS
    var DptosLayer = L.geoJson(undefined, {
        style: styleDptos /*,
        onEachFeature: function (feature, layer) {
            if (feature.properties.NODO !== "Resto") {
                layer.on('mouseover', highlightFeature);
                layer.on('mouseout', resetHighlightNodos);
                layer.on('click', zoomToFeatureNodos);
            }
        }*/
    });

DptosLayer.addData(capaDepartamentos);
DptosLayer.addTo(map);
map.fitBounds(DptosLayer.getBounds());

    /**
 * Ajusta la simbologia de los nodos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleDptos(feature) {
    "use strict";

    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.2,
        fillColor: "#2196F3"
    };
}