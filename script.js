const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const chatToggle = document.getElementById('chatToggle');
const chatSidebar = document.getElementById('chatSidebar');
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');

let localStream;
let peers = {};

chatToggle.addEventListener('click', () => {
    chatSidebar.style.display = chatSidebar.style.display === 'none' ? 'flex' : 'none';
});

// Request access to the user's webcam and microphone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
        socket.emit('join'); // Emit a join event when the user joins
    })
    .catch(err => {
        console.error('Error accessing media devices.', err);
    });

socket.on('message', (msg) => {
    const messageElement = document.createElement('div');
    const time = new Date().toLocaleTimeString();
    messageElement.innerHTML = `<strong>User:</strong> ${msg.text} <span>${time}</span>`;
    messagesDiv.appendChild(messageElement);
});

// Send chat message on 'Enter' key press
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value) {
        const msg = { text: chatInput.value };
        socket.emit('message', msg);
        chatInput.value = '';
        const messageElement = document.createElement('div');
        const time = new Date().toLocaleTimeString();
        messageElement.innerHTML = `<strong>You:</strong> ${msg.text} <span>${time}</span>`;
        messagesDiv.appendChild(messageElement);
    }
});
