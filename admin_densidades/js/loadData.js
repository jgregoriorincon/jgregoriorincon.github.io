var dataDptos = $.getJSON("data/Dptos_Valores.json", function () {})
    .done(function () {
        console.log("Cargados Datos Departamentos");
    })
    .fail(function () {
        console.log("Error Departamentos");
    });

var dataMpios = $.getJSON("data/Mpios_Valores.json", function () {})
    .done(function () {
        console.log("Cargados Datos Municipales");
    })
    .fail(function () {
        console.log("Error Mpios");
    });

var TituloMapa = "Densidad de Homicidios por Departamento</br>Año 2015";
var unidadMapeo = " %";