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
                    updateUso();
                    $("#localidadSelector").val($("#localidadSelector option:first").val()).trigger("change");

                }
            });
        }
    });
});

function updateUso() {
    var tipoUso = ['BODEGAS', 'CLINICAS, HOSPITALES, CENTROS MÉDICOS', 'COMERCIO', 'HOTELES', 'INDUSTRIA', 'OFICINAS', 'UNIVERSIDADES Y COLEGIOS', 'RESIDENCIAL', 'OTROS'];

    for (var index1 = 0; index1 < tipoUso.length; index1++) {
        var nombreUso = tipoUso[index1];
        var UsoFiltrado = datosUso.filter(function (Uso) {
            return Uso.Uso == nombreUso;
        });

        var allData = [0, 0, 0];
        for (var index2 = 0; index2 < UsoFiltrado.length; index2++) {
            var valores = UsoFiltrado[index2];
            allData[0] += parseInt(valores.NumeroPredios);
            allData[1] += parseFloat(valores.AreaConstruida);
            allData[2] += parseFloat(valores.ValorAvaluoCatastral);
        }
        
        for (var index3 = 0; index3 < datosUso.length; index3++) {
            if (datosUso[index3].Localidad == 'All' && datosUso[index3].Uso == nombreUso) {
                datosUso[index3].NumeroPredios = allData[0];
                datosUso[index3].AreaConstruida = allData[1];
                datosUso[index3].ValorAvaluoCatastral = allData[2];
                break;
            }
        }
    }
}

function graphUso(chooseLocalidad) {
    var datosUsoLocalidad = datosUso.filter(function (dato) {
        return dato.Localidad == chooseLocalidad;
    });

    var Uso = unpack(datosUsoLocalidad, 'Uso');
    var areaConstruida = unpack(datosUsoLocalidad, 'AreaConstruida');

    bubbleSortAscending(areaConstruida, Uso);

    var colorBodega = '#ffdbe3';
    var colorClinica = '#00c5ff';
    var colorComercio = '#ff0000';
    var colorHotel = '#cd6699';
    var colorIndustria = '#ffa77f';
    var colorOficina = '#a83800';
    var colorOtro = '#b2b2b2';
    var colorResidencial = '#ffffbe';
    var colorUniversidad = '#0070ff';

    var data = [];
    for (var i = 0; i < Uso.length; i++) {

        var colorMarker;
        switch (Uso[i]) {
            case "RESIDENCIAL":
                colorMarker = colorResidencial;
                break;
            case "OFICINAS":
                colorMarker = colorOficina;
                break;
            case "COMERCIO":
                colorMarker = colorComercio;
                break;
            case "BODEGAS":
                colorMarker = colorBodega;
                break;
            case "UNIVERSIDADES Y COLEGIOS":
                colorMarker = colorUniversidad;
                break;
            case "OTROS":
                colorMarker = colorOtro;
                break;
            case "CLINICAS, HOSPITALES, CENTROS MÉDICOS":
                colorMarker = colorClinica;
                break;
            case "HOTELES":
                colorMarker = colorHotel;
                break;
            case "INDUSTRIA":
                colorMarker = colorIndustria;
                break;
            default:
                break;
        }

        var trace1 = {
            y: [chooseLocalidad],
            x: [areaConstruida[i]],
            name: Uso[i],
            type: 'bar',
            orientation: 'h',
            marker: {
                color: colorMarker
            },
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
            l: 150,
            t: 30,
            b: 50,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hovermode: 'closest',
        hoverlabel: {
            bgcolor: 'white',
            font: {
                color: 'black',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        title: 'Participación del uso predominante del área construida',
        width: window.innerWidth,
        height: window.innerHeight / 3,
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