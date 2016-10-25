var Localidad, Nombre, Codigo;
var barriosSMLayer;

var densidadLayer;
// Variable del Cluster
var clusterHechos = L.markerClusterGroup();

// Mapa asociado a los atributos de la variable InfoMapaV2 
var mapHeat = L.map("mapHeat", {
    zoom: InfoMapaV2.zoom,
    center: [InfoMapaV2.Lat, InfoMapaV2.Lon],
    zoomControl: true,
    attributionControl: true,
    maxZoom: 18,
    minZoom: 12
});

cartoLight.addTo(mapHeat);

// Controles
L.control.defaultExtent().addTo(mapHeat);

var control = L.control.zoomBox({
    modal: true
});
mapHeat.addControl(control);

mapHeat.attributionControl.addAttribution('Observatorio Distrital de Seguridad y Convivencia &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
/* --------------------------------------------------------------- */

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        cargarHeat();
        cargarCluster();

        // Se adiciona el mapa de calor como un Layer
        mapHeat.addLayer(densidadLayer);

        var baseLayers = {
            "Mapa de Calor": densidadLayer,
            "Mapa de Cluster": clusterHechos
        };

        L.control.layers(baseLayers, null, {
            collapsed: false
        }).addTo(mapHeat);
    }
};

function cargarHeat() {
    // Se parsean los datos de InfoMapaV2 en un GeoJSON
    var eventos = GeoJSON.parse(InfoMapaV2.infoMapa, {
        Point: ['Lat', 'Lon']
    });

    // Se llama a la funcion geoJson2heat, que esta en la parte inferior
    // se le pasan como argumentos los puntos y la intensidad
    // La cual va de 0.0 a 1.0
    var geoData = geoJson2heat(eventos, 0.7);

    // Se define el mapa de calor, con los geodatos
    // radius: Ancho de cada punto en el mapa, por defecto 25, pero 15 me parecio adecuado
    // blur: La cantidad d desenfoque
    densidadLayer = L.heatLayer(geoData, {
        radius: 15,
        blur: 15,
        maxZoom: 19
    })

}

function cargarCluster() {
    // Se parsean los datos de InfoMapaV2 en un GeoJSON
    var eventos = GeoJSON.parse(InfoMapaV2.infoMapa, {
        Point: ['Lat', 'Lon']
    });

    // elementos geográficos
    var hechos = L.geoJson(eventos, {
        pointToLayer: function (feature, latlng) {

            var smallIcon = L.icon({
                iconSize: [27, 27],
                iconAnchor: [13, 27],
                popupAnchor: [1, -24],
                iconUrl: feature.properties.Icono
            });

            var marker = L.marker(latlng, {
                icon: smallIcon
            });

            return marker;
        }
    });

    // Adicionar los hechos al cluster
    clusterHechos.addLayer(hechos);
}

// Funcion que convierte el GeoJSON en geodatos
function geoJson2heat(geojson, intensity) {
    return geojson.features.map(function (feature) {
        return [parseFloat(feature.geometry.coordinates[1]), parseFloat(feature.geometry.coordinates[0]), intensity];
    });
}

function borrarDatos() {
    mapHeat.eachLayer(function (layer) {
        mapHeat.removeLayer(layer);
    });
    cartoLight.addTo(mapHeat);
}

function recargarDatos() {
    cargarHeat();
}