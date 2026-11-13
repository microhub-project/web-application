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

const generateSummary = async () => {
    const body = {
        "instances": [
            { "mac": "00:00:00:00:00:00", "cpu": 2, "ram": 4, "monthly_cost": 18.83 },
            { "mac": "00:00:00:00:00:01", "cpu": 2, "ram": 4, "monthly_cost": 18.83 },
            { "mac": "00:00:00:00:00:02", "cpu": 2, "ram": 4, "monthly_cost": 18.83 },
            { "mac": "00:00:00:00:00:03", "cpu": 2, "ram": 4, "monthly_cost": 18.83 }
        ],
        "infra_multiplier": 1.23
    }

    try {
        const summary = await fetch("http://localhost:8000/predict-infra/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const response = await summary.json()

        let current_instances = 4
        let current_cpus = 8
        let current_ram = 16
        let current_cost = 75.32

        let vertical_cpus = 0
        let vertical_ram = 0
        let vertical_cost = 0

        let horizontal_instances = current_instances * 2
        let horizontal_cpus = 0
        let horizontal_ram = 0
        let horizontal_cost = 0

        response.forEach(instancia => {
            const { mac, vertical, horizontal } = instancia;

            vertical_cost += vertical.final_cost
            vertical_cpus += vertical.new_instance.cpus
            vertical_ram += vertical.new_instance.memory

            horizontal_cost += horizontal.final_cost
            horizontal_cpus += horizontal.new_instance.cpus
            horizontal_ram += horizontal.new_instance.memory
        })

        console.log(response)

        const container = document.getElementById("summary-container")

        container.innerHTML = generateSummaryHTML(current_instances, current_cpus, current_ram, current_cost, vertical_cpus, vertical_ram, vertical_cost, horizontal_instances, horizontal_cpus, horizontal_ram, horizontal_cost)
    } catch (e) {
        console.error(e)
        return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
}

const generateSummaryHTML = (
    current_instances, current_cpus, current_ram, current_cost,
    vertical_cpus, vertical_ram, vertical_cost,
    horizontal_instances, horizontal_cpus, horizontal_ram, horizontal_cost
) => {
    const round2 = (num) => Math.round(num * 100) / 100;

    const badgeStyles = {
        green: 'bg-green-100 text-green-700 border-green-700',
        red: 'bg-red-100 text-red-700 border-red-700',
        neutral: 'bg-stone-100 text-stone-700 border-stone-700'
    };

    const getComparisonStyle = (n1, n2, higherIsBetter = true) => {
        if (n1 === n2) return [badgeStyles.neutral, badgeStyles.neutral];
        const n1Higher = higherIsBetter ? n1 > n2 : n1 < n2;
        return n1Higher
            ? [badgeStyles.green, badgeStyles.red]
            : [badgeStyles.red, badgeStyles.green];
    };

    const horizontal_instances_increase = horizontal_instances - current_instances;
    const horizontal_instances_increase_percentage = round2(((horizontal_instances * 100) / current_instances) - 100);

    const vertical_cpus_increase = vertical_cpus - current_cpus;
    const vertical_cpus_increase_percentage = round2(((vertical_cpus * 100) / current_cpus) - 100);

    const horizontal_cpus_increase = horizontal_cpus;
    const horizontal_cpus_total = current_cpus + horizontal_cpus;
    const horizontal_cpus_increase_percentage = round2((horizontal_cpus_increase * 100) / current_cpus);

    const [vertical_cpus_style, horizontal_cpus_style] = getComparisonStyle(vertical_cpus_increase, horizontal_cpus_increase, true);

    const vertical_ram_increase = vertical_ram - current_ram;
    const vertical_ram_increase_percentage = round2(((vertical_ram * 100) / current_ram) - 100);

    const horizontal_ram_increase = horizontal_ram;
    const horizontal_ram_total = current_ram + horizontal_ram;
    const horizontal_ram_increase_percentage = round2((horizontal_ram_increase * 100) / current_ram);

    const [vertical_ram_style, horizontal_ram_style] = getComparisonStyle(vertical_ram_increase, horizontal_ram_increase, true);

    const vertical_cost_increase = round2(vertical_cost - current_cost);
    const vertical_cost_increase_percentage = round2(((vertical_cost * 100) / current_cost) - 100);

    const horizontal_cost_increase = round2(horizontal_cost - current_cost);
    const horizontal_cost_increase_percentage = round2(((horizontal_cost * 100) / current_cost) - 100);

    const [vertical_cost_style, horizontal_cost_style] = getComparisonStyle(vertical_cost_increase, horizontal_cost_increase, false);
    const vertical_cost_text = vertical_cost_increase === horizontal_cost_increase ? 'text-stone-700' : (vertical_cost_increase < horizontal_cost_increase ? 'text-green-700' : 'text-red-700');
    const horizontal_cost_text = vertical_cost_increase === horizontal_cost_increase ? 'text-stone-700' : (horizontal_cost_increase < vertical_cost_increase ? 'text-green-700' : 'text-red-700');

    return `
    <div class="w-full flex gap-8">
        <div class="w-1/2">
            <div class="w-full h-fit mb-4 rounded-xl p-2 bg-slate-100 border-blue-800 border text-blue-950">
                <div class="flex w-full">
                    <div class="w-3/5">
                        <div class="flex w-full items-center gap-2 my-4 ml-4">
                            <p class="font-bold">Instâncias:</p>
                            <p>${current_instances}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p>${current_instances}</p>
                            <p class="rounded-3xl ${badgeStyles.neutral} w-fit py-1 px-2 border">+0 (+0%)</p>
                        </div>
                        <div class="flex w-full items-center gap-2 my-4 ml-4">
                            <p class="font-bold">CPUs:</p>
                            <p>${current_cpus}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p>${vertical_cpus}</p>
                            <p class="rounded-3xl ${vertical_cpus_style} w-fit py-1 px-2 border">+${vertical_cpus_increase} (+${vertical_cpus_increase_percentage}%)</p>
                        </div>
                        <div class="flex w-full items-center gap-2 my-4 ml-4">
                            <p class="font-bold">RAM (GiB):</p>
                            <p>${current_ram}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p>${vertical_ram}</p>
                            <p class="rounded-3xl ${vertical_ram_style} w-fit py-1 px-2 border">+${vertical_ram_increase} (+${vertical_ram_increase_percentage}%)</p>
                        </div>
                    </div>
                    
                    <div class="w-2/5 text-center m-auto mr-4">
                        <h2 class="w-full text-2xl text-center font-bold">Custo:</h2>
                        <div class="flex w-full items-center justify-center gap-4 mb-4">
                            <p class="flex-1 text-left ml-4 text-2xl font-bold">$${current_cost}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p class="flex-1 text-right mr-4 text-2xl font-bold ${vertical_cost_text}">$${vertical_cost}</p>
                        </div>
                        <p class="rounded-3xl ${vertical_cost_style} mx-auto w-fit py-1 px-2 border">+$${vertical_cost_increase} (+${vertical_cost_increase_percentage}%)</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-1/2">
            <div class="w-full h-fit mb-4 rounded-xl p-2 bg-slate-100 border-blue-800 border text-blue-950">
                <div class="flex w-full">
                    <div class="w-3/5">
                        <div class="flex w-full items-center gap-2 my-4 ml-4">
                            <p class="font-bold">Instâncias:</p>
                            <p>${current_instances}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p>${horizontal_instances}</p>
                            <p class="rounded-3xl ${badgeStyles.red} w-fit py-1 px-2 border">+${horizontal_instances_increase} (+${horizontal_instances_increase_percentage}%)</p>
                        </div>
                        <div class="flex w-full items-center gap-2 my-4 ml-4">
                            <p class="font-bold">CPUs:</p>
                            <p>${current_cpus}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p>${horizontal_cpus_total}</p>
                            <p class="rounded-3xl ${horizontal_cpus_style} w-fit py-1 px-2 border">+${horizontal_cpus_increase} (+${horizontal_cpus_increase_percentage}%)</p>
                        </div>
                        <div class="flex w-full items-center gap-2 my-4 ml-4">
                            <p class="font-bold">RAM (GiB):</p>
                            <p>${current_ram}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p>${horizontal_ram_total}</p>
                            <p class="rounded-3xl ${horizontal_ram_style} w-fit py-1 px-2 border">+${horizontal_ram_increase} (+${horizontal_ram_increase_percentage}%)</p>
                        </div>
                    </div>
                    
                    <div class="w-2/5 text-center m-auto mr-4">
                        <h2 class="w-full text-2xl text-center font-bold">Custo:</h2>
                        <div class="flex w-full items-center justify-center gap-4 mb-4">
                            <p class="flex-1 text-left ml-4 text-2xl font-bold">$${current_cost}</p>
                            <i class="ph-bold ph-arrow-right text-xl"></i>
                            <p class="flex-1 text-right mr-4 text-2xl font-bold ${horizontal_cost_text}">$${horizontal_cost}</p>
                        </div>
                        <p class="rounded-3xl ${horizontal_cost_style} mx-auto w-fit py-1 px-2 border">+$${horizontal_cost_increase} (+${horizontal_cost_increase_percentage}%)</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

generateSummary()