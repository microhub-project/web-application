var myChart = null;

var cardClass = "bg-slate-100 border border-blue-300 rounded-lg";
var switchBase = "px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer";
var switchActive = switchBase + " bg-white text-slate-900 shadow-sm";
var switchInactive = switchBase + " text-blue-500";


function errorBox(msg) {
    return `
        <div class="flex flex-col items-center justify-center gap-2 flex-1 w-full h-full text-center text-slate-500 py-6">
            <i class="ph ph-warning-circle text-3xl text-red-500"></i>
            <span class="text-sm font-semibold">${msg}</span>
        </div>`;
}

function setChartError(title, msg) {
    chartTitle.innerHTML = title;

    if (myChart != null) {
        myChart.destroy();
        myChart = null;
    }

    var canvas = document.getElementById("mainChart");
    canvas.classList.add("hidden");

    var box = document.getElementById("chartError");
    if (!box) {
        box = document.createElement("div");
        box.id = "chartError";
        canvas.parentElement.appendChild(box);
    }
    box.className = "absolute inset-0 flex";
    box.innerHTML = errorBox(msg);
}

function clearChartError() {
    var box = document.getElementById("chartError");
    if (box) {
        box.className = "hidden";
    }
    document.getElementById("mainChart").classList.remove("hidden");
}

function setRankError(title, msg) {
    rankTitle.innerHTML = title;
    rankList.innerHTML = `<li class="flex flex-1">${errorBox(msg)}</li>`;
}

function setSideError(msg) {
    sideCards.innerHTML = `<div class="${cardClass} p-4 flex flex-col flex-1">${errorBox(msg)}</div>`;
}

function setListError(msg) {
    detailList.innerHTML = `<div class="${cardClass} p-4 flex">${errorBox(msg)}</div>`;
}


