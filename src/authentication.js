function hideModal() {
    document.body.classList.remove('body-no-scroll');
    document.getElementById('authModal').classList.add("hidden");
}

function toggleErrorMessage (display, msg) {
    const errorMessageElement = document.getElementById('errorMessage');
    if (display)
        errorMessageElement.classList.remove('hidden'); // Make sure this error message is visible
    else
        errorMessageElement.classList.add('hidden');

    errorMessageElement.textContent = msg;
}

function passwordChangeToggleErrorMessage (display, msg) {
    const errorMessageElement = document.getElementById('changePasswordErrorMessage');
    if (display)
        errorMessageElement.classList.remove('hidden'); // Make sure this error message is visible
    else
        errorMessageElement.classList.add('hidden');

    errorMessageElement.textContent = msg;
}

function toggleButtons() {
    document.getElementById('fullscreenBtn').classList.toggle("hidden");
    document.getElementById('saveBtn').classList.toggle("hidden");
    document.getElementById('logoutBtn').classList.toggle("hidden");
    document.getElementById('profileBtn').classList.toggle("hidden");
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/login', {
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
                // If not successful, parse the response as JSON to get the error message
                return response.json().then(data => {
                    toggleErrorMessage(true, data.error || 'Login failed for an unknown reason')
                    throw new Error(data.error || 'Login failed for an unknown reason');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Store the token for later use
                alert('Login successful');
                populatePlayerProfile(data);
                toggleErrorMessage(false, "");
                hideModal();
                toggleButtons();
                util.gameInit(data.userId);
            } else {
                // Handle any situation where login is successful but no token is returned
                alert('Login successful, but no authentication token received.');
            }
        })
        .catch((error) => {
            console.error(error);
            toggleErrorMessage(true, error || 'Login failed for an unknown reason')
        });
}

// Sign up function
function signup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value; // Make sure this ID matches your input
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/register', { // Adjust this URL based on your actual API endpoint
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
        .then(response => {
            // Check if the response status indicates success (e.g., 200 OK or 201 Created)
            if (!response.ok) {
                // If not successful, parse the response as JSON to get the error message
                return response.json().then(data => {
                    toggleErrorMessage(true, data.error || 'Registration failed for an unknown reason')
                    throw new Error(data.error || 'Registration failed for an unknown reason');
                });
            }
            return response.json();
        })
        .then(data => {
            // Handle success case
            toggleErrorMessage(false, '');
            alert('Registration successful');
            toggleAuthMode(true); // Assuming this function toggles your authentication mode/state
        })
        .catch((error) => {
            console.error('Error:', error);
            toggleErrorMessage(true, error || 'Login failed for an unknown reason')
        });
}

let isLoginMode = true; // Variable to track auth mode, default to log in
function toggleAuthMode(loginMode) {
    toggleErrorMessage(false, '');
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

async function saveGame() {
    // Obtain the current game state
    const userId = window.Player.id;
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `${token}`,
            },
            body: JSON.stringify({
                mapName: window.currentMap.name,
                player_x: window.Player.x,
                player_y: window.Player.y,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error saving game state:', error);
            return null;
        }

        const result = await response.json();
        console.log('Game state saved successfully:', result);
        alert('Game saved successfully');
        return result;
    } catch (error) {
        console.error('Error saving game state:', error);
        return null;
    }
}

async function loadGame(userId) {
    // todo : Manage the case where a save point doesn't exist in the db
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}/load`, {
            method: 'GET',
            headers: {
                'x-access-token': `${token}`
            }
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

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const authToken = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage after login
    const userId = window.Player.id;

    if (!authToken) {
        alert('You must be logged in to change your password.');
        return;
    }

    fetch(`http://localhost:8080/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': authToken,
        },
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    })
        .then(response => {
            if (!response.ok) {
                // If not successful, parse the response as JSON to get the error message
                return response.json().then(data => {
                    passwordChangeToggleErrorMessage(true, data.error || 'Password change failed for an unknown reason');
                    throw new Error(data.error || 'Password change failed for an unknown reason');
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Password changed successfully.');
            passwordChangeToggleErrorMessage(false, '');
            toggleProfilePanel();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

