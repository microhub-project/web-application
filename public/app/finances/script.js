const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const forecast = [1.23, 1.45, 1.8, 1.47, 2.07, 1.9, 2.06, 1.67, 1.66, 1.77, 6.65, 2.57]

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
            data: forecast,
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
            data: forecast,
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
        onClick: (event, elements, chart) => {
            if (elements.length > 0) {
                const monthIndex = elements[0].index;

                const selectedMonth = chart.data.labels[monthIndex];
                const infraMultiplier = chart.data.datasets[0].data[monthIndex];

                generateSummary(selectedMonth, infraMultiplier);
            }
        },
        onHover: (event, elements) => {
            event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        },
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

let volumes_cost = 0

const getInstances = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/instances/listar', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.status === 204) {
            return showToast("Não há nenhuma instância", "warning");
        }

        const body = await response.json();

        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const data = body.data || [];

        let instances = []

        volumes_cost = 0

        for (const instance of data) {
            const { endereco_mac, custo_armazenamento, custo_computacao, cpu, ram } = instance;

            instances.push({
                "mac": endereco_mac,
                "cpu": cpu,
                "ram": ram,
                "monthly_cost": custo_computacao
            })

            volumes_cost += parseFloat(custo_armazenamento)
        };

        return instances
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar as instâncias.", "error");
    }
};

const generateSummary = async (month, infra_multiplier) => {
    const month_name = document.getElementById("month")

    month_name.innerHTML = month

    const instances = await getInstances();

    const body = {
        "instances": instances,
        "infra_multiplier": infra_multiplier
    }

    console.log(body)

    const container = document.getElementById("summary-container")

    try {
        const summary = await fetch("http://localhost:8000/predict-infra/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const response = await summary.json()

        let current_instances = instances.length

        let current_cpus = 0
        let current_ram = 0
        let current_cost = 0

        instances.forEach(instance => {
            const { cpu, ram, monthly_cost } = instance;

            current_cpus += cpu
            current_ram += parseFloat(ram)
            current_cost += parseFloat(monthly_cost)
        })

        current_cost += volumes_cost

        let vertical_cpus = 0
        let vertical_ram = 0
        let vertical_cost = 0

        let horizontal_instances = current_instances * 2
        let horizontal_cpus = 0
        let horizontal_ram = 0
        let horizontal_cost = 0

        response.forEach(instance => {
            const { vertical, horizontal } = instance;

            vertical_cost += vertical.final_cost
            vertical_cpus += vertical.new_instance.cpus
            vertical_ram += vertical.new_instance.memory

            horizontal_cost += horizontal.final_cost
            horizontal_cpus += horizontal.new_instance.cpus
            horizontal_ram += horizontal.new_instance.memory
        })

        vertical_cost += volumes_cost
        horizontal_cost += volumes_cost

        console.log(response)

        container.innerHTML = generateSummaryHTML(current_instances, current_cpus, current_ram, current_cost, vertical_cpus, vertical_ram, vertical_cost, horizontal_instances, horizontal_cpus, horizontal_ram, horizontal_cost)
    } catch (e) {
        console.error(e)
        container.innerHTML = errorSummaryHTML;
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

    vertical_cost = round2(vertical_cost);
    horizontal_cost = round2(horizontal_cost);

    return `
    <div class="w-full flex gap-8">
        <div class="w-1/2">
            <div class="w-full h-fit mb-4 rounded-xl py-2 bg-slate-100 border-blue-800 border text-blue-950">
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
            <div class="w-full h-fit mb-4 rounded-xl py-2 bg-slate-100 border-blue-800 border text-blue-950">
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

const errorSummaryHTML = `
    <div class="w-full flex gap-8">
        <div class="w-1/2">
            <div class="w-full h-fit mb-4 rounded-xl p-2 bg-slate-100 border-blue-800 border text-blue-950">
                <div class="flex w-full items-center justify-center h-32">
                    <h1 class="text-center">O servico <span class="font-bold">FinOps Predictability</span> está fora do ar no momento.
                        <br>
                        Tente novamente mais tarde.
                    </h1>
                </div>
            </div>
        </div>
        <div class="w-1/2">
            <div class="w-full h-fit mb-4 rounded-xl p-2 bg-slate-100 border-blue-800 border text-blue-950">
                <div class="flex w-full items-center justify-center h-32">
                    <h1 class="text-center">O servico <span class="font-bold">FinOps Predictability</span> está fora do ar no momento.
                        <br>
                        Tente novamente mais tarde.
                    </h1>
                </div>
            </div>
        </div>
    </div>
`

const atualizarDataHora = () => {
    const elementoData = document.getElementById('data-atualizacao');
    if (!elementoData) return;

    const agora = new Date();

    const opcoes = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    let dataFormatada = agora.toLocaleDateString('pt-BR', opcoes);

    elementoData.innerText = dataFormatada;

    const opcao_mes = {
        month: 'long'
    }

    const mes_atual = agora.toLocaleDateString('pt-BR', opcao_mes)

    const mes_atual_formatado = mes_atual.charAt(0).toUpperCase() + mes_atual.slice(1)

    generateSummary(mes_atual_formatado, forecast[labels.indexOf(mes_atual_formatado)])
};

atualizarDataHora()