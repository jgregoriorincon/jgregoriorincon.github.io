/*jslint browser: true*/
/*global $, jQuery, alert, console, L, GeoJSON, limpiarSeleccion, styleNodos, styleDptos, styleMpios, highlightFeature */
/*jslint plusplus: true */

// Variables globales
var mapColombia, cartodbAttribution;
// Controles
var volver, tieneJoin;

// Datos
var DptosLayer, MpiosLayer;
var dptoAnterior, mpioAnterior, nivelActual;
var DptoSeleccionado, CodDptoSeleccionado, MpioSeleccionado;

// Funcion Principal
$(document).ready(function () {
    "use strict";

    var i;

    /* ------------------- MAPA ------------------*/
    mapColombia = L.map('mapColombia', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        defaultExtentControl: false
    });

    mapColombia.setView([4.5, -73.0], 6);

    mapColombia.createPane('labels');

    // This pane is above markers but below popups
    mapColombia.getPane('labels').style.zIndex = 500;

    // Layers in this pane are non-interactive and do not obscure mouse/touch events
    mapColombia.getPane('labels').style.pointerEvents = 'none';

    positron.addTo(mapColombia);
    positronLabels.addTo(mapColombia);

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
    }).addTo(mapColombia);

    /* ------------------- CONTROLES ------------------*/
    volver = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (mapColombia) {
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

    mapColombia.addControl(new volver());

    mapColombia.attributionControl.addAttribution(' <a href="http://pares.com.co/">Fundación Paz y Reconciliación &copy;</a>');

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
    DptosLayer.addData(capaDepartamentos);
    DptosLayer.addTo(mapColombia);
    tieneJoin = false;

    console.log("Listo!");
});

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

    mapColombia.setView(new L.LatLng(4.5, -73.0), 6);
    mapColombia.eachLayer(function (layer) {
        mapColombia.removeLayer(layer);
    });
    mapColombia.addLayer(positron);
    mapColombia.addLayer(positronLabels);
    mapColombia.addLayer(DptosLayer);
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

    if (tieneJoin) {
        DptosLayer.eachLayer(function (layer) {
            layer.setStyle(DptoValorStyle(layer));
        });
    } else {
        DptosLayer.setStyle(styleDptos);
    }
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
    mapColombia.fitBounds(e.target.getBounds());

    DptoSeleccionado = layer.feature.properties.DEPTO;
    CodDptoSeleccionado = layer.feature.properties.COD_DEPTO;

    mapColombia.eachLayer(function (layer) {
        mapColombia.removeLayer(layer);
    });

    mapColombia.addLayer(positron);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.COD_DEPTO == CodDptoSeleccionado)
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

    MpiosLayer.addData(capaMunicipios);
    mapColombia.addLayer(MpiosLayer);

}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    mapColombia.eachLayer(function (layer) {
        mapColombia.removeLayer(layer);
    });

    mapColombia.addLayer(positron);

    var layer = e.target;

    mapColombia.fitBounds(e.target.getBounds());
    MpioSeleccionado = layer.feature.properties.COD_DANE;
    mapColombia.eachLayer(function (layer) {
        mapColombia.removeLayer(layer);
    });
    mapColombia.addLayer(positron);
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

    MpiosLayer.addData(capaMunicipios);
    mapColombia.addLayer(MpiosLayer);
    mapColombia.addLayer(positronLabels);

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

function borrarDatos() {
    if (mapColombia.hasLayer(DptosLayer)) {
       DptosLayer.setStyle(styleDptos);
    }
    if (mapColombia.hasLayer(MpiosLayer)) {
       MpiosLayer.setStyle(styleMpios);
    }

    tieneJoin = false;
    console.log("Borrado");
}

function cargarDatos() {

    /*
    var max = Math.max.apply(Math,csvdata.data.map(function(o){return o.VALOR;}))
    var min = Math.min.apply(Math,csvdata.data.map(function(o){return o.VALOR;}))
    console.log(max - min);

*/

    var csvdata = Papa.parse(strDatosDensidad, {
        header: true,
        dynamicTyping: false,
        complete: function (results) {
            data = results;
        }
    });

    DptosLayer.eachLayer(function (layer) {
        featureJoinByProperty(layer.feature.properties, csvdata.data, "COD_DEPTO");
    });

    tieneJoin = true;

    //do some styling
    DptosLayer.eachLayer(function (layer) {
        layer.setStyle(DptoValorStyle(layer));
    });

    console.log("Cargado");
}

//input arguments:
//fProps: geoJson feature properties object
//dTable: array of objects containing properties to be joined
//joinKey: property to use to perform the join
function featureJoinByProperty(fProps, dTable, joinKey) {
    var keyVal = fProps[joinKey];
    var match = {};
    for (var i = 0; i < dTable.length; i++) {
        if (dTable[i][joinKey] === keyVal) {
            match = dTable[i];
            for (key in match) {
                if (!(key in fProps)) {
                    fProps[key] = match[key];
                }
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
//styling functions//
/////////////////////////////////////////////////////////////////////////////////////////////

function DptoValorStyle(layer) {
    return {
        fillColor: getValorColor(layer.feature.properties.VALOR),
        color: "#000",
        opacity: 0,
        fillOpacity: 0.5
    };
}

function getValorColor(y) {
    return y == 0 ? '000000' :
        y > 1.0 ? '#FF5100' :
        y > 0.9 ? '#FF7300' :
        y > 0.8 ? '#FF9100' :
        y > 0.7 ? '#FFB300' :
        y > 0.6 ? '#FFD000' :
        y > 0.5 ? '#FFF200' :
        y > 0.4 ? '#E8F000' :
        y > 0.3 ? '#BDD600' :
        y > 0.2 ? '#97BD00' :
        y > 0.1 ? '#70A300' :
        '#4D8C00';
}