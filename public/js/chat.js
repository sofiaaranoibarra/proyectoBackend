const socket = io();
let username = null;

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const disconnectBtn = document.getElementById("disconnectBtn");
const sendBtn = document.getElementById("sendBtn");
const sessionClosed = document.getElementById("sessionClosed");
const starButtons = document.querySelectorAll(".star-btn");
let isDisconnected = false;
let rating = 0;

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

const addSystemMessage = (text) => {
  const li = document.createElement("li");
  li.classList.add("chat-system");
  li.textContent = text;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
};

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
  socket.emit("chat:userConnected", username);
});

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
});

socket.on("chat:status", (data) => {
  addSystemMessage(data.message || "Usuario Desconectado ☹️");
});

disconnectBtn.addEventListener("click", () => {
  if (isDisconnected) return;

  isDisconnected = true;
  socket.disconnect();

  messageInput.disabled = true;
  messageInput.placeholder = "Sesion cerrada";
  sendBtn.disabled = true;
  disconnectBtn.disabled = true;
  sessionClosed.hidden = false;
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
