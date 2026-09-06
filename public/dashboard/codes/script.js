const getCodes = async () => {
  const userId = sessionStorage.getItem("USER_ID")
  const companyId = sessionStorage.getItem("COMPANY_ID")

  if (!userId || !companyId) 
    return showToast("Sessão inválida, faça login novamente", "warning")

  const response = await fetch(`/code/getAll?userId=${userId}&companyId=${companyId}`)

  if (response.status === 204)
    return showToast("Não há nenhum código de ativação", "warning")

  const { message, data } = await response.json()
  
  if (response.status === 400)
    return showToast(message, "warning")
  
  if (response.status === 500)
    return showToast(message, "error")

  const codesContainer = document.getElementById("codesContainer")

  data.forEach(code => {
    const { atualizado_em, cargo, codigo, criado_em, deletado_em, expira_em, id, usado_em } = code

    console.log(atualizado_em, cargo, codigo, criado_em, deletado_em, expira_em, id, usado_em)
    const elementId = `${codigo}-${id}`

    const element = `
      <div id="${elementId}" class="bg-slate-100 p-6 rounded-lg flex flex-col gap-4 shadow">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 font-semibold">
            <i class="ph-bold ph-briefcase text-2xl"></i>
            <select id="roleSelect-${elementId}" class="text-lg" onchange="editRole('${elementId}')">
              <option value="0" ${cargo === 0 ? "selected" : ""}>Novo parceiro</option>
              <option value="1" ${cargo === 1 ? "selected" : ""}>Gerente TI</option>
              <option value="2" ${cargo === 2 ? "selected" : ""}>FinOps</option>
              <option value="3" ${cargo === 3 ? "selected" : ""}>DevOps</option>
            </select>
            <!-- select aqui. toda vez que renovar o codigo, deve-se enviar o email novamente e vice-versa -->
          </div>
          <h1 class="text-3xl font-bold tracking-widest text-slate-800">${codigo}</h1>
          <div class="flex *:cursor-pointer items-center gap-5">
            <i onclick="copyCode('${elementId}')" tabindex="0" class="ph-bold ph-copy-simple text-2xl hover:text-blue-600 duration-150 transition-all ${usado_em ? "pointer-events-none opacity-25" : ""}"></i>
            <i onclick="refreshCode('${elementId}')" tabindex="0" class="ph-bold ph-arrows-clockwise text-2xl hover:text-green-600 duration-150 transition-all ${usado_em ? "pointer-events-none opacity-25" : ""}"></i>
            <i onclick="disableCode('${elementId}')" tabindex="0" class="ph-bold ph-trash-simple text-2xl hover:text-red-600 duration-150 transition-all"></i>
          </div>
        </div>
        <div class="border border-slate-950/50"></div>
        <div>
          <span class="flex items-center gap-2 font-medium pt-1">
            <i class="ph ph-calendar-dot text-2xl"></i>
            <p>Criado há ${dateToTime(criado_em)} atrás</p>
          </span>
          ${ usado_em ? `
            <span class="flex items-center gap-2 font-medium pt-1 text-green-700">
              <i class="ph ph-calendar-check text-2xl"></i>
              <p>Usado há ${dateToTime(usado_em)} atrás</p>
            </span>
            ` : new Date(expira_em) > new Date() ? `
              <span class="flex items-center gap-2 font-medium pt-1 text-blue-700">
                <i class="ph ph-calendar-x text-2xl"></i>
                <p>Expirará em ${dateToTime(expira_em)}</p> 
              </span>
            ` : `
              <span class="flex items-center gap-2 font-medium pt-1 text-red-700">
                <i class="ph ph-calendar-x text-2xl"></i>
                <p>Expirou há ${dateToTime(expira_em)} atrás</p> 
              </span>
            `}
          ${ !atualizado_em ? "" : `
            <span class="flex items-center gap-2 font-medium pt-1">
              <i class="ph ph-calendar-plus text-2xl"></i>
              <p>Última atualização há ${dateToTime(atualizado_em)} atrás</p>
            </span>
          `}
        </div>
      </div>
    `

    codesContainer.innerHTML += element
  })
  
}

// parte da função abaixo foi reutilizada do meu projeto passado (CompostEco)
const dateToTime = (date) => {
  const incomingDate = new Date(date)
  const nowDate = new Date()

  const diferenceMs = Math.abs(nowDate.getTime() - incomingDate.getTime())

  const seconds = (diferenceMs / 1000).toFixed(0)
  const minutes = (diferenceMs / (1000 * 60)).toFixed(0)
  const hours = (diferenceMs / (1000 * 60 * 60)).toFixed(0)
  const days = (diferenceMs / (1000 * 60 * 60 * 24)).toFixed(0)

  if (seconds < 60) 
    return seconds + " segundo" + (seconds > 1 ? "s" : "")
  else if (minutes < 60) 
    return minutes + " minuto" + (minutes > 1 ? "s" : "")
  else if (hours < 24) 
    return hours + " hora" + (hours > 1 ? "s" : "")
  else 
    return days + " dia" + (days > 1 ? "s" : "")
}

