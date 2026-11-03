const viewIntancia = document.querySelector('#viewerInst');
const viewMicro = document.querySelector('#viewerMicro');
const viewComp = document.querySelector('#viewerComp');
const viewUser = document.querySelector('#viewerUser');
const viewVol = document.querySelector('#viewerVol');

const selectInst = document.querySelector('#btn_select_instancias');
const selectMicro = document.querySelector('#btn_select_micro');
const selectCompo = document.querySelector('#btn_select_compo');
const selectUsuario = document.querySelector('#btn_select_usuario');
const selectVolume = document.querySelector('#btn_select_volume');

selectInst.addEventListener('click', function () {
    selectInst.classList.add('card-ativo');
    selectInst.classList.remove('card-inativo');
    selectMicro.classList.add('card-inativo');
    selectMicro.classList.remove('card-ativo');
    selectCompo.classList.add('card-inativo');
    selectCompo.classList.remove('card-ativo');
    selectUsuario.classList.add('card-inativo');
    selectUsuario.classList.remove('card-ativo');
    selectVolume.classList.add('card-inativo');
    selectVolume.classList.remove('card-ativo');
    viewIntancia.classList.add('ativo');
    viewIntancia.classList.remove('desativado');
    viewMicro.classList.add('desativado');
    viewMicro.classList.remove('ativo');
    viewComp.classList.add('desativado');
    viewComp.classList.remove('ativo');
    viewUser.classList.add('desativado');
    viewUser.classList.remove('ativo');
    viewVol.classList.add('desativado');
    viewVol.classList.remove('ativo');
});

selectMicro.addEventListener('click', function () {
    selectInst.classList.add('card-inativo');
    selectInst.classList.remove('card-ativo');
    selectMicro.classList.add('card-ativo');
    selectMicro.classList.remove('card-inativo');
    selectCompo.classList.add('card-inativo');
    selectCompo.classList.remove('card-ativo');
    selectUsuario.classList.add('card-inativo');
    selectUsuario.classList.remove('card-ativo');
    selectVolume.classList.add('card-inativo');
    selectVolume.classList.remove('card-ativo');
    viewIntancia.classList.add('desativado');
    viewIntancia.classList.remove('ativo');
    viewMicro.classList.add('ativo');
    viewMicro.classList.remove('desativado');
    viewComp.classList.add('desativado');
    viewComp.classList.remove('ativo');
    viewUser.classList.add('desativado');
    viewUser.classList.remove('ativo');
    viewVol.classList.add('desativado');
    viewVol.classList.remove('ativo');
});

selectCompo.addEventListener('click', function () {
    selectInst.classList.add('card-inativo');
    selectInst.classList.remove('card-ativo');
    selectMicro.classList.add('card-inativo');
    selectMicro.classList.remove('card-ativo');
    selectCompo.classList.add('card-ativo');
    selectCompo.classList.remove('card-inativo');
    selectUsuario.classList.add('card-inativo');
    selectUsuario.classList.remove('card-ativo');
    selectVolume.classList.add('card-inativo');
    selectVolume.classList.remove('card-ativo');
    viewIntancia.classList.add('desativado');
    viewIntancia.classList.remove('ativo');
    viewMicro.classList.add('desativado');
    viewMicro.classList.remove('ativo');
    viewComp.classList.add('ativo');
    viewComp.classList.remove('desativado');
    viewUser.classList.add('desativado');
    viewUser.classList.remove('ativo');
    viewVol.classList.add('desativado');
    viewVol.classList.remove('ativo');
});

selectUsuario.addEventListener('click', function () {
    selectInst.classList.add('card-inativo');
    selectInst.classList.remove('card-ativo');
    selectMicro.classList.add('card-inativo');
    selectMicro.classList.remove('card-ativo');
    selectCompo.classList.add('card-inativo');
    selectCompo.classList.remove('card-ativo');
    selectUsuario.classList.add('card-ativo');
    selectUsuario.classList.remove('card-inativo');
    selectVolume.classList.add('card-inativo');
    selectVolume.classList.remove('card-ativo');
    viewIntancia.classList.add('desativado');
    viewIntancia.classList.remove('ativo');
    viewMicro.classList.add('desativado');
    viewMicro.classList.remove('ativo');
    viewComp.classList.add('desativado');
    viewComp.classList.remove('ativo');
    viewUser.classList.add('ativo');
    viewUser.classList.remove('desativado');
    viewVol.classList.add('desativado');
    viewVol.classList.remove('ativo');
});

