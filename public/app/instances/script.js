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

        const instancesContainer = document.getElementById("instancesContainer");
        instancesContainer.innerHTML = "";

        const data = body.data || [];

        for (const instance of data) {
            const { uuid, nome, endereco_mac, custo_armazenamento, custo_mensal, custo_computacao, microsservico, tipo, cpu, ram } = instance;
            const elementId = `${uuid}`;

            let nomeInstancia = "";
            let microsservicoAtribuido = "";
            let nomeMicrosservico = "";
            let corMicroservice = "";
            let corHoverMicroservice = "";

            if (!microsservico) {
                microsservicoAtribuido = "hidden"
                nomeMicrosservico = "Não atribuído"
                corMicroservice = "bg-red-200"
                corHoverMicroservice = "bg-red-300";
            } else {
                microsservicoAtribuido = ""
                nomeMicrosservico = `${microsservico}`
                corMicroservice = "bg-slate-300"
                corHoverMicroservice = "bg-slate-400"
                if (!nome) {
                    nomeInstancia = `${endereco_mac}`
                } else {
                    nomeInstancia = `${nome}`
                }
            }

            let volumes = await getInstanceVolumes(uuid);

            const element = `
                <div class="bg-slate-100 p-6 rounded-lg flex flex-col gap-4 shadow w-full" id="${elementId}">
                    <div class="flex justify-between items-center gap-2 font-semibold text-lg">
                        <div>
                            <h1 class="text-2xl font-bold">${nomeInstancia}</h1>
                            <div class="flex items-center mt-1">
                                <p class="text-md text-blue-600 font-bold">${tipo}</p>
                                <p class="text-sm ml-2 bg-blue-600 text-white py-1.5 px-3 max-sm:text-xs rounded-lg font-semibold w-fit break-all">${cpu}vCPU</p>
                                <p class="text-sm ml-2 bg-blue-600 text-white py-1.5 px-3 max-sm:text-xs rounded-lg font-semibold w-fit break-all">${ram} GiB de RAM</p>
                                <p class="text-sm ml-2 bg-green-600 text-white py-1.5 px-3 max-sm:text-xs rounded-lg font-semibold w-fit break-all">$${custo_computacao}/mês</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 shrink-0">
                            <i onclick="openDeleteInstanceForm('${uuid}', '${elementId}')" class="ph-bold ph-trash text-2xl sm:text-3xl hover:cursor-pointer rounded-lg hover:bg-slate-300 size-10 sm:size-12 flex items-center justify-center duration-150 transition-all"></i>
                            <i onclick="openEditInstanceForm('${uuid}', '${endereco_mac}', '${elementId}')" class="ph-bold ph-note-pencil text-2xl sm:text-3xl hover:cursor-pointer rounded-lg hover:bg-slate-300 size-10 sm:size-12 flex items-center justify-center duration-150 transition-all"></i>
                        </div>
                    </div>
                    <div class="border border-slate-950/50"></div>
                    <div class="flex items-center">
                        <h1 class="py-1.5 pr-3 max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all ${microsservicoAtribuido}">Microsserviço:</h1>
                        <h1 class="${corMicroservice} hover:${corHoverMicroservice} py-1.5 px-3 max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all hover:cursor-pointer duration-150 transition-all" onclick="openMicroservicesPage()">${nomeMicrosservico}</h1>
                    </div>
                    <div class="flex items-center">
                        <h1 class="py-1.5 pr-3 max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all">Custo da instância:</h1>
                        <h1 class="bg-green-600 text-white py-1.5 px-3 max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all">$${custo_mensal}/mês</h1>
                    </div>
                    <h1 class="max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all">Volumes:</h1>
                    ${volumes}
                    <div class="flex items-center">
                        <p class="max-sm:text-xs text-sm pl-3 font-semibold w-fit break-all">Total:</p>
                        <p class="text-sm ml-2 bg-green-600 text-white py-1.5 px-3 max-sm:text-xs rounded-lg font-semibold w-fit break-all">$${custo_armazenamento}/mês</p>
                    </div>
                </div>
            `;

            instancesContainer.innerHTML += element;
        };
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar as instâncias.", "error");
    }
};

const getInstanceVolumes = async (instance_uuid) => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch(`/instances/listar-volumes/${instance_uuid}`, {
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
            return showToast("Não há nenhum volume", "warning");
        }

        const body = await response.json();

        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const data = body.data || [];

        console.log(data)

        let element = "";

        let contador = 1;
        let custo_total = 0;

        if (data == "") {
            element += `<h1 class="text-red-500 pl-3 py-1.5 max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all">Nenhum volume atribuído.</h1>`;
        }

        data.forEach(volume => {
            const { uuid, armazenamento, custo_giga } = volume;
            const elementId = `${uuid}`;
            const custo_volume = armazenamento * custo_giga;

            element += `
                <div class="flex items-center" id="${elementId}">
                    <p class="max-sm:text-xs pl-3 text-sm w-fit break-all"><b>${contador}.</b> ${armazenamento} GiB, $${custo_volume}</p>
                </div>
            `;

            contador++;
        });
        return element;
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar os volumes.", "error");
    }
}

const newMicroservice = async () => {
    const data = await getInstancesMACAddress();
    const options = [];

    data.forEach(instance => {
        const { uuid, endereco_mac } = instance;

        const option = `<option value="${uuid}">${endereco_mac}</option>`

        options.push(option)
    })

    const popUpBody = `
    <div class="flex flex-col justify-around gap-4">
      <form class="flex flex-col gap-2">

        <div class="flex flex-col gap-1.5">
        <label for="microserviceInstance" class="text-sm text-slate-300">Instância</label> 
        
        <div class="relative w-full">
            <select id="microserviceInstance"
                class="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-gray-400 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                onchange="this.classList.toggle('text-gray-400', !this.value); this.classList.toggle('text-slate-100', !!this.value);"
            >
                <option value="" disabled selected class="text-gray-400 bg-slate-800">Selecione uma instância</option>
                ${options}
            </select>

            <span class="ph-bold ph-caret-down text-xl text-slate-400 pointer-events-none absolute top-1/2 end-3 -translate-y-1/2"></span>
            </div>

        <div class="flex flex-col gap-1.5">
          <label for="microserviceName" class="text-sm text-slate-300">Nome</label> 
            <input type="text" id="microserviceName" placeholder="Nome do microsserviço" class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="microserviceDescription" class="text-sm text-slate-300">Descrição</label> 
          <textarea type="text" id="microserviceDescription" placeholder="Descrição do microsserviço" 
            class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors min-h-32 resize-none [field-sizing:content]"
            rows="10"></textarea>
        </div>
      </form>
      
      <div>
        <button
          onclick="newMicroserviceConfirmed()"
          id="newMicroserviceConfirmedButton"
          class="w-full py-3 mt-2 border-2 border-blue-600 hover:bg-blue-600 rounded-lg font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Criar</span>
        </button>
        <button
          onclick="closePopUp()"
          class="w-full py-3 mt-2 border-2 border-red-600 hover:bg-red-600 rounded-lg font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Cancelar</span>
        </button>
      </div>
    </div>
  `

    showPopUp("Cadastrar novo microsserviço", popUpBody)
}

const openMicroservicesPage = () => {
    window.location.href = "/app/microservices/index.html";
}