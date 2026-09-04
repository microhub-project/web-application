const questionsAndAnswers = [
  {
    question: "O que é a plataforma?",
    answer: "É uma solução de monitoramento voltada para aplicações de e-commerce baseadas em microsserviços. Ela coleta, processa e apresenta métricas de CPU, memória e rede, permitindo acompanhar o comportamento dos serviços e identificar possíveis situações de sobrecarga."
  },
  {
    question: "Quais métricas podem ser monitoradas?",
    answer: "A plataforma monitora principalmente a utilização de CPU, memória e rede dos serviços. Essas métricas permitem acompanhar o consumo dos recursos computacionais e identificar alterações que possam indicar degradação de desempenho."
  },
  {
    question: "Como a plataforma identifica uma situação de sobrecarga?",
    answer: "O sistema utiliza parâmetros e limites previamente definidos para analisar as métricas coletadas. Quando os valores monitorados indicam uma condição crítica ou comportamento anormal, o serviço afetado é identificado e a situação pode ser apresentada como um alerta."
  },
  {
    question: "A plataforma monitora todos os microsserviços de uma aplicação?",
    answer: "A solução foi projetada para monitorar os serviços que forem configurados para participar do ambiente de monitoramento. Dessa forma, é possível acompanhar individualmente o comportamento dos diferentes componentes de uma aplicação baseada em microsserviços."
  },
  {
    question: "É possível acompanhar o histórico das métricas?",
    answer: "Sim. As métricas coletadas podem ser organizadas e apresentadas ao longo do tempo, permitindo analisar o comportamento dos recursos e comparar diferentes períodos de utilização."
  },
  {
    question: "A plataforma substitui ferramentas de observabilidade?",
    answer: "Não. A solução possui foco específico no monitoramento de recursos de infraestrutura, como CPU, memória e rede. Seu objetivo é fornecer uma visão centralizada desses indicadores e auxiliar na identificação de sobrecarga e degradação de desempenho."
  },
  {
    question: "Para quais situações a solução é mais indicada?",
    answer: "A solução é especialmente voltada para ambientes de e-commerce que utilizam microsserviços e enfrentam períodos de alta demanda, como Black Friday, Natal e outras campanhas promocionais. Nesses cenários, o monitoramento auxilia no acompanhamento da infraestrutura e na identificação de possíveis incidentes."
  }
]

const loadFaqItems = () => {
  const container = document.getElementById('faq')

  questionsAndAnswers.forEach(((item, i) => {
    container.innerHTML += `
      <div class="flex items-center justify-center w-full *:transition-all *:duration-300">
        <div class="flex flex-col items-center justify-center gap-3 w-full bg-slate-800 rounded-2xl px-6 py-4 max-w-3xl cursor-pointer border border-transparent hover:scale-103" id="item-${i}" onclick="faqHandler(${i})">
          <div class="flex justify-start items-center gap-4 w-full">
            <button class="flex justify-center cursor-pointer">
              <i id="carret-${i}" class="ph ph-caret-down text-4xl"></i>
            </button>
            <h1 class="text-xl max-sm:text-base">
              ${item.question}
            </h1>
          </div>
          <div id="answer-${i}" class="hidden w-full max-sm:text-sm">
            <p>
              <i class="ph ph-arrow-bend-down-right text-xl text-blue-400"></i>
              ${item.answer}
            </p>
          </div>
        </div>
      </div>
    `
  }))
}

const faqHandler = (index) => {
  for (let i = 0; i < questionsAndAnswers.length; i++) {
    const carretElement = document.getElementById(`carret-${i}`)
    const answerElement = document.getElementById(`answer-${i}`)
    const itemElement = document.getElementById(`item-${i}`)

    if (answerElement.classList.contains("flex") && index !== i) {
      answerElement.classList.add("hidden")
      answerElement.classList.remove("flex")

      carretElement.classList.add("ph-caret-down")
      carretElement.classList.remove("ph-caret-up")

      itemElement.classList.remove("scale-103", "border-blue-500!")
    }
  }

  const carretElement = document.getElementById(`carret-${index}`)
  const answerElement = document.getElementById(`answer-${index}`)
  const itemElement = document.getElementById(`item-${index}`)


  if (answerElement.classList.contains("hidden")) {
    answerElement.classList.remove("hidden")
    answerElement.classList.add("flex")

    carretElement.classList.remove("ph-caret-down")
    carretElement.classList.add("ph-caret-up")

    itemElement.classList.add("scale-103", "border-blue-500!")
  } else {
    answerElement.classList.add("hidden")
    answerElement.classList.remove("flex")

    carretElement.classList.add("ph-caret-down")
    carretElement.classList.remove("ph-caret-up")

    itemElement.classList.remove("scale-103", "border-blue-500!")
  }
}

