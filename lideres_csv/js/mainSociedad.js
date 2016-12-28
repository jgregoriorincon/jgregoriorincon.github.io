function loadMap() {
    "use strict";

    var i;

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
    }).addTo(mapSociedad);

    /* ------------------- CONTROLES ------------------*/
    mapSociedad.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>&copy;');

    // Add legend (don't forget to add the CSS from index.html)
    legendDpto = L.control({
        position: 'topright'
    })

    AddDatosDpto(sociedad_departamento);
    AddLegendDpto();

    sociedad_departamento_layer = renderMarkersData(sociedad_departamento_geo, 5);
    mapSociedad.addLayer(sociedad_departamento_layer);
    mapSociedad.fitBounds(DptosLayer.getBounds());

}

/**
 * Ajusta la simbologia de los Departamentos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleDptos(feature) {
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

// HECHOS
/**
 * Cluster con Ventana Modal
 * @param   {[[Type]]} data            Datos a clusterizar
 * @param   {[[Type]]} distancia = 100 Distancia para unificar
 * @returns {boolean}  [[Description]]
 */
function renderMarkersData(data, distancia = 10) {

    var layer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                popupHecho(feature, layer);
            }
        },

        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: SociedadIcon
            });
        }
    });

    layer.setZIndex(1002);

    if (distancia > 0) {
        var cluster = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: distancia,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 19
        });

        cluster.addLayer(layer);

        return cluster;
    } else {
        return layer;
    }

}

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

    mapSociedad.setView(new L.LatLng(4.5, -73.0), 6);
    mapSociedad.eachLayer(function (layer) {
        mapSociedad.removeLayer(layer);
    });
    mapSociedad.addLayer(Stamen_Watercolor);
    mapSociedad.addLayer(positronLabels);

    AddDatosDpto(sociedad_departamento);
    AddLegendDpto();

    document.getElementById('selDepartamento').value = 'all';
    document.getElementById('selSector').value = 'all';
    document.getElementById('selTipoSociedad').value = 'all';
    document.getElementById('selAlcance').value = 'all';
    document.getElementById('buscarPalabra').value = '';

    // Recupera el listado inicial
    filtroDataDptoPunto = JSON.parse(JSON.stringify(sociedad_departamento));
    $("#total_places").text(0);

    //$(".divinfo")[0].hidden = false;

    sociedad_departamento_layer = renderMarkersData(sociedad_departamento_geo, 5);
    mapSociedad.addLayer(sociedad_departamento_layer);

}

/**
 * [[filtra los hechos por las opciones del sidebar]]
 * @returns {boolean} filtra la capa de hechos 'filtroData'
 */
function filtrarTodo() {
    "use strict";

    var i,
        Dpto = document.getElementById('selDepartamento').value,
        Sector = document.getElementById('selSector').value,
        TipoSociedad = document.getElementById('selTipoSociedad').value,
        Alcance = document.getElementById('selAlcance').value,
        FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

    if ((Dpto !== 'all') || (Sector !== 'all') || (TipoSociedad !== 'all') || (Alcance !== 'all') || (FiltroTexto !== '')) {

        filtroDataDptoPunto = JSON.parse(JSON.stringify(sociedad_departamento_geo));
        filtroDataDptoPoly = JSON.parse(JSON.stringify(sociedad_departamento));

        if (Dpto !== 'all') {

            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.COD_DPTO === parseInt(Dpto);
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.COD_DPTO === parseInt(Dpto);
            });
        }

        if (Sector !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties["Sector"].toString().includes(Sector);
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a["Sector"].toString().includes(Sector);
            });

        }

        if (TipoSociedad !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties["Tipo de organización"].toString().includes(TipoSociedad);
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a["Tipo de organización"].toString().includes(TipoSociedad);
            });
        }

        if (Alcance !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties["Alcance de acción"].toString().includes(Alcance);
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a["Alcance de acción"].toString().includes(Alcance);
            });

        }

        if (FiltroTexto.toUpperCase() !== '') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                var k1 = a.properties["Nombre de la organización - Funcionario"].toUpperCase(),
                    k2 = a.properties["Sector"].toString().toUpperCase(),
                    k3 = a.properties["Tipo de organización"].toString().toUpperCase(),
                    k4 = a.properties["Alcance de acción"].toString().toUpperCase(),
                    k5 = a.properties["Municipio(s) de acción"].toString().toUpperCase(),
                    k6 = a.properties["Relevancia (DD.HH.)(Acciones de promoción, prevención, respuesta y/o incidencia en materia de DD.HH.)"].toString().toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto)) || (k6.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                var k1 = a["Nombre de la organización - Funcionario"].toUpperCase(),
                    k2 = a["Sector"].toString().toUpperCase(),
                    k3 = a["Tipo de organización"].toString().toUpperCase(),
                    k4 = a["Alcance de acción"].toString().toUpperCase(),
                    k5 = a["Municipio(s) de acción"].toString().toUpperCase(),
                    k6 = a["Relevancia (DD.HH.)(Acciones de promoción, prevención, respuesta y/o incidencia en materia de DD.HH.)"].toString().toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto)) || (k6.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

        }

        if (filtroDataDptoPunto.features.length > 0) {

            mapSociedad.eachLayer(function (layer) {
                mapSociedad.removeLayer(layer);
            });

            mapSociedad.addLayer(Stamen_Watercolor);
            mapSociedad.addLayer(positronLabels);

            filtroDataDptoPuntoLayer = renderMarkersData(filtroDataDptoPunto, 10);
            mapSociedad.addLayer(filtroDataDptoPuntoLayer);

            AddDatosDpto(filtroDataDptoPoly);
            AddLegendDpto();

            filtroDataDptoPuntoLayer.bringToFront();
            mapSociedad.fitBounds(DptosLayer.getBounds());

        }

        $("#total_places").text(filtroDataDptoPunto.features.length);
    } else {
        limpiarSeleccion();
    }

}

