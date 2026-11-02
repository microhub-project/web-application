import { getUserSession } from "./utils.js";

export const logout = () => {
  sessionStorage.clear();
  window.location.href = "/";
};

const navItems = [
  {
    desktop: document.getElementById("navItemGeneral"),
    mobile: document.getElementById("navItemGeneralMobile")
  },
  {
    desktop: document.getElementById("navItemReports"),
    mobile: document.getElementById("navItemReportsMobile")
  },
  {
    desktop: document.getElementById("navItemAlerts"),
    mobile: document.getElementById("navItemAlertsMobile")
  },
  {
    desktop: document.getElementById("navItemFinances"),
    mobile: document.getElementById("navItemFinancesMobile")
  },
  {
    desktop: document.getElementById("navItemMicroservices"),
    mobile: document.getElementById("navItemMicroservicesMobile")
  },
  {
    desktop: document.getElementById("navItemInstances"),
    mobile: document.getElementById("navItemInstancesMobile")
  },
  {
    desktop: document.getElementById("navItemUsers"),
    mobile: document.getElementById("navItemUsersMobile")
  },
  {
    desktop: document.getElementById("navItemCodes"),
    mobile: document.getElementById("navItemCodesMobile")
  },
  {
    desktop: document.getElementById("navItemTrash"),
    mobile: document.getElementById("navItemTrashMobile")
  }
];

const pages = [
  "/app/index.html",
  "/app/reports/index.html",
  "/app/alerts/index.html",
  "/app/finances/index.html", // página de financas
  "/app/microservices/index.html",
  "/app/instances/index.html",
  "/app/users/index.html",
  "/app/codes/index.html",
  "/app/trash/index.html"
];

const roleAccess = [
  [0, 1, 2, 3],
  [0, 1],
  [0, 1, 3],  
  [0, 1, 2], // página de financas
  [0, 1, 3],
  [0, 1, 2, 3],
  [0, 1],
  [0, 1],
  [0, 1]
];

function toggleElementVisibility(element, show) {
  if (!element) return;
  if (show) {
    element.classList.remove("hidden");
    element.classList.add("flex");
  } else {
    element.classList.add("hidden");
    element.classList.remove("flex");
  }
}

function renderNavBar(role) {
  const numericRole = Number(role);

  for (let i = 0; i < roleAccess.length; i++) {
    const canAccess = roleAccess[i].includes(numericRole);
    toggleElementVisibility(navItems[i].desktop, canAccess);
    toggleElementVisibility(navItems[i].mobile, canAccess);
  }
}

const capitalizeName = (str) => {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const fillUserInfos = () => {
  const userData = getUserSession();

  if (!userData) {
    return logout();
  }

  renderNavBar(userData.cargo);

  const iconElements = [
    document.getElementById("navUserIcon"),
    document.getElementById("navUserIconMobile")
  ];
  const nameElement = document.getElementById("navUserName");

  const formattedName = capitalizeName(userData.name || userData.email || "Usuário");

  const nameSplited = formattedName.toUpperCase().split(" ");
  const nameInitials = nameSplited.length >= 2
    ? nameSplited[0][0] + nameSplited[1][0]
    : nameSplited[0].slice(0, 2);

  iconElements.forEach(icon => {
    if (icon) icon.innerHTML = nameInitials;
  });

  if (nameElement) nameElement.innerText = formattedName;
};

export const verifyIfUserCanAccess = () => {
  const userData = getUserSession();

  if (!userData) {
    return logout();
  }

  const pageIndex = pages.indexOf(window.location.pathname);

  if (pageIndex !== -1 && !roleAccess[pageIndex].includes(Number(userData.cargo)) && window.location.pathname !== "/app/index.html") {
    window.location.href = "/app/index.html";
  }
};

window.logout = logout;
window.fillUserInfos = fillUserInfos;
window.verifyIfUserCanAccess = verifyIfUserCanAccess;