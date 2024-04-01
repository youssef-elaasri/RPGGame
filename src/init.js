document.addEventListener('DOMContentLoaded', function() {
    // Initialize the form with login mode
    toggleAuthMode(true);

    // Add login and sign up event listeners
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('signupBtn').addEventListener('click', signup);

});


