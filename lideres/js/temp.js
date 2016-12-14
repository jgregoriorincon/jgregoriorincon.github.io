






/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleMpios(feature) {
    "use strict";
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.2,
        fillColor: "#f0f"
    };
}











/**
 * Genera Cluster Inicial
 * @param   {[[Type]]} data             Informacion a usar
 * @param   {[[Type]]} distancia = 1500 Distancia para unificar
 * @returns {[[Type]]} [[Description]]
 */
function renderMarkersBase(data, distancia = 1500) {

    var cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: distancia,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 19
    });

    var layer = L.geoJson(data);
    layer.setZIndex(1002);
    cluster.addLayer(layer);
    return cluster;
}



/**
 * [[Ventana de información]]
 * @param   {object}   feature [[Description]]
 * @param   {[[Type]]} layer   [[Description]]
 * @returns {boolean}  [[Description]]
 */
function popupObservatorio(feature, layer) {
    "use strict";

    var Telefono = feature.properties.TELEFONO;
    var TelefonoStr = '';
    if (Telefono.length > 0) {
        Telefono.forEach(function (entry) {
            TelefonoStr += entry + '<br />';
        });
    }

    var Correo = feature.properties.CORREO;
    var CorreoStr = '';
    if (Correo.length > 0) {
        Correo.forEach(function (entry) {
            CorreoStr += entry + '<br />';
        });
    }

    var logo = "<center><img class='imgLogo' src='images/" + feature.properties.IDENTIFICADOR + ".png' alt='" + feature.properties.OBSERVATORIO + "' style='height:100px;'></center>";
    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Tipo Observatorio</th><td>" + feature.properties.SECTOR + "</td></tr>" + "<tr><th>Dirección</th><td>" + feature.properties.DIRECCION + '<br/>' + feature.properties.MUNICIPIO + ', ' + feature.properties.DEPARTAMENTO + "</td></tr>" + (TelefonoStr == '' ? '' : "<tr><th>Teléfono</th><td>" + TelefonoStr + "</td></tr>") + (CorreoStr == '' ? '' : "<tr><th>Correo Electrónico</th><td>" + CorreoStr + "</td></tr>") + (feature.properties.SITIO_WEB == '' ? '' : "<tr><th>Web</th><td><a class='url-break' href='" + feature.properties.SITIO_WEB + "' target='_blank'>" + feature.properties.SITIO_WEB + "</a></td></tr>") + (feature.properties.FACEBOOK == '' ? '' : "<tr><th>Facebook</th><td>" + feature.properties.FACEBOOK + "</td></tr>") + (feature.properties.TWITER == '' ? '' : "<tr><th>Twitter</th><td>" + feature.properties.TWITER + "</td></tr>") + "<table>";

    var tematicas = feature.properties.TEMATICA;
    var tematicasStr = '';
    if (tematicas.length > 0) {
        tematicas.forEach(function (entry) {
            tematicasStr += entry + '<br />';
        });
    }

    var territorial = feature.properties.NIVEL_TERRITORIAL;
    var territorialStr = '';
    if (territorial.length > 0) {
        territorial.forEach(function (entry) {
            territorialStr += entry + '<br />';
        });
    }

    var tipoinformacion = feature.properties.TIPO_INFORMACION;
    var tipoinformacionStr = '';
    if (tipoinformacion.length > 0) {
        tipoinformacion.forEach(function (entry) {
            tipoinformacionStr += entry + '<br />';
        });
    }

    var productos = feature.properties.PRODUCTOS;
    var productosStr = productos;

    layer.on({
        click: function (e) {
            $("#feature-title").html('<center>' + feature.properties.OBSERVATORIO + '</center>');
            $("#logoObservatorio").html(logo);
            $("#feature-info").html(infobasica);

            $("#tematicas").html(tematicasStr);
            tematicasStr == '' || tematicasStr == '<br />' ? $('#tematicasTab').attr('class', 'disabled') : $('#tematicasTab').attr('class', '');
            $('#tematicasTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $("#territorial").html(territorialStr);
            territorialStr == '' || territorialStr == '<br />' ? $('#territorialTab').attr('class', 'disabled') : $('#territorialTab').attr('class', '');
            $('#territorialTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $("#tipoinformacion").html(tipoinformacionStr);
            tipoinformacionStr == '' || tipoinformacionStr == '<br />' ? $('#tipoinformacionTab').attr('class', 'disabled') : $('#tipoinformacionTab').attr('class', '');
            $('#tipoinformacionTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $("#productos").html(productosStr);
            productosStr == '' || productosStr == '<br />' ? $('#productosTab').attr('class', 'disabled') : $('#productosTab').attr('class', '');
            $('#productosTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $('.nav-tabs a[href="#feature-info"]').tab('show');
            $("#featureModal").modal("show");
        }
    });
}