const toggleMenu = () => {
  const menuElement = document.getElementById("header-mobile")

  if (menuElement.classList.contains("hidden")) {
    menuElement.classList.add("flex")
    menuElement.classList.remove("hidden")
  } else {
    menuElement.classList.remove("flex")
    menuElement.classList.add("hidden")
  }
}

const openRegistration = () => {
  const cadastro = document.getElementById("registerUser");

  cadastro.classList.remove("hidden");
  cadastro.classList.add("flex");
}

const closeRegistration = () => {
  const cadastro = document.getElementById("registerUser");

  cadastro.classList.remove("flex");
  cadastro.classList.add("hidden");
}

const openLogin = () => {
  const cadastro = document.getElementById("loginUser");

  cadastro.classList.remove("hidden");
  cadastro.classList.add("flex");
}

const closeLogin = () => {
  const cadastro = document.getElementById("loginUser");

  cadastro.classList.remove("flex");
  cadastro.classList.add("hidden");
}

const validateRegistration = async () => {

  const evento = window.event;
  if (evento) evento.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const email = document.querySelector("#email").value.trim();
  const senha = document.querySelector("#senha").value;
  const senha2 = document.querySelector("#senha2").value;
  const codigo = document.querySelector("#codigo").value.trim()
    .replaceAll("		", "")
    .replaceAll("	", "")
    .replaceAll("	", "")
    .replaceAll(" ", "")
    .toUpperCase();

  let validate = true;

  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

  let message = "a";
  let type = "error";

  if (nome === "" || !regexNome.test(nome) || nome.length < 3) {
    validate = false;
    message = "Formato do nome incorreto!";
  }else if (email === "" || !regexEmail.test(email)) {
    validate = false;
    message = "Formato do email incorreto!";
  }else if (senha === "" || senha.length < 8) {
    validate = false;
    message = "Formato da senha incorreta!";
  }else if (senha2 === "" || senha2 !== senha) {
    validate = false;
    message = "Senha divergete!";
  }else if (codigo === "") {  // falta verificar o codigo da empresa
    validate = false;
    message = "Código da empresa obrigatório!";
  }
  if(validate){
    message = "Sucesso!";
    type = "success"
    console.log( JSON.stringify({
        nome,
        email,
        senha,
        codigo
      }
      ))
    const cadastrar = await fetch("/usuarios/cadastrar", {
      method: "POST",
  
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": nome,
        "email": email,
        "password": senha,
        "code": codigo
      })
    })
    const response = await cadastrar.json()

    if (cadastrar.status == 400) 
      return showToast(response.message, "warning");

    else if (cadastrar.status != 201) 
      return showToast(response.message, "error");
    

    showToast(response.message, "success");
    closeRegistration()

    document.querySelector("#nome").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#senha").value = "";
    document.querySelector("#senha2").value = "";
    document.querySelector("#codigo").value = ""

    openLogin()
  }
  }
