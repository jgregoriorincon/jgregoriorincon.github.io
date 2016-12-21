var datosSM = $.getJSON("data/valores.json", function () {})
    .done(function () {
        console.log("Cargados Datos ");
        cargarBarrios();
    })
    .fail(function () {
        console.log("Error Datos");
    });

var TituloMapa = "Indice de Seguridad de la Ciudad de Santa Marta</br>Año 2016";
var unidadMapeo = "";