var csvfile = "data/Dptos_Valores.csv",
        strDatosDensidad = "";

    jQuery.ajax({
        url: csvfile,
        success: function (data) {
            strDatosDensidad = data;
        },
        async: false
    });
