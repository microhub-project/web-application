
import { getUserSession } from "../../js/utils.js";

import {
    logout,
    fillUserInfos,
    verifyIfUserCanAccess
} from "../../js/session.js";


// ARRAY DE INSTÂNCIAS
let listaInstancias = [];


// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {

    fillUserInfos();
    verifyIfUserCanAccess();

    configurarMenuMobile();
    configurarPesquisa();

    carregarGraficos();
    loadInstances();

});


// ==========================================
// MENU MOBILE
// ==========================================

const configurarMenuMobile = () => {

    const menu = document.getElementById("menu");
    const botao = document.getElementById("btnToggleInstances");
    const icone = document.getElementById("iconToggleInstances");

    if (!menu || !botao) return;

    botao.addEventListener("click", () => {

        menu.classList.toggle("hidden");

        const menuAberto = !menu.classList.contains("hidden");

        botao.setAttribute("aria-expanded", menuAberto);

        if (menuAberto) {

            botao.querySelector("span").innerHTML = `
                <i class="fa-solid fa-server"></i>
                Fechar lista de instâncias
            `;

            icone.classList.remove("fa-chevron-down");
            icone.classList.add("fa-chevron-up");

        } else {

            botao.querySelector("span").innerHTML = `
                <i class="fa-solid fa-server"></i>
                Selecionar instância
            `;

            icone.classList.remove("fa-chevron-up");
            icone.classList.add("fa-chevron-down");

        }

    });

};


// FECHAR MENU APÓS SELECIONAR UMA INSTÂNCIA
const fecharMenuMobile = () => {

    if (window.innerWidth >= 768) return;

    const menu = document.getElementById("menu");
    const botao = document.getElementById("btnToggleInstances");
    const icone = document.getElementById("iconToggleInstances");

    if (!menu || !botao) return;

    menu.classList.add("hidden");

    botao.setAttribute("aria-expanded", "false");

    botao.querySelector("span").innerHTML = `
        <i class="fa-solid fa-server"></i>
        Selecionar instância
    `;

    icone.classList.remove("fa-chevron-up");
    icone.classList.add("fa-chevron-down");

};


// ==========================================
// PESQUISA DE INSTÂNCIAS
// ==========================================

const configurarPesquisa = () => {

    const inputBuscar = document.getElementById("inputBuscar");

    if (!inputBuscar) return;

    inputBuscar.addEventListener("input", () => {

        const pesquisa = inputBuscar.value.toLowerCase().trim();

        const instanciasFiltradas = listaInstancias.filter(instance => {

            const nome = (
                instance.nome ||
                instance.endereco_mac ||
                ""
            ).toLowerCase();

            const tipo = (instance.tipo || "").toLowerCase();

            return nome.includes(pesquisa) || tipo.includes(pesquisa);

        });

        renderizarInstancias(instanciasFiltradas);

    });

};


// ==========================================
// RENDERIZAR INSTÂNCIAS
// ==========================================

const renderizarInstancias = (instancias) => {

    const instancesContainer = document.getElementById("allInstances");

    instancesContainer.innerHTML = "";

    if (instancias.length === 0) {

        instancesContainer.innerHTML = `
            <p class="text-center text-slate-500 mt-4">
                Nenhuma instância encontrada.
            </p>
        `;

        return;
    }

    for (const instance of instancias) {

        const {
            uuid,
            nome,
            endereco_mac,
            custo_mensal,
            tipo
        } = instance;

        const nomeInstancia = nome || endereco_mac;

        const element = `

            <div
                onclick="loadInstance('${uuid}')"
                id="${uuid}"
                class="w-full flex flex-col rounded-xl border-2 border-slate-400 p-4 bg-white cursor-pointer hover:border-blue-700 transition-colors">

                <div class="flex flex-row items-center justify-between gap-2">

                    <span class="break-all">
                        ${nomeInstancia}
                    </span>

                    <span class="pr-4 text-sm text-slate-500 shrink-0">

                        Custo:

                        <span class="text-black">
                            $${custo_mensal}
                        </span>

                    </span>

                </div>

                <div class="flex flex-row items-center justify-between gap-2 mt-1">

                    <span class="text-sm text-slate-500">
                        ${tipo}
                    </span>

                    <div class="rounded-3xl border-[1px] border-yellow-500 text-yellow-500 text-sm bg-yellow-100 p-1 shrink-0">
                        Sub-utilizada
                    </div>

                </div>

            </div>

        `;

        instancesContainer.innerHTML += element;

    }

};


