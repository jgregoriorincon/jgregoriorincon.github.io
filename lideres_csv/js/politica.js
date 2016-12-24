var mapPoliticas;

var volver;

var nivelActual, dptoAnterior, mpioAnterior;
var DptoSeleccionado, MpioSeleccionado;
var DptosLayer, MpiosLayer;
var DptosLayerBack, MpiosLayerBack;
var legendDpto;

// Funcion Principal
$(document).ready(function () {
    'use strict';

    /* ------------------- MAPA ------------------*/
    mapPoliticas = L.map('mapPoliticas', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: true,
        scrollWheelZoom: true
    });

    mapPoliticas.setView([4.5, -73.0], 6);

    // Add legend (don't forget to add the CSS from index.html)
    legendDpto = L.control({
        position: 'topright'
    })

    mapPoliticas.createPane('labels');

    // This pane is above markers but below popups
    mapPoliticas.getPane('labels').style.zIndex = 500;

    // Layers in this pane are non-interactive and do not obscure mouse/touch events
    mapPoliticas.getPane('labels').style.pointerEvents = 'none';

    Stamen_Watercolor.addTo(mapPoliticas);
    positronLabels.addTo(mapPoliticas);

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
    }).addTo(mapPoliticas);

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

    mapPoliticas.addControl(new volver());

    mapPoliticas.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>&copy;');

    loadDptos();
    AddLegendDpto();
});

function loadDptos() {
    'use strict';

    var dataDptosHash = listaDepartamentos.reduce(function (hash, item) {
        if (item.CODIGO) {
            hash[item.CODIGO] = isNaN(item.CODIGO) ? null : "SI"
        }
        return hash
    }, {});

    capaDepartamentos.features.forEach(function (item) {
        item.properties.POLITICA = dataDptosHash[item.properties.COD_DEPTO] || null;
    })

    // Capa de Departamentos Base
    DptosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.POLITICA == null)
        },
        style: stylePoligonos
    });

    DptosLayerBack.addData(capaDepartamentos);
    DptosLayerBack.addTo(mapPoliticas);

    // Capa de Departamentos Base
    DptosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.POLITICA !== null)
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

    DptosLayer.addData(capaDepartamentos);
    DptosLayer.addTo(mapPoliticas);
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
        fillColor: getColorPoligonos(feature.properties.POLITICA) //"#fff"
    };
}

/**
 * Asigna colores por el nodo
 * @param   {[[Type]]} d valor del nodo
 * @returns {[[Type]]} color asignado al nodo
 */
function getColorPoligonos(d) {
    "use strict";

    return d === 'SI' ? '#02df8a' :
        d === 'NO' ? '#FF0000' :
        d === 'NS/NR' ? '#1E90FF' : '#fff';
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

    mapPoliticas.eachLayer(function (layer) {
        mapPoliticas.removeLayer(layer);
    });

    mapPoliticas.addLayer(Stamen_Watercolor);

    var dataMpios = listaMunicipios[DptoSeleccionado] || [];

    var dataMpiosHash = dataMpios.reduce(function (hash, item) {
        if (item.CODIGO) {
            hash[item.CODIGO] = isNaN(item.CODIGO) ? null : item.POLITICA
        }
        return hash
    }, {});

    var capaMunicipiosFiltrada = jQuery.extend(true, {}, capaMunicipios);

    capaMunicipiosFiltrada.features = capaMunicipiosFiltrada.features.filter(function (a) {
        return a.properties.COD_DPTO === DptoSeleccionado.toString();
    });

    capaMunicipiosFiltrada.features.forEach(function (item) {
        item.properties.POLITICA = dataMpiosHash[item.properties.COD_MPIO] || null;
    })

    // Capa de Municipios Base
    MpiosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return feature.properties.POLITICA !== null
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
    MpiosLayerBack.addTo(mapPoliticas);
    mapPoliticas.fitBounds(MpiosLayerBack.getBounds());
}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    var layer = e.target;

    MpioSeleccionado = layer.feature.properties.COD_MPIO;

    var dataMpios = politicasPublicas[MpioSeleccionado] || [];
    var showTabla = false;

    var tablaMunicipio = '<table class="table table-hover">'
    $.each(dataMpios, function (key, value) {
        if ((key === "MUNICIPIO") && (value !== "")) {
            tablaMunicipio += '<thead><tr><th>' + key + '</th><td>' + value + '</td></tr></thead><tbody>'
            showTabla = true;
        } else if (value !== "") {
            tablaMunicipio += '<tr><th>' + key + '</th><td>' + value + '</td></tr>';
        }
    });

    tablaMunicipio += '</tbody></table>';

    $("#feature-title").html('<center>Politicas Públicas</center>');
    $("#tablaDatos").html(tablaMunicipio);

    if (showTabla) {
        $('#featureModal').modal('show');
    }
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

    mapPoliticas.setView(new L.LatLng(4.5, -73.0), 6);
    mapPoliticas.eachLayer(function (layer) {
        mapPoliticas.removeLayer(layer);
    });
    mapPoliticas.addLayer(Stamen_Watercolor);
    mapPoliticas.addLayer(positronLabels);

    loadDptos();

}

function AddLegendDpto() {

    mapPoliticas.removeControl(legendDpto);

    var TituloMapa = "Mapa de Politicas Públicas" + '</br>Por Municipios';
    var unidadMapeo = " Hechos";

    legendDpto.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var labels = []

        labels.push('<i style="background:' + '#02df8a' + '"></i> SI');
        labels.push('<i style="background:' + '#EE8474' + '"></i> NO');
        labels.push('<i style="background:' + '#1E90FF' + '"></i> NS/NR');

        div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">' + TituloMapa + '</h5></br><div class="coloresLeyenda">' + labels.join('<br>') + '</div>';

        return div
    }
    legendDpto.addTo(mapPoliticas);
}