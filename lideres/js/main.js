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
    }).addTo(map);

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

    map.addControl(new volver());

    map.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>&copy;');

    // control that shows state info on hover
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'panel panel-primary divinfo text-right'); // 'info popup');
        this.update();
        return this._div;
    };

    info.update = function (props) {

        var strInstrucciones = '<div><div class="alert alert-info margin-5" id="left" > De clic en los iconos de los eventos para obtener más información sobre estos. </div> <div id="right" ><span class="fa fa-map-marker fa-2x text-info aria-hidden="true"></span> </div></div>';

        var strEncabezado = '<div class="panel-body text-right">';

        var finalHTML = strEncabezado + strInstrucciones + '</div>';

        this._div.innerHTML = finalHTML === '' ? '' : finalHTML;

    };

    info.addTo(map);
    $('[data-toggle="tooltip"]').tooltip();

    // Capa de Departamentos
    DptosLayer = L.geoJson(undefined, {
        style: styleDptos,
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

    DptosLayer.addData(capaDepartamentos);
    DptosLayer.addTo(map);

    violencia_selectiva_departamento_layer = renderMarkersData(violencia_selectiva_departamento_geo, 5);
    map.addLayer(violencia_selectiva_departamento_layer);
    map.fitBounds(violencia_selectiva_departamento_layer.getBounds());
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
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleDptos);
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
    DptoSeleccionado = layer.feature.properties.COD_DEPTO;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(Stamen_Watercolor);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.COD_DEPTO == DptoSeleccionado)
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

    MpiosLayer.addData(capaMunicipios);
    map.addLayer(MpiosLayer);

    violencia_selectiva_municipio_data = JSON.parse(JSON.stringify(violencia_selectiva_municipio_geo));
    violencia_selectiva_municipio_data.features = violencia_selectiva_municipio_data.features.filter(function (a) {
        return a.properties.Cod_DANE_Dep == DptoSeleccionado;
    });

    violencia_selectiva_municipio_layer = renderMarkersData(violencia_selectiva_municipio_data, 5);
    map.addLayer(violencia_selectiva_municipio_layer);
    map.fitBounds(MpiosLayer.getBounds());

}

// EVENTOS
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
                popupEvento(feature, layer);
            }
        },

        pointToLayer: function (feature, latlng) {

            var IconoUsar;

            switch (feature.properties.accion) {
                case "Amenaza":
                    IconoUsar = AmenazaIcon;
                    break;
                case "Atentado":
                    IconoUsar = AtentadoIcon;
                    break;
                case "Desalojo":
                    IconoUsar = DesalojoIcon;
                    break;
                case "Desaparición forzada":
                    IconoUsar = DesaparicionIcon;
                    break;
                case "Desplazamiento forzado":
                    IconoUsar = DesplazamientoIcon;
                    break;
                case "Detención arbitraria":
                    IconoUsar = DetencionIcon;
                    break;
                case "Ejecución extrajudicial":
                    IconoUsar = EjecucionIcon;
                    break;
                case "Extorsión":
                    IconoUsar = ExtorsionIcon;
                    break;
                case "Homicidio":
                    IconoUsar = HomicidioIcon;
                    break;
                case "Hostigamiento":
                    IconoUsar = HostigamientoIcon;
                    break;
                case "Secuestro":
                    IconoUsar = SecuestroIcon;
                    break;
                case "Tortura":
                    IconoUsar = TorturaIcon;
                    break;
                default:
                    IconoUsar = eventoIcon;
            }

            return L.marker(latlng, {
                icon: IconoUsar
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

// Resaltado
function highlightFeatureMpios(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    var layer = e.target;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    MpioSeleccionado = layer.feature.properties.COD_DANE;
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(Stamen_Watercolor);
    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.COD_DANE == MpioSeleccionado)
        },
        style: styleDptos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeatureMpios);
            //layer.on('mouseout', resetHighlightMpios);
            //layer.on('click', zoomToFeatureMpios);
        }
    })

    MpiosLayer.addData(capaMunicipios);
    map.addLayer(MpiosLayer);
    map.addLayer(positronLabels);

    violencia_selectiva_municipio_data = JSON.parse(JSON.stringify(violencia_selectiva_municipio_geo));
    violencia_selectiva_municipio_data.features = violencia_selectiva_municipio_data.features.filter(function (a) {
        return a.properties.Cod_DANE_Mun == MpioSeleccionado;
    });

    violencia_selectiva_municipio_layer = renderMarkersData(violencia_selectiva_municipio_data, 5);
    map.addLayer(violencia_selectiva_municipio_layer);
    map.fitBounds(MpiosLayer.getBounds());
}

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

    map.setView(new L.LatLng(4.5, -73.0), 6);
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(Stamen_Watercolor);
    map.addLayer(positronLabels);
    map.addLayer(DptosLayer);

    document.getElementById('selDepartamento').value = 'all';
    document.getElementById('selMunicipio').value = 'all';
    document.getElementById('selTipoAccion').value = 'all';
    document.getElementById('selTipoLider').value = 'all';
    document.getElementById('selResponsable').value = 'all';
    document.getElementById('buscarPalabra').value = '';

    fechaInicial = startFechaTotal;
    fechaFinal = endFecha;
    cb(startFechaTotal, endFecha);

    if (document.getElementById('selMunicipio').options.length > 1) {
        for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
            document.getElementById('selMunicipio').remove(i);
        }
    }

    // Recupera el listado inicial
    filtroDataDpto = JSON.parse(JSON.stringify(violencia_selectiva_departamento));
    $("#total_places").text(0);

    $(".divinfo")[0].hidden = false;

    violencia_selectiva_departamento_layer = renderMarkersData(violencia_selectiva_departamento_geo, 5);
    map.addLayer(violencia_selectiva_departamento_layer);
    map.fitBounds(violencia_selectiva_departamento_layer.getBounds());
}

