const logout = () => {
  sessionStorage.clear()

  window.location.href = "/"
}

const fillUserInfos = () => {
  const admNavItems = [document.getElementById("navItemUsers"), document.getElementById("navItemCodes")]
  const userRole = sessionStorage.getItem("ROLE")

  if (userRole == 1) {
    admNavItems.forEach(element => {
      element.classList.remove("hidden")
      element.classList.add("flex")
    })
  }

  const iconElement = document.getElementById("navUserIcon")
  const nameElement = document.getElementById("navUserName")

  const userName = sessionStorage.getItem("USER_NAME")
  const nameSplited = userName.toUpperCase().split(" ")
  const nameInitials = nameSplited.length >= 2 ? nameSplited[0][0] + nameSplited[1][0] : nameSplited[0][0] + nameSplited[0][1]

  iconElement.innerHTML = nameInitials
  nameElement.innerText = userName
}
