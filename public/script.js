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
      <div class="flex items-center justify-center w-full" onclick="faqHandler(${i})">
        <div class="flex flex-col items-center justify-center gap-3 w-full bg-slate-800 rounded-2xl px-6 py-4 max-w-3xl cursor-pointer border border-transparent hover:scale-103" id="item-${i}">
          <div class="flex justify-start items-center gap-4 w-full">
            <button class="flex justify-center cursor-pointer">
              <i id="carret-${i}" class="ph ph-caret-down text-4xl"></i>
            </button>
            <h1 class="text-xl">
              ${item.question}
            </h1>
          </div>
          <div id="answer-${i}" class="hidden w-full">
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