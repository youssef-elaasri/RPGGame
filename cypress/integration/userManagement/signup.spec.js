/**
 * SignUp test. Creates a new account with random (supposedly unique) credentials.
 */

describe('Account Creation', () => {
    it('creates a new user account with unique credentials', () => {
        // Generate a random number to append to the username and email
        const randomNumber = Math.floor(Math.random() * 10000);
        const username = `testuser${randomNumber}`;
        const email = `testuser${randomNumber}@example.com`;
        const password = 'CypressTest123*';

        // Visit the base URL
        cy.visit('http://localhost:3000/index.html');

        // Stub the window.alert function and verify its text when called
        const stub = cy.stub();
        cy.on('window:alert', stub);

        // Trigger signup mode
        cy.contains('Sign up').click();

        // Open the authentication modal and switch to signup
        cy.get('#signupBtn').should('be.visible'); // Ensures the signup button is visible

        // Fill the registration form with random data
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);

        // Submit the form
        cy.get('#signupBtn').click()
            .then(() => {
                cy.get('#errorMessage').should('be.empty');
                // Ensure the alert was called with the correct text
                expect(stub.getCall(0)).to.be.calledWith('Registration successful');
            });
    });
});