//=====================================================
  const validarLogin = async () =>{
    const email = document.querySelector("#emailLogin").value.trim();
    const senha = document.querySelector("#senhaLogin").value;


    if (!email) 
      return showToast("Preencha o campo email", "warning")
    
    if (!senha) 
      return showToast("Preencha o campo senha", "warning")
    
    try {
      const authResponse = await fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: senha
        })
      })

      const authResponseJson = await authResponse.json()
      console.log(authResponseJson, String(authResponse.status)[0]) 
      if (authResponse.status == 500)
        return showToast(authResponseJson.message, "error")

      if (String(authResponse.status)[0] == "4") 
        return showToast(authResponseJson.message, "warning");

      showToast(authResponseJson.message, "success")
      
      // sessionStorage.EMAIL_USUARIO = authResponseJson[0].email;
      // sessionStorage.NOME_USUARIO = authResponseJson[0].nome;
      // sessionStorage.ID_USUARIO = authResponseJson[0].id;

      setTimeout(() => { window.location = "./app/index.html" }, 2000)
    } catch (e) {
      console.error(e)
      showToast("Algo deu errado. Tente novamente mais tarde", "error")
    }
    
  }
  


//=====================================================



const contactForm = document.getElementById("contactForm");
const contactValidateAndSubmitForm = async () => {
  const fields = [
    document.getElementById("contactName"), 
    document.getElementById("contactEmail"), 
    document.getElementById("contactSubject"), 
    document.getElementById("contactMessage")
  ]

  fields.forEach(field => {
    if (field.classList.contains("border-amber-500!"))
      field.classList.remove("border-amber-500!")
  })

  const button = document.getElementById("contactSendButton")

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const subject = document.getElementById("contactSubject").value;
  const message = document.getElementById("contactMessage").value;

  const nameRegex = /^[A-Za-zÀ-ÿ\s]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(name)) {
    fields[0].classList.add("border-amber-500!")
    return showToast("Digite um nome válido", "warning")
  }
  
  if (!emailRegex.test(email)) {
    fields[1].classList.add("border-amber-500!")
    return showToast("Digite um e-mail válido", "warning")
  }
  
  if (subject.trim().length < 3) {
    fields[2].classList.add("border-amber-500!")
    return showToast("O assunto deve ter pelo menos 3 caracteres", "warning")
  }
  
  if (message.trim().length < 10) {
    fields[3].classList.add("border-amber-500!")
    return showToast("A mensagem deve ter pelo menos 10 caracteres", "warning")
  }

  try {
    toggleLoadingContactButton(button)

    const fetchResponse = await fetch("/mailer/send", {
      method: "POST",
  
      headers: {
        "Content-Type": "application/json"
      },
  
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    })

    const response = await fetchResponse.json()

    if (fetchResponse.status == 400) 
      return showToast(response.message, "warning");

    else if (fetchResponse.status != 200) 
      return showToast(response.message, "error");

    showToast(response.message, "success");

  } catch (e) {
    console.error(e)
    showToast("Algo deu errado. Tente novamente mais tarde.", "error");
  }

  fields.forEach(field => field.value = "")

  toggleLoadingContactButton(button)
}

const toggleLoadingContactButton = (button) => {
  if(!button) return

  if (button.disabled) {
    button.disabled = false
    button.innerHTML = `<i class="ph ph-paper-plane-tilt text-xl -ml-4"></i><span class="font-medium">Enviar</span>`
  } else {
    button.disabled = true
    button.innerHTML = `<i class="ph ph-spinner text-xl -ml-4 animate-spin"></i><span class="font-medium">Enviando...</span>`
  }
}

let counter = 0
const showToast = (message, type) => {
  const types = {
    "success": {
      "color": "green",
      "icon": "ph ph-check-fat"
    },
    "error": {
      "color": "red",
      "icon": "ph-bold ph-x"
    },
    "warning": {
      "color": "yellow",
      "icon": "ph ph-warning"
    }
  }

  if (!["success", "error", "warning"].includes(type)) 
    return alert(message)

  const toastContainer = document.getElementById("toast-container")
  
  const toastId = `toast-${counter}`
  toastContainer.innerHTML += `
    <div id="${toastId}" class="w-full bg-slate-800 flex p-4 gap-4 rounded border toast-${type}">
      <i class="${types[type].icon} self-center text-3xl"></i>
      <span>
        <p>${message}</p>
      </span>
    </div>
  `
  
  
  setTimeout(() => cleanToast(toastId), 5000)
  counter++
}

const cleanToast = (elementId) => {
  const toastElement = document.getElementById(elementId)
  toastElement.classList.add("hidden")
}