const copyCode = (elementId) => {
  navigator.clipboard.writeText(elementId.substring(0, 6))
  showToast("Código copiado para sua área de transferência.", "success")
}

const refreshCode = (elementId) => {
  const popUpBody = `
    <div class="flex flex-col">
      <div class="flex flex-col gap-1.5">
        <label for="emailReceiver" class="text-slate-200">Email</label> 
        <input type="email" id="emailReceiver" placeholder="Digite o email a receber o código" class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
      </div>
      <button 
        onclick="resendCode('${elementId}')"
        id="resendCodeButton"
        class="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center">
        <i class="ph ph-paper-plane-tilt text-xl -ml-4"></i><span class="font-medium">Reenviar código</span>
      </button>
    </div>
  `

  showPopUp("Reenviar código", popUpBody)
}

const resendCode = async (elementId) => {
  const emailReceiverElement = document.getElementById("emailReceiver")
  const emailReceiver = emailReceiverElement.value.trim()

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
  if (!emailReceiver || !emailRegex.test(emailReceiver))
    return showToast("Email inválido", "warning")

  const codeId = elementId.split("-")[1]
  const body = { 
    id: codeId, 
    role: null, 
    email: emailReceiver, 
    isRenewal: true
  }

  const resendCodeButton = document.getElementById("resendCodeButton")
  try {
    toggleLoadingSendButton(resendCodeButton)
    const response = await fetch("/code/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    const responseJson = await response.json()
    console.log(responseJson)
  
    toggleLoadingSendButton(resendCodeButton)
    if (response.status === 500) 
      return showToast(responseJson.message, "error")
  
    if (response.status === 400) 
      return showToast(responseJson.message, "warning")
  
    if (response.status !== 200) 
      return showToast(responseJson.message, "error")

    emailReceiverElement.innerHTML = ""
    showToast(responseJson.message, "success")
    
    closePopUp()
  } catch (e) {
    console.error(e)
    return showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const disableCode = (elementId) => {
  const popUpBody = `
    <div class="flex justify-around gap-4">
    <button 
        onclick="closePopUp()"
        id="disableCodeConfirmedButton"
        class="w-full py-3 mt-2 outline outline-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center">
        <span class="font-medium">Cancelar</span>
      </button>
      <button 
        onclick="disableCodeConfirmed('${elementId}')"
        id="disableCodeConfirmedButton"
        class="w-full py-3 mt-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center">
        <span class="font-medium">Desativar código</span>
      </button>
    </div>
  `

  showPopUp("Desativar código", popUpBody)
}

const disableCodeConfirmed = async (elementId) => {
  const button = document.getElementById("disableCodeConfirmedButton")
  toggleDisableButton(button)

  const codeId = elementId.split("-")[1]
  const body = { 
    id: codeId
  }

  try {
    const response = await fetch("/code/disable", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    
    const responseJson = await response.json()
  
    toggleDisableButton(button)
    if (response.status !== 200) 
      return showToast(responseJson.message, "error")

    showToast(responseJson.message, "success")
    
    closePopUp()
  } catch (e) {
    console.error(e)
    return showToast("Algo deu errado. Tente novamente mais tarde", "error")
  }
}

const showPopUp = (title, popUpBody) => {
  const popUpContainer = document.getElementById("popUpContainer")
  const popUpContent = document.getElementById("popUpContent")

  popUpContainer.classList.replace("hidden", "flex")
  popUpContent.innerHTML = `
    <h1 class="text-2xl pb-4">${title}</h1>
    <button 
      type="button" 
      onclick="closePopUp()"
      class="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300"> 
      <i class="ph ph-x text-3xl"></i>
    </button>
  `

  popUpContent.innerHTML += popUpBody
}

const closePopUp = () => {
  document.getElementById("popUpContainer").classList.replace("flex", "hidden")
  document.getElementById("popUpContent").innerHTML = ""
}

const toggleLoadingSendButton = (button) => {
  if(!button) return

  if (button.disabled) {
    button.disabled = false
    button.innerHTML = `<i class="ph ph-paper-plane-tilt text-xl -ml-4"></i><span class="font-medium">Enviar código</span>`
  } else {
    button.disabled = true
    button.innerHTML = `<i class="ph ph-spinner text-xl -ml-4 animate-spin"></i><span class="font-medium">Enviando...</span>`
  }
}

const toggleDisableButton = (button) => {
  if(!button) return

  button.disabled = !button.disabled
}