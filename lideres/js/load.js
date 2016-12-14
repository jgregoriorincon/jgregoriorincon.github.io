/*jslint browser: true*/
/*global $, jQuery, alert, console, Observatorios, Nodos, Dptos, Mpios, Departamentos, Municipios, Sector, Tematicas, NivelTerritorial, L, GeoJSON, loadTematica, loadSector, loadTerritorial, filtrarTodo, limpiarSeleccion, styleNodos, styleDptos, styleMpios, getColorNodos, highlightFeature, resetHighlightNodos, renderMarkersBase, listaDepartamentos, listaSector, listaTematicas, listaNivelTerritorial, Stamen_Watercolor, positron, positronLabels, OpenStreetMap_Mapnik, Esri_WorldStreetMap, getColorNodos, zoomToFeatureNodos, zoomToFeatureDptos */
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

var violencia_dptos, violencia_mpios;
var violencia_dptos_geo, violencia_mpios_geo;
var violencia_Dptos_layer, violencia_mpios_layer;
var violencia_mpios_data;

var fechaInicial, fechaFinal, filtrarFecha;
var startFecha, endFecha; 

var observatorioIcon = L.icon({
    iconUrl: 'css/Map-Marker.png',
    iconSize: [32, 32],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

// Funcion Principal
$(document).ready(function () {
    "use strict";

    moment.locale('es');
    startFecha = moment('2013-01-01');
    endFecha = moment();

    $('#reportrange').daterangepicker({
        "locale": {
            "format": 'MMMM, YYYY',
            "separator": " - ",
            "applyLabel": "Aplicar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Custom",
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
        minDate: startFecha,
        maxDate: endFecha,
        opens: "center",
        drops: "up",
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 Días': [moment().subtract(6, 'days'), moment()],
            'Últimos 30 Días': [moment().subtract(29, 'days'), moment()],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
            'Último Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este Año': [moment().startOf('year'), moment().endOf('year')],
            'Último Año': [moment().subtract(1, 'year').startOf('month'), moment().subtract(1, 'month').endOf('year')],
        }
    }, cb);

    cb(startFecha, endFecha);

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) {
        fechaInicial = picker.startDate.format('YYYY-M');
        fechaFinal = picker.endDate.format('YYYY-M');
        filtrarFecha = true;
        filtrarTodo();

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

    $("#buscarPalabra").bind("keypress keyup keydown", function (event) {
        filtrarTodo();
    });

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
    /*
        Papa.parse('data/violencia_departamento.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                violencia_dptos = results;
            }
        });

        Papa.parse('data/violencia_municipio.csv', {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function (results) {
                violencia_mpios = results;
            }
        });
    */
    console.log("Listo Alfa!");

    violencia_dptos_geo = GeoJSON.parse(violencia_dptos, {
        Point: ["latitud", "longitud"]
    });

    violencia_mpios_geo = GeoJSON.parse(violencia_mpios, {
        Point: ["latitud", "longitud"]
    });

    loadMap();

    console.log("Listo Geo!");

});

function cb(start, end) {
        $('#reportrange span').html(start.format('MMM, YYYY') + ' - ' + end.format('MMM, YYYY'));
    }