$(document).ready(function () {
    var graphDiv1 = document.getElementById('graph1');
    var graphDiv2 = document.getElementById('graph2');
    var graphDiv3 = document.getElementById('graph3');
    Papa.parse("data/Data1.csv", {
        download: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        header: true,
        complete: function (parsed) {
            var Localidad = unpack(parsed.data, 'Localidad');
            var NumeroPredios = unpack(parsed.data, 'NumeroPredios');
            var AreaConstruida = unpack(parsed.data, 'AreaConstruida');
            var ValorAvaluoCatastral = unpack(parsed.data, 'ValorAvaluoCatastral');

            var colores1 = rangeColors(Localidad.length, '#2E5E87', '#A84127');
            var colores2 = rangeColors(Localidad.length, '#F5C668', '#A84127');
            var colores3 = rangeColors(Localidad.length, '#23723E', '#F5D16E');

            var LocalidadNumeroPredios = Localidad.join(";").split(";");
            var LocalidadAreaConstruida = Localidad.join(";").split(";");
            var LocalidadValorAvaluoCatastral = Localidad.join(";").split(";");

            bubbleSortAscending(NumeroPredios, LocalidadNumeroPredios);
            bubbleSortAscending(AreaConstruida, LocalidadAreaConstruida);
            bubbleSortAscending(ValorAvaluoCatastral, LocalidadValorAvaluoCatastral);

            trace1 = {
                y: NumeroPredios,
                x: LocalidadNumeroPredios,
                marker: {
                    color: colores1
                },
                name: 'Número de Predios',
                opacity: 1,
                orientation: 'v',
                showlegend: false,
                type: 'bar',
            };
            layout1 = {
                autosize: true,
                paper_bgcolor: 'rgb(0, 0, 0)',
                plot_bgcolor: 'rgb(0, 0, 0)',
                barmode: 'group',
                barnorm: '',
                height: window.innerHeight / 1.5,
                margin: {
                    l: 70,
                    t: 70,
                    b: 100,
                    pad: 4
                },
                font: {
                    color: '#fff',
                    family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                },
                hoverlabel: {
                    bgcolor: 'black',
                    font: {
                        color: 'white',
                        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    }
                },
                showlegend: false,
                title: 'Número de Predios',
                width: window.innerWidth,
                xaxis: {
                    autorange: true,
                    // title: 'Localidad',
                    type: 'category'
                },
                yaxis: {
                    autorange: true,
                    title: 'Vigencia 2018',
                    type: 'linear'
                }
            };

            trace2 = {
                y: AreaConstruida,
                x: LocalidadAreaConstruida,
                marker: {
                    color: colores2
                },
                name: 'Miles de Millones de Pesos',
                opacity: 1,
                orientation: 'v',
                showlegend: false,
                type: 'bar',
            };
            layout2 = {
                autosize: true,
                paper_bgcolor: 'rgb(0, 0, 0)',
                plot_bgcolor: 'rgb(0, 0, 0)',
                barmode: 'group',
                barnorm: '',
                height: window.innerHeight / 1.5,
                margin: {
                    l: 70,
                    t: 70,
                    b: 100,
                    pad: 4
                },
                showlegend: false,
                font: {
                    color: '#fff',
                    family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                },
                hoverlabel: {
                    bgcolor: 'black',
                    font: {
                        color: 'white',
                        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    }
                },
                title: 'Área de Contrucción',
                width: window.innerWidth,
                xaxis: {
                    autorange: true,
                    // title: 'Vigencia 2018',
                    type: 'category'
                },
                yaxis: {
                    autorange: true,
                    title: 'Vigencia 2018',
                    type: 'linear'
                }
            };

            trace3 = {
                y: ValorAvaluoCatastral,
                x: LocalidadValorAvaluoCatastral,
                marker: {
                    color: colores3
                },
                name: 'Miles de Millones de Pesos',
                opacity: 1,
                orientation: 'v',
                showlegend: false,
                type: 'bar',
            };
            layout3 = {
                autosize: true,
                paper_bgcolor: 'rgb(0, 0, 0)',
                plot_bgcolor: 'rgb(0, 0, 0)',
                barmode: 'group',
                barnorm: '',
                height: window.innerHeight / 1.5,
                margin: {
                    l: 70,
                    t: 70,
                    b: 100,
                    pad: 4
                },
                showlegend: false,
                font: {
                    color: '#fff',
                    family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                },
                hoverlabel: {
                    bgcolor: 'black',
                    font: {
                        color: 'white',
                        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                    }
                },
                title: 'Valor Avaluo Catastral (En Miles de Millones)',
                width: window.innerWidth,
                xaxis: {
                    autorange: true,                    
                    type: 'category'
                },
                yaxis: {
                    autorange: true,
                    title: 'Vigencia 2018',
                    type: 'linear'
                }
            };

            Plotly.plot(graphDiv1, [trace1],
                layout1, {
                    modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                    displaylogo: false
                }
            );
            Plotly.plot(graphDiv2, [trace2],
                layout2, {
                    modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                    displaylogo: false
                }
            );
            Plotly.plot(graphDiv3, [trace3],
                layout3, {
                    modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                    displaylogo: false
                }
            );
        }
    });

});