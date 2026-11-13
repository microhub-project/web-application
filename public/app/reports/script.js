var employeesList = [
    { name: "João", initials: "JS", avgTime: "00:40", count: 8, minTime: "00:20", maxTime: "01:00" },
    { name: "Thais", initials: "TB", avgTime: "00:20", count: 18, minTime: "00:10", maxTime: "00:30" },
    { name: "Flávia", initials: "FC", avgTime: "00:50", count: 12, minTime: "00:25", maxTime: "01:10" },
    { name: "Pedro", initials: "PL", avgTime: "00:30", count: 3, minTime: "00:15", maxTime: "00:45" }
];


var instancesChartLabels = ["autenticação-03", "pagamento-01", "notificação-01", "carrinho-02"];
var instancesChartValues = [2, 6, 4, 2];

var instancesRanking = [
    { name: "CPU", value: "7" },
    { name: "RAM", value: "3" },
    { name: "Disco", value: "2" },
    { name: "Memória Swap", value: "2" }
];

var instancesTotal = 14;
var instancesLongest = { name: "pagamento-01", time: "01:10" };

var instancesList = [
    { name: "pagamento-01", totalTime: "02:40", count: 6, longest: "01:10", component: "CPU" },
    { name: "notificação-01", totalTime: "01:30", count: 4, longest: "00:40", component: "RAM" },
    { name: "autenticação-03", totalTime: "00:50", count: 2, longest: "00:30", component: "Disco" },
    { name: "carrinho-02", totalTime: "00:40", count: 2, longest: "00:25", component: "Memória Swap" }
];

var myChart = null;

var cardClass = "bg-slate-100 border border-blue-300 rounded-lg";
var switchBase = "px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer";
var switchActive = switchBase + " bg-white text-slate-900 shadow-sm";
var switchInactive = switchBase + " text-blue-500";


window.addEventListener("DOMContentLoaded", function () {
    lastUpdate.innerHTML = getCurrentDateText();
    showEmployees();
});



