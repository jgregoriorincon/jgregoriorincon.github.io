Plotly.d3.csv('data/Poblacion.csv', function (err, rows) {

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  var allLocalidades = unpack(rows, 'Localidad'),
    allYears = unpack(rows, 'Year'),
    allPoblaciones = unpack(rows, 'Poblacion'),
    listofYears = [],
    listofLocalidades = [],
    currentLocalidad = [],
    currentPoblacion = [],
    allLocalidad = [],
    allPoblacion = [];

  for (var i = allYears.length - 1; i > 0; i--) {
    if (listofYears.indexOf(allYears[i]) === -1) {
      listofYears.push(allYears[i]);
    }
  }
  for (var i = 0; i < allLocalidades.length; i++) {
    if (listofLocalidades.indexOf(allLocalidades[i]) === -1) {
      listofLocalidades.push(allLocalidades[i]);
    }
  }

  function getYearsData(chosenYear) {
    currentLocalidad = [];
    currentPoblacion = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allYears[i] === chosenYear) {
        if (allLocalidades[i] != "Bogotá D.C.") {
          currentLocalidad.push(allLocalidades[i]);
          currentPoblacion.push(parseInt(allPoblaciones[i]));
        }
      }
    }

    bubbleSortAscending(currentPoblacion, currentLocalidad);
  }

  function getLocalidadData(chosenLocalidad) {
    allLocalidad = [];
    allPoblacion = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allLocalidades[i] == chosenLocalidad) {
        allLocalidad.push(allYears[i]);
        allPoblacion.push(allPoblaciones[i]);
      }
    }
  }

  setLocalidadPlot('Bogotá D.C.');
  setYearPlot('2018');

  function setYearPlot(chosenYear) {
    getYearsData(chosenYear);

    var colores = rangeColors(listofLocalidades.length, '#084594', '#eff3ff');

    var trace1 = {
      y: currentPoblacion,
      x: currentLocalidad,
      type: 'bar',
      marker: {
        color: colores
      },
    };

    var data1 = [trace1];

    var layout1 = {
      //   title: 'Población por localidad para el año ' + chosenYear,
      width: window.innerWidth,
      height: window.innerHeight / 3,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      margin: {
        l: 150,
        t: 30,
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
    };

    Plotly.newPlot('plotdiv1', data1, layout1);
  }

  function minArrayValue(numberArray) {
    var minValue = parseFloat(numberArray[0]);
    for (var i = 0; i < numberArray.length; i++) {
      if (minValue > parseFloat(numberArray[i])) {
        minValue = parseFloat(numberArray[i]);
      }
    }
    return minValue;
  }

  function maxArrayValue(numberArray) {
    var maxValue = parseFloat(numberArray[0]);
    for (var i = 0; i < numberArray.length; i++) {
      if (maxValue < parseFloat(numberArray[i])) {
        maxValue = parseFloat(numberArray[i]);
      }
    }
    return maxValue;
  }

  function setLocalidadPlot(chosenLocalidad) {
    getLocalidadData(chosenLocalidad);

    var minRange = minArrayValue(allPoblacion),
      maxRange = maxArrayValue(allPoblacion);
    minRange = minRange - (minRange / 100);

    var colores = rangeColors(listofYears.length, '#eff3ff', '#084594');

    var trace2 = {
      y: allPoblacion,
      x: allLocalidad,
      type: 'bar',
      marker: {
        color: colores,
        width: 1
      },
    };
    
    var data2 = [trace2];

    layout2 = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'group',
      barnorm: '',
      margin: {
        l: 150,
        t: 50,
        b: 30,
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
      // title: 'Crecimiento de la población de Bogotá D.C.',
      width: window.innerWidth,
      height: window.innerHeight / 3,
      yaxis: {
        range: [minRange, maxRange],
        type: 'linear',
        zerolinecolor: '#fff'
      }
    };

    Plotly.newPlot('plotdiv2', data2, layout2);
  }

  var yearSelector = document.querySelector('#yearSelector');
  var localidadSelector = document.querySelector('#localidadSelector');

  function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length; i++) {
      var currentOption = document.createElement('option');
      currentOption.text = textArray[i];
      selector.appendChild(currentOption);
    }
  }

  assignOptions(listofYears, yearSelector);
  assignOptions(listofLocalidades, localidadSelector);

  function updateYear() {
    setYearPlot(yearSelector.value);
  }

  function updateLocalidad() {
    setLocalidadPlot(localidadSelector.value);
  }

  yearSelector.addEventListener('change', updateYear, false);
  localidadSelector.addEventListener('change', updateLocalidad, false);
});