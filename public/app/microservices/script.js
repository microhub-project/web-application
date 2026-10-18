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

            let stringEnderecoMAC = "";
            let corInstance = ""

            if (!endereco_mac) {
                stringEnderecoMAC = "Não atribuído"
                corInstance = "bg-red-200"
            } else {
                stringEnderecoMAC = `Instância: ${endereco_mac}`
                corInstance = "bg-slate-300"
            }

            const element = `
                <div class="bg-slate-100 p-6 max-sm:p-4 rounded-lg flex flex-col gap-3 sm:gap-4 shadow w-full" id="${elementId}">
                    <div class="flex justify-between items-center gap-2 font-semibold text-lg">
                        <h1 class="text-2xl max-sm:text-lg font-bold break-words shrink min-w-0">${nome}</h1>
                        <div class="flex items-center gap-1 shrink-0">
                            <i onclick="openDeleteMicroserviceForm('${nome}', '${elementId}')" class="ph-bold ph-trash text-2xl sm:text-3xl hover:cursor-pointer rounded-lg hover:bg-slate-300 size-10 sm:size-12 flex items-center justify-center duration-150 transition-all"></i>
                            <i onclick="openEditMicroserviceForm('${nome}', '${descricao}', '${elementId}')" class="ph-bold ph-note-pencil text-2xl sm:text-3xl hover:cursor-pointer rounded-lg hover:bg-slate-300 size-10 sm:size-12 flex items-center justify-center duration-150 transition-all"></i>
                        </div>
                    </div>
                    <div class="border-b border-slate-950/20"></div>
                    <h1 class="${corInstance} py-1.5 px-3 max-sm:text-xs text-sm rounded-lg font-semibold w-fit break-all">${stringEnderecoMAC}</h1>
                    <div class="flex justify-between items-center gap-2">
                        <p class="w-full px-3 py-2 rounded text-slate-800 text-sm max-sm:text-xs leading-relaxed break-words">
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

const openNewMicroserviceForm = () => {
    const popUpBody = `
    <div class="flex flex-col justify-around gap-4">
      <form class="flex flex-col gap-3">    

        <div class="flex flex-col gap-1.5">
            <label for="microserviceName" class="text-xs sm:text-sm text-slate-300">Nome</label> 
            <input type="text" id="microserviceName" placeholder="Nome do microsserviço" class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
        </div>

        <div class="flex flex-col gap-1.5">
            <label for="microserviceDescription" class="text-xs sm:text-sm text-slate-300">Descrição</label> 
            <textarea id="microserviceDescription" placeholder="Descrição do microsserviço" 
                class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors min-h-28 sm:min-h-32 resize-none"
                rows="6"></textarea>
        </div>
      </form>
      
      <div class="flex flex-col gap-2 mt-1">
        <button
          onclick="newMicroservice()"
          id="newMicroserviceButton"
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

    showPopUp("Cadastrar novo microsserviço", popUpBody);
};

const openDeleteMicroserviceForm = (nome, microservice_uuid) => {
    const popUpBody = `
    <div class="flex flex-col justify-around gap-4">
      <div class="flex flex-col gap-2 mt-1">
        <button
          onclick="deleteMicroservice('${microservice_uuid}')"
          id="deleteMicroserviceButton"
          class="w-full py-2.5 sm:py-3 border-2 border-blue-600 hover:bg-blue-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Apagar</span>
        </button>
        <button
          onclick="closePopUp('deleteMicroservice')"
          class="w-full py-2.5 sm:py-3 border-2 border-red-600 hover:bg-red-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Cancelar</span>
        </button>
      </div>
    </div>
  `;

    showPopUp(`Apagar "${nome}"?`, popUpBody, 'deleteMicroservice');
};

