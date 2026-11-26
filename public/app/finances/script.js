const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const forecast = [1.23, 1.45, 1.8, 1.47, 2.07, 1.9, 2.06, 1.67, 1.66, 1.77, 6.65, 2.57]

const setGraphLoading = (isLoading) => {
    const loading = document.getElementById("months-graph-loading")
    if (!loading) return

    loading.classList.toggle("hidden", !isLoading)
    loading.classList.toggle("flex", isLoading)
}

const renderGraph = async (current_cpus, current_ram) => {
    const userData = getUserSession();

    if (!userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    setGraphLoading(true)

    const body = {
        "company": userData.companyName,
        "instances": 0,
        "cpus": 0,
        "ram": 0
    }

    const current_components = current_cpus + current_ram

    const toPercent = (value) => Math.round((value * 100) / current_components - 100)

    let historical_infra = Array(12).fill(null)
    let infra_forecast = Array(12).fill(null)

    try {
        if (!current_components) throw new Error("Infraestrutura atual vazia")

        const analysis = await fetch("http://localhost:8000/infra-analysis-year/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        const response = await analysis.json()

        for (let i = 0; i < response.cpus_month.length; i++) {
            const total = response.cpus_month[i] + response.ram_month[i]

            historical_infra[i] = total > 0 ? toPercent(total) : null
        }

        for (let i = 0; i < forecast.length; i++) {
            infra_forecast[i] = toPercent(forecast[i] * current_components)
        }
    } catch (e) {
        console.error(e)
        setGraphLoading(false)
        showToast(
            "Algo deu errado ao carregar a análise anual.",
            "error"
        );
        let fallback = document.getElementById("months-graph-fallback")
        fallback.classList.remove("hidden")
        fallback.classList.add("flex")
        return
    }

    const formatPercent = (value) => `${value > 0 ? '+' : ''}${value}%`

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Variação média do mercado',
                data: infra_forecast,
                borderRadius: 7.5,
                backgroundColor: '#FFFFFF',
                borderColor: '#1E3A8A',
                borderWidth: 1,
                order: 1,
                borderSkipped: false
            },
            {
                label: `Variação da infraestrutura da ${userData.companyName}`,
                data: historical_infra,
                borderRadius: 7.5,
                backgroundColor: '#93C5FD',
                borderColor: '#1E3A8A',
                borderWidth: 1,
                order: 1,
                borderSkipped: false
            }
        ]
    };

    const isMobile = window.innerWidth < 768

    const config = {
        type: 'bar',
        data: data,
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements, chart) => {
                if (elements.length > 0) {
                    const monthIndex = elements[0].index;
                    const selectedMonth = chart.data.labels[monthIndex];
                    const infraMultiplier = forecast[monthIndex];

                    generateSummary(selectedMonth, infraMultiplier);
                }
            },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            },
            plugins: {
                legend: {
                    display: true,
                    position: isMobile ? 'bottom' : 'top',
                    labels: {
                        usePointStyle: true,
                        generateLabels: (chart) => {
                            const defaults = Chart.defaults.plugins.legend.labels.generateLabels(chart);

                            defaults.forEach(label => {
                                const dataset = chart.data.datasets[label.datasetIndex];
                                label.pointStyle = dataset.type === 'line' ? 'line' : 'rect';
                            });

                            return defaults;
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${formatPercent(ctx.parsed.y)}`
                    }
                },
                datalabels: {
                    display: (context) => {
                        const value = context.dataset.data[context.dataIndex]
                        return context.datasetIndex !== 2 && value !== null
                    },
                    formatter: (value) => formatPercent(value),
                    align: (context) => context.dataset.data[context.dataIndex] < 0 ? 'bottom' : 'top',
                    anchor: 'end',
                    offset: 4,
                    color: '#64748B',
                    font: { weight: 'bold', size: isMobile ? 11 : 14 }
                }
            },
            scales: {
                y: {
                    title: {
                        display: !isMobile,
                        text: 'Variação da infraestrutura atual (%)',
                        font: { weight: 'bold', size: 14 }
                    },
                    ticks: { callback: (value) => `${value}%` }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        },
    };

    new Chart(document.getElementById('months-graph'), config)
    setGraphLoading(false)
}

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

const renderMonthSelect = (month) => {
    const month_name = document.getElementById("month")

    month_name.innerHTML = `<option value="${month}" selected>${month}</option>`

    let monthOptions = ``

    labels.forEach(monthName => {
        if (monthName != month) {
            monthOptions += `<option value="${monthName}">${monthName}</option>`
        }
    })

    month_name.innerHTML += monthOptions
}

const monthChange = (month) => {
    generateSummary(month, forecast[labels.indexOf(month)])
}

const generateSummary = async (month, infra_multiplier) => {
    renderMonthSelect(month);

    const instances = await getInstances();

    const body = {
        "instances": instances,
        "infra_multiplier": infra_multiplier
    }

    const containerV = document.getElementById("summary-vertical")
    const containerH = document.getElementById("summary-horizontal")

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

        const html = generateSummaryHTML(current_instances, current_cpus, current_ram, current_cost, vertical_cpus, vertical_ram, vertical_cost, horizontal_instances, horizontal_cpus, horizontal_ram, horizontal_cost)
        containerV.innerHTML = html.vertical
        containerH.innerHTML = html.horizontal
    } catch (e) {
        console.error(e)
        containerV.innerHTML = errorSummaryHTML
        containerH.innerHTML = errorSummaryHTML
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

    renderCurrentInfraestructure(current_instances, current_cpus, current_ram, current_cost)

    const row = (label, from, to, style, badge) => `
        <div class="flex flex-wrap items-center gap-1.5 my-3 mx-3">
            <p class="font-bold">${label}</p>
            <p>${from}</p>
            <i class="ph-bold ph-arrow-right text-lg shrink-0"></i>
            <p>${to}</p>
            <p class="rounded-3xl ${style} w-fit py-1 px-2 border text-xs md:text-sm whitespace-nowrap">${badge}</p>
        </div>`

    const card = (rows, from, to, toClass, badgeStyle, badge) => `
        <div class="w-full h-fit mb-4 rounded-xl py-2 bg-slate-100 border-blue-800 border text-blue-950">
            <div class="flex flex-col md:flex-row xl:flex-col 2xl:flex-row w-full">
                <div class="w-full md:w-3/5 xl:w-full 2xl:w-3/5 min-w-0">${rows.join('')}</div>
                <div class="w-full md:w-2/5 xl:w-full 2xl:w-2/5 min-w-0 text-center my-auto px-2 pb-4 md:pb-0 xl:pb-4 2xl:pb-0">
                    <h2 class="text-lg md:text-xl font-bold">Custo:</h2>
                    <div class="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                        <p class="text-base sm:text-lg font-bold whitespace-nowrap">$${from}</p>
                        <i class="ph-bold ph-arrow-right text-base sm:text-lg shrink-0"></i>
                        <p class="text-base sm:text-lg font-bold whitespace-nowrap ${toClass}">$${to}</p>
                    </div>
                    <p class="rounded-3xl ${badgeStyle} mx-auto w-fit max-w-full py-1 px-2 border text-xs sm:text-sm whitespace-nowrap">${badge}</p>
                </div>
            </div>
        </div>`

    return {
        vertical: card([
            row('Instâncias:', current_instances, current_instances, badgeStyles.neutral, '+0 (+0%)'),
            row('CPUs:', current_cpus, vertical_cpus, vertical_cpus_style, `+${vertical_cpus_increase} (+${vertical_cpus_increase_percentage}%)`),
            row('RAM (GiB):', current_ram, vertical_ram, vertical_ram_style, `+${vertical_ram_increase} (+${vertical_ram_increase_percentage}%)`)
        ], current_cost, vertical_cost, vertical_cost_text, vertical_cost_style,
           `+$${vertical_cost_increase} (+${vertical_cost_increase_percentage}%)`),

        horizontal: card([
            row('Instâncias:', current_instances, horizontal_instances, badgeStyles.red, `+${horizontal_instances_increase} (+${horizontal_instances_increase_percentage}%)`),
            row('CPUs:', current_cpus, horizontal_cpus_total, horizontal_cpus_style, `+${horizontal_cpus_increase} (+${horizontal_cpus_increase_percentage}%)`),
            row('RAM (GiB):', current_ram, horizontal_ram_total, horizontal_ram_style, `+${horizontal_ram_increase} (+${horizontal_ram_increase_percentage}%)`)
        ], current_cost, horizontal_cost, horizontal_cost_text, horizontal_cost_style,
           `+$${horizontal_cost_increase} (+${horizontal_cost_increase_percentage}%)`)
    }
};

const errorSummaryHTML = `
    <div class="w-full h-fit mb-4 rounded-xl p-2 bg-slate-100 border-blue-800 border text-blue-950">
        <div class="flex w-full items-center justify-center h-32">
            <h1 class="text-center">O serviço <span class="font-bold">FinOps Predictability</span> está fora do ar no momento.
                <br>Tente novamente mais tarde.
            </h1>
        </div>
    </div>
`

const renderCurrentInfraestructure = (instances, cpus, ram, cost) => {
    let instance_container = document.getElementById('current-instances')
    let cpus_container = document.getElementById('current-cpus')
    let ram_container = document.getElementById('current-ram')
    let cost_container = document.getElementById('current-cost')


    instance_container.innerHTML = instances
    cpus_container.innerHTML = `${cpus} vCPU`
    ram_container.innerHTML = `${ram} GiB`
    cost_container.innerHTML = `$${cost}`
}

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

const initialize = async () => {
    const instances = await getInstances();

    if (!instances) {
        setGraphLoading(false)
        const fallback = document.getElementById("months-graph-fallback")
        fallback.classList.remove("hidden")
        fallback.classList.add("flex")
        return
    }

    let current_cpus = 0
    let current_ram = 0

    instances.forEach(instance => {
        const { cpu, ram } = instance;

        current_cpus += cpu
        current_ram += parseFloat(ram)
    })

    renderGraph(current_cpus, current_ram)
}

const setupScalabilityPoints = () => {
    const points = document.querySelectorAll(".scalability-point");
    const isDesktopHover = () =>
        window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches;

    points.forEach((point) => {
        point.addEventListener("click", () => {
            if (isDesktopHover()) return;

            const description = point.querySelector(".scalability-description");
            if (description) {
                description.classList.toggle("ativo");
            }
        });
    });

    window.addEventListener("resize", () => {
        if (isDesktopHover()) {
            document.querySelectorAll(".scalability-description.ativo").forEach((el) => {
                el.classList.remove("ativo");
            });
        }
    });
};

setupScalabilityPoints()
initialize()
atualizarDataHora()