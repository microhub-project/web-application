let uuidUsuarioSelecionado = null;

const loadCompanyName = () => {
  const userData = getUserSession();
  const companyNameElement = document.getElementById("companyName");

  if (!userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  if (userData && companyNameElement) {
    companyNameElement.innerText = `@ ${userData.companyName || "Empresa"}`;
  }
};

const listarUsuarios = async () => {
  const token = sessionStorage.getItem("JWT_TOKEN");
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(`/usuarios/listar/${userData.companyUUID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    if (resposta.status !== 200) {
      return showToast("Algo deu errado. Tente novamente mais tarde", "error");
    }

    const usuarios = await resposta.json();
    mostrarUsuarios(usuarios);
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado. Tente novamente mais tarde", "error");
  }
};

const mostrarUsuarios = (usuarios) => {
  const lista = document.getElementById("listarUsuarios");

  lista.innerHTML = `
    <div class="hidden sm:grid grid-cols-12 px-5 font-bold text-slate-700">
      <span class="col-span-5">Nome</span>
      <span class="col-span-4">Cargo</span>
      <span class="col-span-3 text-right">Ações</span>
    </div>
  `;

  if (!usuarios || usuarios.length === 0) {
    lista.innerHTML += `
      <p class="text-center my-6 text-slate-600 font-normal sm:font-medium">
        Usuário não encontrado.
      </p>
    `;
    return;
  }

  for (let i = 0; i < usuarios.length; i++) {
    let cargo = "";

    if (usuarios[i].cargo == 0) {
      cargo = "Novo parceiro";
    } else if (usuarios[i].cargo == 1) {
      cargo = "Gerente TI";
    } else if (usuarios[i].cargo == 2) {
      cargo = "FinOps";
    } else if (usuarios[i].cargo == 3) {
      cargo = "DevOps";
    } else {
      cargo = "Administrador";
    }

    lista.innerHTML += `
      <div class="flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center bg-slate-50 rounded-xl p-4 sm:p-3 border sm:border-b border-slate-300 gap-2 sm:gap-0 shadow-sm sm:shadow-none">
        <div class="sm:col-span-5 w-full">
          <span class="sm:hidden text-xs text-slate-500 font-normal block uppercase">Nome</span>
          <p class="font-normal sm:font-normal text-slate-900 truncate">${usuarios[i].nome}</p>
        </div>

        <div class="sm:col-span-4 w-full">
          <span class="sm:hidden text-xs text-slate-500 font-normal block uppercase">Cargo</span>
          <p class="text-slate-700 sm:text-slate-900 truncate">${cargo}</p>
        </div>

        <div class="sm:col-span-3 w-full flex justify-start sm:justify-end gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
          <button
            onclick="Atualizar('${usuarios[i].uuid}')"
            class="flex-1 sm:flex-none px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-full text-xs sm:text-sm font-normal sm:font-medium transition-colors cursor-pointer text-center">
            Atualizar
          </button>

          <button
            onclick="Excluir('${usuarios[i].uuid}')"
            class="flex-1 sm:flex-none px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs sm:text-sm font-normal sm:font-medium transition-colors cursor-pointer text-center">
            Excluir
          </button>
        </div>
      </div>
    `;
  }
};

const Pesquisar = async () => {
  const nome = document.getElementById("input_pesquisa").value.trim();
  const userData = getUserSession();

  if (nome === "") {
    listarUsuarios();
    return;
  }

  const token = sessionStorage.getItem("JWT_TOKEN");

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const nomeEncoded = encodeURIComponent(nome);
    const url = `/usuarios/pesquisar?nome=${nomeEncoded}&companyUUID=${userData.companyUUID}`;

    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const usuarios = await resposta.json();
    mostrarUsuarios(usuarios);
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao pesquisar usuários.", "error");
  }
};

const Atualizar = (uuid) => {
  uuidUsuarioSelecionado = uuid;

  document.getElementById("opcaoAtualizar").value = "";

  document.getElementById("campoNome").classList.replace("flex", "hidden");
  document.getElementById("campoEmail").classList.replace("flex", "hidden");
  document.getElementById("campoCargo").classList.replace("flex", "hidden");

  document.getElementById("btnConfirmarAtualizacao").classList.replace("flex", "hidden");

  document.getElementById("updateUser").classList.replace("hidden", "flex");
};

function fecharAtualizar() {
  document.getElementById("updateUser").classList.replace("flex", "hidden");
}

function mostrarCampoAtualizar() {
  document.getElementById("campoNome").classList.replace("flex", "hidden");
  document.getElementById("campoEmail").classList.replace("flex", "hidden");
  document.getElementById("campoCargo").classList.replace("flex", "hidden");

  const botao = document.getElementById("btnConfirmarAtualizacao");
  const opcao = document.getElementById("opcaoAtualizar").value;

  botao.classList.replace("flex", "hidden");

  if (opcao === "nome") {
    document.getElementById("campoNome").classList.replace("hidden", "flex");
    botao.classList.replace("hidden", "flex");
  }

  if (opcao === "email") {
    document.getElementById("campoEmail").classList.replace("hidden", "flex");
    botao.classList.replace("hidden", "flex");
  }

  if (opcao === "cargo") {
    document.getElementById("campoCargo").classList.replace("hidden", "flex");
    botao.classList.replace("hidden", "flex");
  }
}

const salvarAtualizacao = async () => {
  const opcao = document.getElementById("opcaoAtualizar").value;

  if (opcao === "") {
    return showToast("Selecione o que deseja atualizar.", "warning");
  }

  let dados = {};

  if (opcao === "nome") {
    const nome = document.getElementById("nomeAtualizar").value.trim();
    if (nome === "") {
      return showToast("Digite o novo nome.", "warning");
    }
    dados.nome = nome;
  }

  if (opcao === "email") {
    const email = document.getElementById("emailAtualizar").value.trim();
    if (email === "") {
      return showToast("Digite o novo e-mail.", "warning");
    }
    dados.email = email;
  }

  if (opcao === "cargo") {
    const cargo = document.getElementById("cargoAtualizar").value;
    dados.cargo = cargo;
  }

  const token = sessionStorage.getItem("JWT_TOKEN");

  if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch(
      "/usuarios/atualizar/" + uuidUsuarioSelecionado,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      }
    );

    if (resposta.status === 401 || resposta.status === 403) {
      logout();
      return;
    }

    const resultado = await resposta.json();
    showToast(resultado.message, resposta.ok ? "success" : "error");

    if (resposta.ok) {
      fecharAtualizar();
      listarUsuarios();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao atualizar o usuário.", "error");
  }
};

const Excluir = (uuid) => {
  uuidUsuarioSelecionado = uuid;
  document.getElementById("deleteUser").classList.replace("hidden", "flex");
};

const cancelarExcluir = () => {
  document.getElementById("deleteUser").classList.replace("flex", "hidden");
};

const confirmarExclusao = async () => {
  const token = sessionStorage.getItem("JWT_TOKEN");

  if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const resposta = await fetch("/usuarios/excluir/" + uuidUsuarioSelecionado, {
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
      cancelarExcluir();
      Pesquisar();
    }
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao excluir o usuário.", "error");
  }
};