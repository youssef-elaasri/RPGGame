/**
 * profile test. Tries to log in with test account and then checks the player profile section.
 */

describe('Profile Panel', () => {
    it('Logs in with test account and checks the credentials in the profile panel', () => {
        // Generate a random number to append to the username and email
        const username = `LoginTest`;
        const email = `LoginTest@example.com`;
        const password = 'CypressTest123*';

        // Visit the base URL
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
                // Ensure the alert was called with the correct text
                expect(stub.getCall(0)).to.be.calledWith('Login successful');

                // There should be no error message
                cy.get('#errorMessage').should('be.empty');

                /* We are logged in at this stage. We shall check the player profile */
                // Click on profile button
                cy.get('#profileBtn')

                // Check the information of the user
                cy.get('#playerUsername').should('contain', username);
                cy.get('#playerEmail').should('contain', email);
            });
    });
});