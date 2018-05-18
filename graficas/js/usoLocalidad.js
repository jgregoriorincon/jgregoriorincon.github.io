var Localidad = [];
var datosUso = [];

var graphDiv1 = document.getElementById('graph1');

$(document).ready(function () {

    Papa.parse("data/Data0.csv", {
        download: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        header: true,
        complete: function (parsed) {

            Localidad = unpack(parsed.data, 'Localidad');

            $.each(Localidad, function () {
                $("#localidadSelector").append($("<option />").val(this).text(this));
            });

            $('#localidadSelector').on('change', function () {
                graphUso($('#localidadSelector').val());
            });

            Papa.parse("data/Data5.csv", {
                download: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                header: true,
                complete: function (parsed) {
                    datosUso = parsed.data;

                    $("#localidadSelector").val($("#localidadSelector option:first").val()).trigger("change");

                }
            });
        }
    });
});

function graphUso(chooseLocalidad) {
    var datosUsoLocalidad = datosUso.filter(function (dato) {
        return dato.Localidad == chooseLocalidad;
    });

    console.table(datosUsoLocalidad);
    var Uso = unpack(datosUsoLocalidad, 'Uso');
    var areaConstruida = unpack(datosUsoLocalidad, 'AreaConstruida');

    bubbleSortAscending(areaConstruida, Uso);

    var data = [];
    for (var i = 0; i < Uso.length; i++) {
        var trace1 = {
            y: [chooseLocalidad],
            x: [areaConstruida[i]],
            name: Uso[i],
            type: 'bar',
            orientation: 'h'
        };
        data.push(trace1);
    }

    layout = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'stack',
        barnorm: '',
        margin: {
            l: 50,
            t: 50,
            b: 50,
            pad: 0
        },
        font: {
            color: '#fff'
        },
        hovermode: 'closest',
        hoverlabel: {
            bgcolor: 'white',
            font: {
                color: 'black'
            }
        },
        showlegend: false,
        title: 'Participación del uso predominante del área construida',
        width: window.innerWidth - 50,
        height: window.innerHeight / 4,
        xaxis: {
            autorange: true,
            type: 'linear',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            title: ''
        },
        yaxis: {
            autorange: true,
            type: 'category',
            zerolinecolor: '#fff',
            title: ''

        }
    };
    Plotly.newPlot(graphDiv1, data,
        layout, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });
}