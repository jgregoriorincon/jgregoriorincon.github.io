function loadMap() {
    "use strict";

    var i;

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
    legend = L.control({
        position: 'topright'
    });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ['Caribe', 'Centro', 'Sur'],
            labels = [],
            from;

        for (i = 0; i < grades.length; i++) {
            from = grades[i];
            labels.push('<i style="background:' + getColorNodos(from) + '"></i> Nodo ' + from + '<br />');
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);

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
                    //zoomToFeatureDptos(zoomAnterior);
                    zoomToFeatureNodos(nodoAnterior);
                    nivelActual = 'Nodo';
                } else if (nivelActual === 'Nodo') {
                    limpiarSeleccion();
                    //nivelActual = "Pais";
                } else {
                    zoomToFeatureDptos(mpioAnterior);
                    nivelActual = 'Mpio';
                }
            };

            return container;
        }
    });

    map.addControl(new volver());

    map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

    // Capa de NODOS
    NodosLayer = L.geoJson(undefined, {
        style: styleNodos,
        onEachFeature: function (feature, layer) {
            if (feature.properties.NODO !== "Resto") {
                layer.on('mouseover', highlightFeature);
                layer.on('mouseout', resetHighlightNodos);
                layer.on('click', zoomToFeatureNodos);
            }
        }
    });

    // Adiciona las capas
    NodosLayer.addData(Nodos);
    NodosLayer.addTo(map);

}

/**
 * Asigna colores por el nodo
 * @param   {[[Type]]} d valor del nodo
 * @returns {[[Type]]} color asignado al nodo
 */
function getColorNodos(d) {
    "use strict";

    return d === 'Caribe' ? '#b2df8a' :
        d === 'Centro' ? '#fdcb7b' :
        d === 'Sur' ? '#a5bfdd' : '#f1f4c7';
}

/**
 * Ajusta la simbologia de los nodos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleNodos(feature) {
    "use strict";

    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    map.setView(new L.LatLng(4.5, -73.0), 6);
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(positron);
    map.addLayer(positronLabels);
    map.addLayer(NodosLayer);
}

/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleDptos(feature) {
    'use strict';
    var transparencia = feature.properties.TIENE == 'SI' ? 0.5 : 0.2;
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: transparencia,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleMpios(feature) {
    "use strict";
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.2,
        fillColor: getColorNodos(feature.properties.NODO)
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
 * Quita el resaltado a los nodos deseleccionados
 * @param {object} e Vector deseleccionado
 */
function resetHighlightNodos(e) {
    "use strict";

    NodosLayer.resetStyle(e.target);
    NodosLayer.setStyle(styleNodos);
}

/**
 * Zoom al Nodo
 * @param   {object}   e Vector seleccionado
 * @returns {[[Type]]} [[Description]]
 */
function zoomToFeatureNodos(e) {
    "use strict";

    nodoAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Nodo";

    var layer = e.target;
    map.fitBounds(e.target.getBounds());

    NodoSeleccionado = layer.feature.properties.NODO;

    console.log("Nodo: " + NodoSeleccionado);

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(positron);

    // Capa de DEPARTAMENTOS
    DptosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.NODO === NodoSeleccionado);
        },
        style: styleNodos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.DEPTO, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);
            layer.on('click', zoomToFeatureDptos);
        }
    });

    // Adiciona los Departamentos
    DptosLayer.addData(Dptos);
    map.addLayer(DptosLayer);

}

/**
 * Quita resaltado en Departamentos
 * @param {object} e [[Description]]
 */
function resetHighlightDptos(e) {
    "use strict";
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleNodos);
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

    console.log("Nodo: " + NodoSeleccionado);
    console.log("Dpto: " + DptoSeleccionado);

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(positron);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.DEPTO == DptoSeleccionado)
        },
        style: styleDptos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeatureMpios);
            //layer.on('mouseout', resetHighlightMpios);
            layer.on('click', zoomToFeatureMpios);
        }
    });

    MpiosLayer.addData(Mpios);
    map.addLayer(MpiosLayer);

}

// Resaltado
function highlightFeatureMpios(e) {
    var layer = e.target;
}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    var layer = e.target;
    if (layer.feature.properties.TIENE == 'SI') {

        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });

        map.addLayer(positron);

        //map.fitBounds(e.target.getBounds());
        CodDaneSeleccionado = layer.feature.properties.COD_DANE;
        MpioSeleccionado = layer.feature.properties.NOMBRE;

        console.log("Nodo: " + NodoSeleccionado);
        console.log("Dpto: " + DptoSeleccionado);
        console.log("Mpio: " + MpioSeleccionado);
        console.log("DANE: " + CodDaneSeleccionado);

        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        map.addLayer(positron);
        // Capa de MUNICIPIOS
        MpiosLayer = L.geoJson(undefined, {
            filter: function (feature) {
                return (feature.properties.COD_DANE == CodDaneSeleccionado)
            },
            style: styleMpios,
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.NOMBRE, {
                    permanent: true,
                    direction: "auto"
                });
                layer.on('mouseover', highlightFeatureMpios);
                //layer.on('mouseout', resetHighlightMpios);
                //layer.on('click', zoomToFeatureMpios);
            }
        })

        MpiosLayer.addData(Mpios);
        map.addLayer(MpiosLayer);
        map.addLayer(positronLabels);

        map.fitBounds(MpiosLayer.getBounds());
    }
}