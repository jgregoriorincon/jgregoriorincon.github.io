var dataDptosHash;
var dataMpiosHash;

var dataDptos = $.getJSON("data/Dptos_Valores.json", function () {})
    .done(function () {
        console.log("Cargados Datos Departamentos");

        dataDptosHash = dataDptos.responseJSON.reduce(function (hash, item) {
            if (item.COD_DEPTO) {
                hash[item.COD_DEPTO] = isNaN(item.VALOR) ? null : +item.VALOR
            }
            return hash
        }, {})

        console.log(dataDptosHash);
    })
    .fail(function () {
        console.log("Error Departamentos");
    });

var dataMpios = $.getJSON("data/Mpios_Valores.json", function () {})
    .done(function () {
        console.log("Cargados Datos Municipales");

        dataMpiosHash = dataMpios.responseJSON.reduce(function (hash, item) {
            if (item.COD_DANE) {
                hash[item.COD_DANE] = isNaN(item.VALOR) ? null : +item.VALOR
            }
            return hash
        }, {})

        console.log(dataMpiosHash);
    })
    .fail(function () {
        console.log("Error Mpios");
    });