selectVolume.addEventListener('click', function () {
    selectInst.classList.add('card-inativo');
    selectInst.classList.remove('card-ativo');
    selectMicro.classList.add('card-inativo');
    selectMicro.classList.remove('card-ativo');
    selectCompo.classList.add('card-inativo');
    selectCompo.classList.remove('card-ativo');
    selectUsuario.classList.add('card-inativo');
    selectUsuario.classList.remove('card-ativo');
    selectVolume.classList.add('card-ativo');
    selectVolume.classList.remove('card-inativo');
    viewIntancia.classList.add('desativado');
    viewIntancia.classList.remove('ativo');
    viewMicro.classList.add('desativado');
    viewMicro.classList.remove('ativo');
    viewComp.classList.add('desativado');
    viewComp.classList.remove('ativo');
    viewUser.classList.add('desativado');
    viewUser.classList.remove('ativo');
    viewVol.classList.add('ativo');
    viewVol.classList.remove('desativado');
});

    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    function formatarData(data) {
    if (!data) {
        return "Data não disponível";
    }

    return new Date(data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    }

    function calcularDiasRestantes(dataExclusao) {
        const dataExclusaoTimestamp = new Date(dataExclusao).getTime();
        const dataAtualTimestamp = new Date().getTime();

        const diferenca = dataAtualTimestamp - dataExclusaoTimestamp;

        const diasPassados = Math.floor(diferenca / (1000 * 60 * 60 * 24));

        const diasRestantes = 30 - diasPassados;

        return Math.max(0, diasRestantes);
    }
    
    const loadInstances = async () => {
         if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/lixeira/listar-instancias', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("STATUS:", response.status);
        
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

        const instancesContainer = document.getElementById("viewerInst");
        console.log("CONTAINER:", instancesContainer);
        instancesContainer.innerHTML = "";

        const data = body.data || [];
        console.log("INSTÂNCIAS:", data);

        if (data.length === 0) {
            return showToast("Não há nenhuma instância na lixeira.", "warning");
        }

        for (const instance of data) {
            const { uuid, nome, endereco_mac, deletado_em, criado_em, custo_armazenamento, custo_mensal, custo_computacao, microsservico, tipo, cpu, ram } = instance;
            const elementId = `${uuid}`;
            
            const dataCriacao = formatarData(criado_em);
            const dataExclusao = formatarData(deletado_em);

            const diasRestantes = calcularDiasRestantes(deletado_em);

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
    <div id="${elementId}"
        class="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)]
        bg-white w-full min-w-0 border-2 border-slate-400 min-h-80 h-auto xl:h-80
        rounded-xl overflow-hidden">

        <!-- INFORMAÇÕES DA INSTÂNCIA -->
        <div id="title"
            class="h-full w-full min-w-0 overflow-hidden
            grid grid-rows-[auto_auto_auto] xl:grid-rows-3
            text-base sm:text-lg xl:text-xl 2xl:text-3xl">

            <!-- NOME E MAC -->
            <div class="flex flex-wrap justify-center items-center
                gap-2 sm:gap-4 xl:gap-6 text-center
                px-2 py-3 xl:py-0 min-w-0">

                <div id="nome_inst"
                    class="text-2xl sm:text-3xl 2xl:text-4xl
                    break-words min-w-0">
                    ${nomeInstancia}
                </div>

                ${
                    exibirMac
                    ? `
                        <div id="mac"
                            class="text-sm sm:text-base xl:text-lg 2xl:text-2xl
                            break-all min-w-0">
                            ${endereco_mac}
                        </div>
                    `
                    : ""
                }
            </div>

            <!-- TIPO E MICROSSERVIÇO -->
            <div class="px-3 sm:px-6 xl:px-4 2xl:px-6
                py-3 xl:py-0
                grid grid-rows-[auto_auto]
                items-start justify-start min-w-0 gap-3">

                <div id="tipo_instancia"
                    class="self-start break-words min-w-0">
                    ${tipo}
                </div>

                <div id="list_microsservico"
                    class="flex flex-wrap gap-x-1 gap-y-2
                    min-w-0 break-words">

                    Microsserviços:

                    <span class="${microsservicoAtribuido} break-words">
                        ${nomeMicrosservico}
                    </span>
                </div>
            </div>

            <!-- DATA DE CRIAÇÃO -->
            <div class="flex flex-wrap items-center justify-center
                text-center px-2 py-3 xl:py-0 gap-1 min-w-0">

                Criado em:

                <span id="creation"
                    class="text-green-400 break-words">
                    ${dataCriacao}
                </span>
            </div>
        </div>

        <!-- INFORMAÇÕES DE EXCLUSÃO -->
        <div id="exclusao"
            class="h-full w-full min-w-0
            flex flex-col items-center justify-evenly
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-3 py-5 xl:py-0 px-2
            border-t border-b
            xl:border-t-0 xl:border-b-0 xl:border-l xl:border-r
            border-slate-200 overflow-hidden">

            <div class="flex flex-wrap items-center justify-center
                text-center gap-1 min-w-0">

                Deletado em:

                <span id="data_del"
                    class="text-red-400 text-xl sm:text-2xl 2xl:text-4xl
                    break-words">
                    ${dataExclusao}
                </span>
            </div>

            <div class="flex items-center justify-center
                flex-col text-center min-w-0">

                <div class="break-words">
                    Exclusão permanente em
                </div>

                <div class="text-3xl sm:text-4xl 2xl:text-5xl">
                    <span id="days">${diasRestantes}</span> DIAS
                </div>
            </div>
        </div>

        <!-- AÇÕES -->
        <div id="quest"
            class="h-full w-full min-w-0
            flex flex-col justify-evenly xl:justify-between
            items-center py-5 xl:py-4 2xl:py-6
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-4 overflow-hidden">

            <div class="text-center">
                Deseja recuperar?
            </div>

            <div class="flex flex-wrap justify-center
                gap-3 sm:gap-4 xl:gap-3 2xl:gap-6
                w-full px-2">

                <div onclick="RecuperarInstancia('${uuid}')"
                    class="rounded-2xl border-blue-600
                    hover:cursor-pointer hover:bg-blue-600 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Sim
                </div>

                <div onclick="ExcluirInstancia('${uuid}')"
                    class="rounded-2xl border-red-500
                    hover:cursor-pointer hover:bg-red-500 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Não (Apagar)
                </div>
            </div>
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

const loadMicros = async () => {
         if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/lixeira/listar-micros', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("STATUS:", response.status);
        
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.status === 204) {
            return showToast("Não há nenhum microsserviço", "warning");
        }

        const body = await response.json();
        console.log("BODY:", body);
        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const microContainer = document.getElementById("viewerMicro");
        console.log("CONTAINER:", microContainer);
        microContainer.innerHTML = "";

        const data = body.data || [];
        console.log("MICROSSERVICOS:", data);

        if (data.length === 0) {
            return showToast("Não há nenhum microsserviço na lixeira.", "warning");
        }

        for (const instance of data) {
            const { uuid, nome, descricao, instancias_associadas, criado_em, deletado_em } = instance;
            const elementId = `${uuid}`;
            
            const dataCriacao = formatarData(criado_em);
            const dataExclusao = formatarData(deletado_em);

            const diasRestantes = calcularDiasRestantes(deletado_em); 

            let instanciasHTML = "";

            if (instancias_associadas) {
                const instancias = instancias_associadas.split(", ");
            
                for (const instancia of instancias) {
                    instanciasHTML += `
                        <span class="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xl">
                            ${instancia}
                        </span>
                    `;
                }
            } else {
                instanciasHTML = `
                    <span class="text-slate-400 text-xl italic">
                        Nenhuma instância associada
                    </span>
                `;
            }

           const element = `
    <div id="${elementId}"
        class="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)]
        bg-white w-full min-w-0 border-2 border-slate-400
        min-h-80 h-auto xl:h-80 rounded-xl overflow-hidden">

        <!-- INFORMAÇÕES DO MICROSSERVIÇO -->
        <div id="title"
            class="h-full w-full min-w-0
            grid grid-rows-[auto_auto_auto] xl:grid-rows-3
            text-base sm:text-lg xl:text-xl 2xl:text-3xl">

            <!-- NOME E DESCRIÇÃO -->
            <div class="flex flex-wrap justify-center items-center
                gap-2 sm:gap-4 xl:gap-6 text-center
                px-2 py-3 xl:py-0 min-w-0">

                <div id="nome_micro"
                    class="text-2xl sm:text-3xl 2xl:text-4xl
                    break-words min-w-0">
                    ${nome}
                </div>

                <div id="desc"
                    class="text-sm sm:text-base xl:text-lg 2xl:text-2xl
                    text-center break-words min-w-0">
                    ${descricao}
                </div>
            </div>

            <!-- INSTÂNCIAS ASSOCIADAS -->
            <div class="px-3 sm:px-6 xl:px-4 2xl:px-6
                py-3 xl:py-0
                flex flex-col justify-center gap-3
                min-w-0 overflow-hidden">

                <div class="text-base sm:text-lg xl:text-xl 2xl:text-2xl
                    break-words">
                    Instâncias associadas:
                </div>

                <div class="flex flex-wrap gap-2 sm:gap-3
                    max-h-24 overflow-y-auto min-w-0">

                    ${instanciasHTML}
                </div>
            </div>

            <!-- DATA DE CRIAÇÃO -->
            <div class="flex flex-wrap items-center justify-center
                text-center px-2 py-3 xl:py-0 gap-1 min-w-0">

                Criado em:

                <span id="creation"
                    class="text-green-400 break-words">
                    ${dataCriacao}
                </span>
            </div>
        </div>

        <!-- INFORMAÇÕES DE EXCLUSÃO -->
        <div id="exclusao"
            class="h-full w-full min-w-0
            flex flex-col items-center justify-evenly
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-3 py-5 xl:py-0 px-2
            border-t border-b
            xl:border-t-0 xl:border-b-0 xl:border-l xl:border-r
            border-slate-200">

            <div class="flex flex-wrap items-center justify-center
                text-center gap-1 min-w-0">

                Deletado em:

                <span id="data_del"
                    class="text-red-400 text-xl sm:text-2xl 2xl:text-4xl
                    break-words">
                    ${dataExclusao}
                </span>
            </div>

            <div class="flex items-center justify-center
                flex-col text-center min-w-0">

                <div class="break-words">
                    Exclusão permanente em
                </div>

                <div class="text-3xl sm:text-4xl 2xl:text-5xl">
                    <span id="days">${diasRestantes}</span> DIAS
                </div>
            </div>
        </div>

        <!-- AÇÕES -->
        <div id="quest"
            class="h-full w-full min-w-0
            flex flex-col justify-evenly xl:justify-between
            items-center py-5 xl:py-4 2xl:py-6
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-4">

            <div class="text-center">
                Deseja recuperar?
            </div>

            <div class="flex flex-wrap justify-center
                gap-3 sm:gap-4 xl:gap-3 2xl:gap-6
                w-full px-2">

                <div onclick="RecuperarMicro('${uuid}')"
                    class="rounded-2xl border-blue-600
                    hover:cursor-pointer hover:bg-blue-600 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Sim
                </div>

                <div onclick="ExcluirMicro('${uuid}')"
                    class="rounded-2xl border-red-500
                    hover:cursor-pointer hover:bg-red-500 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Não (Apagar)
                </div>
            </div>
        </div>
    </div>
`;
            microContainer.innerHTML += element;
        };
    } catch (e) {
    console.error("ERRO NA LOAD MICROS:", e);
    showToast("Algo deu errado ao carregar os microsserviços.", "error");
}
};

const loadCompos = async () => {
         if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/lixeira/listar-componentes', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("STATUS:", response.status);
        
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.status === 204) {
            return showToast("Não há nenhum componente", "warning");
        }

        const body = await response.json();
        console.log("BODY:", body);
        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const compoContainer = document.getElementById("viewerComp");
        console.log("CONTAINER:", compoContainer);
        compoContainer.innerHTML = "";

        const data = body.data || [];
        console.log("COMPONENTES:", data);

        if (data.length === 0) {
            return showToast("Não há nenhum componente na lixeira.", "warning");
        }

        for (const instance of data) {
            const { uuid, instancia_uuid, nome, limite_maximo, limite_minimo, instancia_associada, criado_em, deletado_em } = instance;
            const elementId = `${uuid}`;
            
            const dataCriacao = formatarData(criado_em);
            const dataExclusao = formatarData(deletado_em);

            const diasRestantes = calcularDiasRestantes(deletado_em);        

           const element = `
    <div id="${elementId}"
        class="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)]
        bg-white w-full min-w-0 border-2 border-slate-400
        min-h-80 h-auto xl:h-80 rounded-xl overflow-hidden">

        <!-- INFORMAÇÕES DO COMPONENTE -->
        <div id="title"
            class="h-full w-full min-w-0
            grid grid-rows-[auto_auto_auto] xl:grid-rows-3
            text-base sm:text-lg xl:text-xl 2xl:text-3xl">

            <!-- NOME E LIMITES -->
            <div class="flex flex-wrap justify-center items-center
                gap-2 sm:gap-4 xl:gap-6 text-center
                px-2 py-3 xl:py-0 min-w-0">

                <div id="nome_compo"
                    class="text-2xl sm:text-3xl 2xl:text-4xl
                    break-words min-w-0">
                    ${nome}
                </div>

                <div id="limites"
                    class="text-red-500 text-base sm:text-lg xl:text-xl 2xl:text-3xl
                    break-words">

                    Max-<span id="max">${limite_maximo}</span>

                    Min-<span id="min">${limite_minimo}</span>
                </div>
            </div>

            <!-- INSTÂNCIA ASSOCIADA -->
            <div class="px-3 sm:px-6 xl:px-4 2xl:px-6
                py-3 xl:py-0
                grid grid-rows-[auto_auto]
                items-start justify-start min-w-0 gap-3">

                <div class="flex self-start break-words">
                    Instância:
                </div>

                <div class="flex break-words min-w-0">
                    ${instancia_associada}
                </div>
            </div>

            <!-- DATA DE CRIAÇÃO -->
            <div class="flex flex-wrap items-center justify-center
                text-center px-2 py-3 xl:py-0 gap-1 min-w-0">

                Criado em:

                <span id="creation"
                    class="text-green-400 break-words">
                    ${dataCriacao}
                </span>
            </div>
        </div>

        <!-- INFORMAÇÕES DE EXCLUSÃO -->
        <div id="exclusao"
            class="h-full w-full min-w-0
            flex flex-col items-center justify-evenly
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-3 py-5 xl:py-0 px-2
            border-t border-b
            xl:border-t-0 xl:border-b-0 xl:border-l xl:border-r
            border-slate-200">

            <div class="flex flex-wrap items-center justify-center
                text-center gap-1 min-w-0">

                Deletado em:

                <span id="data_del"
                    class="text-red-400 text-xl sm:text-2xl 2xl:text-4xl
                    break-words">
                    ${dataExclusao}
                </span>
            </div>

            <div class="flex items-center justify-center
                flex-col text-center min-w-0">

                <div class="break-words">
                    Exclusão permanente em
                </div>

                <div class="text-3xl sm:text-4xl 2xl:text-5xl">
                    <span id="days">${diasRestantes}</span> DIAS
                </div>
            </div>
        </div>

        <!-- AÇÕES -->
        <div id="quest"
            class="h-full w-full min-w-0
            flex flex-col justify-evenly xl:justify-between
            items-center py-5 xl:py-4 2xl:py-6
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-4">

            <div class="text-center">
                Deseja recuperar?
            </div>

            <div class="flex flex-wrap justify-center
                gap-3 sm:gap-4 xl:gap-3 2xl:gap-6
                w-full px-2">

                <div onclick="RecuperarCompo('${uuid}', '${instancia_uuid}')"
                    class="rounded-2xl border-blue-600
                    hover:cursor-pointer hover:bg-blue-600 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Sim
                </div>

                <div onclick="ExcluirCompo('${uuid}', '${instancia_uuid}')"
                    class="rounded-2xl border-red-500
                    hover:cursor-pointer hover:bg-red-500 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Não (Apagar)
                </div>
            </div>
        </div>
    </div>
`;
            compoContainer.innerHTML += element;
        };
    } catch (e) {
    console.error("ERRO NA LOAD COMPOS:", e);
    showToast("Algo deu errado ao carregar os componentes.", "error");
}
};

