var datos = $.getJSON("data/valores.json", function () {})
    .done(function () {
        console.log("Cargados Datos ");
        with(datos.responseJSON) {
            cargarBarrios(datosSM, TituloMapa, unidadMapeo, primerColor, segundoColor, transparencia);
        }
    })
    .fail(function () {
        console.log("Error Datos");
    });