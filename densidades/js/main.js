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
        position: 'bottomleft'
    })

    tieneJoin = false;

    console.log("Listo!");
});


function cargarDptos() {

    borrarDatos();

    var metodo = metodoSeleccionado === "Límites Naturales" ? "k" : metodoSeleccionado === "Intervalos Iguales" ? "e" : "q"; 

    capaDepartamentos.features.forEach(function (item) {
        item.properties.VALOR = dataDptosHash[item.properties.COD_DEPTO] || null
    })

    DptosLayer = L.choropleth(capaDepartamentos, {
        valueProperty: 'VALOR',
        scale: ['green', 'red'],
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

        // Add min & max
        div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + ';opacity: 0.5;"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
        return div
    }
    legend.addTo(mapColombia);

    tieneJoin = true;
    console.log("Cargados los Departamentos");

}

function cargarMpios() {

    borrarDatos();

    var metodo = metodoSeleccionado === "Límites Naturales" ? "k" : metodoSeleccionado === "Intervalos Iguales" ? "e" : "q"; 

    capaMunicipios.features.forEach(function (item) {
        item.properties.VALOR = dataMpiosHash[item.properties.COD_DANE] || null
    })

    MpiosLayer = L.choropleth(capaMunicipios, {
        valueProperty: 'VALOR',
        scale: ['green', 'red'],
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
            layer.bindTooltip("Mpio: " + feature.properties.NOMBRE + "</br>Valor: " + feature.properties.VALOR, {
                permanent: false,
                direction: "auto"
            });
            layer.on('click', zoomToFeature);
        }
    });
    MpiosLayer.addTo(mapColombia);

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = MpiosLayer.options.limits
        var colors = MpiosLayer.options.colors
        var labels = []

        // Add min & max
        div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

        limits.forEach(function (limit, index) {
            labels.push('<li style="background-color: ' + colors[index] + ';opacity: 0.5;"></li>')
        })

        div.innerHTML += '<ul>' + labels.join('') + '</ul>'
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