async function showEmployees() {

    const token = sessionStorage.getItem('JWT_TOKEN');

    const chartTitleText = "Top 5 funcionários com mais alertas resolvidos/mês";
    const rankTitleText = "Top 5 melhores médias de tempo de resolução/mês";

    btnEmployees.className = switchActive;
    btnInstances.className = switchInactive;

    try {
        const response = await fetch('/reports/getGeralFunc', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const body = await response.json();

        if (!body || !Array.isArray(body.data)) {
            throw new Error("Resposta inválida");
        }

        if (body.data.length == 0) {
            showToast("Sem alertas resolvidos neste mês", "warning");
            setChartError(chartTitleText, "Sem dados neste mês");
            setRankError(rankTitleText, "Sem dados neste mês");
            setSideError("Sem dados neste mês");
            setListError("Sem dados neste mês");
            return;
        }

        var employeesRanking = []
        var employeesChartLabels = []
        var employeesChartValues = []
        var employeesMax = {}
        var employeesMin = {}
        var max = 0
        var min = 10000


        for (let i = 0; i < 5 && i < body.data.length; i++) {
            var pessoa = body.data[i]

            employeesRanking[i] = {
                "name": pessoa.funcionario,
                "value": pessoa.media
            }
            employeesChartLabels[i] = `${pessoa.funcionario}`
            employeesChartValues[i] = pessoa.alertas_resolvidos
        }

        for (let i = 0; i < body.data.length; i++) {
            var pessoa = body.data[i]
            var tempoMax = pessoa.alertaMax
            var tempoMin = pessoa.alertaMin

            if (tempoMax > max) {
                employeesMax = {
                    name: pessoa.funcionario,
                    time: tempoMax
                }
                max = tempoMax
            }
            if (tempoMin < min) {
                employeesMin = {
                    name: pessoa.funcionario,
                    time: tempoMin
                }
                min = tempoMin
            }
        }


        btnEmployees.className = switchActive;
        btnInstances.className = switchInactive;

        drawChart(chartTitleText, employeesChartLabels, employeesChartValues);
        drawRankingFunc(rankTitleText, employeesRanking);
        drawEmployeesSideCards(employeesMin, employeesMax);
        drawEmployeesList(body.data);
    } catch (e) {
        console.log(e)
        showToast("Erro ao carregar dados dos funcionários", "error");
        setChartError(chartTitleText, "Erro ao carregar");
        setRankError(rankTitleText, "Erro ao carregar");
        setSideError("Erro ao carregar");
        setListError("Erro ao carregar");
    }

}

async function showInstances() {

    btnEmployees.className = switchInactive;
    btnInstances.className = switchActive;
    var maxKpi = {}

    const chartTitleText = "Top 5 instancias com mais alertas/mês";
    const rankTitleText = "Componentes com mais alertas";

    try {
        const token = sessionStorage.getItem('JWT_TOKEN');
        const response = await fetch('/reports/getGeralInst', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const body = await response.json();

        if (!body || !Array.isArray(body.data)) {
            throw new Error("Resposta inválida");
        }

        const dados = body.data

        if (dados.length == 0) {
            throw new Error("vazio");
        }

        var instancesChartLabels = []
        var instancesChartValues = []

        if (dados.length < 5) {
            for (let i = 0; i < dados.length; i++) {
                var instacia = dados[i]
                instancesChartLabels[i] = `${instacia.nome}`
                instancesChartValues[i] = instacia.alertas
            }
        } else {
            for (let i = 0; i < 5; i++) {
                var instacia = dados[i]
                instancesChartLabels[i] = `${instacia.nome}`
                instancesChartValues[i] = instacia.alertas
            }
        }

        for (let i = 0; i < dados.length; i++) {
            var minutosMaior = dados[i].maior
            var hrsMaior = 0
            var hrsTotal = 0
            var minutosTotal = dados[i].total

            while (minutosMaior >= 60) {
                hrsMaior++;
                minutosMaior -= 60
            }
            while (minutosTotal >= 60) {
                hrsTotal++
                minutosTotal -= 60
            }

            dados[i].total = `${hrsTotal}:${twoDigits(minutosTotal)}`
            dados[i].maior = `${hrsMaior}:${twoDigits(minutosMaior)}`
        }

        var max = dados[0].maior
        var nomeMax = dados[0].nome

        for (let i = 0; i < dados.length; i++) {
            if (dados[i].maior > max) {
                max = dados[i].maior
                nomeMax = dados[i].nome
            }
        }

        maxKpi = {
            "nome": nomeMax,
            "valor": max
        }

        drawChart(chartTitleText, instancesChartLabels, instancesChartValues);
        drawInstancesList(dados);
    } catch (e) {
        console.log(e)
        var msg = "Erro ao carregar";
        if (e.message == "vazio") {
            msg = "Sem dados neste mês";
            showToast("Sem alertas neste mês", "warning");
        } else {
            showToast("Erro ao carregar instâncias", "error");
        }
        setChartError(chartTitleText, msg);
        setListError(msg);
    }
    try {
        const token = sessionStorage.getItem('JWT_TOKEN');
        const response = await fetch('/reports/getTotalAlertas', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const body = await response.json();

        if (!body || !Array.isArray(body.data) || body.data.length == 0 || !body.data[0]) {
            throw new Error("Resposta inválida");
        }

        if (Object.keys(maxKpi).length == 0) {
            throw new Error("Sem dados de instâncias");
        }

        drawInstancesSideCards(maxKpi, body.data[0]);
    } catch (e) {
        console.log(e)
        setSideError("Erro ao carregar");
    }

    try {
        const token = sessionStorage.getItem('JWT_TOKEN');
        const response = await fetch('/reports/getRankingAlertas', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const body = await response.json();

        if (!body || !Array.isArray(body.data)) {
            throw new Error("Resposta inválida");
        }

        if (body.data.length == 0) {
            setRankError(rankTitleText, "Sem dados neste mês");
            return;
        }

        drawRankingFunc(rankTitleText, body.data);
    } catch (e) {
        console.log(e)
        setRankError(rankTitleText, "Erro ao carregar");
    }

}


function twoDigits(number) {
    if (number < 10) {
        return "0" + number;
    }
    return "" + number;
}

function drawChart(title, labels, values) {
    clearChartError();
    chartTitle.innerHTML = title;

    if (myChart != null) {
        myChart.destroy();
    }

    var biggest = values[0];
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        if (values[i] > biggest) {
            biggest = values[i];
        }
        sum += values[i];
    }

    var average = values.length > 0 ? sum / values.length : 0;

    var colors = [];
    for (var i = 0; i < values.length; i++) {
        colors.push(values[i] == biggest ? "#2563eb" : "#93c5fd");
    }

    var ctx = document.getElementById("mainChart").getContext("2d");

    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{ data: values, backgroundColor: colors }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        },
        plugins: [{
            afterDatasetsDraw: function (chart) {
                var c = chart.ctx;
                var y = chart.scales.y.getPixelForValue(average);
                c.save();
                c.setLineDash([6, 6]);
                c.strokeStyle = "#ef4444";
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(chart.chartArea.left, y);
                c.lineTo(chart.chartArea.right, y);
                c.stroke();
                c.restore();
            }
        }]
    });
}

function drawRankingFunc(title, items) {
    rankTitle.innerHTML = title;
    var html = "";

    if (title.toLowerCase().includes("médias")) {
        for (var i = 0; i < items.length; i++) {

            items[i].value = convertTime(items[i].value)
            html += `
            <li class="flex items-center justify-between">
                <span class="text-base">${items[i].name}</span>
                <span class="text-base font-semibold">${items[i].value}</span>
            </li>`;
        }
    } else {
        for (var i = 0; i < items.length; i++) {

            html += `
            <li class="flex items-center justify-between">
                <span class="text-base">${items[i].name}</span>
                <span class="text-base font-semibold">${items[i].value}</span>
            </li>`;
        }
    }

    rankList.innerHTML = html;
}

