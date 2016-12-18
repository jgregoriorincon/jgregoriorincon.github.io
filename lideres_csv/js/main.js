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

    var dataDptos = dl.groupby('COD_DPTO').count().execute(hechos_departamento);
    //dataDptos = JSON.parse(JSON.stringify(dataDptos));

    console.log(typeof dataDptos);

    var dataDptosHash = dataDptos.reduce(function (hash, item) {
        if (item.COD_DPTO) {
            hash[item.COD_DPTO] = isNaN(item.count) ? null : +item.count
        }
        return hash
    }, {});

    capaDepartamentos.features.forEach(function (item) {
        item.properties.VALOR = dataDptosHash[item.properties.COD_DEPTO] || null;
    })

    console.log(capaDepartamentos);

    DptosLayer = L.choropleth(capaDepartamentos, {
        filter: function (feature) {
            return (feature.properties.VALOR != null)
        },
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
            /*layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);*/
    layer.on('click', zoomToFeatureDptos);
        }
    });
    DptosLayer.addTo(map);

    //return;









    // Capa de Departamentos
    var DptosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.VALOR == null)
        },
        style: styleDptos/*,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.DEPTO, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);
            layer.on('click', zoomToFeatureDptos);
    }*/
    });

    DptosLayerBack.addData(capaDepartamentos);
    DptosLayerBack.addTo(map);

    hechos_departamento_layer = renderMarkersData(hechos_departamento_geo, 5);
    map.addLayer(hechos_departamento_layer);
    map.fitBounds(DptosLayer.getBounds());
    //map.setZoom(map.getZoom()+1);
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

    hechos_municipio_data = JSON.parse(JSON.stringify(hechos_municipio_geo));
    hechos_municipio_data.features = hechos_municipio_data.features.filter(function (a) {
        return a.properties.COD_DPTO == DptoSeleccionado;
    });

    hechos_municipio_layer = renderMarkersData(hechos_municipio_data, 5);
    map.addLayer(hechos_municipio_layer);
    map.fitBounds(MpiosLayer.getBounds());

    //document.getElementById('selDepartamento').value = DptoSeleccionado;
    //filtrarDepartamento();
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
            /*            return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "#FF7FAC",
                            color: "#FF7FAC",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.5
                        });*/
            return L.marker(latlng, {
                icon: eventoIcon
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
            return (feature.properties.COD_DANE === MpioSeleccionado)
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

    hechos_municipio_data = JSON.parse(JSON.stringify(hechos_municipio_geo));
    hechos_municipio_data.features = hechos_municipio_data.features.filter(function (a) {
        return a.properties.COD_MPIO === parseInt(MpioSeleccionado);
    });

    hechos_municipio_layer = renderMarkersData(hechos_municipio_data, 5);
    map.addLayer(hechos_municipio_layer);
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
    document.getElementById('selAnnos').value = 'all';
    document.getElementById('selTipoHecho').value = 'all';
    document.getElementById('selGrupo').value = 'all';
    document.getElementById('buscarPalabra').value = '';

    if (document.getElementById('selMunicipio').options.length > 1) {
        for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
            document.getElementById('selMunicipio').remove(i);
        }
    }

    // Recupera el listado inicial
    filtroDataDpto = JSON.parse(JSON.stringify(hechos_departamento));
    $("#total_places").text(0);

    $(".divinfo")[0].hidden = false;

    hechos_departamento_layer = renderMarkersData(hechos_departamento_geo, 5);
    map.addLayer(hechos_departamento_layer);
    map.fitBounds(hechos_departamento_layer.getBounds());
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

        filtroDataMpio = JSON.parse(JSON.stringify(hechos_municipio_geo));

        filtrarTodo();

    } else {
        if (document.getElementById('selMunicipio').options.length > 1) {
            for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }

        var Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Annos = document.getElementById('selAnnos').value,
            TipoHecho = document.getElementById('selTipoHecho').value,
            Grupo = document.getElementById('selGrupo').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

        if ((Dpto !== 'all') || (Mpio !== 'all') || (Annos !== 'all') || (TipoHecho !== 'all') || (Grupo !== 'all') || (FiltroTexto !== '')) {
            filtrarTodo();
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
        Annos = document.getElementById('selAnnos').value,
        TipoHecho = document.getElementById('selTipoHecho').value,
        Grupo = document.getElementById('selGrupo').value,
        FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

    if ((Dpto !== 'all') || (Mpio !== 'all') || (Annos !== 'all') || (TipoHecho !== 'all') || (Grupo !== 'all') || (FiltroTexto !== '')) {

        filtroDataDpto = JSON.parse(JSON.stringify(hechos_departamento_geo));
        filtroDataMpio = JSON.parse(JSON.stringify(hechos_municipio_geo));

        if (Dpto !== 'all') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                return a.properties.COD_DPTO === parseInt(Dpto);
            });
            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    return a.properties.COD_DPTO === parseInt(Dpto);
                });
            }
        }

        if (Mpio !== 'all') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                return a.properties.COD_MPIO === parseInt(Mpio);
            });
            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    return a.properties.COD_MPIO === parseInt(Mpio);
                });
            }
        }

        if (Annos !== 'all') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                return a.properties.ANNO === parseInt(Annos);
            });
            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    return a.properties.ANNO === parseInt(Annos);
                });
            }
        }

        if (TipoHecho !== 'all') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                return a.properties.TIPOHECHO === TipoHecho;
            });
            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    return a.properties.TIPOHECHO === TipoHecho;
                });
            }
        }

        if (Grupo !== 'all') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                if (a.properties.GRUPOS.length > 0) {
                    for (i = 0; i < a.properties.GRUPOS.length; i++) {
                        if (a.properties.GRUPOS[i] === Grupo) {
                            return true;
                        }
                    }
                }
                return false;
            });

            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    if (a.properties.GRUPOS.length > 0) {
                        for (i = 0; i < a.properties.GRUPOS.length; i++) {
                            if (a.properties.GRUPOS[i] === Grupo) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
            }
        }

        /*
        if (Grupo !== 'all') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                return a.properties.GRUPOS === Grupo;
            });
            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    return a.properties.GRUPOS === Grupo;
                });
            }
        }


                

                if (Territorial !== 'all') {

                    filtroData.features = filtroData.features.filter(function (a) {
                        if (a.properties.NIVEL_TERRITORIAL.length > 0) {
                            for (i = 0; i < a.properties.NIVEL_TERRITORIAL.length; i++) {
                                if (a.properties.NIVEL_TERRITORIAL[i] === Territorial) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });

                }
*/

        if (FiltroTexto.toUpperCase() !== '') {
            filtroDataDpto.features = filtroDataDpto.features.filter(function (a) {
                var k1 = a.properties.DEPARTAMENTO.toUpperCase(),
                    k2 = a.properties.MUNICIPIO.toUpperCase(),
                    k3 = a.properties.TIPOHECHO.toUpperCase(),
                    k4 = a.properties.GRUPOS.toString().toUpperCase(),
                    k5 = a.properties.ANNO.toString();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });
/*
            if (filtroDataMpio !== undefined) {
                filtroDataMpio.features = filtroDataMpio.features.filter(function (a) {
                    var k1 = a.properties.nombre.toUpperCase(),
                        k2 = a.properties.municipio.toUpperCase(),
                        k3 = a.properties.organizacion_politica.toUpperCase(),
                        k4 = a.properties.observaciones.toString().toUpperCase();

                    if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto))) {
                        return true;
                    } else {
                        return false;
                    }
                });
        }*/
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
        }

        $("#total_places").text(filtroDataDpto.features.length);
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
function popupEvento(feature, layer) {
    "use strict";

    var TipoHecho = feature.properties.TIPOHECHO;
    var Municipio = feature.properties.MUNICIPIO;
    var Departamento = feature.properties.DEPARTAMENTO;
    var Annos = feature.properties.ANNO;
    var EsAgente = feature.properties.ESAGENTE;
    var Agente = feature.properties.AGENTE;
    var Grupo = feature.properties.GRUPOS.toString();

    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Tipo de Hecho</th><td>" + TipoHecho + "</td></tr>" + "<tr><th>Fecha</th><td>" + Annos + "</td></tr>" + "<tr><th>Ubicación</th><td>" + Municipio + ', ' + Departamento + "</td></tr>" + "<tr><th>Tipo Grupo</th><td>" + Grupo + "</td></tr>" + "<tr><th>¿ Es Agente Estatal ?</th><td>" + EsAgente + "</td></tr>" + "<tr><th>Tipo de Agente</th><td>" + Agente + "</td></tr>" + "<table>";

    layer.on({
        click: function (e) {
            $("#feature-title").html('<center>' + TipoHecho + '</center>');
            $("#feature-info").html(infobasica);

            $('.nav-tabs a[href="#feature-info"]').tab('show');
            $("#featureModal").modal("show");
        }
    });
}