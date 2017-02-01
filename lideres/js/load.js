/*jslint browser: true*/
/*global $, jQuery, alert, console, Dptos, Mpios, Departamentos, Municipios, Sector, Tematicas, NivelTerritorial, L, GeoJSON, loadTematica, loadSector, loadTerritorial, filtrarTodo, limpiarSeleccion, styleDptos, styleMpios, highlightFeature, listaDepartamentos, listaSector, listaTematicas, listaNivelTerritorial, Stamen_Watercolor, positron, positronLabels, OpenStreetMap_Mapnik, Esri_WorldStreetMap, zoomToFeatureDptos */
/*jslint plusplus: true */

// Variables globales
var map, cartodbAttribution;
// Controles
var info, legend, volver;

// Datos Totales
var filtroDataDpto, filtroDataDptoLayer;
var filtroDataMpio, filtroDataMpioLayer;
var DptosLayer, MpiosLayer;

var dptoAnterior, mpioAnterior, nivelActual;
var DptoSeleccionado, MpioSeleccionado;

var violencia_selectiva_departamento, violencia_selectiva_municipio;
var violencia_selectiva_departamento_geo, violencia_selectiva_municipio_geo;
var violencia_selectiva_departamento_layer, violencia_selectiva_municipio_layer;
var violencia_selectiva_municipio_data;

var fechaInicial, fechaFinal;
var startFechaTotal, startFecha, endFecha;

var eventoIcon = L.icon({
    iconUrl: 'css/Map-Marker.png',
    iconSize: [32, 32],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var AmenazaIcon = L.icon({
    iconUrl: 'css/Amenaza.png',
    iconSize: [40, 40],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var AtentadoIcon = L.icon({
    iconUrl: 'css/Atentado.png',
    iconSize: [48, 56],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var DesalojoIcon = L.icon({
    iconUrl: 'css/Desalojo.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var DesaparicionIcon = L.icon({
    iconUrl: 'css/Desaparicion_forzada.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var DesplazamientoIcon = L.icon({
    iconUrl: 'css/Desplazamiento_forzado.png',
    iconSize: [56, 56],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var DetencionIcon = L.icon({
    iconUrl: 'css/Detencion_arbitraria.png',
    iconSize: [56, 56],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var EjecucionIcon = L.icon({
    iconUrl: 'css/Ejecucion_extrajudicial.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var ExtorsionIcon = L.icon({
    iconUrl: 'css/Extorsion.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var HomicidioIcon = L.icon({
    iconUrl: 'css/Homicidio.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var HostigamientoIcon = L.icon({
    iconUrl: 'css/Hostigamiento.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var SecuestroIcon = L.icon({
    iconUrl: 'css/Secuestro.png',
    iconSize: [48, 48],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var TorturaIcon = L.icon({
    iconUrl: 'css/Tortura.png',
    iconSize: [56, 56],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

// Funcion Principal
$(document).ready(function () {
    "use strict";

    moment.locale('es');
    startFechaTotal = moment('2013-01-01');
    startFecha = moment().startOf('year');
    endFecha = moment();

    fechaInicial = startFecha;
    fechaFinal = endFecha;

    $('#reportrange').daterangepicker({
        "locale": {
            "format": 'MMMM, YYYY',
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Personalizar",
            "weekLabel": "W",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "OCtubre",
                "Noviembre",
                "Diciembre"
            ],
            "firstDay": 1
        },
        showDropdowns: true,
        startDate: startFecha,
        endDate: endFecha,
        minDate: startFechaTotal,
        maxDate: endFecha,
        opens: "center",
        drops: "up",
        ranges: {
            //'Hoy': [moment(), moment()],
            //'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            //'Últimos 7 Días': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 Días': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Último Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Año': [moment().startOf('year'), moment().endOf('year')],
            'Último Año': [moment().subtract(1, 'year').startOf('month'), moment().subtract(1, 'month').endOf('year')],
            'Todos': [startFechaTotal, moment()]
        }
    }, cb);
    
    cb(startFecha, endFecha);

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        fechaInicial = picker.startDate.format('YYYY-M');
        fechaFinal = picker.endDate.format('YYYY-M');
        filtrarTodo();
    });

    $('#buscarPalabraBtn').on('click', function (event) {
        filtrarTodo();
    });

    $('#buscarPalabra').keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });

    var i, lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaDepartamentos.length; i++) {
        lista += "<option value='" + listaDepartamentos[i].CODIGO + "'>" + listaDepartamentos[i].NOMBRE + "</option>";
    }
    $("#selDepartamento").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaTipoAccion.length; i++) {
        lista += "<option value='" + listaTipoAccion[i] + "'>" + listaTipoAccion[i] + "</option>";
    }
    $("#selTipoAccion").html(lista);

    lista = "<option value='all'>Todas</option>";
    for (i = 0; i < listaTipoLider.length; i++) {
        lista += "<option value='" + listaTipoLider[i] + "'>" + listaTipoLider[i] + "</option>";
    }
    $("#selTipoLider").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaResponsables.length; i++) {
        lista += "<option value='" + listaResponsables[i] + "'>" + listaResponsables[i] + "</option>";
    }
    $("#selResponsable").html(lista);

    /* ------------------- MAPA ------------------*/
    map = L.map('map', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: false,
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

    Papa.parse('data/violencia_selectiva_departamento.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            violencia_selectiva_departamento = results;
            violencia_selectiva_departamento_geo = GeoJSON.parse(violencia_selectiva_departamento.data, {
                Point: ["latitud", "longitud"]
            });

            Papa.parse('data/violencia_selectiva_municipio.csv', {
                download: true,
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    violencia_selectiva_municipio = results;
                    violencia_selectiva_municipio_geo = GeoJSON.parse(violencia_selectiva_municipio.data, {
                        Point: ["latitud", "longitud"]
                    });
                    
                    loadMap();
                    filtrarTodo();

                }
            });

        }
    });

});

function cb(start, end) {
    $('#reportrange span').html(start.format('MMM, YYYY') + ' - ' + end.format('MMM, YYYY'));
}