import { getUserSession } from "../../js/utils.js";

import {
    logout,
    fillUserInfos,
    verifyIfUserCanAccess
} from "../../js/session.js";

let listaInstancias = [];

document.addEventListener("DOMContentLoaded", () => {
    fillUserInfos();
    verifyIfUserCanAccess();

    configurarMenuMobile();
    configurarPesquisa();

    loadInstances();
});

// FUNÇÕES AUXILIARES

const escaparHtml = (valor) => {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caractere];
    });
};

const formatarMoeda = (valor) => {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "$0.00";
    }

    return `$${numero.toFixed(2)}`;
};

const formatarPercentual = (valor) => {
    if (valor === null || valor === undefined) {
        return "--";
    }

    const numero = Number(valor);

    return Number.isFinite(numero) ? `${numero.toFixed(1)}%` : "--";
};

const obterStatus = (status) => {
    const estados = {
        super_utilizada: {
            texto: "Super-utilizada",
            classe: "border-red-500 text-red-600 bg-red-50"
        },

        sub_utilizada: {
            texto: "Sub-utilizada",
            classe: "border-yellow-500 text-yellow-600 bg-yellow-50"
        },

        estavel: {
            texto: "Estável",
            classe: "border-green-500 text-green-600 bg-green-50"
        },

        sem_dados: {
            texto: "Sem dados",
            classe: "border-slate-400 text-slate-500 bg-slate-100"
        }
    };

    return estados[status] || estados.sem_dados;
};

const obterMetrica = (analise, componente) => {
    if (!analise || !Array.isArray(analise.metricas)) {
        return null;
    }

    return analise.metricas.find(metrica => {
        return metrica.componente === componente;
    }) || null;
};

// MENU MOBILE

const configurarMenuMobile = () => {
    const menu = document.getElementById("menu");
    const botao = document.getElementById("btnToggleInstances");
    const icone = document.getElementById("iconToggleInstances");

    if (!menu || !botao || !icone || !botao.querySelector("span")) return;

    botao.addEventListener("click", () => {
        menu.classList.toggle("hidden");

        const menuAberto = !menu.classList.contains("hidden");

        botao.setAttribute("aria-expanded", menuAberto);

        botao.querySelector("span").innerHTML = menuAberto
            ? `<i class="fa-solid fa-server"></i> Fechar lista de instâncias`
            : `<i class="fa-solid fa-server"></i> Selecionar instância`;

        icone.classList.toggle("fa-chevron-down", !menuAberto);
        icone.classList.toggle("fa-chevron-up", menuAberto);
    });
};

const fecharMenuMobile = () => {
    if (window.innerWidth >= 768) return;

    const menu = document.getElementById("menu");
    const botao = document.getElementById("btnToggleInstances");
    const icone = document.getElementById("iconToggleInstances");

    if (!menu || !botao || !icone || !botao.querySelector("span")) return;

    menu.classList.add("hidden");

    botao.setAttribute("aria-expanded", "false");

    botao.querySelector("span").innerHTML = `
        <i class="fa-solid fa-server"></i>
        Selecionar instância
    `;

    icone.classList.remove("fa-chevron-up");
    icone.classList.add("fa-chevron-down");
};

// PESQUISA DE INSTÂNCIAS

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

            return nome.includes(pesquisa) ||
                tipo.includes(pesquisa);
        });

        renderizarInstancias(instanciasFiltradas);
    });
};

// RENDERIZAR LISTA DE INSTÂNCIAS

