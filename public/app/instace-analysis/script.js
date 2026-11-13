document.addEventListener("DOMContentLoaded", () => {

    const ctx = document.getElementById("graficoBarras");

    const graficoBarras = new Chart(ctx, {
        type: "bar",

        data: {
            labels: ["Provisionada", "Efetiva"],

            datasets: [{
                label: "Capacidade",
                data: [100, 75],

                backgroundColor: [
                    "#3B82F6",
                    "#16A34A"
                ],

                borderRadius: 8,
                barPercentage: 0.5
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    min: 25,
                    max: 125,

                    ticks: {
                        stepSize: 25,
                        callback: function (valor) {
                            return valor + "%";
                        }
                    },

                    title: {
                        display: true,
                        text: "Capacidade (%)"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

});


document.addEventListener("DOMContentLoaded", () => {

    // GRÁFICO DE ROSCA
    const ctxRosca = document.getElementById("graficoRosca");

    // Plugin para escrever a porcentagem no centro da rosca
    const textoCentral = {
        id: "textoCentral",

        afterDraw(chart) {
            const { ctx } = chart;

            const valores = chart.data.datasets[0].data;
            const total = valores.reduce((soma, valor) => soma + valor, 0);
            const porcentagem = Math.round((valores[0] / total) * 100);

            const centroX = chart.getDatasetMeta(0).data[0].x;
            const centroY = chart.getDatasetMeta(0).data[0].y;

            ctx.save();

            ctx.font = "bold 38px monospace";
            ctx.fillStyle = "#0f172a";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(porcentagem + "%", centroX, centroY);

            ctx.restore();
        }
    };

    const graficoRosca = new Chart(ctxRosca, {
        type: "doughnut",

        data: {
            labels: ["Capacidade atual", "Desperdício"],

            datasets: [{
                data: [80, 20],

                backgroundColor: [
                    "#1d4ed8",
                    "#93c5fd"
                ],

                borderWidth: 0,
                hoverOffset: 0
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "68%",
            rotation: -90,

            plugins: {
                legend: {
                    display: true,
                    position: "bottom",

                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 14,

                        color: "#0f172a",

                        font: {
                            family: "monospace",
                            size: 14,
                            weight: "bold"
                        }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label + ": " + context.parsed + "%";
                        }
                    }
                }
            }
        },

        plugins: [textoCentral]
    });

});
