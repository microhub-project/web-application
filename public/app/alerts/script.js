const API_BASE = window.location.port === "3333" ? "" : "http://localhost:3333";
let listaUsuarios = [];
let filtrosPreenchidos = false; 
const TZ = "America/Sao_Paulo"; 

function formatarDataHora(valor) {
    if (!valor || isNan(valor)) return "—";
    let dateTime = String(valor).replace("","T");
    if (!/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateTime)) dateTime += "Z";
    const d = new Date(dateTime)
    return d.toLocaleString("pt-BR", { timeZone: TZ });
}

function diaLocal(valor) {
    if(!valor) return "—"
    let dateLocal = String(valor).replace("","T");
    if(!/[zZ]|[+-]\d{2}:?\d{2}$/.test(dateLocal)) dateLocal +="Z";
    const d = new Date(dateLocal);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

function converterDataFiltro(texto) {
    const m = String(texto || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/);
    if (!m) return "";
    const ano = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${ano}-${m[2]}-${m[1]}`;
}

function nomeResponsavel(alert, resolvido) {
    if (alert.resolvido_por) {
        const u = listaUsuarios.find(x => x.uuid === alert.resolvido_por);
        return u ? u.nome : "—";
    }
    return resolvido ? "Resolvido pelo sistema" : "—";
}

function atualizarDataHora() {
    const el = document.getElementById("data-atualizacao");
    if (!el) return;

    const agora = new Date();
    el.innerText = agora.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TZ
    });
}

function obterFiltros() {
    const filtros = {};

    const data = document.getElementById("filtro-data")?.value.trim();
    const instancia = document.getElementById("filtro-instancia")?.value;
    const componente = document.getElementById("filtro-componente")?.value;
    const severidade = document.getElementById("filtro-severidade")?.value;
    const status = document.getElementById("filtro-status")?.value;
    const resolvidoPor = document.getElementById("filtro-resolvido-por")?.value;

    const dataConvertida = converterDataFiltro(data);
    if (dataConvertida) filtros.data = dataConvertida;
    if (instancia && instancia !== "Todos") filtros.instancia = instancia;
    if (componente && componente !== "Todos") filtros.componente = componente;
    if (severidade && severidade !== "Todos") filtros.severidade = severidade;
    if (status && status !== "Todos") filtros.status = status;
    if (resolvidoPor && resolvidoPor !== "Todos") filtros.resolvido_por = resolvidoPor;

    return filtros;
}

function preencherSelectFiltro(id, itens) {
    const select = document.getElementById(id);
    if (!select) return;

    const atual = select.value || "Todos";
    select.innerHTML = `<option value="Todos">Todos</option>`;
    for (const { value, label } of itens) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        select.appendChild(option);
    }
    select.value = [...select.options].some(o => o.value === atual) ? atual : "Todos";
}

function preencherFiltros(alerts) {
    if (!filtrosPreenchidos && alerts.length > 0) {
        const instancias = [...new Set(alerts.map(a => a.instancia).filter(Boolean))].sort();
        const componentes = [...new Set(alerts.map(a => a.componente).filter(Boolean))].sort();

        preencherSelectFiltro("filtro-instancia", instancias.map(v => ({ value: v, label: v })));
        preencherSelectFiltro("filtro-componente", componentes.map(v => ({ value: v, label: v })));
        preencherSelectFiltro("filtro-severidade", [
            { value: "3", label: "Crítico" },
            { value: "2", label: "Atenção" }
        ]);
        preencherSelectFiltro("filtro-status", [
            { value: "1", label: "Ativo" },
            { value: "0", label: "Resolvido" }
        ]);
        filtrosPreenchidos = true;
    }

    preencherSelectFiltro("filtro-resolvido-por", listaUsuarios.map(u => ({ value: u.uuid, label: u.nome })));
}

function obterEmpresaUuid() {
    if (typeof getUserSession === "function") {
        const sessao = getUserSession();
        if (sessao?.empresa_uuid) return sessao.empresa_uuid;
        if (sessao?.companyUUID) return sessao.companyUUID;
    }
    return sessionStorage.getItem("EMPRESA_UUID") || sessionStorage.getItem("empresa_uuid") || "";
}

function normalizarLista(valor) {
    if (!valor) return [];
    return Array.isArray(valor) ? valor : [valor];
}

function atualizarKpis(alerts) {
    const ativos = alerts.filter(a => !(a.status === 0 || a.status === false || String(a.status).toLowerCase() === "resolvido"));
    const criticos = ativos.filter(a => Number(a.prioridade) >= 3 || ["crítico", "critico"].includes(String(a.prioridade).toLowerCase()));
    const atencao = ativos.filter(a => !(Number(a.prioridade) >= 3 || ["crítico", "critico"].includes(String(a.prioridade).toLowerCase())));

    // ALTERADO: compara a data local (antes usava UTC)
    const hoje = diaLocal(new Date());
    const resolvidosHoje = alerts.filter(a => {
        const resolvido = a.status === 0 || a.status === false || String(a.status).toLowerCase() === "resolvido";
        return resolvido && a.data_hora_resolvido && diaLocal(a.data_hora_resolvido) === hoje;
    });

    const elAtivos = document.getElementById("valor-ativos");
    const elCriticos = document.getElementById("valor-criticos");
    const elAtencao = document.getElementById("valor-atencao");
    const elResolvidos = document.getElementById("valor-resolvidos");

    if (elAtivos) elAtivos.textContent = ativos.length;
    if (elCriticos) elCriticos.textContent = criticos.length;
    if (elAtencao) elAtencao.textContent = atencao.length;
    if (elResolvidos) elResolvidos.textContent = resolvidosHoje.length;
}

async function resolverAlerta(alertUuid, usuarioSelecionado, selectEl) {
    const token = sessionStorage.getItem("JWT_TOKEN");
    const empresaUuid = obterEmpresaUuid();

    if (!token || !alertUuid || !usuarioSelecionado) return;

    if (selectEl) selectEl.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/alerts/resolver`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                uuid: alertUuid,
                resolvido_por: usuarioSelecionado,
                empresa_uuid: empresaUuid
            })
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
            if (selectEl) selectEl.disabled = false;
            if (typeof showToast === "function") {
                showToast(body.message || "Não foi possível resolver o alerta.", "warning");
            }
            return;
        }

        if (typeof showToast === "function") {
            showToast(body.message || "Alerta resolvido com sucesso!", "success");
        }

        await getAlerts();
    } catch (erro) {
        console.error(erro);
        if (selectEl) selectEl.disabled = false;
        if (typeof showToast === "function") {
            showToast("Erro ao atualizar o alerta.", "error");
        }
    }
}

