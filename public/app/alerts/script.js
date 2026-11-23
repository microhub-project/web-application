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
};

const getAlerts = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/alerts/listar', {
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
            return showToast("Nenhum alerta encontrado", "warning");
        }

        const body = await response.json();

        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const data = body.data || [];
        const kpis = data.kpis || [];
        const alerts = data.alerts || data || [];

        if (document.getElementById("valor-ativos") && kpis.ativos !== undefined) {
            document.getElementById("valor-ativos").textContent = kpis.ativos;
        }
        if (document.getElementById("valor-criticos") && kpis.criticos !== undefined) {
            document.getElementById("valor-criticos").textContent = kpis.criticos;
        }
        if (document.getElementById("valor-atencao") && kpis.atencao !== undefined) {
            document.getElementById("valor-atencao").textContent = kpis.atencao;
        }
        if (document.getElementById("valor-resolvidos") && kpis.resolvidosHoje !== undefined) {
            document.getElementById("valor-resolvidos").textContent = kpis.resolvidosHoje;
        }
        if (document.getElementById("data-atualizacao") && data.ultimaAtualizacao) {
            document.getElementById("data-atualizacao").textContent = data.ultimaAtualizacao;
        }

        renderAlerts(Array.isArray(alerts) ? alerts : []);
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar os alertas.", "error");
    }
};

const renderAlerts = (alerts) => {
    const mobileContainer = document.getElementById("alertsMobileContainer");
    const tableBody = document.getElementById("alertsTableBody");

    if (mobileContainer) mobileContainer.innerHTML = "";
    if (tableBody) tableBody.innerHTML = "";

    for (const alert of alerts) {
        const {
            uuid,
            data_hora,
            instancia,
            componente,
            valor,
            limite,
            severidade,
            status,
            resolvido_em,
            resolvido_por
        } = alert;

        const isResolved = status?.toLowerCase() === "resolvido";
        const resolvedAtText = resolvido_em || "—";
        const resolvedByText = resolvido_por || "—";

        const badgeSeveridade = severidade?.toLowerCase() === "crítico" || severidade?.toLowerCase() === "critico"
            ? `<span class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-pink-100 text-red-700 border border-red-700 rounded-xl font-medium text-[10px]"><i class="ph-fill ph-circle text-[6px]"></i>${severidade}</span>`
            : `<span class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-500 rounded-xl font-medium text-[10px]"><i class="ph-fill ph-circle text-[6px]"></i>${severidade}</span>`;

        const badgeStatus = isResolved
            ? `<span class="inline-flex items-center justify-center px-2 py-0.5 bg-green-100 text-green-800 border border-green-800 rounded-xl font-medium">${status}</span>`
            : `<span class="inline-flex items-center justify-center px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-800 rounded-xl font-medium">${status || "Ativo"}</span>`;

        if (mobileContainer) {
            mobileContainer.innerHTML += `
                <div id="mobile-alert-${uuid}" class="bg-slate-50 border border-blue-900 rounded-2xl p-4 shadow-sm flex flex-col gap-3 text-xs text-slate-700">
                    <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <span class="font-semibold text-slate-900">${data_hora || "—"}</span>
                        ${badgeSeveridade}
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <span class="text-slate-500 font-semibold block">Instância</span>
                            <span>${instancia || "—"}</span>
                        </div>
                        <div>
                            <span class="text-slate-500 font-semibold block">Componente</span>
                            <span>${componente || "—"}</span>
                        </div>
                        <div>
                            <span class="text-slate-500 font-semibold block">Valor</span>
                            <span>${valor ?? "—"}</span>
                        </div>
                        <div>
                            <span class="text-slate-500 font-semibold block">Limite</span>
                            <span>${limite ?? "—"}</span>
                        </div>
                        <div>
                            <span class="text-slate-500 font-semibold block">Status</span>
                            ${badgeStatus}
                        </div>
                        <div>
                            <span class="text-slate-500 font-semibold block">Resolvido por</span>
                            <span class="${resolvido_por ? "text-slate-700" : "text-slate-400"}">${resolvedByText}</span>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                        <span class="text-slate-500 font-semibold">Resolvido em</span>
                        <span class="${resolvido_em ? "font-semibold text-slate-900" : "text-slate-400"}">${resolvedAtText}</span>
                    </div>
                </div>
            `;
        }

        if (tableBody) {
            tableBody.innerHTML += `
                <div id="row-alert-${uuid}" class="grid grid-cols-12 py-4 text-xs items-center text-slate-700">
                    <div class="col-span-2">${data_hora || "—"}</div>
                    <div class="col-span-2 text-center mr-10 ml-1">${instancia || "—"}</div>
                    <div class="col-span-1 text-center mr-2 lg:mr-5">${componente || "—"}</div>
                    <div class="col-span-1 text-center">${valor ?? "—"}</div>
                    <div class="col-span-1 text-center mr-6">${limite ?? "—"}</div>
                    <div class="col-span-1">${badgeSeveridade}</div>
                    <div class="col-span-1">${badgeStatus}</div>
                    <div class="col-span-2 ${resolvido_em ? "text-slate-700" : "text-slate-400"} text-[0.6rem] lg:text-[0.7rem] text-center mr-0 ml-1 lg:mr-6">${resolvedAtText}</div>
                    <div class="col-span-1 ${resolvido_por ? "text-slate-700" : "text-slate-400"} text-center mr-1 lg:mr-9">${resolvedByText}</div>
                </div>
            `;
        }
    }
};

window.addEventListener("DOMContentLoaded", () => {
    atualizarDataHora();

});