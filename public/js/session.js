import { getUserSession } from "./utils.js";

export const logout = () => {
  sessionStorage.clear()
  window.location.href = "/"
}

const capitalizeName = (str) => {
  if (!str) return ""
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const fillUserInfos = () => {
  const userData = getUserSession()

  if (!userData) {
    return logout()
  }

  const admNavItems = [document.getElementById("navItemUsers"), document.getElementById("navItemCodes")]
  if (userData.cargo == 1) {
    admNavItems.forEach(element => {
      if (element) {
        element.classList.remove("hidden")
        element.classList.add("flex")
      }
    })
  }

  const iconElement = document.getElementById("navUserIcon")
  const nameElement = document.getElementById("navUserName")

  const formattedName = capitalizeName(userData.name || userData.email || "Usuário")

  const nameSplited = formattedName.toUpperCase().split(" ")
  const nameInitials = nameSplited.length >= 2 
    ? nameSplited[0][0] + nameSplited[1][0] 
    : nameSplited[0].slice(0, 2)

  if (iconElement) iconElement.innerHTML = nameInitials
  if (nameElement) nameElement.innerText = formattedName
}

export const verifyIfUserCanAccess = () => {
  const userData = getUserSession()

  if (!userData) {
    return logout()
  }

  if (userData.cargo != 1) {
    window.location.href = "/app"
  }
}

window.logout = logout;
window.fillUserInfos = fillUserInfos;
window.verifyIfUserCanAccess = verifyIfUserCanAccess;