const renderAlerts = (alerts) => {
    const mobileContainer = document.getElementById("alertsMobileContainer");
    const tableBody = document.getElementById("alertsTableBody");

    if (mobileContainer) mobileContainer.innerHTML = "";
    if (tableBody) tableBody.innerHTML = "";

    for (const alert of alerts) {
        const {
            uuid,
            criado_em,
            instancia,
            componente,
            valor_detectado,
            limite_maximo,
            prioridade,
            status,
            data_hora_resolvido,
            resolvido_por
        } = alert;

        const isResolved = status === 0 || status === false || String(status).toLowerCase() === "resolvido";
        const statusText = isResolved ? "Resolvido" : "Ativo";
        const resolvedAtText = data_hora_resolvido || "—";
        const resolvedByText = resolvido_por || "—";

        const isCritical = Number(prioridade) >= 3 || String(prioridade).toLowerCase() === "crítico" || String(prioridade).toLowerCase() === "critico";
        const severidadeText = isCritical
            ? "Crítico"
            : (Number(prioridade) === 2 ? "Atenção" : (prioridade || "Atenção"));

        const badgeSeveridade = isCritical
            ? `<span class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-pink-100 text-red-700 border border-red-700 rounded-xl font-medium text-[10px]"><i class="ph-fill ph-circle text-[6px]"></i>${severidadeText}</span>`
            : `<span class="inline-flex items-center justify-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-500 rounded-xl font-medium text-[10px]"><i class="ph-fill ph-circle text-[6px]"></i>${severidadeText}</span>`;

        const badgeStatus = isResolved
            ? `<span class="inline-flex items-center justify-center px-2 py-0.5 bg-green-100 text-green-800 border border-green-800 rounded-xl font-medium">${statusText}</span>`
            : `<span class="inline-flex items-center justify-center px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-800 rounded-xl font-medium">${statusText}</span>`;

        if (mobileContainer) {
            mobileContainer.innerHTML += `
                <div id="mobile-alert-${uuid}" class="bg-slate-50 border border-blue-900 rounded-2xl p-4 shadow-sm flex flex-col gap-3 text-xs text-slate-700">
                    <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <span class="font-semibold text-slate-900">${criado_em || "—"}</span>
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
                            <span>${valor_detectado ?? "—"}</span>
                        </div>
                        <div>
                            <span class="text-slate-500 font-semibold block">Limite</span>
                            <span>${limite_maximo ?? "—"}</span>
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
                        <span class="${data_hora_resolvido ? "font-semibold text-slate-900" : "text-slate-400"}">${resolvedAtText}</span>
                    </div>
                </div>
            `;
        }

        if (tableBody) {
            tableBody.innerHTML += `
                <div id="row-alert-${uuid}" class="grid grid-cols-12 py-4 text-xs items-center text-slate-700">
                    <div class="col-span-2">${criado_em || "—"}</div>
                    <div class="col-span-2 text-center mr-10 ml-1">${instancia || "—"}</div>
                    <div class="col-span-1 text-center mr-2 lg:mr-5">${componente || "—"}</div>
                    <div class="col-span-1 text-center">${valor_detectado ?? "—"}</div>
                    <div class="col-span-1 text-center mr-6">${limite_maximo ?? "—"}</div>
                    <div class="col-span-1">${badgeSeveridade}</div>
                    <div class="col-span-1">${badgeStatus}</div>
                    <div class="col-span-2 ${data_hora_resolvido ? "text-slate-700" : "text-slate-400"} text-[0.6rem] lg:text-[0.7rem] text-center mr-0 ml-1 lg:mr-6">${resolvedAtText}</div>
                    <div class="col-span-1 ${resolvido_por ? "text-slate-700" : "text-slate-400"} text-center mr-1 lg:mr-9">${resolvedByText}</div>
                </div>
            `;
        }
    }
};
