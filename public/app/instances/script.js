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
                            <i onclick="openDeleteInstanceForm('${nomeInstancia}', '${elementId}')" class="ph-bold ph-trash text-2xl sm:text-3xl hover:cursor-pointer rounded-lg hover:bg-slate-300 size-10 sm:size-12 flex items-center justify-center duration-150 transition-all"></i>
                            <i onclick="openEditInstanceForm('${uuid}', '${endereco_mac}', '${elementId}')" class="ph-bold ph-note-pencil text-2xl sm:text-3xl hover:cursor-pointer rounded-lg hover:bg-slate-300 size-10 sm:size-12 flex items-center justify-center duration-150 transition-all"></i>
                        </div>
                    </div>
                    <div class="border border-slate-950"></div>
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

const openDeleteInstanceForm = (nome, instance_uuid) => {
    const popUpBody = `
    <div class="flex flex-col justify-around gap-4">
      <div class="flex flex-col gap-2 mt-1">
        <button
          onclick="deleteInstance('${instance_uuid}')"
          id="deleteInstanceButton"
          class="w-full py-2.5 sm:py-3 border-2 bg-red-600 border-red-600 hover:bg-red-800 hover:border-red-800 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Apagar</span>
        </button>
        <button
          onclick="closePopUp('deleteInstanceButton')"
          class="w-full py-2.5 sm:py-3 border-2 border-red-600 hover:bg-red-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Cancelar</span>
        </button>
      </div>
    </div>
  `;

    showPopUp(`Apagar "${nome}"?`, popUpBody, 'deleteInstance');
};

