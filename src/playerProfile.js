function toggleProfilePanel() {
    document.getElementById('profilePanel').classList.toggle('hidden');
    util.togglePlayerControlled();
}

function populatePlayerProfile(userData) {
    document.getElementById('playerUsername').textContent = userData.username;
    document.getElementById('playerEmail').textContent = userData.email;
    // Todo :Populate other profile elements as needed


}

