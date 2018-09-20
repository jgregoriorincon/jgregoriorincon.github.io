Plotly.d3.csv('data/Residencial.csv', function (err, rows) {
  Plotly.d3.csv('data/Residencial2.csv', function (err2, rows2) {

    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    var allEstratos = unpack(rows, 'Estrato'),
      allYears = unpack(rows, 'Year'),
      allPredios = unpack(rows, 'Predios'),
      listofYears = [],
      currentEstrato = [],
      currentPredio = [];

    var allEstratos2 = unpack(rows2, 'Estrato'),
      allYears2 = unpack(rows2, 'Year'),
      allLocalidades2 = unpack(rows2, 'Localidad'),
      allPorcentajes2 = unpack(rows2, 'PorcPredios'),
      listofLocalidades2 = [],
      listofEstratos2 = [],
      currentEstrato2 = [],
      currentLocalidad2 = [],
      currentPorcentaje2 = [];

    for (var i = allYears.length - 1; i > 0; i--) {
      if (listofYears.indexOf(allYears[i]) === -1) {
        listofYears.push(allYears[i]);
      }
    }
    for (var i = 0; i < allLocalidades2.length; i++) {
      if (listofLocalidades2.indexOf(allLocalidades2[i]) === -1) {
        listofLocalidades2.push(allLocalidades2[i]);
      }
    }
    for (var i = 0; i < allEstratos2.length; i++) {
      if (listofEstratos2.indexOf(allEstratos2[i]) === -1) {
        listofEstratos2.push(allEstratos2[i]);
      }
    }

    function getYearsData(chosenYear) {
      currentEstrato = [];
      currentEstratoPerc = [];
      currentPredio = [];

      currentEstrato2 = [];
      currentLocalidad2 = [];
      currentPorcentaje2 = [];
      for (var i = 0; i < allYears.length; i++) {
        if (allYears[i] === chosenYear) {
          currentEstrato.push(allEstratos[i]);
          currentPredio.push(parseInt(allPredios[i]));
        }
      }
      for (var i = 0; i < allYears2.length; i++) {
        if (allYears2[i] === chosenYear) {
          currentEstrato2.push(allEstratos2[i]);
          currentLocalidad2.push(allLocalidades2[i]);
          currentPorcentaje2.push(parseFloat(allPorcentajes2[i]) * 100);
        }
      }

      // bubbleSortAscending(currentPredio, currentEstrato);
    }

    // Default Country Data
    setBubblePlot('2018');

    function setBubblePlot(chosenYear) {
      getYearsData(chosenYear);

      var colores = ['#f0f9e8', 
      '#ccebc5', 
      '#a8ddb5', 
      '#7bccc4', 
      '#4eb3d3', 
      '#2b8cbe', 
      '#08589e'];

      var data = [];
      for (var i = 0; i < currentEstrato.length; i++) {
        var colorMarker;
        if (currentEstrato[i] == 'Sin Estrato') {
          colorMarker = colores[0];
        } else if (currentEstrato[i] == 'E1') {
          colorMarker = colores[1];
        } else if (currentEstrato[i] == 'E2') {
          colorMarker = colores[2];
        } else if (currentEstrato[i] == 'E3') {
          colorMarker = colores[3];
        } else if (currentEstrato[i] == 'E4') {
          colorMarker = colores[4];
        } else if (currentEstrato[i] == 'E5') {
          colorMarker = colores[5];
        } else if (currentEstrato[i] == 'E6') {
          colorMarker = colores[6];
        }

        var trace2 = {
          y: [chosenYear],
          x: [currentPredio[i]],
          name: currentEstrato[i],
          type: 'bar',
          orientation: 'h',
          marker: {
            color: colorMarker
          },
        };
        data.push(trace2);
      }

      var layout = {
        autosize: true,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        barmode: 'stack',
        barnorm: '',
        margin: {
          l: 150,
          t: 30,
          b: 30,
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

      Plotly.newPlot('plotdiv1', data, layout);

      var dataE0 = [],
        dataE1 = [],
        dataE2 = [],
        dataE3 = [],
        dataE4 = [],
        dataE5 = [],
        dataE6 = [];

      for (var i = 0; i < currentEstrato2.length; i++) {
        switch (currentEstrato2[i]) {
          case "Sin Estrato":
            dataE0.push(currentPorcentaje2[i]);
            break;
          case "E1":
            dataE1.push(currentPorcentaje2[i]);
            break;
          case "E2":
            dataE2.push(currentPorcentaje2[i]);
            break;
          case "E3":
            dataE3.push(currentPorcentaje2[i]);
            break;
          case "E4":
            dataE4.push(currentPorcentaje2[i]);
            break;
          case "E5":
            dataE5.push(currentPorcentaje2[i]);
            break;
          case "E6":
            dataE6.push(currentPorcentaje2[i]);
            break;
          default:
            break;
        }
      }

      var traces = [{
        x: listofLocalidades2,
        y: dataE0,
        type: 'bar',
        fill: 'tozeroy',
        name: 'Sin Estrato',
        marker: {
          color: colores[0],
          width: 1
        },
      },
      {
        x: listofLocalidades2,
        y: dataE1,
        type: 'bar',
        fill: 'tonexty',
        name: 'E1',
        marker: {
          color: colores[1],
          width: 1
        },
      },
      {
        x: listofLocalidades2,
        y: dataE2,
        type: 'bar',
        fill: 'tonexty',
        name: 'E2',
        marker: {
          color: colores[2],
          width: 1
        },
      },
      {
        x: listofLocalidades2,
        y: dataE3,
        type: 'bar',
        fill: 'tonexty',
        name: 'E3',
        marker: {
          color: colores[3],
          width: 1
        },
      },
      {
        x: listofLocalidades2,
        y: dataE4,
        type: 'bar',
        fill: 'tonexty',
        name: 'E4',
        marker: {
          color: colores[4],
          width: 1
        },
      },
      {
        x: listofLocalidades2,
        y: dataE5,
        type: 'bar',
        fill: 'tonexty',
        name: 'E5',
        marker: {
          color: colores[5],
          width: 1
        },
      },
      {
        x: listofLocalidades2,
        y: dataE6,
        type: 'bar',
        fill: 'tonexty',
        name: 'E6',
        marker: {
          color: colores[6],
          width: 1
        },
      }
    ];

    // function stackedArea(traces) {
    //   for(var i=1; i<traces.length; i++) {
    //     for(var j=0; j<(Math.min(traces[i]['y'].length, traces[i-1]['y'].length)); j++) {
    //       traces[i]['y'][j] += traces[i-1]['y'][j];
    //     }
    //   }
    //   return traces;
    // }

    var layout2 = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'stack',
      margin: {
        l: 100,
        t: 0,
        b: 200,
        pad: 0
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      width: window.innerWidth,
      height: window.innerHeight /1.5 ,
    };

    Plotly.newPlot('plotdiv2', traces, layout2);

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
});