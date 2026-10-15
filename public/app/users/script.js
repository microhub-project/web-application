let uuidUsuarioSelecionado = null

const loadCompanyName = () => {
  const userData = getUserSession()
  const companyNameElement = document.getElementById("companyName")

  if (!userData) {
    logout()
    return showToast("Sessão inválida, faça login novamente", "warning")
  }

  if (userData && companyNameElement) {
    companyNameElement.innerText = `@ ${userData.companyName}`
  }
}

const listarUsuarios = async () => {
  const token = sessionStorage.getItem("JWT_TOKEN")
  const userData = getUserSession()

  if (!token || !userData) {
    logout()
    return showToast("Sessão inválida, faça login novamente", "warning")
  }

  try {
    const resposta = await fetch(`/usuarios/listar/${userData.companyUUID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (resposta.status === 401 || resposta.status === 403) {
      logout()
      return
    }

    if (resposta.status !== 200) {
      return showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }

    const usuarios = await resposta.json()
    mostrarUsuarios(usuarios)
  } catch (e) {
    console.error(e)
    showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const mostrarUsuarios = (usuarios) => {
  const lista = document.getElementById("listarUsuarios")

  lista.innerHTML = `
    <div class="grid grid-cols-12 px-5 font-bold text-slate-700">
      <span class="col-span-5">Nome</span>
      <span class="col-span-4">Cargo</span>
      <span class="col-span-3 text-right">Ações</span>
    </div>
  `

  if (!usuarios || usuarios.length === 0) {
    lista.innerHTML += `
      <p class="text-center mt-5 text-slate-600">
        Usuário não encontrado.
      </p>
    `
    return
  }

  for (let i = 0; i < usuarios.length; i++) {
    let cargo = ""

    if (usuarios[i].cargo == 0) {
      cargo = "Novo parceiro"
    } else if (usuarios[i].cargo == 1) {
      cargo = "Gerente TI"
    } else if (usuarios[i].cargo == 2) {
      cargo = "FinOps"
    } else if (usuarios[i].cargo == 3) {
      cargo = "DevOps"
    } else {
      cargo = "Administrador"
    }

    lista.innerHTML += `
      <div class="grid grid-cols-12 items-center bg-slate-50 rounded-xl p-3 border-b border-slate-300">
        <p class="col-span-5 truncate">${usuarios[i].nome}</p>
        <p class="col-span-4 truncate">${cargo}</p>

        <div class="col-span-3 flex justify-end gap-2">
          <button
            onclick="Atualizar('${usuarios[i].uuid}')"
            class="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-full cursor-pointer">
            Atualizar
          </button>

          <button
            onclick="Excluir('${usuarios[i].uuid}')"
            class="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full cursor-pointer">
            Excluir
          </button>
        </div>
      </div>
    `
  }
}

const Pesquisar = async () => {
  const nome = document.getElementById("input_pesquisa").value.trim()
  const userData = getUserSession()

  if (nome === "") {
    listarUsuarios()
    return
  }

  const token = sessionStorage.getItem("JWT_TOKEN")

  if (!token || !userData) {
    logout()
    return showToast("Sessão inválida, faça login novamente", "warning")
  }

  try {
    const nomeEncoded = encodeURIComponent(nome)
    
    const url = `/usuarios/pesquisar?nome=${nomeEncoded}&companyUUID=${userData.companyUUID}`

    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (resposta.status === 401 || resposta.status === 403) {
      logout()
      return
    }

    const usuarios = await resposta.json()
    mostrarUsuarios(usuarios)
  } catch (e) {
    console.error(e)
    showToast("Algo deu errado ao pesquisar usuários.", "error")
  }
}

if (document.getElementById("listarUsuarios")) {
  listarUsuarios()
}

const Atualizar = (uuid) => {
  uuidUsuarioSelecionado = uuid

  document.getElementById("opcaoAtualizar").value = ""

  document.getElementById("campoNome").classList.add("hidden")
  document.getElementById("campoEmail").classList.add("hidden")
  document.getElementById("campoCargo").classList.add("hidden")

  document.getElementById("btnConfirmarAtualizacao").classList.add("hidden")

  document.getElementById("updateUser").classList.remove("hidden")
  document.getElementById("updateUser").classList.add("flex")
}

function fecharAtualizar() {
  document.getElementById("updateUser").classList.add("hidden")
  document.getElementById("updateUser").classList.remove("flex")
}

function mostrarCampoAtualizar() {
  document.getElementById("campoNome").classList.add("hidden")
  document.getElementById("campoEmail").classList.add("hidden")
  document.getElementById("campoCargo").classList.add("hidden")

  const botao = document.getElementById("btnConfirmarAtualizacao")
  const opcao = document.getElementById("opcaoAtualizar").value

  botao.classList.add("hidden")

  if (opcao === "nome") {
    document.getElementById("campoNome").classList.remove("hidden")
    botao.classList.remove("hidden")
  }

  if (opcao === "email") {
    document.getElementById("campoEmail").classList.remove("hidden")
    botao.classList.remove("hidden")
  }

  if (opcao === "cargo") {
    document.getElementById("campoCargo").classList.remove("hidden")
    botao.classList.remove("hidden")
  }
}

const salvarAtualizacao = async () => {
  const opcao = document.getElementById("opcaoAtualizar").value

  if (opcao === "") {
    return showToast("Selecione o que deseja atualizar.", "warning")
  }

  let dados = {}

  if (opcao === "nome") {
    const nome = document.getElementById("nomeAtualizar").value.trim()
    if (nome === "") {
      return showToast("Digite o novo nome.", "warning")
    }
    dados.nome = nome
  }

  if (opcao === "email") {
    const email = document.getElementById("emailAtualizar").value.trim()
    if (email === "") {
      return showToast("Digite o novo e-mail.", "warning")
    }
    dados.email = email
  }

  if (opcao === "cargo") {
    const cargo = document.getElementById("cargoAtualizar").value
    dados.cargo = cargo
  }

  const token = sessionStorage.getItem("JWT_TOKEN")

  if (!token) {
    logout()
    return showToast("Sessão inválida, faça login novamente", "warning")
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
    )

    if (resposta.status === 401 || resposta.status === 403) {
      logout()
      return
    }

    const resultado = await resposta.json()
    showToast(resultado.message, resposta.ok ? "success" : "error")

    if (resposta.ok) {
      fecharAtualizar()
      listarUsuarios()
    }
  } catch (e) {
    console.error(e)
    showToast("Algo deu errado ao atualizar o usuário.", "error")
  }
}

const Excluir = (uuid) => {
  uuidUsuarioSelecionado = uuid
  document.getElementById("deleteUser").classList.remove("hidden")
  document.getElementById("deleteUser").classList.add("flex")
}

const cancelarExcluir = () => {
  document.getElementById("deleteUser").classList.add("hidden")
  document.getElementById("deleteUser").classList.remove("flex")
}

const confirmarExclusao = async () => {
  const token = sessionStorage.getItem("JWT_TOKEN")

  if (!token) {
    logout()
    return showToast("Sessão inválida, faça login novamente", "warning")
  }

  try {
    const resposta = await fetch("/usuarios/excluir/" + uuidUsuarioSelecionado, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (resposta.status === 401 || resposta.status === 403) {
      logout()
      return
    }

    const resultado = await resposta.json()

    if (resposta.status === 400) 
      return showToast(resultado.message, "warning")

    if (resposta.status === 500) 
      return showToast(resultado.message, "error")
    
    showToast(resultado.message, "success")

    if (resposta.ok) {
      cancelarExcluir()
      Pesquisar()
    }
  } catch (e) {
    console.error(e)
    showToast("Algo deu errado ao excluir o usuário.", "error")
  }
}