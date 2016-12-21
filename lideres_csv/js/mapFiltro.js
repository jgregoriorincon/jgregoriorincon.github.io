var mapFiltro;

var volver;

var nivelActual, dptoAnterior, mpioAnterior;
var DptoSeleccionado, MpioSeleccionado;
var DptosLayerBack, MpiosLayerBack;

// Funcion Principal
$(document).ready(function () {
    'use strict';

    /* ------------------- MAPA ------------------*/
    mapFiltro = L.map('mapFiltro', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: true,
        scrollWheelZoom: true
    });

    mapFiltro.setView([4.5, -73.0], 6);


    mapFiltro.createPane('labels');

    // This pane is above markers but below popups
    mapFiltro.getPane('labels').style.zIndex = 500;

    // Layers in this pane are non-interactive and do not obscure mouse/touch events
    mapFiltro.getPane('labels').style.pointerEvents = 'none';

    Stamen_Watercolor.addTo(mapFiltro);
    positronLabels.addTo(mapFiltro);

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
    }).addTo(mapFiltro);

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
                if (nivelActual === 'Mpio') {
                    zoomToFeatureDptos(dptoAnterior);
                    nivelActual = 'Dpto';
                } else if (nivelActual === 'Dpto') {
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

    mapFiltro.addControl(new volver());

    mapFiltro.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>&copy;');

    loadDptos();
});

function loadDptos() {
    'use strict';

    var dataDptosHash = listaDepartamentos.reduce(function (hash, item) {
        if (item.CODIGO) {
            hash[item.CODIGO] = isNaN(item.CODIGO) ? null : 1
        }
        return hash
    }, {});

    capaDepartamentos.features.forEach(function (item) {
        item.properties.VALOR = dataDptosHash[item.properties.COD_DEPTO] || null;
    })

    // Capa de Departamentos Base
    DptosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.VALOR === 1)
        },
        style: stylePoligonos,
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

    DptosLayerBack.addData(capaDepartamentos);
    DptosLayerBack.addTo(mapFiltro);
}

/**
 * Ajusta la simbologia de los Departamentos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function stylePoligonos(feature) {
    "use strict";

    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3,
        fillColor: "#fff"
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
    DptosLayerBack.resetStyle(e.target);
    DptosLayerBack.setStyle(stylePoligonos);
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
    
    DptoSeleccionado = layer.feature.properties.COD_DEPTO;
    console.log("El Departamento Seleccionado es " + DptoSeleccionado);

    mapFiltro.eachLayer(function (layer) {
        mapFiltro.removeLayer(layer);
    });

    mapFiltro.addLayer(Stamen_Watercolor);

    var dataMpios = listaMunicipios[DptoSeleccionado] || [];

    var dataMpiosHash = dataMpios.reduce(function (hash, item) {
        if (item.CODIGO) {
            hash[item.CODIGO] = isNaN(item.CODIGO) ? null : 1
        }
        return hash
    }, {});

    var capaMunicipiosFiltrada = jQuery.extend(true, {}, capaMunicipios);

    capaMunicipiosFiltrada.features = capaMunicipiosFiltrada.features.filter(function (a) {
        return a.properties.COD_DPTO === DptoSeleccionado.toString();
    });

    capaMunicipiosFiltrada.features.forEach(function (item) {
        item.properties.VALOR = dataMpiosHash[item.properties.COD_MPIO] || null;
    })

    // Capa de Municipios Base
    MpiosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return feature.properties.VALOR !== null
        },
        style: stylePoligonos,
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
    });

    MpiosLayerBack.addData(capaMunicipiosFiltrada);
    MpiosLayerBack.addTo(mapFiltro);
    mapFiltro.fitBounds(MpiosLayerBack.getBounds());
}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    mapFiltro.eachLayer(function (layer) {
        mapFiltro.removeLayer(layer);
    });

    var layer = e.target;

    mapFiltro.fitBounds(e.target.getBounds());

    MpioSeleccionado = layer.feature.properties.COD_MPIO;
    console.log("El Municipio Seleccionado es " + MpioSeleccionado);
    
    mapFiltro.eachLayer(function (layer) {
        mapFiltro.removeLayer(layer);
    });

    // Capa de MUNICIPIOS
    MpiosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.COD_MPIO == MpioSeleccionado)
        },
        style: stylePoligonos,
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

    MpiosLayerBack.addData(capaMunicipios);
    mapFiltro.addLayer(Stamen_Watercolor);
    mapFiltro.addLayer(MpiosLayerBack);
    mapFiltro.addLayer(positronLabels);

}

/**
 * Quita resaltado en Departamentos
 * @param {object} e [[Description]]
 */
function resetHighlightMpios(e) {
    "use strict";
    MpiosLayerBack.resetStyle(e.target);
    MpiosLayerBack.setStyle(stylePoligonos);
}

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

    mapFiltro.setView(new L.LatLng(4.5, -73.0), 6);
    mapFiltro.eachLayer(function (layer) {
        mapFiltro.removeLayer(layer);
    });
    mapFiltro.addLayer(Stamen_Watercolor);
    mapFiltro.addLayer(positronLabels);

    loadDptos();

}