var map;
var markers = [];

$(document).ready(function () {
    // "use strict";

    renderCategories();
    initInputs();

    var observatorio = ObservatoriosData[0];

    LeafletMap.init(observatorio.LAT, observatorio.LONG, ObservatoriosData);

    var afterFilter = function(result){
        $('#total_places').text(result.length);
        //LeafletMap.updateMarkers(result);
        console.log(result);
        if (result.length > 0)
        {
            for (var i=0; i < result.length; i++)
            {
                console.log(JSON.stringify(result[i]));
            }
        }
    };

  afterFilter(ObservatoriosData);

    //search: {ele: '#searchbox', fields: ['runtime']}, // With specific fields
  var FJS = FilterJS(ObservatoriosData, '#places', {
    template: '#place-template',
    search: {ele: '#searchbox', fields: ['OBSERVATORIO', 'DEPARTAMENTO', 'NODO', 'MUNICIPIO', 'SECTOR']},
    callbacks: {
      afterFilter: afterFilter 
    }
  });

  //FJS.addCriteria({field: 'rating', ele: '#rating_filter', type: 'range'});
  //FJS.addCriteria({field: 'is_closed', ele: '#is_closed_criteria input:checkbox'});
  FJS.addCriteria({field: 'TEMATICA', ele: '#categories_criteria input:checkbox', all: 'all'});

  window.FJS = FJS;

    /*
        loadTematica();
        loadSector();
        loadTerritorial();
        loadDepartamentos();
        loadMunicipios();

        $('#selTematica :checkbox').prop('checked', true);

        ObservatoriosDataCompleto = ObservatoriosData;

      //NOTE: To append in different container
      var appendToContainer = function(htmlele, record){
        console.log(record);
      };

        //FJS.addCriteria({ field: 'DEPARTAMENTO', ele: '#selDepartamento' });
        var FJS = FilterJS(ObservatoriosDataCompleto, '#map', {
            template: '#observatorio-template',
            search: {
                ele: '#searchbox'
            },
            //search: {ele: '#searchbox', fields: ['runtime']}, // With specific fields
            callbacks: {
                afterFilter: function (result) {
                    $('#total_observatorios').text(result.length);
                }
            },
            //appendToContainer: appendToContainer
            filter_on_init: true
        });

        FJS.addCriteria({field: 'DEPARTAMENTO', ele: '#selDepartamento', all: 'all'});
        FJS.addCriteria({field: 'SECTOR', ele: '#selSector', all: 'all'});
        //FJS.addCriteria({field: 'TEMATICA', ele: '#selTematica', all: 'all'});
        FJS.addCriteria({field: 'TEMATICA', ele: '#selTematica input:checkbox', all: 'all'});

        window.FJS = FJS;
    */
});
/*
function loadDepartamentos() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";

    for (var i = 0; i < Departamentos.length; i++) {
        lista += "<option value='" + Departamentos[i] + "'>" + Departamentos[i] + "</option>";
    }
    $("#selDepartamento").html(lista);
}

function loadMunicipios() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";
    /*
    for (var i = 0; i < Tematicas.length; i++){
        lista +=   "<option value='" + Tematicas[i] + "'>" + Tematicas[i] + "</option>";
    }
    */
/*
    $("#selMunicipio").html(lista);
}

function loadSector() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";

    for (var i = 0; i < Sector.length; i++) {
        lista += "<option value='" + Sector[i] + "'>" + Sector[i] + "</option>";
    }
    $("#selSector").html(lista);
}

function loadTematica() {
    "use strict";
    var lista; // = "<option value='all'>Todas</option>";
    for (var i = 0; i < Tematicas.length; i++) {
        lista += "<option value='" + Tematicas[i] + "'>" + Tematicas[i] + "</option>";
    }
    $("#selTematica").html(lista);

    $('#selTematica').multiselect({
        buttonWidth: '300px',
        includeSelectAllOption: true,
            selectAllValue: 'all',
            maxHeight: 200,
            dropUp: true,
            allSelectedText: 'Todos',
            selectAllNumber: false
    });
}

function loadTerritorial() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";

    for (var i = 0; i < NivelTerritorial.length; i++) {
        lista += "<option value='" + NivelTerritorial[i] + "'>" + NivelTerritorial[i] + "</option>";
    }
    $("#selTerritorial").html(lista);
}
*/

/*
$("#make").change(function () {
    $('#model').empty().append($('<option></option>').val('Select Model').html('Select Model'));
    var matchVal = $("#make option:selected").text();
    a.Cars.filter(function (car) {
        if (car.make == matchVal) {
            $("#model").append($('<option></option>').val(car.size).html(car.model));
        }
    });
});
*/

function renderCategories() {
    var html = $('#category-template').html();
    var templateFn = FilterJS.templateBuilder(html);
    var container = $('#categories_criteria');

    $.each(Tematicas, function (i, c) {
        container.append(templateFn({
            name: c,
            value: c
        }))
    });
}

function initInputs() {

    $('#categories_criteria :checkbox').prop('checked', true);

    $('#all_categories').on('click', function () {
        $('#categories_criteria :checkbox').prop('checked', $(this).is(':checked'));
    });
}

var LeafletMap = {

    init: function (lat, lng, lugares) {
        var self = this;

        /* ------------------- MAPA ------------------*/
        map = L.map('map', {
            maxZoom: 18,
            minZoom: 5,
            zoomControl: false,
            scrollWheelZoom: false
        });

        map.setView([4.5, -73.0], 6);

        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        map.getPane('labels').style.pointerEvents = 'none';

        positron.addTo(map);
        positronLabels.addTo(map);

        $.each(lugares, function () {
            self.addMarker(this);
            // Create and save a reference to each marker
            //self.markers[this.IDENTIFICADOR] = L.marker([this.LAT, this.LONG]).addTo(this.map);
        });

        //map.addLayer(markers);
        //map.addLayer(markers);
        //this.setCenterPoint();
    },

  addMarker: function(lugar){
    var self = this;
    var marker = L.marker([lugar.LAT, lugar.LONG]).addTo(map);

    //marker.info_window_content = lugar.name + '<br/>' + lugar.address;
    markers[lugar.IDENTIFICADOR] = marker;
/*
    google.maps.event.addListener(marker, 'click', function() {
      self.infowindow.setContent(marker.info_window_content)
      self.infowindow.open(self.map,marker);
    });*/
  },

    updateMarkers: function (records) {
        var self = this;

        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        /*$.each(self.markers, function () {
            //this.setMap(null);
            self.map.removeLayer(this);
        })*/
        $.each(records, function () {
            markers[this.IDENTIFICADOR].addTo(map);
        });
    }

};