const loadUsuarios = async () => {
         if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/lixeira/listar-usuarios', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("STATUS:", response.status);
        
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.status === 204) {
            return showToast("Não há nenhum usuario", "warning");
        }

        const body = await response.json();
        console.log("BODY:", body);
        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const usuarioContainer = document.getElementById("viewerUser");
        console.log("USUARIO:", usuarioContainer);
        usuarioContainer.innerHTML = "";

        const data = body.data || [];
        console.log("USUARIOS:", data);

        if (data.length === 0) {
            return showToast("Não há nenhum usuario na lixeira.", "warning");
        }

        for (const instance of data) {
            const { uuid, nome, cargo, email, criado_em, deletado_em } = instance;
            const elementId = `${uuid}`;
            
            const dataCriacao = formatarData(criado_em);
            const dataExclusao = formatarData(deletado_em);

            const diasRestantes = calcularDiasRestantes(deletado_em);        

            const element = `
    <div id="${elementId}"
        class="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)]
        bg-white w-full min-w-0 border-2 border-slate-400
        min-h-80 h-auto xl:h-80 rounded-xl">

        <!-- INFORMAÇÕES DO USUÁRIO -->
        <div id="title"
            class="h-full w-full min-w-0
            grid grid-rows-[auto_auto_auto] xl:grid-rows-3
            text-base sm:text-lg xl:text-xl 2xl:text-3xl">

            <!-- NOME -->
            <div class="flex flex-wrap justify-center items-center
                gap-2 sm:gap-4 xl:gap-6 text-center
                px-2 py-3 xl:py-0 min-w-0">

                <div id="nome_user"
                    class="text-2xl sm:text-3xl 2xl:text-4xl
                    break-words min-w-0">
                    ${nome}
                </div>
            </div>

            <!-- CARGO E EMAIL -->
            <div class="px-3 sm:px-6 xl:px-4 2xl:px-6
                py-3 xl:py-0
                grid grid-rows-[auto_auto]
                items-start justify-start min-w-0 gap-3">

                <div id="cargo"
                    class="self-start break-words min-w-0">
                    ${cargo}
                </div>

                <div class="flex text-sm sm:text-base xl:text-lg 2xl:text-2xl
                    break-all min-w-0">
                    ${email}
                </div>
            </div>

            <!-- DATA DE CRIAÇÃO -->
            <div class="flex flex-wrap items-center justify-center
                text-center px-2 py-3 xl:py-0 gap-1 min-w-0">

                Criado em:

                <span id="creation"
                    class="text-green-400 break-words">
                    ${dataCriacao}
                </span>
            </div>
        </div>

        <!-- INFORMAÇÕES DE EXCLUSÃO -->
        <div id="exclusao"
            class="h-full w-full min-w-0
            flex flex-col items-center justify-evenly
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-3 py-5 xl:py-0 px-2
            border-t border-b
            xl:border-t-0 xl:border-b-0 xl:border-l xl:border-r
            border-slate-200">

            <div class="flex flex-wrap items-center justify-center
                text-center gap-1 min-w-0">

                Deletado em:

                <span id="data_del"
                    class="text-red-400 text-xl sm:text-2xl 2xl:text-4xl
                    break-words">
                    ${dataExclusao}
                </span>
            </div>

            <div class="flex items-center justify-center
                flex-col text-center min-w-0">

                <div class="break-words">
                    Exclusão permanente em
                </div>

                <div class="text-3xl sm:text-4xl 2xl:text-5xl">
                    <span id="days">${diasRestantes}</span> DIAS
                </div>
            </div>
        </div>

        <!-- AÇÕES -->
        <div id="quest"
            class="h-full w-full min-w-0
            flex flex-col justify-evenly xl:justify-between
            items-center py-5 xl:py-4 2xl:py-6
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-4">

            <div class="text-center">
                Deseja recuperar?
            </div>

            <div class="flex flex-wrap justify-center
                gap-3 sm:gap-4 xl:gap-3 2xl:gap-6
                w-full px-2">

                <div onclick="RecuperarUsuario('${uuid}')"
                    class="rounded-2xl border-blue-600
                    hover:cursor-pointer hover:bg-blue-600 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Sim
                </div>

                <div onclick="ExcluirUsuario('${uuid}')"
                    class="rounded-2xl border-red-500
                    hover:cursor-pointer hover:bg-red-500 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Não (Apagar)
                </div>
            </div>
        </div>
    </div>
`;
            usuarioContainer.innerHTML += element;
        };
    } catch (e) {
    console.error("ERRO NA LOAD USERS:", e);
    showToast("Algo deu errado ao carregar os usuarios.", "error");
}
};

