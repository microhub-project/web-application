const loadCharts = () => {
   const grafico1 = document.getElementById('myChart1');

  new Chart(grafico1, {
    type: 'bar',
    data: {
      labels: ['a', 'b', 'c', 'd', 'e', 'f'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


  const grafico2 = document.getElementById('myChart2');

  new Chart(grafico2, {
    type: 'bar',
    data: {
      labels: ['a', 'b', 'c', 'd', 'e', 'f'],
      datasets: [{
        label: '# of Votes',
        data: [3, 2, 5, 3, 19, 12],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const grafico3 = document.getElementById('myChart3');

  new Chart(grafico3, {
    type: 'bar',
    data: {
      labels: ['a', 'b', 'c', 'd', 'e', 'f'],
      datasets: [{
        label: '# of Votes',
        data: [3, 2, 5, 3, 19, 12],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


  const grafico4 = document.getElementById('myChart4');

  new Chart(grafico4, {
    type: 'bar',
    data: {
      labels: ['a', 'b', 'c', 'd', 'e', 'f'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}