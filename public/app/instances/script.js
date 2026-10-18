const getMicroservices = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    try {
        const response = await fetch('/microservices/listar', {
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

        const microservicesContainer = document.getElementById("microservicesContainer");
        microservicesContainer.innerHTML = "";

        const data = body.data || [];

        data.forEach(microservice => {
            const { uuid, nome, descricao, endereco_mac } = microservice;
            const elementId = `${uuid}`;

            const element = `
                <div class="bg-slate-100 p-6 rounded-lg flex flex-col gap-4 shadow w-full" id="${elementId}">
                    <div class="flex justify-between items-center gap-2 font-semibold text-lg">
                        <h1 class="text-2xl font-bold">${nome}</h1>
                    </div>
                    <div class="border border-slate-950/50"></div>
                    <h1 class="bg-slate-300 py-2 px-4 rounded-lg font-semibold w-fit">Instância: ${endereco_mac}</h1>
                    <div class="flex justify-between items-center gap-5">
                        <p class="w-full px-4 py-3 bg-slate-100">
                            ${descricao}
                        </p>
                    </div>
                </div>
            `;

            microservicesContainer.innerHTML += element;
        });
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar os microsserviços.", "error");
    }
};

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

        const data = body.data || [];

        return data
    } catch (e) {
        console.error(e);
        showToast("Algo deu errado ao carregar as instâncias.", "error");
    }
};