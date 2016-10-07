// Basemaps disponibles, pueden quitarse y dejar uno solo, esta por defecto el gris que contrasta mejor con el mapa de calor
var baseMaps = {
    "OSM": OpenStreetMap_Mapnik,
    "Calles": Esri_WorldStreetMap, 
    "Gris": cartoLight
};

// Mapa asociado a los atributos de la variable InfoMapaV2 
var mapHeat = L.map("mapHeat", {
    zoom: InfoMapaV2.zoom,
    center: [InfoMapaV2.Lat, InfoMapaV2.Lon],
    layers: [OpenStreetMap_Mapnik, Esri_WorldStreetMap, cartoLight],
    zoomControl: true,
    attributionControl: false,
    maxZoom: 18, 
    minZoom: 12
});

// Se adicionan los basemaps al mapa
L.control.layers(baseMaps).addTo(mapHeat);

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
var heatMap = L.heatLayer(geoData, {
    radius: 15,
    blur: 15,
    maxZoom: 19
})

// Se adiciona el mapa de calor como un Layer
mapHeat.addLayer(heatMap);

// Funcion que convierte el GeoJSON en geodatos
function geoJson2heat(geojson, intensity) {
    return geojson.features.map(function (feature) {
        return [parseFloat(feature.geometry.coordinates[1]), parseFloat(feature.geometry.coordinates[0]), intensity];
    });
}