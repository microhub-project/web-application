const roleHash = {
  0: "Novo parceiro",
  1: "Gerente TI",
  2: "FinOps",
  3: "DevOps",
};

const fillRolesAtNewCode = () => {
  const newPartnerOpt = document.getElementById("newPartnerOpt");
  const userData = getUserSession();

  if (!userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  if (userData.cargo == 1 && userData.companyUUID === "61983115-a071-4cec-8bb7-d5e45e126c66") {
    newPartnerOpt.classList.remove("hidden");
  }
};

const getCodes = async () => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const userData = getUserSession();

  if (!token || !userData) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch('/code/getAll', {
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

    if (response.status === 204)
      return showToast("Não há nenhum código de ativação", "warning");

    const { message, data } = await response.json();

    if (response.status === 400)
      return showToast(message, "warning");

    if (response.status === 500)
      return showToast(message, "error");

    const codesContainer = document.getElementById("codesContainer");
    codesContainer.innerHTML = "";

    data.forEach(code => {
      const { atualizado_em, cargo, codigo, criado_em, deletado_em, expira_em, uuid, usado_em } = code;
      const elementId = `${codigo}-${uuid}`;

      const element = `
        <div id="${elementId}" class="bg-slate-100 p-4 sm:p-6 rounded-lg flex flex-col justify-between gap-3 sm:gap-4 shadow w-full">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div class="flex items-center gap-2 font-normal sm:font-semibold">
              <i class="ph-bold ph-briefcase text-xl sm:text-2xl"></i>
              <select id="roleSelect-${elementId}" class="text-sm sm:text-lg outline-none bg-transparent cursor-pointer max-w-[140px] sm:max-w-xs truncate" onchange="editRole('${elementId}')">
                <option value="0" ${cargo === 0 ? "selected" : ""} ${userData.cargo == 1 && userData.companyUUID === "61983115-a071-4cec-8bb7-d5e45e126c66" ? "" : "hidden disabled"}>Novo parceiro</option>
                <option value="1" ${cargo === 1 ? "selected" : ""}>Gerente TI</option>
                <option value="2" ${cargo === 2 ? "selected" : ""}>FinOps</option>
                <option value="3" ${cargo === 3 ? "selected" : ""}>DevOps</option>
              </select>
            </div>

            <div class="flex justify-between items-center sm:gap-6 w-full sm:w-auto">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-normal sm:font-bold tracking-widest text-slate-800">${codigo}</h1>
              <div class="flex *:cursor-pointer items-center gap-3 sm:gap-5">
                <i onclick="copyCode('${elementId}')" tabindex="0" class="ph-bold ph-copy-simple text-xl sm:text-2xl hover:text-blue-600 duration-150 transition-all ${usado_em ? "pointer-events-none opacity-25" : ""}"></i>
                <i onclick="refreshCode('${elementId}')" tabindex="0" class="ph-bold ph-arrows-clockwise text-xl sm:text-2xl hover:text-green-600 duration-150 transition-all ${usado_em ? "pointer-events-none opacity-25" : ""}"></i>
                <i onclick="disableCode('${elementId}')" tabindex="0" class="ph-bold ph-trash-simple text-xl sm:text-2xl hover:text-red-600 duration-150 transition-all"></i>
              </div>
            </div>
          </div>

          <div class="border-b border-slate-950/20"></div>

          <div class="text-xs sm:text-sm lg:text-base">
            <span class="flex items-center gap-2 font-normal sm:font-medium pt-1">
              <i class="ph ph-calendar-dot text-lg sm:text-2xl"></i>
              <p>Criado há ${dateToTime(criado_em)} atrás</p>
            </span>
            ${usado_em ? `
              <span class="flex items-center gap-2 font-normal sm:font-medium pt-1 text-green-700">
                <i class="ph ph-calendar-check text-lg sm:text-2xl"></i>
                <p>Usado há ${dateToTime(usado_em)} atrás</p>
              </span>
              ` : new Date(expira_em) > new Date() ? `
                <span class="flex items-center gap-2 font-normal sm:font-medium pt-1 text-blue-700">
                  <i class="ph ph-calendar-x text-lg sm:text-2xl"></i>
                  <p>Expirará em ${dateToTime(expira_em)}</p> 
                </span>
              ` : `
                <span class="flex items-center gap-2 font-normal sm:font-medium pt-1 text-red-700">
                  <i class="ph ph-calendar-x text-lg sm:text-2xl"></i>
                  <p>Expirou há ${dateToTime(expira_em)} atrás</p> 
                </span>
              `}
            ${!atualizado_em ? "" : `
              <span class="flex items-center gap-2 font-normal sm:font-medium pt-1">
                <i class="ph ph-calendar-plus text-lg sm:text-2xl"></i>
                <p>Última atualização há ${dateToTime(atualizado_em)} atrás</p>
              </span>
            `}
          </div>
        </div>
      `;

      codesContainer.innerHTML += element;
    });
  } catch (e) {
    console.error(e);
    showToast("Algo deu errado ao carregar os códigos.", "error");
  }
};

const dateToTime = (date) => {
  const incomingDate = new Date(date);
  const nowDate = new Date();

  const diferenceMs = Math.abs(nowDate.getTime() - incomingDate.getTime());

  const seconds = (diferenceMs / 1000).toFixed(0);
  const minutes = (diferenceMs / (1000 * 60)).toFixed(0);
  const hours = (diferenceMs / (1000 * 60 * 60)).toFixed(0);
  const days = (diferenceMs / (1000 * 60 * 60 * 24)).toFixed(0);

  if (seconds < 60)
    return seconds + " segundo" + (seconds > 1 ? "s" : "");
  else if (minutes < 60)
    return minutes + " minuto" + (minutes > 1 ? "s" : "");
  else if (hours < 24)
    return hours + " hora" + (hours > 1 ? "s" : "");
  else
    return days + " dia" + (days > 1 ? "s" : "");
};

const copyCode = (elementId) => {
  navigator.clipboard.writeText(elementId.substring(0, 6));
  showToast("Código copiado para sua área de transferência.", "success");
};

const refreshCode = (elementId) => {
  const popUpBody = `
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1.5">
        <label for="emailReceiver" class="text-xs sm:text-sm text-slate-200">Email</label> 
        <input type="email" id="emailReceiver" placeholder="Digite o email a receber o código" class="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 transition-colors">
      </div>
      <button 
        onclick="resendCode('${elementId}')"
        id="resendCodeButton"
        class="w-full py-2.5 sm:py-3 mt-1 bg-blue-600 hover:bg-blue-700 rounded-full font-normal sm:font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center text-sm sm:text-base">
        <i class="ph ph-paper-plane-tilt text-xl"></i><span class="font-normal sm:font-medium">Reenviar código</span>
      </button>
    </div>
  `;

  showPopUp("Reenviar código", popUpBody);
};

const resendCode = async (elementId) => {
  const emailReceiverElement = document.getElementById("emailReceiver");
  const emailReceiver = emailReceiverElement.value.trim();

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  if (!emailReceiver || !emailRegex.test(emailReceiver))
    return showToast("Email inválido", "warning");

  const codeId = elementId.substring(elementId.indexOf("-") + 1);
  const body = {
    uuid: codeId,
    role: null,
    email: emailReceiver,
    isRenewal: true
  };

  const resendCodeButton = document.getElementById("resendCodeButton");
  const token = sessionStorage.getItem('JWT_TOKEN');

  if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    toggleLoadingSendButton(resendCodeButton);
    const response = await fetch("/code/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const responseJson = await response.json();

    toggleLoadingSendButton(resendCodeButton);
    if (response.status === 500)
      return showToast(responseJson.message, "error");

    if (response.status === 400)
      return showToast(responseJson.message, "warning");

    if (response.status !== 200)
      return showToast(responseJson.message, "error");

    emailReceiverElement.value = "";
    
    closePopUp();
    reloadPage();
    showToast(responseJson.message, "success");
  } catch (e) {
    console.error(e);
    return showToast("Algo deu errado. Tente novamente mais tarde", "error");
  }
};

const disableCode = (elementId) => {
  const popUpBody = `
    <div class="flex flex-col sm:flex-row justify-around gap-2 sm:gap-4 mt-2">
      <button 
        onclick="closePopUp()"
        class="w-full py-2.5 sm:py-3 border border-slate-600 hover:bg-slate-800 text-slate-200 rounded-xl font-medium transition-colors cursor-pointer text-center">
        <span class="font-normal sm:font-medium">Cancelar</span>
      </button>
      <button 
        onclick="disableCodeConfirmed('${elementId}')"
        id="disableCodeConfirmedButton"
        class="w-full py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors cursor-pointer text-center">
        <span class="font-normal sm:font-medium">Desativar código</span>
      </button>
    </div>
  `;

  showPopUp(`Desativar código: <span class="font-normal sm:font-bold">${elementId.split("-")[0]}</span>`, popUpBody);
};

const disableCodeConfirmed = async (elementId) => {
  const button = document.getElementById("disableCodeConfirmedButton");
  toggleDisableButton(button);

  const codeId = elementId.substring(elementId.indexOf("-") + 1);
  const body = {
    uuid: codeId
  };

  const token = sessionStorage.getItem('JWT_TOKEN');

  if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch("/code/disable", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const responseJson = await response.json();

    toggleDisableButton(button);
    if (response.status !== 200)
      return showToast(responseJson.message, "error");

    closePopUp();
    reloadPage();
    showToast(responseJson.message, "success");
  } catch (e) {
    console.error(e);
    return showToast("Algo deu errado. Tente novamente mais tarde", "error");
  }
};

const editRole = (elementId) => {
  const popUpBody = `
    <div class="flex flex-col sm:flex-row justify-around gap-2 sm:gap-4 mt-2">
      <button 
        onclick="closePopUp()"
        class="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-normal sm:font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center text-sm sm:text-base">
        <span class="font-normal sm:font-medium">Cancelar</span>
      </button>
      <button 
        onclick="editRoleConfirmed('${elementId}')"
        id="editRoleConfirmedButton"
        class="w-full py-2.5 sm:py-3 border border-blue-600 hover:bg-blue-700 text-blue-400 hover:text-white rounded-full font-normal sm:font-medium transition-colors cursor-pointer flex gap-2 items-center justify-center text-sm sm:text-base">
        <span class="font-normal sm:font-medium">Alterar cargo</span>
      </button>
    </div>
  `;

  const roleSelected = document.getElementById(`roleSelect-${elementId}`).value;
  showPopUp(`Alterar cargo: <span class="font-normal sm:font-bold">${roleHash[roleSelected]}</span>`, popUpBody);
};

const editRoleConfirmed = async (elementId) => {
  const button = document.getElementById("editRoleConfirmedButton");
  const roleSelected = document.getElementById(`roleSelect-${elementId}`).value;
  toggleDisableButton(button);

  const codeId = elementId.substring(elementId.indexOf("-") + 1);
  const body = {
    "uuid": codeId,
    "role": roleSelected,
    "email": null,
    "isRenewal": false
  };

  const token = sessionStorage.getItem('JWT_TOKEN');

  if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch("/code/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const responseJson = await response.json();

    toggleDisableButton(button);
    if (response.status === 500)
      return showToast(responseJson.message, "error");

    if (response.status === 400)
      return showToast(responseJson.message, "warning");

    if (response.status !== 200)
      return showToast(responseJson.message, "error");

    closePopUp();
    reloadPage();
    showToast(responseJson.message, "success");
  } catch (e) {
    console.error(e);
    return showToast("Algo deu errado. Tente novamente mais tarde", "error");
  }
};

const sendCode = () => {
  const newRoleSelect = document.getElementById("newRoleSelect").value;
  const newEmailReceiver = document.getElementById("newEmailReceiver").value.trim();

  if (!newRoleSelect)
    return showToast("Selecione um cargo", "warning");

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  if (!newEmailReceiver || !emailRegex.test(newEmailReceiver))
    return showToast("Digite um email válido", "warning");

  const popUpBody = `
    <div class="flex flex-col justify-around gap-4">
      <div class="text-sm sm:text-base">
        <span class="flex gap-2"><p class="font-normal sm:font-semibold">Cargo:</p> ${roleHash[newRoleSelect]}</span>
        <span class="flex gap-2"><p class="font-normal sm:font-semibold">Email:</p> ${newEmailReceiver}</span>
      </div>
      <div class="flex flex-col gap-2">
      <button
      onclick="sendCodeConfirmed()"
      id="sendCodeConfirmedButton"
      class="w-full py-2.5 sm:py-3 border-2 border-blue-600 hover:bg-blue-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
      <span font-medium">Confirmar</span>
      </button>
      <button
        onclick="closePopUp()"
        class="w-full py-2.5 sm:py-3 border-2 border-red-600 hover:bg-red-600 rounded-lg font-medium text-sm sm:text-base transition-colors cursor-pointer flex gap-2 items-center justify-center">
        <span class="font-medium">Cancelar</span>
      </button>
      </div>
    </div>
  `;

  showPopUp("Confirme as informações:", popUpBody);
};

const sendCodeConfirmed = async () => {
  closePopUp();
  const button = document.getElementById("sendCodeConfirmedButton");
  const roleSelected = document.getElementById(`newRoleSelect`).value;
  const newEmailReceiver = document.getElementById("newEmailReceiver").value.trim();
  const userData = getUserSession();

  toggleDisableButton(button);

  const body = {
    "companyUUID": userData.companyUUID,
    "role": roleSelected,
    "email": newEmailReceiver
  };

  const token = sessionStorage.getItem('JWT_TOKEN');

  if (!token) {
    logout();
    return showToast("Sessão inválida, faça login novamente", "warning");
  }

  try {
    const response = await fetch("/code/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      return;
    }

    const responseJson = await response.json();

    if (response.status === 500) {
      toggleDisableButton(button);
      return showToast(responseJson.message, "error");
    }

    if (response.status === 400) {
      toggleDisableButton(button);
      return showToast(responseJson.message, "warning");
    }

    if (response.status !== 200) {
      toggleDisableButton(button);
      return showToast(responseJson.message, "error");
    }

    reloadPage();
    showToast(responseJson.message, "success");
  } catch (e) {
    console.error(e);
    return showToast("Algo deu errado. Tente novamente mais tarde", "error");
  }
};

const showPopUp = (title, popUpBody) => {
  const popUpContainer = document.getElementById("popUpContainer");
  const popUpContent = document.getElementById("popUpContent");

  popUpContainer.classList.replace("hidden", "flex");
  popUpContent.innerHTML = `
    <h1 class="text-lg sm:text-2xl pb-4 pr-8 break-words">${title}</h1>
  `;

  popUpContent.innerHTML += popUpBody;
};

const closePopUp = () => {
  document.getElementById("popUpContainer").classList.replace("flex", "hidden");
  document.getElementById("popUpContent").innerHTML = "";
};

const reloadPage = () => {
    setTimeout(() => window.location.reload(), 2500)
}

const toggleLoadingSendButton = (button) => {
  if (!button) return;

  if (button.disabled) {
    button.disabled = false;
    button.innerHTML = `<i class="ph ph-paper-plane-tilt text-xl"></i><span class="font-normal sm:font-medium">Enviar código</span>`;
  } else {
    button.disabled = true;
    button.innerHTML = `<i class="ph ph-spinner text-xl animate-spin"></i><span class="font-normal sm:font-medium">Enviando...</span>`;
  }
};

const toggleDisableButton = (button) => {
  if (!button) return;

  button.disabled = !button.disabled;
};