// ==========================================
// CARREGAR LISTA DE INSTÂNCIAS
// ==========================================

const loadInstances = async () => {

    const token = sessionStorage.getItem("JWT_TOKEN");
    const userData = getUserSession();

    if (!token || !userData) {

        console.log("Sessão ausente ou inválida");

        logout();

        return;
    }

    try {

        const response = await fetch('/finance-individual/listar-instancias', {

            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }

        });

        console.log("STATUS:", response.status);
        console.log("RESPOSTA:", await response.clone().text());

        if (response.status === 401 || response.status === 403) {

            logout();

            return;
        }

        if (response.status === 204) {

            return showToast("Não há nenhuma instância", "warning");
        }

        const body = await response.json();

        console.log("BODY:", body);

        if (response.status === 400) {

            return showToast(
                body.message || "Requisição inválida",
                "warning"
            );
        }

        if (response.status === 500) {

            return showToast(
                body.message || "Erro interno do servidor",
                "error"
            );
        }

        listaInstancias = body.data || [];

        console.log("INSTÂNCIAS:", listaInstancias);

        if (listaInstancias.length === 0) {

            return showToast("Não há nenhuma instância.", "warning");
        }

        renderizarInstancias(listaInstancias);

    } catch (e) {

        console.error("ERRO NA LOAD INSTANCES:", e);

        showToast(
            "Algo deu errado ao carregar as instâncias.",
            "error"
        );

    }

};


// ==========================================
// CARREGAR GRÁFICOS
// ==========================================

