function setBasemap(basemap) {
    if (layer) {
        map.removeLayer(layer);
    }
    if (basemap === 'OpenStreetMap') {
        layer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    } else {
        layer = L.esri.basemapLayer(basemap);
    }
    map.addLayer(layer);
    if (layerLabels) {
        map.removeLayer(layerLabels);
    }

    if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
        layerLabels = L.esri.basemapLayer(basemap + 'Labels');
        map.addLayer(layerLabels);
    }

    // add world transportation service to Imagery basemap
    if (basemap === 'Imagery') {
        worldTransportation.addTo(map);
    } else if (map.hasLayer(worldTransportation)) {
        // remove world transportation if Imagery basemap is not selected    
        map.removeLayer(worldTransportation);
    }
}

L.control.zoom({
    position: 'topleft'
}).addTo(map);

L.control.defaultExtent().addTo(map);

// L.control.Home({
//     position: 'topleft'
// }).addTo(map);

//var searchControl = L.esri.Geocoding.Controls.geosearch({expanded: true, collapseAfterResult: false, zoomToResult: false}).addTo(map);
var searchControl = L.esri.Geocoding.geosearch({
    expanded: false,
    collapseAfterResult: true,
    zoomToResult: false
}).addTo(map);

searchControl.on('results', function (data) {
    if (data.results.length > 0) {
        var popup = L.popup()
            .setLatLng(data.results[0].latlng)
            .setContent(data.results[0].text)
            .openOn(map);
        map.setView(data.results[0].latlng)
    }
})

$(document).ready(function () {
    // Basemap changed
    $("#selectStandardBasemap").on("change", function (e) {
        setBasemap($(this).val());
    });

    // Paises changed
    $("#selectFiltroPaises").on("change", function (e) {
        console.log($(this).val());
    });

    // Departamentos changed
    $("#selectFiltroDpto").on("change", function (e) {
        console.log($(this).val());
    });

    // Search
    var input = $(".geocoder-control-input");
    input.focus(function () {
        $("#panelSearch .panel-body").css("height", "150px");
    });
    input.blur(function () {
        $("#panelSearch .panel-body").css("height", "auto");
    });

    // Attach search control for desktop or mobile
    function attachSearch() {
        var parentName = $(".geocoder-control").parent().attr("id"),
            geocoder = $(".geocoder-control"),
            width = $(window).width();
        if (width <= 767 && parentName !== "geocodeMobile") {
            geocoder.detach();
            $("#geocodeMobile").append(geocoder);
        } else if (width > 767 && parentName !== "geocode") {
            geocoder.detach();
            $("#geocode").append(geocoder);
        }
    }

    $(window).resize(function () {
        attachSearch();
    });

    attachSearch();

    createDataGeo();
    map.addLayer(geoLayerProyectosPaises);
}); //<!-- jQuery -->