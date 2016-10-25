/*jslint browser: true*/
/*global $, jQuery, alert, console, L, GeoJSON, limpiarSeleccion, styleNodos, styleDptos, styleMpios, highlightFeature */
/*jslint plusplus: true */

// Variables globales
var map, cartodbAttribution;
// Controles
var info, legend, volver;

// Datos
var DptosLayer, MpiosLayer;
var dptoAnterior, mpioAnterior, nivelActual;
var DptoSeleccionado, MpioSeleccionado;

// Funcion Principal
$(document).ready(function () {
    "use strict";

    var i;

    /* ------------------- MAPA ------------------*/
    map = L.map('map', {
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

    positron.addTo(map);
    positronLabels.addTo(map);

    var baseMaps = {
        "Base Gris": positron,
        "Base OSM": OpenStreetMap_Mapnik,
        "Base Calles": Esri_WorldStreetMap
    };

    var overlays = {
        "Etiquetas": positronLabels
    };

    L.control.layers(baseMaps, overlays, {
        position: 'bottomright',
        collapsed: false
    }).addTo(map);

    /* ------------------- CONTROLES ------------------*/
    volver = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'volver-control');
            container.innerHTML = '<form><img src="css/back-icon.png" alt="VOLVER" style="width:64px;height:64px;"><br />Ir a Vista Anterior</form>';
            container.style.cursor = 'pointer';

            container.onclick = function () {
                //console.log(zoomAnterior);
                console.log(nivelActual);

                if (nivelActual === 'Mpio') {
                    zoomToFeatureDptos(dptoAnterior);
                    nivelActual = 'Dpto';
                } else if (nivelActual === 'Dpto') {
                    limpiarSeleccion();
                    nivelActual = "Pais";
                } else {
                    zoomToFeatureDptos(mpioAnterior);
                    nivelActual = 'Mpio';
                }
            }

            return container;
        }
    });

    map.addControl(new volver());

    map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

    // Capa de NODOS
    DptosLayer = L.geoJson(undefined, {
        style: styleDptos,
        onEachFeature: function (feature, layer) {
            // Se podria usar el campo COD_DEPTO o DEPTO
            layer.bindTooltip(feature.properties.DEPTO, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);
            layer.on('click', zoomToFeatureDptos);
        }
    });

    // Adiciona las capas
    DptosLayer.addData(departamentos);
    DptosLayer.addTo(map);

    console.log("Listo!");
});

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

    map.setView(new L.LatLng(4.5, -73.0), 6);
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(positron);
    map.addLayer(positronLabels);
    map.addLayer(DptosLayer);

}

/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleDptos(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5,
        fillColor: '#a5bfdd'
    };
}

/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleMpios(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5,
        fillColor: '#b2df8a'
    };
}

/**
 * Resalta el elemento
 * @param {object} e Vector sobre el que pasa el mouse
 */
function highlightFeature(e) {
    "use strict";

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

/**
 * Quita resaltado en Departamentos
 * @param {object} e [[Description]]
 */
function resetHighlightDptos(e) {
    "use strict";
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleDptos);
}

// Zoom al elemento
/**
 * [[Zoom al departamento seleccionado]]
 * @param   {object}   e [[vector seleccionado]]
 * @returns {[[Type]]} [[Description]]
 */
function zoomToFeatureDptos(e) {
    "use strict";
    dptoAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Dpto";

    var layer = e.target;
    map.fitBounds(e.target.getBounds());
    DptoSeleccionado = layer.feature.properties.DEPTO;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(positron);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.DEPTO == DptoSeleccionado)
        },
        style: styleMpios,
        onEachFeature: function (feature, layer) {
            // Se podria usar el campo "COD_DEPTO", "TIPO", "COD_DANE", "DEPTO" o "NOMBRE"
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightMpios);
            layer.on('click', zoomToFeatureMpios);
        }
    })

    MpiosLayer.addData(municipios);
    map.addLayer(MpiosLayer);

}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(positron);

    var layer = e.target;

    map.fitBounds(e.target.getBounds());
    MpioSeleccionado = layer.feature.properties.COD_DANE;
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(positron);
    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.COD_DANE == MpioSeleccionado)
        },
        style: styleMpios,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: true,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            //layer.on('mouseout', resetHighlightMpios);
            //layer.on('click', zoomToFeatureMpios);
        }
    })

    MpiosLayer.addData(municipios);
    map.addLayer(MpiosLayer);
    map.addLayer(positronLabels);

}

/**
 * Quita resaltado en Departamentos
 * @param {object} e [[Description]]
 */
function resetHighlightMpios(e) {
    "use strict";
    MpiosLayer.resetStyle(e.target);
    MpiosLayer.setStyle(styleMpios);
}