const carregarGraficos = () => {

    const barra = document.getElementById("graficoBarras");

    if (barra) {

        // Evita duplicação de gráficos
        const graficoAnterior = Chart.getChart(barra);

        if (graficoAnterior) {
            graficoAnterior.destroy();
        }

        new Chart(barra, {

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

    }


    // GRÁFICO DE ROSCA

    const ctxRosca = document.getElementById("graficoRosca");

    const textoCentral = {

        id: "textoCentral",

        afterDraw(chart) {

            const { ctx } = chart;

            const valores = chart.data.datasets[0].data;

            if (!valores.length) return;

            const total = valores.reduce(
                (soma, valor) => soma + valor,
                0
            );

            if (total === 0) return;

            const porcentagem = Math.round(
                (valores[0] / total) * 100
            );

            const pontoCentral = chart.getDatasetMeta(0).data[0];

            if (!pontoCentral) return;

            const centroX = pontoCentral.x;
            const centroY = pontoCentral.y;

            ctx.save();

            ctx.font = "bold 38px monospace";

            ctx.fillStyle = "#0f172a";

            ctx.textAlign = "center";

            ctx.textBaseline = "middle";

            ctx.fillText(
                porcentagem + "%",
                centroX,
                centroY
            );

            ctx.restore();

        }

    };


    if (ctxRosca) {

        // Evita duplicação de gráficos
        const graficoAnterior = Chart.getChart(ctxRosca);

        if (graficoAnterior) {
            graficoAnterior.destroy();
        }

        new Chart(ctxRosca, {

            type: "doughnut",

            data: {

                labels: [
                    "Capacidade atual",
                    "Desperdício"
                ],

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

    }

};


// ==========================================
// CARREGAR DETALHES DA INSTÂNCIA
// ==========================================

const loadInstance = async (uuid) => {

    const token = sessionStorage.getItem("JWT_TOKEN");
    const userData = getUserSession();

    if (!token || !userData) {

        console.log("Sessão ausente ou inválida");

        logout();

        return;
    }

    try {

        const response = await fetch(
            `/finance-individual/listar-itens-instancia/${uuid}`,
            {

                method: "GET",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                }

            }
        );

        console.log("STATUS:", response.status);
        console.log("RESPOSTA:", await response.clone().text());

        if (response.status === 401 || response.status === 403) {

            logout();

            return;
        }

        if (response.status === 204) {

            return showToast(
                "Não há nenhuma instância",
                "warning"
            );
        }

        const body = await response.json();

        console.log("BODY:", body);

        if (response.status === 400) {

            return showToast(
                body.message || "Requisição inválida",
                "warning"
            );
        }

        if (response.status === 500) {

            return showToast(
                body.message || "Erro interno do servidor",
                "error"
            );
        }

        const instanceView = document.getElementById("instanceMostra");

        const data = body.data || [];

        console.log("INSTÂNCIAS:", data);

        if (data.length === 0) {

            return showToast(
                "Não há nenhuma instância.",
                "warning"
            );
        }

        // Fecha o menu depois da seleção no celular
        fecharMenuMobile();


        for (const instance of data) {

            const {
                uuid,
                nome,
                endereco_mac,
                custo_mensal,
                custo_computacao,
                microsservico,
                tipo,
                cpu,
                ram
            } = instance;

            const nomeInstancia = nome || endereco_mac;

            const nomeMicrosservico = microsservico || "Não atribuído";


            const element = `

                <!-- INFORMAÇÕES E GRÁFICO DE BARRAS -->

                <div class="flex flex-col gap-6 row-span-1 col-span-1 min-w-0">

                    <div class="flex flex-col items-start justify-between h-28 max-md:h-auto max-md:gap-2">

                        <span id="instanceName" class="text-2xl font-extrabold break-words">
                            ${nomeInstancia}
                        </span>

                        <span id="typeName" class="text-xl">
                            ${tipo}
                        </span>

                        <span class="text-slate-400">
                            Microsserviço:
                            <span id="microsserviceName">${nomeMicrosservico}</span>
                        </span>

                    </div>

                    <div class="flex flex-col w-full h-80 bg-white border-[1px] border-blue-900 rounded-lg p-2 max-md:h-64">

                        <span class="ml-4 font-bold">
                            Capacidade da instância
                        </span>

                        <div class="relative flex-1 min-h-0">
                            <canvas id="graficoBarras"></canvas>
                        </div>

                    </div>

                </div>


                <!-- INDICADORES -->

                <div class="grid grid-rows-1 row-span-1 col-span-1 min-w-0">

                    <div class="flex flex-col gap-5">

                        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-4">

                            <div class="text-slate-400">
                                Custo total
                            </div>

                            <div class="text-5xl font-bold max-md:text-4xl">
                                $${custo_mensal}
                            </div>

                        </div>

                        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-7">

                            <div class="text-slate-400">
                                Desperdício
                            </div>

                            <div class="text-6xl font-bold text-red-700 max-md:text-4xl">
                                20%
                            </div>

                        </div>

                        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-8">

                            <div class="text-slate-400">
                                Status da instância
                            </div>

                            <div class="text-4xl font-bold text-orange-500 max-md:text-2xl max-[1600px]:text-2xl">
                                Sub-utilizada
                            </div>

                        </div>

                    </div>

                </div>


                <!-- ESCALABILIDADE -->

                <div class="flex flex-col gap-8 row-span-1 col-span-1 min-w-0">

                    <div id="verticalContainer" class="flex flex-col gap-4 w-full flex-1 min-w-0">

                        <div class="w-full rounded-lg p-3 bg-blue-400 border-[1px] border-blue-900 flex justify-center items-center text-xl font-bold">
                            Vertical
                        </div>

                        <div class="flex gap-4 justify-center items-center flex-1 max-[1600px]:flex-wrap max-md:flex-wrap">

                            <div class="grid grid-cols-3 grid-rows-3 items-center justify-center bg-white border-[1px] border-slate-500 rounded-xl p-4 max-lg:h-24 h-44 text-xl max-[1600px]:flex-1 max-[1600px]:min-w-[140px] max-md:flex-1 max-md:min-w-[130px] max-md:text-sm">

                                <span class="font-bold">${tipo}</span>

                                <span class="justify-self-end pr-8 max-md:pr-2">
                                    &gt;
                                </span>

                                <span class="font-bold">t3.small</span>

                                <span>${cpu} CPU</span>

                                <span class="justify-self-end pr-8 max-md:pr-2">
                                    &gt;
                                </span>

                                <span>2 CPU</span>

                                <span>${ram} RAM</span>

                                <span class="justify-self-end pr-8 max-md:pr-2">
                                    &gt;
                                </span>

                                <span>2 RAM</span>

                            </div>

                            <div class="flex flex-col justify-center gap-5 bg-white border-[1px] border-slate-500 rounded-xl p-4 max-lg:h-24 h-44 max-[1600px]:flex-1 max-[1600px]:min-w-[140px] max-md:flex-1 max-md:min-w-[130px]">

                                <div class="flex justify-center gap-3 text-3xl font-bold max-md:text-xl">

                                    <span>
                                        $${custo_computacao}
                                    </span>

                                    <span class="mx-5 max-md:mx-1">
                                        &gt;
                                    </span>

                                    <span>$40</span>

                                </div>

                                <div class="bg-green-50 border-[1px] border-lime-700 rounded-2xl text-lime-700 p-1 px-1 flex justify-center items-center text-sm">
                                    -$40 (-50%)
                                </div>

                            </div>

                            <div class="flex flex-col justify-center items-center gap-3 bg-white border-[1px] border-slate-500 rounded-xl pb-4 px-6 h-full max-[1600px]:flex-1 max-[1600px]:min-w-[140px] max-md:flex-1 max-md:min-w-[130px]">

                                <div class="text-slate-500">
                                    Desperdício
                                </div>

                                <div class="text-5xl font-semibold text-lime-600 max-md:text-3xl">
                                    15%
                                </div>

                            </div>

                        </div>

                    </div>


                    <div id="horizontalContainer" class="flex flex-col gap-4 w-full flex-1 min-w-0">

                        <div class="w-full rounded-lg p-3 bg-blue-400 border-[1px] border-blue-900 flex justify-center items-center text-xl font-bold">
                            Horizontal
                        </div>

                        <div class="bg-white flex h-full text-center w-full rounded-xl border-[1px] border-slate-500 justify-center items-center max-lg:h-24 min-h-44 p-4">
                            A escalabilidade horizontal só é indicada em casos de super-utilização.
                        </div>

                    </div>

                </div>


                <!-- GRÁFICO DE ROSCA -->

                <div class="flex flex-col gap-6 row-span-1 col-span-1 min-w-0">

                    <div class="h-full min-h-[380px] mt-1 bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center gap-3 py-6 px-4 max-md:min-h-[300px]">

                        <div class="text-center text-xl font-bold">
                            Porcentagem de uso da instância
                        </div>

                        <div class="relative flex-1 min-h-0 w-full">
                            <canvas id="graficoRosca"></canvas>
                        </div>

                    </div>

                </div>

            `;

            instanceView.innerHTML = element;

            carregarGraficos();

        }

    } catch (e) {

        console.error("ERRO NA LOAD INSTANCE:", e);

        showToast(
            "Algo deu errado ao carregar os detalhes da instância.",
            "error"
        );

    }

};


// DISPONIBILIZAR A FUNÇÃO PARA O ONCLICK DO HTML
window.loadInstance = loadInstance;
