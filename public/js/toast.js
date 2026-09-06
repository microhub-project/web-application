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
    <div id="${toastId}" class="w-full bg-slate-800 flex p-4 gap-4 rounded border toast-${type} justify-center">
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