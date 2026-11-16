import { getUserSession } from "../../js/utils.js";
import {
    logout,
    fillUserInfos,
    verifyIfUserCanAccess
} from "../../js/session.js";

document.addEventListener("DOMContentLoaded", () => {
    fillUserInfos();
    verifyIfUserCanAccess();

    carregarGraficos();
    loadInstances();
});

const carregarGraficos = () => {

    const barra = document.getElementById("graficoBarras");

    if(barra) { new Chart(barra, {
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
    });}

     const ctxRosca = document.getElementById("graficoRosca");

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

    if(ctxRosca){ new Chart(ctxRosca, {
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
    });}

};
 

       const loadInstances = async () => {
    const token = sessionStorage.getItem("JWT_TOKEN");
    const userData = getUserSession();

    console.log("TOKEN:", token);
    console.log("USER DATA:", userData);

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
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const instancesContainer = document.getElementById("allInstances");
        console.log("CONTAINER:", instancesContainer);
        instancesContainer.innerHTML = "";

        const data = body.data || [];
        console.log("INSTÂNCIAS:", data);

        if (data.length === 0) {
            return showToast("Não há nenhuma instância.", "warning");
        }

        for (const instance of data) {
            const { uuid, nome, endereco_mac, custo_armazenamento, custo_mensal, custo_computacao, microsservico, tipo } = instance;
            const elementId = `${uuid}`;

            let microsservicoAtribuido = "";
            let nomeMicrosservico = "";
            let nomeInstancia = "";
            let exibirMac = true;


            if (!nome) {
                nomeInstancia = endereco_mac;
                exibirMac = false;
            } else {
                nomeInstancia = nome;
            }
            if (!microsservico) {
                microsservicoAtribuido = "hidden"
                nomeMicrosservico = "Não atribuído"
               
            } else {
                microsservicoAtribuido = ""
                nomeMicrosservico = `${microsservico}`
            
            }
            const element = `
               <div onclick="loadInstance('${uuid}')" id="${elementId}" class="w-full flex flex-col rounded-xl border-2 border-slate-400 p-4 bg-white cursor-pointer">
                            <div class="flex flex-row items-center justify-between">
                                <span class="">${nomeInstancia}</span>
                                <span class="pr-4 text-sm text-slate-500">Custo: <span class="text-black">$${custo_mensal}</span></span>
                            </div>
                            <div class="flex flex-row items-center justify-between">
                                <span class="text-sm text-slate-500">${tipo}</span>
                                <div class="rounded-3xl border-[1px] border-yellow-500 text-yellow-500 text-lg bg-yellow-100 p-1">Sub-utilizada</div>
                            </div>
                        </div>
            
            `;
            instancesContainer.innerHTML += element;
        };
    } catch (e) {
    console.error("ERRO NA LOAD INSTANCES:", e);
    showToast("Algo deu errado ao carregar as instâncias.", "error");
}
};


    const loadInstance = async (uuid) => {
         const token = sessionStorage.getItem("JWT_TOKEN");
    const userData = getUserSession();

    console.log("TOKEN:", token);
    console.log("USER DATA:", userData);

    if (!token || !userData) {
        console.log("Sessão ausente ou inválida");
        logout();
        return;
    }

    try {
        const response = await fetch(`/finance-individual/listar-itens-instancia/${uuid}`, {
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
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const instanceView = document.getElementById("instanceMostra");
        console.log("CONTAINER:", instanceView);
        instanceView.innerHTML = "";

        const data = body.data || [];
        console.log("INSTÂNCIAS:", data);

        if (data.length === 0) {
            return showToast("Não há nenhuma instância.", "warning");
        }

        for (const instance of data) {
            const { uuid, nome, endereco_mac, custo_mensal, custo_computacao, microsservico, tipo, cpu, ram } = instance;
            const elementId = `${uuid}`;

            let microsservicoAtribuido = "";
            let nomeMicrosservico = "";
            let nomeInstancia = "";
            let exibirMac = true;


            if (!nome) {
                nomeInstancia = endereco_mac;
                exibirMac = false;
            } else {
                nomeInstancia = nome;
            }
            if (!microsservico) {
                microsservicoAtribuido = "hidden"
                nomeMicrosservico = "Não atribuído"
               
            } else {
                microsservicoAtribuido = ""
                nomeMicrosservico = `${microsservico}`
            
            }
            const element = `
               <div class="flex flex-col gap-6 row-span-1 col-span-1">
                    <div class="flex flex-col items-start justify-between h-28">
                        <span id="instanceName" class="text-2xl font-extrabold">${nomeInstancia}</span>
                        <span id="typeName" class="text-xl">${tipo}</span>
                        <span class="text-slate-400">Microsserviço: <span id="microsserviceName">${nomeMicrosservico}</span></span>
                    </div>
                    <div class="flex flex-col w-full h-80 bg-white border-[1px] border-blue-900 rounded-lg p-2">
                        <span class="ml-4 font-bold">Capacidade da instância</span>
                         <div class="relative flex-1 min-h-0">
                             <canvas id="graficoBarras"></canvas>
                         </div>
                    </div>
                </div>
                
            
                <div class="grid grid-rows-1 row-span-1 col-span-1">
                    <div class="flex flex-col gap-5">
                        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-4">
                            <div class="text-slate-400">Custo total</div>
                            <div class="text-5xl font-bold">$${custo_mensal}</div>
                        </div>
                        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-7">
                            <div class="text-slate-400">Desperdício</div>
                            <div class="text-6xl font-bold text-red-700">20%</div>
                        </div>
                        <div class="bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center justify-center gap-3 py-8">
                               <div class="text-slate-400">Status da instância</div>
                            <div class="text-4xl font-bold text-orange-500">Sub-utilizada</div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-8 row-span-1 col-span-1">
                    <div id="verticalContainer" class="flex flex-col gap-4 w-full flex-1">
                        <div class="w-full rounded-lg p-3 bg-blue-400 border-[1px] border-blue-900 flex justify-center items-center text-xl font-bold">Vertical</div>
                        <div class="flex gap-4 justify-center items-center flex-1">
                            <div class="grid grid-cols-3 grid-rows-3 items-center justify-center bg-white border-[1px] border-slate-500 rounded-xl p-4 max-lg:h-24 h-44 text-xl">
                                <span class="font-bold">${tipo}</span>
                                <span class="justify-self-end pr-8">></span>
                                <span class="font-bold">t3.small</span>
                                <span>${cpu} CPU</span>
                                <span class="justify-self-end pr-8">></span>
                                <span>2 CPU</span>
                                <span>${ram} RAM</span>
                                <span class="justify-self-end pr-8">></span>
                                <span>2 RAM</span>
                            </div>
                            <div class="flex flex-col justify-center gap-5  bg-white border-[1px] border-slate-500 rounded-xl p-4 max-lg:h-24 h-44">
                                <div class="flex justify-center gap-3 text-3xl font-bold">
                                    <span id="">$${custo_computacao}</span>
                                    <span class="mx-5">></span>
                                    <span id="">$40</span>
                                </div>
                                <div class="bg-green-50 border-[1px] border-lime-700 rounded-2xl text-lime-700 p-1 px-1 flex justify-center items-center">-$40 (-50%)</div>
                            </div>
                            <div class="flex flex-col justify-center items-center gap-3 bg-white border-[1px] border-slate-500 rounded-xl pb-4 px-6 h-full">
                                <div class="text-slate-500">Desperdício</div>
                                <div class="text-5xl font-semibold text-lime-600">15%</div>
                            </div>
                        </div>
                    </div>
                     <div id="horizontalContainer" class="flex flex-col gap-4 w-full flex-1">
                        <div class="w-full rounded-lg p-3 bg-blue-400 border-[1px] border-blue-900 flex justify-center items-center text-xl font-bold">Horizontal</div>
                        <div class="bg-white flex h-full text-center w-full rounded-xl border-[1px] border-slate-500 flex justify-center items-center max-lg:h-24 min-h-44">A escalabilidade horizontal só é indicada em casos de super-utilização.</div>
                     </div>
                </div>

                <div class="flex flex-col gap-6 row-span-1 col-span-1">
                       
                <div class="h-full min-h-[380px] mt-1 bg-white rounded-2xl border-[1px] border-slate-500 w-full flex flex-col items-center gap-3 py-6 px-4">
                
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

        };
    } catch (e) {
    console.error("ERRO NA LOAD INSTANCES:", e);
    showToast("Algo deu errado ao carregar as instâncias.", "error");
}
    }

    window.loadInstance = loadInstance;