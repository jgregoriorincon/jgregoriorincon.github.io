/*jslint browser: true*/
/*global $, jQuery, positronLabels*/

var Localidad, Nombre, Codigo;
var mapDensidadSM, info;
var BarriosLayer, legendDatos;

$(document).ready(function () {
    'use strict';

    /* ------------------- MAPA ------------------*/
    mapDensidadSM = L.map('map').setView([11.17, -74.20], 12);

    mapDensidadSM.createPane('labels');

    // This pane is above markers but below popups
    mapDensidadSM.getPane('labels').style.zIndex = 500;

    // Layers in this pane are non-interactive and do not obscure mouse/touch events
    mapDensidadSM.getPane('labels').style.pointerEvents = 'none';

    Stamen_Watercolor.addTo(mapDensidadSM);
    positronLabels.addTo(mapDensidadSM);

    // Basemaps
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
    }).addTo(mapDensidadSM);

    // Informacion
    info = L.control();

    info.onAdd = function (mapDensidadSM) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        this._div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">Barrios de Santa Marta</h5>' + (props ?
            '<p align="right"><b>' + props.NOMBRE + '<br />Localidad ' + props.LOCALIDAD + '<br /> Codigo ' + props.CODIGO + '</br><br /> Indice: ' + (props.VALOR ? props.VALOR : ' - ') + '<br />' + '</p></b>' : 'Pase el cursor sobre un barrio');
    };

    info.addTo(mapDensidadSM);

    // Controles
    L.control.defaultExtent().addTo(mapDensidadSM);

    var control = L.control.zoomBox({
        modal: true
    });
    mapDensidadSM.addControl(control);

    legendDatos = L.control({
        position: 'topright'
    })

    mapDensidadSM.attributionControl.addAttribution('Observatorio Distrital de Seguridad y Convivencia &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

});

function resetHighlight(e) {
    info.update();
}

function zoomToFeature(e) {
    var layer = e.target;

    // Daniel
    // Almaceno los valores para usarlos 
    Localidad = layer.feature.properties.LOCALIDAD;
    Codigo = layer.feature.properties.CODIGO;
    Nombre = layer.feature.properties.NOMBRE;

    mapDensidadSM.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    feature.layer = layer;
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function highlightFeature(e) {
    var layer = e.target;

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function cargarBarrios(datosSM, TituloMapa, unidadMapeo, primerColor, segundoColor, transparencia ) {

    borrarDatos();

    var metodo = 'k',
        clases = 5;

    var datosSMHash = datosSM.reduce(function (hash, item) {
        if (item.CODIGO) {
            hash[item.CODIGO] = isNaN(item.VALOR) ? null : +item.VALOR
        }
        return hash
    }, {});

    Barrios.features.forEach(function (item) {
        item.properties.VALOR = datosSMHash[item.properties.CODIGO] || null
    })

    BarriosLayer = L.choropleth(Barrios, {
        valueProperty: 'VALOR',
        scale: [primerColor, segundoColor],
        steps: clases,
        mode: metodo,
        style: {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: transparencia
        },
        onEachFeature: onEachFeature
    });
    BarriosLayer.addTo(mapDensidadSM);

    AddLegendDatos(TituloMapa, unidadMapeo);
}

function borrarDatos() {
    if (mapDensidadSM.hasLayer(BarriosLayer)) {
        mapDensidadSM.removeLayer(BarriosLayer);
    }

    //mapDensidadSM.removeControl(legend);

    //tieneJoin = false;

    console.log("Borrados los datos");
}

function AddLegendDatos(TituloMapa, unidadMapeo) {

    mapDensidadSM.removeControl(legendDatos);

    legendDatos.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = BarriosLayer.options.limits
        var colors = BarriosLayer.options.colors
        var labels = []

        for (var i = 0; i < limits.length; i++) {
            var from = Math.round(limits[i]);
            var to = Math.round(limits[i + 1]);

            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                (to === undefined || isNaN(to) ? ' > ' + from : from) + (to === undefined || isNaN(to) ? unidadMapeo : ' &ndash; ' + to + unidadMapeo));
        }

        div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">' + TituloMapa + '</h5></br><div class="coloresLeyenda">' + labels.join('<br>') + '</div>';

        return div
    }
    legendDatos.addTo(mapDensidadSM);
}