/**
 * Recupera la seleccion del departamento y carga la lista de municipios asociados
 * @returns {string} la lista de municipios
 */
function filtrarDepartamento() {
    "use strict";

    var i, Mpios, lista, html, Dpto = $('#selDepartamento').val();

    if (Dpto !== 'all') {
        Mpios = listaMunicipios[Dpto] || [];
        lista = "<option value='all'>Todos</option>";
        html = lista + $.map(Mpios, function (Mpio) {
            return '<option value="' + Mpio.CODIGO + '">' + Mpio.NOMBRE + '</option>';
        }).join('');

        $("#selMunicipio").html(html);

        //filtroDataMpio = JSON.parse(JSON.stringify(violencia_selectiva_municipio_geo));

        filtrarTodo();

    } else {
        if (document.getElementById('selMunicipio').options.length > 1) {
            for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }

        var Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Sector = document.getElementById('selTipoAccion').value,
            Tematica = document.getElementById('selTipoLider').value,
            Territorial = document.getElementById('selResponsable').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

        if ((Dpto !== 'all') || (Mpio !== 'all') || (Sector !== 'all') || (Tematica !== 'all') || (Territorial !== 'all') || (FiltroTexto !== '')) {
            // No hace nada
        } else {
            limpiarSeleccion();
        }
    }
}

/**
 * [[filtra los eventos por las opciones del sidebar]]
 * @returns {boolean} filtra la capa de eventos 'filtroData'
 */
