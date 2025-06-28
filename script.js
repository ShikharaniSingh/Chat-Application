"use strict";

const socket = io();
const inputEl = document.querySelector('.input-chat');
const btnEl = document.querySelector('.fa-paper-plane');
const cardbodyEl = document.querySelector('.card-body');

let username = prompt("Enter your name:") || "User";
let room = "general";

socket.emit("joinRoom", { username, room });

function appendMessage(message, sender) {
    const chatEl = document.createElement('div');
    chatEl.classList.add('chat', sender === username ? 'user' : 'chat-bot');

    chatEl.innerHTML = `
        <span class="user-icon">
            <i class="fa ${sender === username ? 'fa-user' : 'fa-robot'}"></i>
        </span>
        <p class="${sender === username ? '' : 'robot'}">
            <strong>${sender}</strong><br>${message.text}
            <br><small>${message.time}</small>
        </p>`;
    cardbodyEl.appendChild(chatEl);
    cardbodyEl.scrollTop = cardbodyEl.scrollHeight;
}

btnEl.addEventListener("click", () => {
    const msg = inputEl.value.trim();
    if (!msg) return;
    socket.emit("chatMessage", { username, room, message: msg });
    inputEl.value = "";
});

inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        btnEl.click();
    }
});

socket.on("message", (data) => {
    appendMessage(data, data.user);
});