const deleteInstance = async (instance_uuid) => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    const button = document.getElementById("deleteInstanceButton")

    toggleDisableButton(button)

    const body = {
        "uuid": instance_uuid
    }

    try {
        const apagar = await fetch("/instances/apagar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

        if (apagar.status === 401 || apagar.status === 403) {
            logout();
            return;
        }

        const response = await apagar.json()

        if (apagar.status === 500) {
            toggleDisableButton(button)
            return showToast(response.message, "error")
        }

        if (apagar.status === 400) {
            toggleDisableButton(button)
            return showToast(response.message, "warning")
        }

        if (!apagar.ok) {
            toggleDisableButton(button)
            return showToast(response.message, "error")
        }

        closePopUp()
        reloadPage()
        showToast(response.message, "success")
    } catch (e) {
        console.error(e)
        return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
}

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

        let element = "";

        let contador = 1;

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

const openNewInstanceForm = async () => {
    let componentes = await getComponents();
    let microsservicos = await getMicroservices();
    let tipos = await getTypes();

    const popUpBody = `
        <div class="flex flex-col justify-around gap-4">
            <form class="flex flex-row gap-4 w-full">

                <div class="flex flex-col mb-8 gap-1.5 w-2/3">
                    <span class="text-xs sm:text-sm text-slate-300">Componentes monitorados</span> 
                    
                    <div class="grid grid-cols-2 gap-3 items-start">
                        ${componentes}
                    </div>
                </div>

                <div class="flex flex-col mb-8 gap-3 w-1/3 shrink-0">
                    <div class="flex flex-col gap-1.5">
                        <label for="instanceName" class="text-xs sm:text-sm text-slate-300">Nome</label> 
                        <input type="text" id="instanceName" placeholder="Nome da instância" class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="instanceMACAddress" class="text-xs sm:text-sm text-slate-300">Endereço MAC</label> 
                        <input type="text" id="instanceMACAddress" placeholder="00:00:00:00:00:00" class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="instanceType" class="text-xs sm:text-sm text-slate-300">Tipo</label> 
                        <div class="relative w-full">
                            <select id="instanceType"
                                class="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-gray-400 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                onchange="this.classList.toggle('text-gray-400', !this.value); this.classList.toggle('text-slate-100', !!this.value);">
                                <option value="" disabled selected class="text-gray-400 bg-slate-800">Selecione um tipo</option>
                                ${tipos}
                            </select>
                            <span class="ph-bold ph-caret-down text-xl text-slate-400 pointer-events-none absolute top-1/2 end-3 -translate-y-1/2"></span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="instanceMicroservice" class="text-xs sm:text-sm text-slate-300">Microsserviço</label> 
                        <div class="relative w-full">
                            <select id="instanceMicroservice"
                                class="w-full px-4 py-3 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-gray-400 outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                onchange="this.classList.toggle('text-gray-400', !this.value); this.classList.toggle('text-slate-100', !!this.value);">
                                <option value="" disabled selected class="text-gray-400 bg-slate-800">Selecione um microsserviço</option>
                                ${microsservicos}
                            </select>
                            <span class="ph-bold ph-caret-down text-xl text-slate-400 pointer-events-none absolute top-1/2 end-3 -translate-y-1/2"></span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="instanceVolume" class="text-xs sm:text-sm text-slate-300">Volume</label> 
                        <div class="relative w-full">
                            <input type="text" id="instanceVolume" placeholder="100 GiB" class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
                            <span onclick="newVolume()"
                                class="ph-bold ph-plus text-xl text-slate-400 hover:text-slate-100 hover:cursor-pointer absolute top-1/2 end-3 -translate-y-1/2 duration-150 transition-all"></span>
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <ol id="newVolumesList"
                                class="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300">
                            </ol>
                        </div>
                    </div>
                </div>
            </form>
        </div>
      
      <div class="flex flex-col gap-2 mt-1 items-end">
        <button
          onclick="newInstance()"
          id="newInstanceButton"
          class="w-full py-2.5 sm:py-3 border-2 border-blue-600 hover:bg-blue-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Criar</span>
        </button>
        <button
          onclick="closePopUp()"
          class="w-full py-2.5 sm:py-3 border-2 border-red-600 hover:bg-red-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Cancelar</span>
        </button>
      </div>
    </div>
  `;

    showPopUp("Cadastrar nova instância", popUpBody);
};

const newInstance = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    const button = document.getElementById("newInstanceButton")
    const name = document.getElementById("instanceName").value.trim()
    const mac = document.getElementById("instanceMACAddress").value.trim()
    const type = document.getElementById("instanceType").value
    const microservice = document.getElementById("instanceMicroservice").value
    let uuid_nova_instancia = "";

    toggleDisableButton(button)

    if (mac.length != 17) {
        toggleDisableButton(button)
        return showToast("O endereço MAC deve ter exatamente 17 caracteres.", "error");
    }

    for (let i = 0; i < componentsArray.length; i++) {
        let componenteUUID = document.getElementById(`${componentsArray[i]}`).checked;
        let limiteMax = document.getElementById(`max${componentsArray[i]}`).value;
        let limiteMin = document.getElementById(`min${componentsArray[i]}`).value;

        if (componenteUUID) {
            if (!limiteMax && !limiteMin) {
                toggleDisableButton(button)
                return showToast("Para monitorar o componente, algum limite deve ser definido.", "error");
            }
        }
    }

    const body = {
        "nome": name,
        "endereco_mac": mac,
        "tipo_uuid": type,
        "microsservico_uuid": microservice
    }

    try {
        const cadastrar = await fetch("/instances/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

        if (cadastrar.status === 401 || cadastrar.status === 403) {
            logout();
            return;
        }

        const response = await cadastrar.json()

        if (cadastrar.status === 500) {
            toggleDisableButton(button)
            return showToast(response.message, "error")
        }

        if (cadastrar.status === 400) {
            toggleDisableButton(button)
            return showToast(response.message, "warning")
        }

        if (!cadastrar.ok) {
            toggleDisableButton(button)
            return showToast(response.message, "error")
        }

        uuid_nova_instancia = response.instance_uuid;

        showToast(response.message, "success")

        for (let i = 0; i < volumesArray.length; i++) {
            let armazenamento = volumesArray[i].storage;

            const body = {
                "armazenamento": armazenamento,
                "instancia_uuid": uuid_nova_instancia
            }

            try {
                const cadastrar = await fetch("/instances/cadastrar-volume", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })

                if (cadastrar.status === 401 || cadastrar.status === 403) {
                    logout();
                    return;
                }

                const response = await cadastrar.json()

                if (cadastrar.status === 500) {
                    toggleDisableButton(button)
                    return showToast(response.message, "error")
                }

                if (cadastrar.status === 400) {
                    toggleDisableButton(button)
                    return showToast(response.message, "warning")
                }

                if (!cadastrar.ok) {
                    toggleDisableButton(button)
                    return showToast(response.message, "error")
                }

            } catch (e) {
                console.error(e)
                return showToast("Algo deu errado. Tente novamente mais tarde", "error")
            }

            showToast(response.message, "success")
        }

        for (let i = 0; i < componentsArray.length; i++) {
            let componenteUUID = document.getElementById(`${componentsArray[i]}`).checked;
            let limiteMax = document.getElementById(`max${componentsArray[i]}`).value;
            let limiteMin = document.getElementById(`min${componentsArray[i]}`).value;
            let monitorado = 0;

            if (componenteUUID) {
                monitorado = 1;
            }

            const body = {
                "componente_uuid": componentsArray[i],
                "instancia_uuid": uuid_nova_instancia,
                "limite_maximo": limiteMax,
                "limite_minimo": limiteMin,
                "monitorado": monitorado
            }

            try {
                const cadastrar = await fetch("/instances/cadastrar-componente-instancia", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })

                if (cadastrar.status === 401 || cadastrar.status === 403) {
                    logout();
                    return;
                }

                const response = await cadastrar.json()

                if (cadastrar.status === 500) {
                    toggleDisableButton(button)
                    return showToast(response.message, "error")
                }

                if (cadastrar.status === 400) {
                    toggleDisableButton(button)
                    return showToast(response.message, "warning")
                }

                if (!cadastrar.ok) {
                    toggleDisableButton(button)
                    return showToast(response.message, "error")
                }
            } catch (e) {
                console.error(e)
                return showToast("Algo deu errado. Tente novamente mais tarde", "error")
            }
        }

        closePopUp()
        reloadPage()
        showToast(response.message, "success")
    } catch (e) {
        console.error(e)
        return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
}