/**
 * [[Ventana de información]]
 * @param   {object}   feature [[Description]]
 * @param   {[[Type]]} layer   [[Description]]
 * @returns {boolean}  [[Description]]
 */
function popupHecho(feature, layer) {
    "use strict";    

    layer.on({
        click: function (e) {
            var tablaSociedad = '<table class="table table-striped table-bordered table-condensed">'

            $.each(feature.properties, function (key, value) {
                if (value !== "" && key !== ("COD_DPTO") && key !== ("LAT_DPTO") && key !== ("LONG_DPTO") && key !== ("Web")) {
                    tablaSociedad += '<tr><th>' + key + '</th><td>' + value + '</td></tr>';
                }
                else if (value !== "" && key === ("Web")) {
                    tablaSociedad += '<tr><th>' + key + "</th><td><a class='url-break' href='" + value + "' target='_blank'>" + value + "</a></td></tr>";
                }
            });

            tablaSociedad += '</tbody></table>';

            $("#feature-title").html('<center>' + feature.properties["Nombre de la organización - Funcionario"] + '</center>');
            $("#tablaDatos").html(tablaSociedad);
            $('#featureModal').modal('show');
        }
    });

    /*
    var TipoSociedad = feature.properties.TipoSociedad;
    var Municipio = feature.properties.MUNICIPIO;
    var Departamento = feature.properties.DEPARTAMENTO;
    var Annos = feature.properties.ANNO;
    var EsAgente = feature.properties.ESAGENTE;
    var Agente = feature.properties.AGENTE;
    var Alcance = feature.properties.GRUPOS.toString();

    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Tipo de Hecho</th><td>" + TipoSociedad + "</td></tr>" + "<tr><th>Fecha</th><td>" + Annos + "</td></tr>" + "<tr><th>Ubicación</th><td>" + Municipio + ', ' + Departamento + "</td></tr>" + "<tr><th>Tipo Alcance</th><td>" + Alcance + "</td></tr>" + "<tr><th>¿ Es Agente Estatal ?</th><td>" + EsAgente + "</td></tr>" + "<tr><th>Tipo de Agente</th><td>" + Agente + "</td></tr>" + "<table>";

    layer.on({
        click: function (e) {
            $("#feature-title").html('<center>' + TipoSociedad + '</center>');
            $("#feature-info").html(infobasica);

            $('.nav-tabs a[href="#feature-info"]').tab('show');
            $("#featureModal").modal("show");
        }
    });*/


}

function AddLegendDpto() {

    mapSociedad.removeControl(legendDpto);

    var TituloMapa = "Organizaciones de la Sociedad Civil" + '</br>' + 'por Departamentos';
    var unidadMapeo = " Org. Civil";

    legendDpto.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = DptosLayer.options.limits
        var colors = DptosLayer.options.colors
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
    legendDpto.addTo(mapSociedad);
}

function AddDatosDpto(datosUsar) {
    // Calcular los valores
    var dataDptos = dl.groupby('COD_DPTO').count().execute(datosUsar);

    var dataDptosHash = dataDptos.reduce(function (hash, item) {
        if (item.COD_DPTO) {
            hash[item.COD_DPTO] = isNaN(item.count) ? null : +item.count
        }
        return hash
    }, {});

    capaDepartamentos.features.forEach(function (item) {
        item.properties.VALOR = dataDptosHash[item.properties.COD_DEPTO] || null;
    })

    // Capa de Departamentos Base
    DptosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.VALOR == null)
        },
        style: styleDptos
    });

    DptosLayerBack.addData(capaDepartamentos);
    DptosLayerBack.addTo(mapSociedad);

    //console.log(capaDepartamentos);
    // Capa de Departamentos por Densidades
    DptosLayer = L.choropleth(capaDepartamentos, {
        filter: function (feature) {
            return (feature.properties.VALOR !== null)
        },
        valueProperty: 'VALOR',
        scale: ['yellow', 'green'],
        steps: clases,
        mode: metodo,
        style: {
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        }
    });
    DptosLayer.addTo(mapSociedad);
    mapSociedad.fitBounds(DptosLayer.getBounds());
}