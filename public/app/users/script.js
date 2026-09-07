var idUsuarioSelecionado = null

const loadCompanyName = () => {
  const companyName = sessionStorage.getItem("COMPANY_NAME")
  const companyNameElement = document.getElementById("companyName")

  companyNameElement.innerText = `@ ${companyName}`
}

const listarUsuarios = async () => {
    console.log("ENTREI NO LISTAR")

    const resposta = await fetch("/usuarios/listar")
    console.log("STATUS:", resposta.status)

    const usuarios = await resposta.json()
    console.log("USUARIOS:", usuarios)

    mostrarUsuarios(usuarios)
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

    if (!usuarios || usuarios.length == 0) {
        lista.innerHTML += `
            <p class="text-center mt-5 text-slate-600">
                Usuário não encontrado.
            </p>
        `
        return
    }

    for (let i = 0; i < usuarios.length; i++) {
        let cargo = ""

       if (usuarios[i].cargo == 1) {
            cargo = "Gerente"
        } else if (usuarios[i].cargo == 2) {
            cargo = "FinOps"
        } else if (usuarios[i].cargo == 3) {
            cargo = "Dev/DevOps"
        } else {
          cargo = "Administrador"
        }

        lista.innerHTML += `
            <div class="grid grid-cols-12 items-center bg-slate-50 rounded-xl p-3 border-b border-slate-300">
                <p class="col-span-5 truncate">${usuarios[i].nome}</p>
                <p class="col-span-4 truncate">${cargo}</p>

                <div class="col-span-3 flex justify-end gap-2">

                    <button
                        onclick="Atualizar(${usuarios[i].id})"
                        class="px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-full cursor-pointer">
                        Atualizar
                    </button>

                    <button
                        onclick="Excluir(${usuarios[i].id})"
                        class="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full cursor-pointer">
                        Excluir
                    </button>

                </div>

            </div>
        `
    }
}


const Pesquisar = async () => {
    const nome = document.getElementById("input_pesquisa").value;
    if (nome == "") {
        listarUsuarios();
        return;
    }

    const resposta = await fetch("/usuarios/pesquisar/" + nome);
    const usuarios = await resposta.json();
    console.log("USUÁRIOS PESQUISADOS:", usuarios);
    mostrarUsuarios(usuarios);
}


if (document.getElementById("listarUsuarios")) {
    listarUsuarios()
}



const Atualizar = (id) => {
    idUsuarioSelecionado = id

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

    if (opcao == "nome") {
        document.getElementById("campoNome").classList.remove("hidden")
        botao.classList.remove("hidden")
    }

    if (opcao == "email") {
        document.getElementById("campoEmail").classList.remove("hidden")
        botao.classList.remove("hidden")
    }

    if (opcao == "cargo") {
        document.getElementById("campoCargo").classList.remove("hidden")
        botao.classList.remove("hidden")
    }
}




const salvarAtualizacao = async () => {
    const opcao = document.getElementById("opcaoAtualizar").value

    if (opcao == "") {
        return showToast("Selecione o que deseja atualizar.", "warning")
    }

    let dados = {}

    if (opcao == "nome") {
        const nome = document.getElementById("nomeAtualizar").value.trim()
        if (nome == "") {
            return showToast("Digite o novo nome.", "warning")
        }
        dados.nome = nome
    }

    if (opcao == "email") {
        const email = document.getElementById("emailAtualizar").value.trim()
        if (email == "") {
            return showToast("Digite o novo e-mail.", "warning")
        }
        dados.email = email
    }

    if (opcao == "cargo") {
        const cargo = document.getElementById("cargoAtualizar").value
        dados.cargo = cargo
    }

    const resposta = await fetch(
        "/usuarios/atualizar/" + idUsuarioSelecionado,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    )

    const resultado = await resposta.json()
      showToast(resultado.message, resposta.ok ? "success" : "error")

      if (resposta.ok) {
          fecharAtualizar()
          listarUsuarios()
      }
}



const Excluir = (id) => {
    idUsuarioSelecionado = id
    document.getElementById("deleteUser").classList.remove("hidden")
    document.getElementById("deleteUser").classList.add("flex")
}


const cancelarExcluir = () => {
    document.getElementById("deleteUser").classList.add("hidden")
    document.getElementById("deleteUser").classList.remove("flex")
}


const confirmarExclusao = async () => {
    const resposta = await fetch("/usuarios/excluir/" + idUsuarioSelecionado, {
        method: "DELETE"
    })

    const resultado = await resposta.json()
    alert(resultado.message)
    if (resposta.ok) {
        cancelarExcluir()
        Pesquisar()
    }
}