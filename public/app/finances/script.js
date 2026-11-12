const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const alignLineToFirstBar = {
    id: 'alignLineToFirstBar',
    beforeDatasetsDraw(chart) {
        const firstBarMeta = chart.getDatasetMeta(0);
        const lineMeta = chart.getDatasetMeta(2);

        if (firstBarMeta && lineMeta && firstBarMeta.data.length && lineMeta.data.length) {
            lineMeta.data.forEach((point, index) => {
                if (firstBarMeta.data[index]) {
                    point.x = firstBarMeta.data[index].x;
                }
            });
        }
    }
};

const data = {
    labels: labels,
    datasets: [
        {
            label: 'Previsão',
            data: [1.23, 1.45, 1.8, 1.47, 2.07, 1.9, 2.06, 1.67, 1.66, 1.77, 6.65, 2.57],
            borderRadius: 7.5,
            backgroundColor: '#FFFFFF',
            borderColor: '#1E3A8A',
            borderWidth: 1,
            order: 1,
            borderSkipped: false
        },
        {
            label: 'Real',
            data: [1.1, 1.2, 1.7, 1.3, 2.07, 1.1, 2.06, 1.67, 1.4, 1.5, 5.8, 0],
            borderRadius: 7.5,
            backgroundColor: '#93C5FD',
            borderColor: '#1E3A8A',
            borderWidth: 1,
            order: 1,
            borderSkipped: false
        },
        {
            data: [1.23, 1.45, 1.8, 1.47, 2.07, 1.9, 2.06, 1.67, 1.66, 1.77, 6.65, 2.57],
            backgroundColor: '#D9D9D9',
            borderColor: '#1E3A8A',
            borderWidth: 1,
            pointBorderColor: '#64748B',
            pointRadius: 5,
            type: 'line',
            order: 0,
            grouped: true,
            borderSkipped: false
        }
    ]
};

const config = {
    type: 'bar',
    data: data,
    plugins: [ChartDataLabels, alignLineToFirstBar],
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3,
        plugins: {
            legend: {
                display: true,
                labels: {
                    filter: function (item, chartData) {
                        return item.datasetIndex != 2;
                    }
                }
            },
            datalabels: {
                display: function (context) {
                    return context.datasetIndex === 2;
                },
                align: 'top',
                anchor: 'end',
                offset: 4,
                color: '#64748B',
                font: {
                    weight: 'bold',
                    size: 14
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Multiplicador',
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                },
                beginAtZero: true,
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    },
};

let months_graph = new Chart(document.getElementById('months-graph'), config)