const loadVolumes = async () => {
         if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/lixeira/listar-volumes', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("STATUS:", response.status);
        
        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (response.status === 204) {
            return showToast("Não há nenhum volume", "warning");
        }

        const body = await response.json();
        console.log("BODY:", body);
        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const volumeContainer = document.getElementById("viewerVol");
        console.log("VOLUME:", volumeContainer);
        volumeContainer.innerHTML = "";

        const data = body.data || [];
        console.log("VOLUMES:", data);

        if (data.length === 0) {
            return showToast("Não há nenhum volume na lixeira.", "warning");
        }

        for (const instance of data) {
            const { uuid, armazenamento, instancia_associada, custo_volume, criado_em, deletado_em } = instance;
            const elementId = `${uuid}`;
            
            const dataCriacao = formatarData(criado_em);
            const dataExclusao = formatarData(deletado_em);

            const diasRestantes = calcularDiasRestantes(deletado_em);        

            const element = `
    <div id="${elementId}"
        class="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)]
        bg-white w-full min-w-0 border-2 border-slate-400
        min-h-80 h-auto xl:h-80 rounded-xl overflow-hidden">

        <!-- INFORMAÇÕES DO VOLUME -->
        <div id="title"
            class="h-full w-full min-w-0
            grid grid-rows-[auto_auto_auto] xl:grid-rows-3
            text-base sm:text-lg xl:text-xl 2xl:text-3xl">

            <!-- ARMAZENAMENTO -->
            <div class="flex flex-wrap justify-center items-center
                gap-2 sm:gap-4 xl:gap-6 text-center
                px-2 py-3 xl:py-0 min-w-0">

                <div id="volume"
                    class="text-2xl sm:text-3xl 2xl:text-4xl
                    break-words min-w-0">

                    <span id="vol">${armazenamento}</span>GB
                </div>
            </div>

            <!-- INSTÂNCIA E CUSTO -->
            <div class="px-3 sm:px-6 xl:px-4 2xl:px-6
                py-3 xl:py-0
                grid grid-cols-2 sm:grid-cols-4
                grid-rows-[auto_auto]
                items-start justify-center
                min-w-0 gap-x-2 gap-y-3">

                <div class="flex self-start col-span-1 sm:col-span-2
                    min-w-0 break-words">

                    Instância:
                </div>

                <div class="flex col-span-1 sm:col-span-2
                    self-start min-w-0 break-words">

                    ${instancia_associada}
                </div>

                <div class="flex col-span-1 sm:col-span-2
                    min-w-0 break-words">

                    Custo Giga:
                </div>

                <div class="flex col-span-1 sm:col-span-2
                    justify-self-start min-w-0 break-words">

                    R$ <span id="custo" class="break-words">
                        ${custo_volume}
                    </span>
                </div>
            </div>

            <!-- DATA DE CRIAÇÃO -->
            <div class="flex flex-wrap items-center justify-center
                text-center px-2 py-3 xl:py-0 gap-1 min-w-0">

                Criado em:

                <span id="creation"
                    class="text-green-400 break-words">
                    ${dataCriacao}
                </span>
            </div>
        </div>

        <!-- INFORMAÇÕES DE EXCLUSÃO -->
        <div id="exclusao"
            class="h-full w-full min-w-0
            flex flex-col items-center justify-evenly
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-3 py-5 xl:py-0 px-2
            border-t border-b
            xl:border-t-0 xl:border-b-0 xl:border-l xl:border-r
            border-slate-200 overflow-hidden">

            <div class="flex flex-wrap items-center justify-center
                text-center gap-1 min-w-0">
                Deletado em:
                <span id="data_del"
                    class="text-red-400 text-xl sm:text-2xl 2xl:text-4xl
                    break-words">
                    ${dataExclusao}
                </span>
            </div>

            <div class="flex items-center justify-center
                flex-col text-center min-w-0">

                <div class="break-words">
                    Exclusão permanente em
                </div>

                <div class="text-3xl sm:text-4xl 2xl:text-5xl">
                    <span id="days">${diasRestantes}</span> DIAS
                </div>
            </div>
        </div>

        <!-- AÇÕES -->
        <div id="quest"
            class="h-full w-full min-w-0
            flex flex-col justify-evenly xl:justify-between
            items-center py-5 xl:py-4 2xl:py-6
            text-base sm:text-lg xl:text-xl 2xl:text-3xl
            gap-4 overflow-hidden">

            <div class="text-center">
                Deseja recuperar?
            </div>

            <div class="flex flex-wrap justify-center
                gap-3 sm:gap-4 xl:gap-3 2xl:gap-6
                w-full px-2">

                <div onclick="RecuperarVolume('${uuid}')"
                    class="rounded-2xl border-blue-600
                    hover:cursor-pointer hover:bg-blue-600 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Sim
                </div>

                <div onclick="ExcluirVolume('${uuid}')"
                    class="rounded-2xl border-red-500
                    hover:cursor-pointer hover:bg-red-500 hover:text-white
                    border-2 py-2 sm:py-3 px-4 sm:px-5
                    text-base xl:text-lg 2xl:text-xl text-center">

                    Não (Apagar)
                </div>
            </div>
        </div>
    </div>
`;
            volumeContainer.innerHTML += element;
        };
    } catch (e) {
    console.error("ERRO NA LOAD VOLUMES:", e);
    showToast("Algo deu errado ao carregar os volumes.", "error");
}
};

