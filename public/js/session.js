import { getUserSession } from "./utils.js";

export const logout = () => {
  sessionStorage.clear()
  window.location.href = "/"
}

const navItems = [
  document.getElementById("navItemGeneral"),
  document.getElementById("navItemAlerts"),
  document.getElementById("navItemFinances"),
  document.getElementById("navItemMicroservices"),
  document.getElementById("navItemInstances"),
  document.getElementById("navItemUsers"),
  document.getElementById("navItemCodes")
]

const pages = [
  "/app/index.html",
  "/app/alerts/index.html",
  "/app/finances/index.html",
  "/app/microservices/index.html",
  "/app/instances/index.html",
  "/app/users/index.html",
  "/app/codes/index.html"
]

const roleAccess = [
  [0, 1, 2, 3],
  [0, 1, 3],
  [0, 1, 2],
  [0, 1, 3],
  [0, 1, 2, 3],
  [0, 1],
  [0, 1]
]

function renderNavBar(role) {
  for (let i = 0; i < roleAccess.length; i++) {
    if (roleAccess[i].includes(Number(role))) {
      navItems[i].classList.remove("hidden")
      navItems[i].classList.add("flex")
    } else {
      navItems[i].classList.add("hidden")
      navItems[i].classList.remove("flex")
    }
  }
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

  renderNavBar(userData.cargo)

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

  const pageIndex = pages.indexOf(window.location.pathname)

  if (!roleAccess[pageIndex].includes(Number(userData.cargo)) && window.location.pathname !== "/app/index.html") {
      window.location.href = "/app/index.html"
    }
}

window.logout = logout;
window.fillUserInfos = fillUserInfos;
window.verifyIfUserCanAccess = verifyIfUserCanAccess;