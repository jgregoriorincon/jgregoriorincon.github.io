/*jslint browser: true*/
/*global $, jQuery, alert, console, L, GeoJSON, limpiarSeleccion, styleNodos, styleDptos, styleMpios, highlightFeature */
/*jslint plusplus: true */

// Variables globales
var mapColombia, cartodbAttribution, legend;
var tieneJoin;
var metodoSeleccionado, clases;

// Datos
var DptosLayer, MpiosLayer;
//var DptoSeleccionado, CodDptoSeleccionado, MpioSeleccionado;

// Funcion Principal
$(document).ready(function () {
    "use strict";

    $("#metodo li a").click(function () {
        metodoSeleccionado = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(metodoSeleccionado + ' <span class="caret"></span>');
    });

    $("#clases li a").click(function () {
        clases = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle').html(clases + ' <span class="caret"></span>');

        clases = isNaN(clases) ? 5 : +clases;
    });

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
    mapColombia.attributionControl.addAttribution(' <a href="http://pares.com.co/">Fundación Paz y Reconciliación &copy;</a>');
    L.control.defaultExtent().addTo(mapColombia);

    // Add legend (don't forget to add the CSS from index.html)
    legend = L.control({
        position: 'topright'
    })

    tieneJoin = false;

    console.log("Listo!");
});

function cargarDptos() {

    borrarDatos();

    var metodo = metodoSeleccionado === "Límites Naturales" ? "k" : metodoSeleccionado === "Intervalos Iguales" ? "e" : "q";
    clases = isNaN(clases) ? 5 : +clases;

    var dataDptosHash = dataDptos.responseJSON.reduce(function (hash, item) {
        if (item.COD_DEPTO) {
            hash[item.COD_DEPTO] = isNaN(item.VALOR) ? null : +item.VALOR
        }
        return hash
    }, {});

    capaDepartamentos.features.forEach(function (item) {
        item.properties.VALOR = dataDptosHash[item.properties.COD_DEPTO] || null
    })

    DptosLayer = L.choropleth(capaDepartamentos, {
        valueProperty: 'VALOR',
        scale: ['yellow', 'red'],
        steps: clases,
        mode: metodo,
        style: {
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        },
        onEachFeature: function (feature, layer) {
            layer.bindTooltip("Dpto: " + feature.properties.DEPTO + "</br>Valor: " + feature.properties.VALOR, {
                permanent: false,
                direction: "auto"
            });
            layer.on('click', zoomToFeature);
        }
    });
    DptosLayer.addTo(mapColombia);

    console.log(DptosLayer.options.limits);

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = DptosLayer.options.limits
        var colors = DptosLayer.options.colors
        var labels = []

        for (var i = 0; i < limits.length; i++) {
            from = Math.round(limits[i] * 100) / 100;
            to = (Math.round(limits[i + 1] * 100) - 1) / 100;

            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                from + unidadMapeo + (to === undefined || isNaN(to) ? ' +' : ' &ndash; ' + to + unidadMapeo));
        }

        div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">' + TituloMapa + '</h5></br><div class="coloresLeyenda">' + labels.join('<br>') + '</div>';

        return div
    }
    legend.addTo(mapColombia);

    tieneJoin = true;
    console.log("Cargados los Departamentos");

}

function cargarMpios() {

    borrarDatos();

    var metodo = metodoSeleccionado === "Límites Naturales" ? "k" : metodoSeleccionado === "Intervalos Iguales" ? "e" : "q";
    clases = isNaN(clases) ? 5 : +clases;

    var dataMpiosHash = dataMpios.responseJSON.reduce(function (hash, item) {
        if (item.COD_DANE) {
            hash[item.COD_DANE] = isNaN(item.VALOR) ? null : +item.VALOR
        }
        return hash
    }, {})

    capaMunicipios.features.forEach(function (item) {
        item.properties.VALOR = dataMpiosHash[item.properties.COD_DANE] || null
    })

    MpiosLayer = L.choropleth(capaMunicipios, {
        valueProperty: 'VALOR',
        scale: ['green', 'red'],
        steps: clases,
        mode: metodo,
        style: {
            weight: 0.8,
            opacity: 0.8,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        },
        onEachFeature: function (feature, layer) {
            layer.bindTooltip("Mpio: " + feature.properties.NOMBRE + "</br>Valor: " + feature.properties.VALOR, {
                permanent: false,
                direction: "auto"
            });
            layer.on('click', zoomToFeature);
        }
    });
    MpiosLayer.addTo(mapColombia);

    console.log(MpiosLayer.options.limits);

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = MpiosLayer.options.limits
        var colors = MpiosLayer.options.colors
        var labels = []

        for (var i = 0; i < limits.length; i++) {
            from = Math.round(limits[i] * 100) / 100;
            to = (Math.round(limits[i + 1] * 100) - 1) / 100;

            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                from + unidadMapeo + (to === undefined || isNaN(to) ? ' +' : ' &ndash; ' + to + unidadMapeo));
        }

        div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">' + TituloMapa + '</h5></br><div class="coloresLeyenda">' + labels.join('<br>') + '</div>';


        return div
    }
    legend.addTo(mapColombia);

    tieneJoin = true;
    console.log("Cargados los Municipios");
}

function borrarDatos() {
    if (mapColombia.hasLayer(DptosLayer)) {
        mapColombia.removeLayer(DptosLayer);
    }
    if (mapColombia.hasLayer(MpiosLayer)) {
        mapColombia.removeLayer(MpiosLayer)
    }

    mapColombia.removeControl(legend);

    tieneJoin = false;

    console.log("Borrados los datos");
}

function zoomToFeature(e) {
    var layer = e.target;

    mapColombia.fitBounds(e.target.getBounds());
}