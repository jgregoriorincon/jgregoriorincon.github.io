var Localidad = [];
var datosTipoPredio = [];
var datosEstrato = [];
var datosRegimen = [];

var graphDiv1 = document.getElementById('graph1');
var graphDiv2 = document.getElementById('graph2');
var graphDiv3 = document.getElementById('graph3');
var graphDiv4 = document.getElementById('graph4');
var graphDiv5 = document.getElementById('graph5');
var graphDiv6 = document.getElementById('graph6');
var graphDiv7 = document.getElementById('graph7');

$(document).ready(function () {
    getSizeWindow();
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
                graphTipoPredio($('#localidadSelector').val());
                graphEstrato($('#localidadSelector').val());
                graphRegimen($('#localidadSelector').val());
            });

            Papa.parse("data/Data2.csv", {
                download: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                header: true,
                complete: function (parsed) {
                    datosTipoPredio = parsed.data;

                    Papa.parse("data/Data3.csv", {
                        download: true,
                        skipEmptyLines: true,
                        dynamicTyping: true,
                        header: true,
                        complete: function (parsed) {
                            datosEstrato = parsed.data;

                            Papa.parse("data/Data4.csv", {
                                download: true,
                                skipEmptyLines: true,
                                dynamicTyping: true,
                                header: true,
                                complete: function (parsed) {
                                    datosRegimen = parsed.data;
        
                                    $("#localidadSelector").val($("#localidadSelector option:first").val()).trigger("change");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

function graphTipoPredio(chooseLocalidad) {
    var prediosUrbanos = unpack(datosTipoPredio, 'Urbanos');
    var prediosRurales = unpack(datosTipoPredio, 'Rurales');
    var prediosMixtos = unpack(datosTipoPredio, 'Mixtos');

    var currentUrbano, currentRural, currentMixto;
    for (var i = 0; i < Localidad.length; i++) {
        if (Localidad[i] === chooseLocalidad) {
            currentUrbano = (prediosUrbanos[i]);
            currentRural = (prediosRurales[i]);
            currentMixto = (prediosMixtos[i]);
        }
    }

    var colores = rangeColors(3, '#F1CF6D', '#246D3B');
    prediosTotales = currentUrbano + currentRural + currentMixto;
    porcUrbano = (currentUrbano / prediosTotales);
    porcRural = (currentRural / prediosTotales);
    porcMixto = (currentMixto / prediosTotales);

    var trace1 = {
        type: 'bar',
        x: [porcMixto, porcRural, porcUrbano],
        y: ['Predios Mixtos', 'Predios Rurales', 'Predios Urbanos'],
        orientation: 'h',
        marker: {
            color: colores
        },
    };

    layout = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 150,
            t: 30,
            b: 30,
            pad: 4
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        title: 'Participación por zonas',
        width: window.innerWidth,
        height: window.innerHeight / 3,
        xaxis: {
            autorange: true,
            type: 'linear',
            hoverformat: '.2%',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'category',
            zerolinecolor: '#fff'
        }
    };
    Plotly.newPlot(graphDiv1, [trace1],
        layout, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });
}

function graphEstrato(chooseLocalidad) {
    var datosEstratoLocalidad = datosEstrato.filter(function (dato) {
        return dato.Localidad == chooseLocalidad;
    });

    var Estrato = unpack(datosEstratoLocalidad, 'Estrato');
    var numeroPredios = unpack(datosEstratoLocalidad, 'NumeroPredios');
    var areaConstruida = unpack(datosEstratoLocalidad, 'AreaConstruida');
    var valorAvaluoCatastral = unpack(datosEstratoLocalidad, 'ValorAvaluoCatastral');

    // var colores = rangeColors(Estrato.length, '#F47139', '#1267A8');
    var colores = ['#f0f9e8',
    '#ccebc5',
    '#a8ddb5',
    '#7bccc4',
    '#4eb3d3',
    '#2b8cbe',
    '#08589e'];

    layout1 = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 100,
            t: 50,
            b: 0,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        title: 'Estrato Socioeconómico',
        width: window.innerWidth,
        height: window.innerHeight / 3,
        xaxis: {
            autorange: true,
            type: 'category',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            showline: true,
            title: "Número de Predios"
        }
    };

    layout2 = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 100,
            t: 0,
            b: 0,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        width: window.innerWidth,
        height: window.innerHeight / 4,
        xaxis: {
            autorange: true,
            type: 'category',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            title: "Area Construida (m2)"
        }
    };

    layout3 = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 100,
            t: 0,
            b: 50,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        width: window.innerWidth,
        height: window.innerHeight / 3,
        xaxis: {
            autorange: true,
            type: 'category',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            title: "Avalúo Catastral (MM)"
        }
    };

    var trace1 = {
        x: Estrato,
        y: numeroPredios,
        mode: 'markers',
        marker: {
            size: [20, 20, 20, 20, 20, 20, 20],
            color: colores
        }
    };
    var trace2 = {
        x: Estrato,
        y: areaConstruida,
        mode: 'markers',
        marker: {
            size: [20, 20, 20, 20, 20, 20, 20],
            color: colores
        }
    };
    var trace3 = {
        x: Estrato,
        y: valorAvaluoCatastral,
        mode: 'markers',
        marker: {
            size: [20, 20, 20, 20, 20, 20, 20],
            color: colores
        }
    };

    Plotly.newPlot(graphDiv2, [trace1],
        layout1, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });

    Plotly.newPlot(graphDiv3, [trace2],
        layout2, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });
    Plotly.newPlot(graphDiv4, [trace3],
        layout3, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });
}

function graphRegimen(chooseLocalidad) {
    var datosRegimenLocalidad = datosRegimen.filter(function (dato) {
        return dato.Localidad == chooseLocalidad;
    });

    var Regimen = unpack(datosRegimenLocalidad, 'Regimen');
    var numeroPredios = unpack(datosRegimenLocalidad, 'NumeroPredios');
    var areaConstruida = unpack(datosRegimenLocalidad, 'AreaConstruida');
    var valorAvaluoCatastral = unpack(datosRegimenLocalidad, 'ValorAvaluoCatastral');

    // var colores = rangeColors(Regimen.length, '#48B8C5', '#A3D9B5');
    var colores = ['#3eb4c2', '#9fd8b2'];

    layout1 = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 100,
            t: 50,
            b: 6,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        title: 'Predios y áreas según regimen de propiedad',
        width: window.innerWidth,
        height: window.innerHeight / 3,
        xaxis: {
            autorange: true,
            type: 'category',
            // gridcolor: '#fff',
            // zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            showline: true,
            title: "Número de Predios"
        }
    };

    layout2 = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 100,
            t: 0,
            b: 6,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        width: window.innerWidth,
        height: window.innerHeight / 4,
        xaxis: {
            autorange: true,
            type: 'category',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            title: "Area Construida (m2)"
        }
    };

    layout3 = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'group',
        barnorm: '',
        margin: {
            l: 100,
            t: 0,
            b: 50,
            pad: 0
        },
        font: {
            color: '#fff',
            family: "'Roboto', sans-serif"
        },
        hoverlabel: {
            bgcolor: 'black',
            font: {
                color: 'white',
                family: "'Roboto', sans-serif"
            }
        },
        showlegend: false,
        width: window.innerWidth,
        height: window.innerHeight / 3,
        xaxis: {
            autorange: true,
            type: 'category',
            // gridcolor: '#fff',
            zerolinecolor: '#fff',
            linecolor: '#fff',
        },
        yaxis: {
            autorange: true,
            type: 'linear',
            zerolinecolor: '#fff',
            linecolor: '#fff',
            title: "Avalúo Catastral (MM)"
        }
    };

    var trace1 = {
        x: Regimen,
        y: numeroPredios,
        type: 'bar',
        orientation: 'v',
        marker: {
            color: colores
        }
    };
    var trace2 = {
        x: Regimen,
        y: areaConstruida,
        type: 'bar',
        orientation: 'v',
        marker: {
            color: colores
        }
    };
    var trace3 = {
        x: Regimen,
        y: valorAvaluoCatastral,
        type: 'bar',
        orientation: 'v',
        marker: {
            color: colores
        }
    };

    Plotly.newPlot(graphDiv5, [trace1],
        layout1, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });

    Plotly.newPlot(graphDiv6, [trace2],
        layout2, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });
    Plotly.newPlot(graphDiv7, [trace3],
        layout3, {
            modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displaylogo: false
        });
}
