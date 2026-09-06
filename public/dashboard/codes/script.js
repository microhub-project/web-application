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
            <i onclick="copyCode('${elementId}')" tabindex="0" class="ph-bold ph-copy-simple text-2xl hover:text-blue-600 duration-150 transition-all"></i>
            <i onclick="refreshCode('${elementId}')" tabindex="0" class="ph-bold ph-arrows-clockwise text-2xl hover:text-green-600 duration-150 transition-all"></i>
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
