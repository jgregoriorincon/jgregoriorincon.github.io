Plotly.d3.csv('data/ValorReferencia1.csv', function (err, rows) {
  Plotly.d3.csv('data/ValorReferencia2.csv', function (err2, rows2) {

    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    var allRangos = unpack(rows, 'Rango'),
      allYears = unpack(rows, 'Year'),
      allValores = unpack(rows, 'Total'),
      listofYears = [],
      currentRango = [],
      currentValor = [];

    var allYearsRef = unpack(rows2, 'Year'),
        allValorRef = unpack(rows2, 'Valor');

    for (var i = allYears.length - 1; i > 0; i--) {
      if (listofYears.indexOf(allYears[i]) === -1) {
        listofYears.push(allYears[i]);
      }
    }

    function getYearsData(chosenYear) {
      currentRango = [];
      currentValor = [];
      for (var i = 0; i < allYears.length; i++) {
        if (allYears[i] === chosenYear) {
          currentRango.push(allRangos[i]);
          currentValor.push(parseInt(allValores[i]));
        }
      }
    }

    // Default Country Data
    setBubblePlot('2017');

    function setBubblePlot(chosenYear) {
      getYearsData(chosenYear);

      // var colores = rangeColors(8, '#FFFE8A', '#48569D');
      var colores = ['#FFFF80','#AFF553','#5AE622','#3EC948','#34A884','#1F7EA3','#1F438F','#0C1078']; 
      var trace1 = {
        x: currentValor,
        y: currentRango,
        orientation: 'h',
        type: 'bar',
        marker: {
          color: colores
        },
      };

      var trace2 = {
        y: allValorRef,
        x: allYearsRef,
        type: 'bar',
        marker: {color: '#47549e'},
      };

      var data1 = [trace1];
      var data2 = [trace2];

      var layout1 = {
        //   title: 'Población por localidad para el año ' + chosenYear,
        paper_bgcolor: '#000',
        plot_bgcolor: '#000',
        // width: window.innerWidth,
        height: window.innerHeight / 2,
        margin: {
          l: 150,
          t: 30,
          b: 50,
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

      layout2 = {
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
        title: 'Valor promedio del suelo por año',
        width: window.innerWidth,
        height: window.innerHeight / 3,
        xaxis: {
          autorange: true,
          type: 'linear',
          hoverformat: '',
          // gridcolor: '#fff',
          zerolinecolor: '#fff',
          linecolor: '#fff',
        },
        yaxis: {
          autorange: true,
          // type: 'category',
          zerolinecolor: '#fff'
        }
      };

      Plotly.newPlot('plotdiv1', data1, layout1);
      Plotly.newPlot('plotdiv2', data2, layout2);
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