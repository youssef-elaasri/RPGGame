function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message) {
        displayMessage(message, 'You');
        input.value = ''; // Clear the input after sending

        const data = {
            message: message,
            sender: window.Player.id
        };
        socket.emit('sendMessage', data);
    }
}

function displayMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatMessages.appendChild(messageElement);

    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}