window.addEventListener("load", loadInstances);
window.addEventListener("load", loadMicros);
window.addEventListener("load", loadCompos);
window.addEventListener("load", loadUsuarios);
window.addEventListener("load", loadVolumes);

let uuidInstSelecionado = null;
let uuidMicroSelecionado = null;
let uuidCompoSelecionado = null;
let uuidInstCompoSelecionado = null;
let uuidUsuarioSelecionado = null;
let uuidVolSelecionado = null;

const ExcluirInstancia = (uuid) => {
    console.log("CLICOU EM APAGAR INSTÂNCIA:", uuid);

    uuidInstSelecionado = uuid;

    const modal = document.getElementById("deleteInst");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

const ExcluirMicro = (uuid) => {
    console.log("CLICOU EM APAGAR MICRO:", uuid);

    uuidMicroSelecionado = uuid;

    const modal = document.getElementById("deleteMicro");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

const ExcluirCompo = (componente_uuid, instancia_uuid) => {
    console.log("CLICOU EM APAGAR COMPONENTE:", componente_uuid, instancia_uuid);

    uuidCompoSelecionado = componente_uuid;
    uuidInstCompoSelecionado = instancia_uuid;

    const modal = document.getElementById("deleteCompo");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

const ExcluirUsuario = (uuid) => {
    console.log("CLICOU EM APAGAR USUÁRIO:", uuid);

    uuidUsuarioSelecionado = uuid;

    const modal = document.getElementById("deleteUser");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

const ExcluirVolume = (uuid) => {
    console.log("CLICOU EM APAGAR VOLUME:", uuid);

    uuidVolSelecionado = uuid;

    const modal = document.getElementById("deleteVol");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

const confirmarExclusaoInst = async () => {
    if (!token) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    if (!uuidInstSelecionado) {
        return showToast("Nenhuma instância foi selecionada.", "warning");
    }

    try {
        const resposta = await fetch(`/lixeira/apagar-instancia/${uuidInstSelecionado}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Vamos verificar exatamente o que o servidor respondeu
        const textoResposta = await resposta.text();

        console.log("STATUS DA EXCLUSÃO:", resposta.status);
        console.log("RESPOSTA DO BACKEND:", textoResposta);

        let resultado = {};

        if (textoResposta) {
            try {
                resultado = JSON.parse(textoResposta);
            } catch (erro) {
                console.log("A resposta não está em formato JSON.");
            }
        }

        if (resposta.status === 401 || resposta.status === 403) {
            logout();
            return;
        }

        if (!resposta.ok) {
            return showToast(
                resultado.message || `Erro ao excluir. Status: ${resposta.status}`,
                "error"
            );
        }

        showToast(resultado.message || "Instância excluída com sucesso!", "success");

        cancelarExcluirInst();
        uuidInstSelecionado = null;

        loadInstances();

    } catch (e) {
        console.error("ERRO NA REQUISIÇÃO DE EXCLUSÃO:", e);
        showToast("Não foi possível concluir a requisição.", "error");
    }
};

const confirmarExclusaoMicro = async() => {
     if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(`/lixeira/apagar-micro/${uuidMicroSelecionado}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();

    if (resposta.status === 400) 
      return showToast(resultado.message, "warning");

    if (resposta.status === 500) 
      return showToast(resultado.message, "error");
    
    showToast(resultado.message, "success");

    if (resposta.ok) {
      cancelarExcluirMicro();
      loadMicros();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao excluir o microsservico.", "error");
  }
} 

const confirmarExclusaoCompo = async() => {
     if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch( `/lixeira/apagar-componente/${uuidCompoSelecionado}/${uuidInstCompoSelecionado}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();

    if (resposta.status === 400) 
      return showToast(resultado.message, "warning");

    if (resposta.status === 500) 
      return showToast(resultado.message, "error");
    
    showToast(resultado.message, "success");

    if (resposta.ok) {
      cancelarExcluirCompo();
      loadCompos();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao excluir o componente.", "error");
  }
} 

const confirmarExclusaoUser = async() => {
     if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(`/lixeira/apagar-usuario/${uuidUsuarioSelecionado}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();

    if (resposta.status === 400) 
      return showToast(resultado.message, "warning");

    if (resposta.status === 500) 
      return showToast(resultado.message, "error");
    
    showToast(resultado.message, "success");

    if (resposta.ok) {
      cancelarExcluirUser();
      loadUsuarios();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao excluir o usuario.", "error");
  }
} 

const confirmarExclusaoVol = async() => {
     if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(`/lixeira/apagar-volume/${uuidVolSelecionado}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();

    if (resposta.status === 400) 
      return showToast(resultado.message, "warning");

    if (resposta.status === 500) 
      return showToast(resultado.message, "error");
    
    showToast(resultado.message, "success");

    if (resposta.ok) {
      cancelarExcluirVol();
      loadVolumes();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao excluir o volume.", "error");
  }
} 

const cancelarExcluirInst = () => {
  document.getElementById("deleteInst").classList.replace("flex", "hidden");
};
const cancelarExcluirMicro = () => {
  document.getElementById("deleteMicro").classList.replace("flex", "hidden");
};
const cancelarExcluirCompo = () => {
  document.getElementById("deleteCompo").classList.replace("flex", "hidden");
};
const cancelarExcluirUser = () => {
  document.getElementById("deleteUser").classList.replace("flex", "hidden");
};
const cancelarExcluirVol = () => {
  document.getElementById("deleteVol").classList.replace("flex", "hidden");
};

const RecuperarInstancia = async (uuid) => {
    uuidInstSelecionado = uuid;
    if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(
      `/lixeira/recuperar-instancia/${uuidInstSelecionado}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();
    showToast(resultado.message, resposta.ok ? "success" : "error");

    if (resposta.ok) {
      loadInstances();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao atualizar a instancia.", "error");
  }
}
const RecuperarMicro = async (uuid) => {
    uuidMicroSelecionado = uuid;
    if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(
      `/lixeira/recuperar-micro/${uuidMicroSelecionado}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();
    showToast(resultado.message, resposta.ok ? "success" : "error");

    if (resposta.ok) {
      loadMicros();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao atualizar o microsservico.", "error");
  }
}
const RecuperarCompo = async (componente_uuid, instancia_uuid) => {
    uuidCompoSelecionado = componente_uuid;
    uuidInstCompoSelecionado = instancia_uuid;
    if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(
      `/lixeira/recuperar-componente/${uuidCompoSelecionado}/${uuidInstCompoSelecionado}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();
    showToast(resultado.message, resposta.ok ? "success" : "error");

    if (resposta.ok) {
      loadCompos();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao atualizar o componente.", "error");
  }
}
const RecuperarUsuario = async (uuid) => {
    uuidUsuarioSelecionado = uuid;
    if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(
      `/lixeira/recuperar-usuario/${uuidUsuarioSelecionado}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();
    showToast(resultado.message, resposta.ok ? "success" : "error");

    if (resposta.ok) {
      loadUsuarios();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao atualizar o usuario.", "error");
  }
}
const RecuperarVolume = async (uuid) => {
    uuidVolSelecionado = uuid;
    if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(
      `/lixeira/recuperar-volume/${uuidVolSelecionado}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();
    showToast(resultado.message, resposta.ok ? "success" : "error");

    if (resposta.ok) {
      loadVolumes();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao atualizar o volume.", "error");
  }
}

window.ExcluirInstancia = ExcluirInstancia;
window.ExcluirMicro = ExcluirMicro;
window.ExcluirCompo = ExcluirCompo;
window.ExcluirUsuario = ExcluirUsuario;
window.ExcluirVolume = ExcluirVolume;

window.confirmarExclusaoInst = confirmarExclusaoInst;
window.confirmarExclusaoMicro = confirmarExclusaoMicro;
window.confirmarExclusaoCompo = confirmarExclusaoCompo;
window.confirmarExclusaoUser = confirmarExclusaoUser;
window.confirmarExclusaoVol = confirmarExclusaoVol;

window.RecuperarInstancia = RecuperarInstancia;
window.RecuperarMicro = RecuperarMicro;
window.RecuperarCompo = RecuperarCompo;
window.RecuperarUsuario = RecuperarUsuario;
window.RecuperarVolume = RecuperarVolume; 