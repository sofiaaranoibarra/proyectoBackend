const socket = io();
let username = null;

const STORAGE_KEYS = {
  user: "chat:user",
  messages: "chat:messages",
  disconnected: "chat:disconnected"
};

const navEntry = performance.getEntriesByType("navigation")[0];
if (navEntry && navEntry.type === "reload") {
  sessionStorage.removeItem(STORAGE_KEYS.user);
  sessionStorage.removeItem(STORAGE_KEYS.messages);
  sessionStorage.removeItem(STORAGE_KEYS.disconnected);
}

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const disconnectBtn = document.getElementById("disconnectBtn");
const sendBtn = document.getElementById("sendBtn");
const sessionClosed = document.getElementById("sessionClosed");
const starButtons = document.querySelectorAll(".star-btn");

let isDisconnected = sessionStorage.getItem(STORAGE_KEYS.disconnected) === "true";
let rating = 0;
let chatHistory = [];

const getUserColor = (user) => {
  const palette = ["#e63946", "#1d3557", "#2a9d8f", "#f4a261", "#6a4c93", "#0081a7", "#43aa8b"];
  const safeUser = user || "Anonimo";
  let hash = 0;

  for (let i = 0; i < safeUser.length; i++) {
    hash = safeUser.charCodeAt(i) + ((hash << 5) - hash);
  }

  return palette[Math.abs(hash) % palette.length];
};

const escapeHtml = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const saveHistory = () => {
  sessionStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(chatHistory.slice(-200)));
};

const renderChatMessage = (data) => {
  const li = document.createElement("li");
  const user = data.user || "Anonimo";
  const message = data.message || "";
  const time =
    data.timestamp ||
    new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: true });
  const userColor = getUserColor(user);

  li.classList.add("chat-line");
  li.innerHTML = `<span class="chat-time">[${escapeHtml(time)}]</span> <strong class="chat-user" style="color:${userColor}">${escapeHtml(user)}</strong>: ${escapeHtml(message)}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
};

const addSystemMessage = (text) => {
  const li = document.createElement("li");
  li.classList.add("chat-system");
  li.textContent = text;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
};

const setDisconnectedState = () => {
  messageInput.disabled = true;
  messageInput.placeholder = "Sesion cerrada";
  sendBtn.disabled = true;
  disconnectBtn.disabled = true;
  sessionClosed.hidden = false;
};

if (isDisconnected) {
  setDisconnectedState();
}

const savedHistory = sessionStorage.getItem(STORAGE_KEYS.messages);
if (savedHistory) {
  chatHistory = JSON.parse(savedHistory);
  chatHistory.forEach((item) => {
    if (item.type === "system") {
      addSystemMessage(item.text);
      return;
    }

    renderChatMessage(item);
  });
}

const savedUser = sessionStorage.getItem(STORAGE_KEYS.user);
if (savedUser) {
  username = savedUser;
  if (!isDisconnected) {
    socket.emit("chat:userConnected", username);
  }
} else {
  Swal.fire({
    title: "Bienvenido",
    text: "Ingresa tu nombre de usuario para comenzar a chatear",
    input: "text",
    inputPlaceholder: "Ingrese aqui su nombre...",
    confirmButtonText: "Ingresar",
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) return "Debes ingresar tu nombre de usuario para continuar";
    }
  }).then((result) => {
    username = result.value;
    sessionStorage.setItem(STORAGE_KEYS.user, username);
    socket.emit("chat:userConnected", username);
  });
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isDisconnected) return;

  if (messageInput.value.trim()) {
    socket.emit("chat:message", {
      user: username,
      message: messageInput.value
    });
    messageInput.value = "";
  }
});

socket.on("chat:message", (data) => {
  renderChatMessage(data);
  chatHistory.push({ type: "chat", ...data });
  saveHistory();
});

socket.on("chat:status", (data) => {
  const text = data.message || "Usuario Desconectado ☹️";
  addSystemMessage(text);
  chatHistory.push({ type: "system", text });
  saveHistory();
});

disconnectBtn.addEventListener("click", () => {
  if (isDisconnected) return;

  isDisconnected = true;
  sessionStorage.setItem(STORAGE_KEYS.disconnected, "true");
  socket.disconnect();
  setDisconnectedState();
});

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rating = Number(button.dataset.value);
    starButtons.forEach((star) => {
      const starValue = Number(star.dataset.value);
      star.textContent = starValue <= rating ? "★" : "☆";
      star.classList.toggle("selected", starValue <= rating);
    });
  });
});
