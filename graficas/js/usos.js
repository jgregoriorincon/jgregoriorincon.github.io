Plotly.d3.csv('data/Usos.csv', function (err, rows) {

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  var allUsos = unpack(rows, 'ActividadEconomica'),
    allYears = unpack(rows, 'Year'),
    allPredios = unpack(rows, 'Predios'),
    allPorcentajes = unpack(rows, 'Porcentaje'),
    listofYears = [],
    currentUso = [],
    currentUsoPerc = [],
    currentPredio = [],
    currentPorcentaje = [];

  for (var i = allYears.length - 1; i > 0; i--) {
    if (listofYears.indexOf(allYears[i]) === -1) {
      listofYears.push(allYears[i]);
    }
  }

  function getYearsData(chosenYear) {
    currentUso = [];
    currentUsoPerc = [];
    currentPredio = [];
    currentPorcentaje = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allYears[i] === chosenYear) {
        currentUso.push(allUsos[i]);
        currentUsoPerc.push(allUsos[i]);
        currentPredio.push(parseInt(allPredios[i]));
        currentPorcentaje.push(parseFloat(allPorcentajes[i]) * 100);
      }
    }

    bubbleSortAscending(currentPredio, currentUso);
    bubbleSortAscending(currentPorcentaje, currentUsoPerc);
  }

  // Default Country Data
  setBubblePlot('2018');

  function setBubblePlot(chosenYear) {
    getYearsData(chosenYear);

    var data2 = [];
    for (var i = 0; i < currentUso.length; i++) {

      var colorMarker;
      switch (currentUso[i]) {
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

      var trace2 = {
        y: [chosenYear],
        x: [currentPredio[i]],
        name: currentUso[i],
        type: 'bar',
        orientation: 'h',
        marker: {
          color: colorMarker
        },
      };
      data2.push(trace2);
    }

    var layout2 = {
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
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      hovermode: 'closest',
      hoverlabel: {
        bgcolor: 'white',
        font: {
          color: 'black',
          family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        }
      },
      showlegend: false,
      // title: 'Participación del uso predominante del área construida',
      width: window.innerWidth,
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

    Plotly.newPlot('plotdiv2', data2, layout2);

    for (var j = 0; j < currentPorcentaje.length; j++) {
      currentPorcentaje[j] = currentPorcentaje[j].toFixed(2) + "%";
    }

    var values = [
      currentUsoPerc,
      currentPorcentaje
    ];

    var data = [{
      type: 'table',
      header: {
        values: [
          ["Actividad Ecónomica"],
          ["Porcentaje"]
        ],
        align: "center",
        line: {
          width: 0,
          color: 'white'
        },
        fill: {
          color: "black"
        },
        font: {
          family: "Arial",
          size: 14,
          color: "white"
        }
      },
      cells: {
        values: values,
        align: "center",
        line: {
          color: "white",
          width: 0
        },
        fill: {
          color: "black"
        },
        font: {
          family: "Arial",
          size: 14,
          color: ["white"]
        }
      }
    }];

    var layout = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      margin: {
        l: 150,
        t: 30,
        b: 30,
        pad: 4
      },
    };

    Plotly.plot('plotdiv3', data, layout);

  }

  var yearSelector = document.querySelector('#yearSelector');

  function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length; i++) {
      var currentOption = document.createElement('option');
      currentOption.text = textArray[i];
      selector.appendChild(currentOption);
    }
  }

  assignOptions(listofYears, yearSelector);

  function updateYear() {
    setBubblePlot(yearSelector.value);
  }

  yearSelector.addEventListener('change', updateYear, false);
});