function filtrarTodo() {
    "use strict";

    var i,
        Dpto = document.getElementById('selDepartamento').value,
        Mpio = document.getElementById('selMunicipio').value,
        TipoAccion = document.getElementById('selTipoAccion').value,
        TipoLider = document.getElementById('selTipoLider').value,
        Responsable = document.getElementById('selResponsable').value,
        FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

    //if ((Dpto !== 'all') || (Mpio !== 'all') || (TipoAccion !== 'all') || (TipoLider !== 'all') || (Responsable !== 'all') || (FiltroTexto !== '')) {

    filtroDataDpto = JSON.parse(JSON.stringify(violencia_selectiva_departamento_geo));
    filtroDataMpio = JSON.parse(JSON.stringify(violencia_selectiva_municipio_geo));

    if (Dpto !== 'all') {

        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            return a.properties.Cod_DANE_Dep === parseInt(Dpto);
        });
        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                return a.properties.Cod_DANE_Dep === parseInt(Dpto);
            });
        }
    }

    if (Mpio !== 'all') {
        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            return a.properties.Cod_DANE_Mun === parseInt(Mpio);
        });
        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                return a.properties.Cod_DANE_Mun === parseInt(Mpio);
            });
        }
    }

    if (TipoAccion !== 'all') {
        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            return a.properties.accion === TipoAccion;
        });
        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                return a.properties.accion === TipoAccion;
            });
        }
    }

    if (TipoLider !== 'all') {
        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            return a.properties.tipo_victima === TipoLider;
        });
        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                return a.properties.tipo_victima === TipoLider;
            });
        }
    }

    if (Responsable !== 'all') {
        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            return a.properties.reponsable === Responsable;
        });
        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                return a.properties.reponsable === Responsable;
            });
        }
    }

    if (FiltroTexto.toUpperCase() !== '') {
        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            var k1 = a.properties.nombre.toUpperCase(),
                k2 = a.properties.municipio.toUpperCase(),
                k3 = a.properties.organizacion_politica.toUpperCase(),
                k4 = a.properties.observaciones.toUpperCase();

            if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto))) {
                return true;
            } else {
                return false;
            }
        });

        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                var k1 = a.properties.nombre.toUpperCase(),
                    k2 = a.properties.municipio.toUpperCase(),
                    k3 = a.properties.organizacion_politica.toUpperCase(),
                    k4 = a.properties.observaciones.toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    }

    /*console.log(fechaInicial);
    console.log(fechaFinal);
    console.log(filtroDataDpto.features.length);*/

    //Filtro por fecha
    if (true) {
        filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
            var fechaEvento = moment(a.properties.anno.toString() + '-' + a.properties.mes.toString(), "YYYY-MM");
            return (moment(fechaEvento).isSameOrBefore(fechaFinal, 'month') && moment(fechaEvento).isSameOrAfter(fechaInicial, 'month'));
        });

        if (filtroDataMpio !== undefined) {
            filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                if (a.properties.id_violencia_selectiva === "") {
                    return false;
                } else {
                    var fechaEvento = moment(a.properties.anno.toString() + '-' + a.properties.mes.toString(), "YYYY-MM");
                    return (moment(fechaEvento).isSameOrBefore(fechaFinal, 'month') && moment(fechaEvento).isSameOrAfter(fechaInicial, 'month'));
                }
            });

        }
    }

    if (filtroDataDpto.features.length > 0) {

        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });

        map.addLayer(Stamen_Watercolor);
        map.addLayer(positronLabels);

        if ((Mpio !== 'all')) {
            filtroDataMpioLayer = renderMarkersData(filtroDataMpio, 10);
            map.addLayer(filtroDataMpioLayer);

            var MpiosLayerFiltro = L.geoJson(undefined, {
                filter: function (feature) {
                    return (feature.properties.COD_DANE == Mpio)
                },
                style: styleDptos,
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(feature.properties.NOMBRE, {
                        permanent: false,
                        direction: "auto"
                    });
                }
            });
            // Adiciona las capas
            MpiosLayerFiltro.addData(capaMunicipios);
            MpiosLayerFiltro.addTo(map);
            map.fitBounds(MpiosLayerFiltro.getBounds());

            filtroDataMpioLayer.bringToFront();
        } else if ((Dpto !== 'all')) {
            filtroDataMpioLayer = renderMarkersData(filtroDataMpio, 10);
            map.addLayer(filtroDataMpioLayer);

            var MpiosLayerFiltro = L.geoJson(undefined, {
                filter: function (feature) {
                    return (feature.properties.COD_DEPTO == Dpto)
                },
                style: styleDptos,
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(feature.properties.NOMBRE, {
                        permanent: false,
                        direction: "auto"
                    });
                }
            });
            // Adiciona las capas
            MpiosLayerFiltro.addData(capaMunicipios);
            MpiosLayerFiltro.addTo(map);
            map.fitBounds(MpiosLayerFiltro.getBounds());

            filtroDataMpioLayer.bringToFront();
        } else {

            filtroDataDptoLayer = renderMarkersData(filtroDataDpto, 10);
            map.addLayer(filtroDataDptoLayer);
            map.fitBounds(filtroDataDptoLayer.getBounds());

            DptosLayer.addTo(map);

            filtroDataDptoLayer.bringToFront();
        }
        $(".divinfo")[0].hidden = true;
        //map.setZoom(map.getZoom() - 1);
    } else {
        map.setView(new L.LatLng(4.5, -73.0), 6);
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        map.addLayer(Stamen_Watercolor);
        map.addLayer(positronLabels);
        map.addLayer(DptosLayer);
    }

    $("#total_places").text(filtroDataDpto.features.length);
}

/**
 * [[Ventana de información]]
 * @param   {object}   feature [[Description]]
 * @param   {[[Type]]} layer   [[Description]]
 * @returns {boolean}  [[Description]]
 */
function popupEvento(feature, layer) {
    "use strict";

    var Fecha = feature.properties.dia + "/" + feature.properties.mes + "/" + feature.properties.anno;
    var Nombre = feature.properties.nombre;
    var Municipio = feature.properties.municipio;
    var Departamento = feature.properties.departamento;
    var TipoAccion = feature.properties.accion;
    var TipoLider = feature.properties.tipo_victima;
    var Organizacion = feature.properties.organizacion_politica;
    var Responsable = feature.properties.reponsable;
    var Observaciones = feature.properties.observaciones;
    var Fuente = feature.properties.fuente;

    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Fecha</th><td>" + Fecha + "</td></tr>" + "<tr><th>Ubicación</th><td>" + Municipio + ', ' + Departamento + "</td></tr>" + "<tr><th>Acción</th><td>" + TipoAccion + "</td></tr>" + "<tr><th>Tipo Víctima</th><td>" + TipoLider + "</td></tr>" + "<tr><th>Organización Politica</th><td>" + Organizacion + "</td></tr>" + "<tr><th>Responsable</th><td>" + Responsable + "</td></tr>" + "<tr><th>Fuente</th><td><a class='url-break' href='" + Fuente + "' target='_blank'>" + Fuente + "</a></td></tr>" + "<table>";

    layer.on({
        click: function (e) {
            $("#feature-title").html('<center>' + Nombre + '</center>');
            $("#feature-info").html(infobasica);

            $("#Observaciones").html(Observaciones);

            $('.nav-tabs a[href="#feature-info"]').tab('show');
            $("#featureModal").modal("show");
        }
    });
}