let count = 0;
let volumesArray = [];

const newVolume = () => {
    const list = document.getElementById("newVolumesList");
    const inputElement = document.getElementById("instanceVolume");
    const rawValue = inputElement.value.trim();
    const numberValue = Number(rawValue);

    if (!rawValue) {
        showToast("Insira a quantidade de armazenamento do volume.", "error");
        inputElement.focus();
        return;
    }

    if (isNaN(numberValue)) {
        showToast("O volume inserido deve ser um número.", "error");
        inputElement.focus();
        return;
    }

    if (numberValue <= 0) {
        showToast("O volume inserido deve ser maior que 0.", "error");
        inputElement.focus();
        return;
    }

    let id = count;
    volumesArray.push({
        "id": count,
        "storage": numberValue
    })

    count++;

    const element = `
        <li class="pl-1" id="${id}">
            <div class="inline-flex items-center gap-2">
                <span>${numberValue} GiB</span>
                <span onclick="deleteVolume(${id})" class="ph-bold ph-trash text-xl text-slate-400 hover:text-slate-100 cursor-pointer duration-150 transition-colors"></span>
            </div>
        </li>
    `;

    list.innerHTML += element;

    inputElement.value = "";
    showToast("Novo volume inserido com sucesso!", "success");
    inputElement.focus();
};

const deleteVolume = (id) => {
    for (i = 0; i < volumesArray.length; i++) {
        if (volumesArray[i].id == id) {
            volumesArray.splice(i, 1);
            break;
        }
    }

    document.getElementById(id).remove();
}

const getTypes = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch(`/instances/listar-tipos`, {
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
            return showToast("Não há nenhum tipo", "warning");
        }

        const body = await response.json();

        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const data = body.data || [];

        let element = "";

        data.forEach(tipo => {
            const { uuid, nome, cpu, ram } = tipo;

            element += `<option value="${uuid}">${nome} (${cpu}, ${ram})</option>`;
        });

        return element;
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar os componentes.", "error");
    }
}

