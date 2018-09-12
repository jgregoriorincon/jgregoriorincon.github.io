Plotly.d3.csv('data/Alturas.csv', function (err, rows) {

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  var allLocalidades = unpack(rows, 'Localidad'),
    allYears = unpack(rows, 'Year'),
    allNPHs = unpack(rows, 'NPH'),
    allPorcNPHs = unpack(rows, 'Porc_NPH'),
    allPHs = unpack(rows, 'PH'),
    allPorcPHs = unpack(rows, 'Porc_PH'),
    listofYears = [],
    listofLocalidades = [],
    allLocalidad = [],
    allLocalidad2 = [],
    allPorcNPH = [],
    allPH = [],
    allPorcPH = [],
    allNPH = [];

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
    allLocalidad2 = [];
    allPH = [];
    allNPH = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allYears[i] === chosenYear) {
        if (allLocalidades[i] != "Bogotá D.C.") {
          allLocalidad2.push(allLocalidades[i]);
          allPH.push(allPHs[i]);
          allNPH.push(allNPHs[i]);
        }
      }
    }
  }

  function getLocalidadData(chosenLocalidad) {
    allLocalidad = [];
    allPorcNPH = [];
    allPorcPH = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allLocalidades[i] == chosenLocalidad) {
        allLocalidad.push(allYears[i]);
        allPorcNPH.push((allPorcNPHs[i] * 100).toFixed(2) + '%');
        allPorcPH.push((allPorcPHs[i] * 100).toFixed(2) + '%');
      }
    }
  }

  setYearPlot('2018');
  setLocalidadPlot('Bogotá D.C.');

  function setYearPlot(chosenYear) {
    getYearsData(chosenYear);

    var traces = [{
        x: allLocalidad2,
        y: allPH,
        fill: 'tozeroy',
        name: 'PH',
        marker: {
          color: 'rgba(251, 106, 74, 0.8)',
          width: 1
        },
      },
      {
        x: allLocalidad2,
        y: allNPH,
        fill: 'tonexty',
        name: 'NPH',
        marker: {
          color: 'rgba(252, 174, 145, 0.8)',
          width: 1
        },
      }
    ];

    var layout1 = {
      //   title: 'Población por localidad para el año ' + chosenYear,
      width: window.innerWidth,
      height: window.innerHeight / 2.5,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      showlegend:false,
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
    };

    Plotly.newPlot('plotdiv1', traces, layout1);
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

    var minRange = minArrayValue(allNPH),
      maxRange = maxArrayValue(allNPH);

    maxRange = maxRange + maxArrayValue(allPH);

    minRange = minRange + minArrayValue(allPH);
    minRange = minRange - (minRange / 100);

    var trace1 = {
      y: allPorcPH,
      x: allLocalidad,
      type: 'bar',
      name: 'PH',
      marker: {
        color: 'rgba(251, 106, 74, 0.8)',
        width: 1
      },
    };
    var trace2 = {
      y: allPorcNPH,
      x: allLocalidad,
      type: 'bar',
      name: 'NPH',
      marker: {
        color: 'rgba(252, 174, 145, 0.8)',
        width: 1
      },
    };

    var data2 = [trace1, trace2];

    layout2 = {
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'stack',
      barnorm: '',
      margin: {
        l: 150,
        t: 30,
        b: 30,
        pad: 4
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      // title: 'Crecimiento de la población de Bogotá D.C.',
      width: window.innerWidth,
      height: window.innerHeight / 2.5,
      yaxis: {
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