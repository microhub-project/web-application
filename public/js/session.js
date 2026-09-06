const logout = () => {
  sessionStorage.clear()

  window.location.href = "/"
}

const fillUserInfos = () => {
  const iconElement = document.getElementById("navUserIcon")
  const nameElement = document.getElementById("navUserName")

  const userName = sessionStorage.getItem("USER_NAME")
  const nameSplited = userName.toUpperCase().split(" ")
  const nameInitials = nameSplited.length >= 2 ? nameSplited[0][0] + nameSplited[1][0] : nameSplited[0][0] + nameSplited[0][1]

  iconElement.innerHTML = nameInitials
  nameElement.innerText = userName
}
