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

    // Also show a message bubble
    // showMessageMainPlayer(message);
}

function showMessageMainPlayer(message) {
    const bubble = document.createElement('div');
    bubble.textContent = message;
    bubble.style.position = 'fixed'; // Use fixed positioning for main player
    bubble.style.bottom = '450px'; // Fixed distance from the bottom of the screen
    bubble.style.left = '54%'; // Centered horizontally
    bubble.style.transform = 'translateX(-50%)';

    styleMessageBubble(bubble);

    document.body.appendChild(bubble);

    // Remove the bubble after 2 seconds
    setTimeout(() => {
        document.body.removeChild(bubble);
    }, 2000);
}

// function showMessageOtherPlayer(message, playerX, playerY) {
//     const bubble = document.createElement('div');
//     bubble.textContent = message;
//
//     // Calculate position relative to the center
//     const offsetX = (playerX - window.Player.x) + window.innerWidth / 2;
//     const offsetY = (playerY - window.Player.y) + window.innerHeight / 2;
//
//     bubble.style.position = 'absolute';
//     bubble.style.left = `${offsetX}px`;
//     bubble.style.top = `${offsetY - 50}px`; // Position it above the other player
//
//     styleMessageBubble(bubble);
//
//     document.body.appendChild(bubble);
//
//     // Remove the bubble after 2 seconds
//     setTimeout(() => {
//         document.body.removeChild(bubble);
//     }, 2000);
// }

function styleMessageBubble(bubble) {
    bubble.style.backgroundColor = 'rgba(0,0,0,0.8)';
    bubble.style.color = 'white';
    bubble.style.padding = '5px 10px';
    bubble.style.borderRadius = '10px';
    bubble.style.zIndex = '100';
    bubble.style.fontSize = '0.8rem';
    bubble.style.whiteSpace = 'nowrap';
    bubble.style.textAlign = 'center';
}
