const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const chatToggle = document.getElementById('chatToggle');
const chatSidebar = document.getElementById('chatSidebar');
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');

chatToggle.addEventListener('click', () => {
    chatSidebar.style.display = chatSidebar.style.display === 'none' ? 'flex' : 'none';
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        // Here you'd handle the stream and peers for video calls.
    })
    .catch(err => {
        console.error('Error accessing media devices.', err);
    });

socket.on('message', (msg) => {
    const messageElement = document.createElement('div');
    const time = new Date().toLocaleTimeString();
    messageElement.innerHTML = `<strong>${msg.user}:</strong> ${msg.text} <span>${time}</span>`;
    messagesDiv.appendChild(messageElement);
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const msg = { user: "User", text: chatInput.value };
        socket.emit('message', msg);
        chatInput.value = '';

        // Echo message for demonstration purposes
        const messageElement = document.createElement('div');
        const time = new Date().toLocaleTimeString();
        messageElement.innerHTML = `<strong>${msg.user}:</strong> ${msg.text} <span>${time}</span>`;
        messagesDiv.appendChild(messageElement);
    }
});