function configurarEventosSelectUsuario() {
    const selects = document.querySelectorAll(".select-resolvido-por");

    for (const select of selects) {
        select.addEventListener("change", () => {
            const usuarioSelecionado = select.value;
            const alertUuid = select.dataset.alertUuid;

            if (!usuarioSelecionado) return;
            resolverAlerta(alertUuid, usuarioSelecionado, select);
        });
    }
}

function popularSelectsUsuarios() {
    const selects = document.querySelectorAll(".select-resolvido-por");

    for (const select of selects) {
        select.innerHTML = `<option value="">Selecionar</option>`;
        for (const user of listaUsuarios) {
            const option = document.createElement("option");
            option.value = user.uuid || user.id || user.nome;
            option.textContent = user.nome;
            select.appendChild(option);
        }
    }

    configurarEventosSelectUsuario();
}

async function getAlerts() {

    const token = sessionStorage.getItem("JWT_TOKEN");
    if (!token) {
        if (typeof logout === "function") logout();
        return;
    }

    try {
        const params = new URLSearchParams(obterFiltros()).toString();
        const url = params ? `${API_BASE}/alerts/listar?${params}` : `${API_BASE}/alerts/listar`;

        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401 || res.status === 403) {
            if (typeof logout === "function") logout();
            return;
        }

        if (res.status === 204) {
            renderAlerts([]);
            atualizarKpis([]);
            return;
        }

        const body = await res.json();
        console.log("BODY RECEBIDO:", body);
        if (!res.ok) {
            if (typeof showToast === "function") {
                showToast(body.message || "Erro ao buscar alertas", "warning");
            }
            return;
        }

        const data = body.data || {};
        const alerts = normalizarLista(data.alerts ?? (Array.isArray(body.data) ? body.data : []));
        const usuarios = normalizarLista(data.usuarios);

        if (usuarios.length > 0) {
            listaUsuarios = usuarios;
        }

        if (data.kpis) {
            if (data.kpis.ativos !== undefined) document.getElementById("valor-ativos").textContent = data.kpis.ativos;
            if (data.kpis.criticos !== undefined) document.getElementById("valor-criticos").textContent = data.kpis.criticos;
            if (data.kpis.atencao !== undefined) document.getElementById("valor-atencao").textContent = data.kpis.atencao;
            if (data.kpis.resolvidosHoje !== undefined) document.getElementById("valor-resolvidos").textContent = data.kpis.resolvidosHoje;
        } else {
            atualizarKpis(alerts);
        }

        if (data.ultimaAtualizacao) {
            document.getElementById("data-atualizacao").textContent = data.ultimaAtualizacao;
        } else {
            atualizarDataHora(); 
        }

        preencherFiltros(alerts); 
        renderAlerts(alerts);
        popularSelectsUsuarios();
    } catch (erro) {
        console.error(erro);
        if (typeof showToast === "function") {
            showToast("Erro ao carregar os alertas.", "error");
        }
    }
}



