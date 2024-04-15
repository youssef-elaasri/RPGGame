/**
 * login test. Tries to log in with test account (attempts to create it first).
 */

describe('Login test', () => {
    it('creates a user and logs in with the same credentials', () => {
        // Generate a random number to append to the username and email
        const username = `LoginTest`;
        const email = `LoginTest@example.com`;
        const password = 'CypressTest123*';

        // Visit the base URL
        cy.visit('http://localhost:3000/index.html');

        /* Create the account if not already existing */
        // Trigger signup mode
        cy.contains('Sign up').click();

        // Open the authentication modal and switch to signup
        cy.get('#signupBtn').should('be.visible'); // Ensures the signup button is visible

        // Fill the registration form with random data
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);

        // Submit the form
        cy.get('#signupBtn').click();

        // Return to main page
        cy.visit('http://localhost:3000/index.html');

        // Stub the window.alert function and verify its text when called
        const stub = cy.stub();
        cy.on('window:alert', stub);

        // Fill the login form with random data
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);

        // Submit the form
        cy.get('#loginBtn').click()
            .then(() => {
                // There should be no error message
                cy.get('#errorMessage').should('be.empty');
                // Ensure the alert was called with the correct text
                expect(stub.getCall(0)).to.be.calledWith('Login successful');
            });
    });
});