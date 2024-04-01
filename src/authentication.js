function hideModal() {
    document.getElementById('authModal').classList.add("hidden");
}

function showButtons() {
    document.getElementById('fullscreenBtn').classList.remove("hidden");
    document.getElementById('saveBtn').classList.remove("hidden");
    document.getElementById('logoutBtn').classList.remove("hidden");
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Store the token for later use
                alert('Login successful');
                hideModal();
                showButtons();
                util.gameInit(data.userId);
            } else {
                // Handle any situation where login is successful but no token is returned
                alert('Login successful, but no authentication token received.');
            }
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}

// Sign up function
function signup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value; // Make sure this ID matches your input
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/auth/register', { // Adjust this URL based on your actual API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Registration successful');
                toggleAuthMode(true);

            } else {
                alert('Registration failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Registration failed');
        });
}

let isLoginMode = true; // Variable to track auth mode, default to log in
function toggleAuthMode(loginMode) {
    // Set the mode
    isLoginMode = loginMode;

    // Get references to the elements
    const emailGroup = document.getElementById('emailGroup');
    const authToggleText = document.getElementById('authToggleText');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    // Toggle visibility based on the mode
    if (isLoginMode) {
        emailGroup.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        signupBtn.classList.add('hidden');
        authToggleText.innerHTML = 'New player? <a href="#" onclick="toggleAuthMode(false)">Sign up</a>';
    } else {
        emailGroup.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        signupBtn.classList.remove('hidden');
        authToggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode(true)">Login</a>';
    }
}

async function logout() {
    // Ask for confirmation before logging out
    const confirmLogout = confirm("Did you save your game?");

    if (confirmLogout) {
        // Clear stored JWT token or user data
        localStorage.removeItem('authToken');
        // todo : Optionally clear other user-specific data stored in localStorage or sessionStorage
        window.location.reload();
    }
}

function getCurrentGameState() {
    return {
        playerPosition: { x: window.Player.x, y: window.Player.y }, // Example of retrieving player position
        map: window.currentMap, // Example of retrieving current map name
    };
}

async function saveGame() {
    // Obtain the current game state
    const gameState = getCurrentGameState();
    const userId = window.Player.id;
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/saves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mapName: gameState.map,
                player_x: gameState.playerPosition.x,
                player_y: gameState.playerPosition.y,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error saving game state:', error);
            return null;
        }

        const result = await response.json();
        console.log('Game state saved successfully:', result);
        return result;
    } catch (error) {
        console.error('Error saving game state:', error);
        return null;
    }
}

async function loadGame(userId) {
    console.log(userId)
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/last-game`, {
            method: 'GET'
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error loading game state:', error);
            return null;
        }

        const gameState = await response.json();
        console.log('Game state loaded successfully:', gameState);

        return gameState;
    } catch (error) {
        console.error('Error loading game state:', error);
        return null;
    }
}