function convertTime(horario) {
    var minutos = horario
    var hrs = 0
    var convertido = ""

    if (minutos < 60) {
        convertido = `0:${twoDigits(minutos)}`
    } else {
        while (minutos >= 60) {
            hrs++
            minutos -= 60
        }
        convertido = `${hrs}:${twoDigits(minutos)}`
    }
    return convertido;
}

function drawEmployeesSideCards(min, max) {

    var tempoMax = convertTime(max.time)
    var tempoMin = convertTime(min.time)

    sideCards.innerHTML = `
        <div class="${cardClass} p-4 flex flex-col gap-3 flex-1">
            <h2 class="text-xs font-bold">Menor tempo de resolução</h2>
            <div class="flex items-center justify-between gap-2 flex-1 px-2">
                <span class="text-xl font-semibold">${min.name}</span>
                <span class="flex items-center gap-2 text-2xl font-semibold text-green-600">
                    <i class="ph ph-clock text-base text-slate-400"></i>${tempoMin}
                </span>
            </div>
        </div>
        <div class="${cardClass} p-4 flex flex-col gap-3 flex-1">
            <h2 class="text-xs font-bold">Maior tempo de resolução</h2>
            <div class="flex items-center justify-between gap-2 flex-1 px-2">
                <span class="text-xl font-semibold">${max.name}</span>
                <span class="flex items-center gap-2 text-2xl font-semibold text-red-600">
                    <i class="ph ph-clock text-base text-slate-400"></i>${tempoMax}
                </span>
            </div>
        </div>`;
}

function drawInstancesSideCards(maior, total) {
    sideCards.innerHTML = `
        <div class="${cardClass} p-4 flex flex-col gap-3 flex-1">
            <h2 class="text-xs font-bold">Volume total de alertas no mês</h2>
            <div class="flex items-center justify-center flex-1">
                <span class="text-5xl font-semibold">${total.total}</span>
            </div>
        </div>
        <div class="${cardClass} p-4 flex flex-col gap-3 flex-1">
            <h2 class="text-xs font-bold">Instância com maior tempo em alerta</h2>
            <div class="flex items-center justify-between gap-2 flex-1 px-1">
                <span class="text-lg font-semibold truncate">${maior.nome}</span>
                <span class="text-xl font-semibold text-red-600">${maior.valor}</span>
            </div>
        </div>`;
}

function drawEmployeesList(data) {
    var html = "";

    for (var i = 0; i < data.length; i++) {
        var item = data[i];

        html += `
        <article class="${cardClass} px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-6">
            <div class="flex items-center gap-4 lg:w-1/4 min-w-0">
                <h3 class="text-3xl font-semibold truncate">${item.funcionario}</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-5 flex-1 lg:divide-x lg:divide-slate-300">
                ${buildMetric("Tempo médio de resolução", convertTime(item.media), "text-3xl", "text-slate-900")}
                ${buildMetric("Quantidade de atendimentos/mês", item.alertas_resolvidos, "text-3xl", "text-slate-900")}
                ${buildMetric("Menor tempo de resolução", convertTime(item.alertaMin), "text-3xl", "text-slate-900")}
                ${buildMetric("Maior tempo de resolução", convertTime(item.alertaMax), "text-3xl", "text-red-600")}
            </div>
        </article>`;

    }

    detailList.innerHTML = html;
}

function drawInstancesList(dados) {
    var html = "";

    for (var i = 0; i < dados.length; i++) {
        var item = dados[i];

        html += `
        <article class="${cardClass} px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-6">
            <div class="flex items-center gap-4 lg:w-1/4 min-w-0">
                <h3 class="text-3xl font-semibold truncate">${item.nome}</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-5 flex-1 lg:divide-x lg:divide-slate-300">
                ${buildMetric("Tempo total em alerta", item.total, "text-3xl", "text-slate-900")}
                ${buildMetric("Quantidade de alertas/mês", item.alertas, "text-3xl", "text-slate-900")}
                ${buildMetric("Alerta de maior duração", item.maior, "text-3xl", "text-slate-900")}
                ${buildMetric("Componente com maior origem de alertas", item.componente, "text-2xl", "text-red-600")}
            </div>
        </article>`;
    }

    detailList.innerHTML = html;
}

function buildMetric(label, value, size, color) {
    return `
        <div class="flex flex-col items-center justify-between gap-3 text-center px-2">
            <span class="text-[11px] leading-tight text-slate-600">${label}</span>
            <span class="${size} font-semibold ${color}">${value}</span>
        </div>`;
}

async function downloadPdf() {
    const token = sessionStorage.getItem('JWT_TOKEN');

    try {
        const response = await fetch('/reports/download-url', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();

        const link = document.createElement("a");
        link.href = body.url;
        link.click();
    } catch (e) {
        console.log(e);
    }
}

showEmployees();