function renderAlerts(alerts) {
    if (!Array.isArray(alerts)) return;

    const mobileContainer = document.getElementById("alertsMobileContainer");
    const tableBody = document.getElementById("alertsTableBody");

    const cardsHtml = [];
    const rowsHtml = [];

    for (const alert of alerts) {
        const resolvido = alert.status === 0 || alert.status === false || String(alert.status).toLowerCase() === "resolvido";
        const statusLabel = resolvido ? "Resolvido" : "Ativo";
        const resolvidoEm = resolvido ? formatarDataHora(alert.data_hora_resolvido) : "—"; // ALTERADO
        const criadoEm = formatarDataHora(alert.criado_em); // ALTERADO
        const nomeInstancia = alert.instancia || alert.nome_instancia || alert.apelido || "—";
        const nomeResolvidoPor = nomeResponsavel(alert, resolvido); // ALTERADO

        const critico = Number(alert.prioridade) >= 3 || ["crítico", "critico"].includes(String(alert.prioridade).toLowerCase());
        const severidadeLabel = critico ? "Crítico" : "Atenção";

        const badgeSeveridade = critico
            ? `<span class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-pink-100 text-red-700 border border-red-700 rounded-xl font-medium text-[10px]"><i class="ph-fill ph-circle text-[6px]"></i>${severidadeLabel}</span>`
            : `<span class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-500 rounded-xl font-medium text-[10px]"><i class="ph-fill ph-circle text-[6px]"></i>${severidadeLabel}</span>`;

        const badgeStatus = resolvido
            ? `<span class="inline-flex items-center justify-center shrink-0 px-2.5 py-0.5 bg-green-100 text-green-800 border border-green-800 rounded-xl font-medium">${statusLabel}</span>`
            : `<span class="inline-flex items-center justify-center shrink-0 px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-800 rounded-xl font-medium">${statusLabel}</span>`;

        const mobileResolvidoPor = resolvido
            ? `<span>${nomeResolvidoPor}</span>`
            : `<select data-alert-uuid="${alert.uuid}" class="select-resolvido-por mt-1 bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-slate-700 outline-none">
                    <option value="">Selecionar</option>
               </select>`;

        const rowResolvidoPor = resolvido
            ? `<div class="col-span-1 text-center leading-tight">${nomeResolvidoPor}</div>`
            : `<div class="col-span-1 flex justify-center pr-1">
                    <select data-alert-uuid="${alert.uuid}" class="select-resolvido-por w-full max-w-[105px] bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 outline-none">
                        <option value="">Selecionar</option>
                    </select>
               </div>`;

        cardsHtml.push(`
            <div class="bg-slate-50 border border-blue-900 rounded-2xl p-4 shadow-sm flex flex-col gap-3 text-xs text-slate-700">
                <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <span class="font-semibold text-slate-900">${criadoEm}</span>
                    ${badgeSeveridade}
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <span class="text-slate-500 font-semibold block">Instância</span>
                        <span>${nomeInstancia}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 font-semibold block">Componente</span>
                        <span>${alert.componente || "—"}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 font-semibold block">Valor</span>
                        <span>${alert.valor_detectado ?? "—"}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 font-semibold block">Limite</span>
                        <span>${alert.limite_maximo ?? "—"}</span>
                    </div>
                    <div>
                        <span class="text-slate-500 font-semibold block">Status</span>
                        ${badgeStatus}
                    </div>
                    <div>
                        <span class="text-slate-500 font-semibold block">Resolvido por</span>
                        ${mobileResolvidoPor}
                    </div>
                </div>
                <div class="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span class="text-slate-500 font-semibold">Resolvido em</span>
                    <span>${resolvidoEm}</span>
                </div>
            </div>
        `);

        rowsHtml.push(`
            <div class="grid grid-cols-12 gap-2 py-4 text-xs items-center text-slate-700">
                <div class="col-span-2 break-words leading-tight">${criadoEm}</div>
                <div class="col-span-2 text-center truncate">${nomeInstancia}</div>
                <div class="col-span-1 text-center leading-tight">${alert.componente || "—"}</div>
                <div class="col-span-1 text-center">${alert.valor_detectado ?? "—"}</div>
                <div class="col-span-1 text-center">${alert.limite_maximo ?? "—"}</div>
                <div class="col-span-1 flex justify-center">${badgeSeveridade}</div>
                <div class="col-span-1 flex justify-center">${badgeStatus}</div>
                <div class="col-span-2 text-center leading-tight">${resolvidoEm}</div>
                ${rowResolvidoPor}
            </div>
        `);
    }

    if (mobileContainer) mobileContainer.innerHTML = cardsHtml.join("");
    if (tableBody) tableBody.innerHTML = rowsHtml.join("");
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarDataHora();

    const filtros = [
        "filtro-data",
        "filtro-instancia",
        "filtro-componente",
        "filtro-severidade",
        "filtro-status",
        "filtro-resolvido-por"
    ];

    for (const id of filtros) {
        const campo = document.getElementById(id);
        if (campo) campo.addEventListener("change", getAlerts);
    }

    getAlerts();

    setInterval(() => {
        if (document.activeElement?.classList?.contains("select-resolvido-por")) return;
        getAlerts();
    }, 30000);
});