const renderizarInstancias = (instancias) => {
    const container = document.getElementById("allInstances");

    if (!container) return;

    container.innerHTML = "";

    if (!instancias.length) {
        container.innerHTML = `
            <p class="text-center text-slate-500 mt-4">
                Nenhuma instância encontrada.
            </p>
        `;

        return;
    }

    for (const instance of instancias) {
        const uuid = escaparHtml(instance.uuid);

        const nome = escaparHtml(
            instance.nome || instance.endereco_mac
        );

        const tipo = escaparHtml(instance.tipo);

        const custo = formatarMoeda(instance.custo_mensal);

        const status = obterStatus(
            instance.analise?.status
        );

        const elemento = `
            <div
                onclick="loadInstance('${uuid}')"
                id="${uuid}"
                class="w-full flex flex-col rounded-xl border-2
                       border-slate-400 p-4 bg-white cursor-pointer
                       hover:border-blue-700 transition-colors">

                <div class="flex flex-row items-center
                            justify-between gap-2">

                    <span class="break-all">
                        ${nome}
                    </span>

                    <span class="pr-4 text-sm text-slate-500 shrink-0">
                        Custo:
                        <span class="text-black">
                            ${custo}
                        </span>
                    </span>
                </div>

                <div class="flex flex-row items-center
                            justify-between gap-2 mt-2">

                    <span class="text-sm text-slate-500">
                        ${tipo}
                    </span>

                    <div class="rounded-3xl border text-sm p-1 shrink-0
                                ${status.classe}">
                        ${status.texto}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += elemento;
    }
};

// CARREGAR INSTÂNCIAS

const loadInstances = async () => {
    const token = sessionStorage.getItem("JWT_TOKEN");
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return;
    }

    try {
        const response = await fetch(
            "/finance-individual/listar-instancias",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        const body = await response.json();

        if (!response.ok) {
            return showToast(
                body.message || "Erro ao carregar instâncias.",
                "error"
            );
        }

        listaInstancias = body.data || [];

        if (!listaInstancias.length) {
            renderizarInstancias(listaInstancias);

            const detalhes = document.getElementById("instanceMostra");

            if (detalhes) {
                detalhes.innerHTML = `
                    <div class="col-span-full rounded-xl border border-slate-300
                                bg-white p-6 text-center text-slate-500">
                        Nenhuma instância disponível para análise.
                    </div>
                `;
            }

            return;
        }

        renderizarInstancias(listaInstancias);

        // Seleciona automaticamente a primeira instância.
        await loadInstance(listaInstancias[0].uuid);

    } catch (erro) {
        console.error("Erro ao carregar instâncias:", erro);

        showToast(
            "Algo deu errado ao carregar as instâncias.",
            "error"
        );
    }
};

// CARREGAR DETALHES DA INSTÂNCIA

const loadInstance = async (uuid) => {
    const token = sessionStorage.getItem("JWT_TOKEN");
    const userData = getUserSession();

    if (!token || !userData) {
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

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        const body = await response.json();

        if (!response.ok) {
            return showToast(
                body.message || "Erro ao carregar a instância.",
                "error"
            );
        }

        const data = body.data || [];

        if (!data.length) {
            return showToast(
                "Instância não encontrada.",
                "warning"
            );
        }

        fecharMenuMobile();

        renderizarDetalhes(data[0]);

    } catch (erro) {
        console.error("Erro ao carregar instância:", erro);

        showToast(
            "Algo deu errado ao carregar os detalhes.",
            "error"
        );
    }
};

// RENDERIZAR DETALHES

const renderizarDetalhes = (instance) => {
    const container = document.getElementById("instanceMostra");

    if (!container) return;

    const analise = instance.analise || {};

    const status = obterStatus(analise.status);

    const cpu = obterMetrica(analise, "cpu_percent");
    const ram = obterMetrica(analise, "ram_percent");

    const recomendacaoVertical = analise.recomendacao?.vertical;
    const recomendacaoHorizontal = analise.recomendacao?.horizontal;

    const nome = escaparHtml(
        instance.nome || instance.endereco_mac
    );

    const tipo = escaparHtml(instance.tipo);

    const microsservico = escaparHtml(
        instance.microsservico || "Não atribuído"
    );

    const custo = formatarMoeda(instance.custo_mensal);

    const usoMedio = formatarPercentual(analise.uso_medio);

    const capacidadeNaoUtilizada = formatarPercentual(
        analise.capacidade_nao_utilizada
    );

    const ultimaLeitura = analise.ultima_leitura
        ? new Date(analise.ultima_leitura).toLocaleString("pt-BR")
        : "Sem leitura disponível";

    container.innerHTML = `
        <!-- INFORMAÇÕES E GRÁFICO DE BARRAS -->

        <div class="flex flex-col gap-6 row-span-1
                    col-span-1 min-w-0">

            <div class="flex flex-col items-start
                        justify-between h-28 max-md:h-auto max-md:gap-2">

                <span class="text-2xl font-extrabold break-words">
                    ${nome}
                </span>

                <span class="text-xl">
                    ${tipo}
                </span>

                <span class="text-slate-400">
                    Microsserviço:
                    <span>${microsservico}</span>
                </span>

                <span class="text-xs text-slate-400">
                    Última leitura: ${escaparHtml(ultimaLeitura)}
                </span>
            </div>

            <div class="flex flex-col w-full h-80 bg-white
                        border-[1px] border-blue-900 rounded-lg p-2
                        max-md:h-64">

                <span class="ml-4 font-bold">
                    Utilização dos recursos
                </span>

                <div class="relative flex-1 min-h-0">
                    <canvas id="graficoBarras"></canvas>
                </div>
            </div>
        </div>

        
<!-- INDICADORES -->

<div class="grid grid-rows-1 row-span-1 col-span-1 min-w-0">

    <div class="flex flex-col gap-5">

        <!-- CUSTO TOTAL -->

        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-4">

            <div class="text-slate-400">
                Custo total
            </div>

            <div class="text-5xl font-bold max-md:text-4xl">
                ${custo}
            </div>

        </div>

        <!-- DESPERDÍCIO -->

        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-7">

            <div class="text-slate-400">
                Desperdício
            </div>

            <div class="text-6xl font-bold text-red-700 max-md:text-4xl">
                ${capacidadeNaoUtilizada}
            </div>

        </div>

        <!-- STATUS -->

        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-8">

            <div class="text-slate-400">
                Status da instância
            </div>

            <div class="text-4xl font-bold max-md:text-2xl ${status.classe.split(" ")[1]}">
                ${status.texto}
            </div>

        </div>

    </div>

</div>


        <!-- ESCALABILIDADE -->

        <div class="flex flex-col gap-8 row-span-1
                    col-span-1 min-w-0">

            <div id="verticalContainer"
                 class="flex flex-col gap-4 w-full flex-1 min-w-0">

                <div class="w-full rounded-lg p-3 bg-blue-400
                            border-[1px] border-blue-900 flex
                            justify-center items-center text-xl font-bold">

                    Vertical
                </div>

                ${renderizarRecomendacaoVertical(
                    instance,
                    recomendacaoVertical,
                    analise.status
                )}
            </div>

            <div id="horizontalContainer"
                 class="flex flex-col gap-4 w-full flex-1 min-w-0">

                <div class="w-full rounded-lg p-3 bg-blue-400
                            border-[1px] border-blue-900 flex
                            justify-center items-center text-xl font-bold">

                    Horizontal
                </div>

                ${renderizarRecomendacaoHorizontal(
                    instance,
                    recomendacaoHorizontal,
                    analise.status
                )}
            </div>
        </div>

        <!-- GRÁFICO DE ROSCA -->

        <div class="flex flex-col gap-6 row-span-1
                    col-span-1 min-w-0">

            <div class="h-full min-h-[380px] mt-1 bg-white
                        rounded-2xl border-[1px] border-slate-500
                        w-full flex flex-col items-center gap-3
                        py-6 px-4 max-md:min-h-[300px]">

                <div class="text-center text-xl font-bold">
                    Porcentagem de utilização
                </div>

                <div class="relative flex-1 min-h-0 w-full">
                    <canvas id="graficoRosca"></canvas>
                </div>
            </div>
        </div>
    `;

    carregarGraficos(analise);
};

// RECOMENDAÇÃO VERTICAL

const renderizarRecomendacaoVertical = (
    instance,
    recomendacao,
    status
) => {
    if (!recomendacao) {
        let mensagem = "A instância está estável. Não há necessidade de alteração vertical.";

        if (status === "super_utilizada") {
            mensagem = "Não foi encontrado um tipo maior compatível no banco de dados.";
        }

        if (status === "sub_utilizada") {
            mensagem = "Não foi encontrado um tipo menor compatível no banco de dados.";
        }

        if (status === "sem_dados") {
            mensagem = "Não há leituras suficientes para recomendar uma alteração.";
        }


        return `
            <div class="bg-white flex min-h-44 p-4 text-center
                        w-full rounded-xl border-[1px]
                        border-slate-500 justify-center items-center">

                ${mensagem}
            </div>
        `;
    }

    const atual = recomendacao.tipo_atual;
    const recomendado = recomendacao.tipo_recomendado;

    const aumentando = recomendacao.acao === "aumentar";

    const titulo = aumentando
        ? "Aumento de capacidade"
        : "Redução de capacidade";

    const cor = aumentando
        ? "text-red-600"
        : "text-green-600";

    const sinal = aumentando ? ">" : "<";

    return `
        <div class="bg-white flex flex-col gap-4 p-4
                    w-full rounded-xl border-[1px] border-slate-500">

            <div class="text-center font-bold ${cor}">
                ${titulo}
            </div>

            <div class="grid grid-cols-[1fr_auto_1fr]
                        items-center gap-2 text-center">

                <div>
                    <div class="font-bold break-words">
                        ${escaparHtml(atual.tipo || atual.nome)}
                    </div>

                    <div class="text-sm text-slate-500">
                        ${atual.cpu} CPU
                    </div>

                    <div class="text-sm text-slate-500">
                        ${atual.ram} GB RAM
                    </div>
                </div>

                <span class="text-2xl font-bold">
                    ${sinal}
                </span>

                <div>
                    <div class="font-bold break-words">
                        ${escaparHtml(recomendado.nome)}
                    </div>

                    <div class="text-sm text-slate-500">
                        ${recomendado.cpu} CPU
                    </div>

                    <div class="text-sm text-slate-500">
                        ${recomendado.ram} GB RAM
                    </div>
                </div>
            </div>

            <div class="text-center text-sm text-slate-500">
                Custo computacional:
                ${formatarMoeda(atual.custo_computacao)}
                →
                ${formatarMoeda(recomendado.custo_computacao)}
            </div>
        </div>
    `;
};

// RECOMENDAÇÃO HORIZONTAL

const renderizarRecomendacaoHorizontal = (
    instance,
    recomendacao,
    status
) => {
    if (!recomendacao) {
        let mensagem = "A escalabilidade horizontal é indicada somente em casos de super-utilização.";

        if (status === "sub_utilizada") {
            mensagem = "Não é necessário adicionar instâncias. A recomendação é avaliar a redução vertical.";
        }

        if (status === "estavel") {
            mensagem = "A instância está estável. Não há necessidade de adicionar outra instância.";
        }

        if (status === "sem_dados") {
            mensagem = "Não há leituras suficientes para recomendar escalabilidade horizontal.";
        }

        return `
            <div class="bg-white flex h-full text-center w-full
                        rounded-xl border-[1px] border-slate-500
                        justify-center items-center min-h-44 p-4">
                ${mensagem}
            </div>
        `;
    }

    if (!Number.isInteger(recomendacao.quantidade) ||
        recomendacao.quantidade < 1) {

        return `
            <div class="bg-white flex h-full text-center w-full
                        rounded-xl border-[1px] border-slate-500
                        justify-center items-center min-h-44 p-4">
                Não foi possível calcular a quantidade de instâncias
                necessárias para distribuir a carga.
            </div>
        `;
    }

    const quantidade = recomendacao.quantidade;

    return `
        <div class="bg-white flex flex-col gap-4 text-center
                    w-full rounded-xl border-[1px] border-slate-500
                    justify-center items-center min-h-44 p-5">

            <div class="text-red-600 font-bold">
                Adicionar capacidade horizontal
            </div>

            <div class="text-5xl font-bold text-blue-700">
                +${quantidade}
            </div>

            <div>
                ${quantidade === 1
                    ? "nova instância"
                    : "novas instâncias"}
                do tipo
                <strong>${escaparHtml(instance.tipo)}</strong>
            </div>

            <div class="text-sm text-slate-500">
                A capacidade adicional permitirá distribuir
                a carga de trabalho entre as instâncias.
            </div>
        </div>
    `;
};
// GRÁFICOS

const carregarGraficos = (analise) => {
    const cpu = obterMetrica(analise, "cpu_percent");
    const ram = obterMetrica(analise, "ram_percent");

    const valorCPU = cpu?.media ?? null;
    const valorRAM = ram?.media ?? null;

    const usoMedio = analise.uso_medio;

    // GRÁFICO DE BARRAS

    const canvasBarras = document.getElementById("graficoBarras");

    if (canvasBarras) {
        const graficoAnterior = Chart.getChart(canvasBarras);

        if (graficoAnterior) {
            graficoAnterior.destroy();
        }

        new Chart(canvasBarras, {
            type: "bar",

            data: {
                labels: ["CPU", "RAM"],

                datasets: [{
                    label: "Utilização",
                    data: [valorCPU, valorRAM],

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
                        min: 0,
                        max: 100,

                        ticks: {
                            callback: valor => `${valor}%`
                        },

                        title: {
                            display: true,
                            text: "Utilização (%)"
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

    const canvasRosca = document.getElementById("graficoRosca");

    if (canvasRosca) {
        const graficoAnterior = Chart.getChart(canvasRosca);

        if (graficoAnterior) {
            graficoAnterior.destroy();
        }

        if (usoMedio === null || usoMedio === undefined ||
            !Number.isFinite(Number(usoMedio))) {

            canvasRosca.parentElement.innerHTML = `
                <div class="w-full h-32 flex items-center
                            justify-center text-center text-slate-500 p-4">
                    Não há dados suficientes para calcular a utilização média.
                </div>
            `;

            return;
        }

        const usoMedioNumerico = Math.min(
            100,
            Math.max(0, Number(usoMedio))
        );

        const textoCentral = {
            id: "textoCentral",

            afterDraw(chart) {
                const { ctx } = chart;
                const ponto = chart.getDatasetMeta(0).data[0];

                if (!ponto) return;

                ctx.save();

                ctx.font = "bold 38px monospace";
                ctx.fillStyle = "#0f172a";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(
                    `${Math.round(usoMedioNumerico)}%`,
                    ponto.x,
                    ponto.y
                );

                ctx.restore();
            }
        };

        new Chart(canvasRosca, {
            type: "doughnut",

            data: {
                labels: [
                    "Utilizado",
                    "Não utilizado"
                ],

                datasets: [{
                    data: [
                        usoMedioNumerico,
                        Math.max(0, 100 - usoMedioNumerico)
                    ],

                    backgroundColor: [
                        "#1d4ed8",
                        "#93c5fd"
                    ],

                    borderWidth: 0
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
                            padding: 14
                        }
                    },

                    tooltip: {
                        callbacks: {
                            label(context) {
                                return `${context.label}: ${context.parsed.toFixed(1)}%`;
                            }
                        }
                    }
                }
            },

            plugins: [textoCentral]
        });
    }
};

window.loadInstance = loadInstance;