const getMicroservices = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch(`/microservices/listar`, {
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
            return showToast("Não há nenhum microsserviço", "warning");
        }

        const body = await response.json();

        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const data = body.data || [];

        let element = "";

        data.forEach(microsservico => {
            const { uuid, nome } = microsservico;

            element += `<option value="${uuid}">${nome}</option>`;
        });

        return element;
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar os componentes.", "error");
    }
}

let componentsArray = [];

const getComponents = async () => {
    componentsArray = [];
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch(`/instances/listar-componentes`, {
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
            return showToast("Não há nenhum componente", "warning");
        }

        const body = await response.json();

        if (response.status === 400) {
            return showToast(body.message || "Requisição inválida", "warning");
        }

        if (response.status === 500) {
            return showToast(body.message || "Erro interno do servidor", "error");
        }

        const data = body.data || [];

        let element = "";

        data.forEach(componente => {
            const { uuid, nome, nome_tecnico, unidade_medida } = componente;

            componentsArray.push(uuid);

            element += `
                <div class="flex flex-col gap-2.5 p-2.5 bg-slate-800 border border-slate-700 rounded-lg group has-[:checked]:bg-slate-800/80 transition-colors">
                    <label class="flex items-center gap-3 cursor-pointer select-none">
                        <div class="relative flex items-center shrink-0">
                            <input type="checkbox" id="${uuid}" class="peer sr-only">
                            <div class="w-5 h-5 border border-slate-600 bg-slate-900 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 transition-all flex items-center justify-center peer-checked:[&>span]:block">
                                <span class="ph-bold ph-check text-white text-xs hidden"></span>
                            </div>
                        </div>
                        <span class="text-xs sm:text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">${nome}</span>
                    </label>

                    <div class="hidden group-has-[:checked]:grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
                        <div class="flex flex-col gap-1">
                            <label for="max${uuid}" class="text-[11px] sm:text-xs text-slate-400">Limite Máximo</label>
                            <input 
                                type="number" 
                                id="max${uuid}" 
                                placeholder="0 ${unidade_medida}" 
                                class="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                        </div>

                        <div class="flex flex-col gap-1">
                            <label for="min${uuid}" class="text-[11px] sm:text-xs text-slate-400">Limite Mínimo</label>
                            <input 
                                type="number" 
                                id="min${uuid}" 
                                placeholder="0 ${unidade_medida}" 
                                class="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                        </div>
                    </div>
                </div>
            `
        });

        return element;
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar os componentes.", "error");
    }
}

const showPopUp = (title, popUpBody, deleteInstance) => {
    let popUpContainer;
    let popUpContent;
    let onClick;

    if (deleteInstance) {
        popUpContainer = document.getElementById("deletePopUpContainer");
        popUpContent = document.getElementById("deletePopUpContent");
        onClick = `onclick="closePopUp('deleteInstance')"`;
    } else {
        popUpContainer = document.getElementById("popUpContainer");
        popUpContent = document.getElementById("popUpContent");
        onClick = `onclick="closePopUp()"`;
    }

    popUpContainer.classList.replace("hidden", "flex");
    popUpContent.innerHTML = `
    <h1 class="text-lg sm:text-2xl font-bold pb-4 pr-8 break-words">${title}</h1>
    <button 
      type="button" 
      ${onClick}
      class="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300"> 
      <i class="ph ph-x text-2xl sm:text-3xl"></i>
    </button>
  `;

    popUpContent.innerHTML += popUpBody;
};

const closePopUp = (deleteInstance) => {
    if (deleteInstance) {
        document.getElementById("deletePopUpContainer").classList.replace("flex", "hidden")
        document.getElementById("deletePopUpContent").innerHTML = ""
        return
    }
    document.getElementById("popUpContainer").classList.replace("flex", "hidden")
    document.getElementById("popUpContent").innerHTML = ""
}

const reloadPage = () => {
    setTimeout(() => window.location.reload(), 2500)
}

const toggleDisableButton = (button) => {
    if (!button) return

    button.disabled = !button.disabled
}

const openMicroservicesPage = () => {
    window.location.href = "/app/microservices/index.html";
}