async function showEmployees() {

    const token = sessionStorage.getItem('JWT_TOKEN');

    try{ 
        const response = await fetch('/reports/getGeralFunc', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const body = await response.json();

        var employeesRanking = []
        var employeesChartLabels = []
        var employeesChartValues = []
        var employeesMax = {}
        var employeesMin = {}
        var max = 0
        var min = 10000


        for(let i = 0; i < 5; i++){
            var pessoa = body.data[i]

            employeesRanking[i] = {"name": pessoa.funcionario,
                "value": pessoa.media
            }
            employeesChartLabels[i] = `${pessoa.funcionario}`
            employeesChartValues[i] = pessoa.alertas_resolvidos 
        }

        for(let i = 0; i < body.data.length; i++){
            var pessoa = body.data[i]
            var tempoMax = pessoa.alertaMax
            var tempoMin = pessoa.alertaMin

            if(tempoMax > max){
                employeesMax = {
                    name: pessoa.funcionario,
                    time: tempoMax
                }
                max = tempoMax
            }
            if(tempoMin < min){
                employeesMin = {
                    name: pessoa.funcionario,
                    time: tempoMin
                }
                min = tempoMin
            }
        }


        btnEmployees.className = switchActive;
        btnInstances.className = switchInactive;

        drawChart("Top 5 funcionários com mais alertas resolvidos/mês", employeesChartLabels, employeesChartValues);
        drawRanking("Top 5 melhores médias de tempo de resolução/mês", employeesRanking);
        drawEmployeesSideCards(employeesMin, employeesMax);
        drawEmployeesList();
    } catch (e){
        console.log("caquinha")
    }
    
}

function showInstances() {
    btnEmployees.className = switchInactive;
    btnInstances.className = switchActive;

    drawChart("Quantidade de alertas por instância (Mensal)", instancesChartLabels, instancesChartValues);
    drawRanking("Componentes com mais alertas", instancesRanking);
    drawInstancesSideCards();
    drawInstancesList();
}


function twoDigits(number) {
    if (number < 10) {
        return "0" + number;
    }
    return "" + number;
}

function getCurrentDateText() {
    var months = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
    var now = new Date();

    var day = twoDigits(now.getDate());
    var month = months[now.getMonth()];
    var year = now.getFullYear();
    var hour = twoDigits(now.getHours());
    var minute = twoDigits(now.getMinutes());

    return day + " de " + month + " de " + year + ", " + hour + ":" + minute;
}



function drawChart(title, labels, values) {
    chartTitle.innerHTML = title;

    if (myChart != null) {
        myChart.destroy();
    }

    var biggest = values[0];
    for (var i = 0; i < values.length; i++) {
        if (values[i] > biggest) {
            biggest = values[i];
        }
    }

    var colors = [];
    for (var i = 0; i < values.length; i++) {
        if (values[i] == biggest) {
            colors.push("#2563eb");
        } else {
            colors.push("#93c5fd");
        }
    }

    var ctx = document.getElementById("mainChart").getContext("2d");

    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}

function drawRanking(title, items) {
    rankTitle.innerHTML = title;

    var html = "";

    for (var i = 0; i < items.length; i++) {
        var horaAtual = items[i].value
        var tempo = "" + convertTime(horaAtual)
        
        if(items[i].value < 60){
            items[i].value = `00:${items[i].value}`
        }else{
            var horas = 0
            var minutos = items[i].value
            while(minutos > 60){
                minutos -= 60
                horas++
            }
            if(horas < 10){
                items[i].value = `0${horas}:${minutos}`
            } else {
                items[i].value = `${horas}:${minutos}`
            }
            
        }
        html += `
            <li class="flex items-center justify-between">
                <span class="text-base">${items[i].name}</span>
                <span class="text-base font-semibold">${items[i].value}</span>
            </li>`;
    }

    rankList.innerHTML = html;
}

function convertTime(horario){
    var minutos = horario
    var hrs = 0
    var convertido = ""

    if(minutos < 60){
        if(minutos < 10){
            convertido = `00:0${minutos}`
        } else{
            tempoMin = `00:${minutos}`
        }
    } else {
        while(minutos >= 60){
            hrs++
            minutos -= 60
        }
        if(hrs < 10){
            if(minutos < 10){
                convertido = `0${hrs}:0${minutos}`
            } else {
                convertido = `0${hrs}:${minutos}`
            }
        } else {
            if(minutos < 10){
                convertido = `${hrs}:0${minutos}`
            } else {
                convertido = `${hrs}:${minutos}`
            }
        }
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

function drawInstancesSideCards() {
    sideCards.innerHTML = `
        <div class="${cardClass} p-4 flex flex-col gap-3 flex-1">
            <h2 class="text-xs font-bold">Volume total de alertas no mês</h2>
            <div class="flex items-center justify-center flex-1">
                <span class="text-5xl font-semibold">${instancesTotal}</span>
            </div>
        </div>
        <div class="${cardClass} p-4 flex flex-col gap-3 flex-1">
            <h2 class="text-xs font-bold">Instância com maior tempo em alerta</h2>
            <div class="flex items-center justify-between gap-2 flex-1 px-1">
                <span class="text-lg font-semibold truncate">${instancesLongest.name}</span>
                <span class="text-xl font-semibold text-red-600">${instancesLongest.time}</span>
            </div>
        </div>`;
}

function drawEmployeesList() {
    var html = "";

    for (var i = 0; i < employeesList.length; i++) {
        var item = employeesList[i];

        html += `
        <article class="${cardClass} px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-6">
            <div class="flex items-center gap-4 lg:w-1/4 min-w-0">
                <div class="rounded-full bg-slate-900 text-slate-50 size-12 shrink-0 flex justify-center items-center text-sm font-bold">${item.initials}</div>
                <h3 class="text-3xl font-semibold truncate">${item.name}</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-5 flex-1 lg:divide-x lg:divide-slate-300">
                ${buildMetric("Tempo médio de resolução", item.avgTime, "text-3xl", "text-slate-900")}
                ${buildMetric("Quantidade de atendimentos/mês", item.count, "text-3xl", "text-slate-900")}
                ${buildMetric("Menor tempo de resolução", item.minTime, "text-3xl", "text-slate-900")}
                ${buildMetric("Maior tempo de resolução", item.maxTime, "text-3xl", "text-red-600")}
            </div>
        </article>`;
    }

    detailList.innerHTML = html;
}

function drawInstancesList() {
    var html = "";

    for (var i = 0; i < instancesList.length; i++) {
        var item = instancesList[i];

        html += `
        <article class="${cardClass} px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-6">
            <div class="flex items-center gap-4 lg:w-1/4 min-w-0">
                <h3 class="text-3xl font-semibold truncate">${item.name}</h3>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-5 flex-1 lg:divide-x lg:divide-slate-300">
                ${buildMetric("Tempo total em alerta", item.totalTime, "text-3xl", "text-slate-900")}
                ${buildMetric("Quantidade de alertas/mês", item.count, "text-3xl", "text-slate-900")}
                ${buildMetric("Alerta de maior duração", item.longest, "text-3xl", "text-slate-900")}
                ${buildMetric("Componente com maior origem de alertas", item.component, "text-2xl", "text-red-600")}
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