const openEditMicroserviceForm = (nome, descricao, microservice_uuid) => {
    const popUpBody = `
    <div class="flex flex-col justify-around gap-4">
      <form class="flex flex-col gap-3">    

        <div class="flex flex-col gap-1.5">
            <label for="newMicroserviceName" class="text-xs sm:text-sm text-slate-300">Nome</label> 
            <input type="text" id="newMicroserviceName" value="${nome}" class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
        </div>

        <div class="flex flex-col gap-1.5">
            <label for="newMicroserviceDescription" class="text-xs sm:text-sm text-slate-300">Descrição</label> 
            <textarea id="newMicroserviceDescription" 
                class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors min-h-28 sm:min-h-32 resize-none"
                rows="6">${descricao}</textarea>
        </div>
      </form>
      
      <div class="flex flex-col gap-2 mt-1">
        <button
          onclick="saveMicroservice('${microservice_uuid}')"
          id="saveMicroserviceButton"
          class="w-full py-2.5 sm:py-3 border-2 border-blue-600 hover:bg-blue-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Salvar</span>
        </button>
        <button
          onclick="closePopUp()"
          class="w-full py-2.5 sm:py-3 border-2 border-red-600 hover:bg-red-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
          <span class="font-medium">Cancelar</span>
        </button>
      </div>
    </div>
  `;

    showPopUp(`Editando "${nome}"`, popUpBody);
};

const saveMicroservice = async (microservice_uuid) => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    const button = document.getElementById("saveMicroserviceButton")
    const name = document.getElementById("newMicroserviceName").value.trim()
    const description = document.getElementById("newMicroserviceDescription").value

    toggleDisableButton(button)

    const body = {
        "uuid": microservice_uuid,
        "nome": name,
        "descricao": description
    }

    try {
        const atualizar = await fetch("/microservices/atualizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })

        if (atualizar.status === 401 || atualizar.status === 403) {
            logout();
            return;
        }

        const response = await atualizar.json()

        if (atualizar.status === 500)
            return showToast(response.message, "error")

        if (atualizar.status === 400)
            return showToast(response.message, "warning")

        if (!atualizar.ok)
            return showToast(response.message, "error")

        closePopUp()
        reloadPage()
        showToast(response.message, "success")
    } catch (e) {
        console.error(e)
        return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
}

const newMicroservice = async () => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    const button = document.getElementById("newMicroserviceButton")
    const name = document.getElementById("microserviceName").value.trim()
    const description = document.getElementById("microserviceDescription").value

    toggleDisableButton(button)

    const body = {
        "empresa_uuid": userData.companyUUID,
        "nome": name,
        "descricao": description
    }

    try {
        const cadastrar = await fetch("/microservices/cadastrar", {
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

        if (cadastrar.status === 500)
            return showToast(response.message, "error")

        if (cadastrar.status === 400)
            return showToast(response.message, "warning")

        if (!cadastrar.ok)
            return showToast(response.message, "error")

        closePopUp()
        reloadPage()
        showToast(response.message, "success")
    } catch (e) {
        console.error(e)
        return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
}

const deleteMicroservice = async (microservice_uuid) => {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const userData = getUserSession();

    if (!token || !userData) {
        logout();
        return showToast("Sessão inválida, faça login novamente", "warning");
    }

    const button = document.getElementById("deleteMicroserviceButton")

    toggleDisableButton(button)

    const body = {
        "uuid": microservice_uuid
    }

    try {
        const apagar = await fetch("/microservices/apagar", {
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

        if (apagar.status === 500)
            return showToast(response.message, "error")

        if (apagar.status === 400)
            return showToast(response.message, "warning")

        if (!apagar.ok)
            return showToast(response.message, "error")

        closePopUp()
        reloadPage()
        showToast(response.message, "success")
    } catch (e) {
        console.error(e)
        return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
}

const showPopUp = (title, popUpBody, deleteMicroservice) => {
    let popUpContainer;
    let popUpContent;
    let onClick;

    if (deleteMicroservice) {
        popUpContainer = document.getElementById("deletePopUpContainer");
        popUpContent = document.getElementById("deletePopUpContent");
        onClick = `onclick="closePopUp('deleteMicroservice')"`;
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

const closePopUp = (deleteMicroservice) => {
    if (deleteMicroservice) {
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