/**
 * Simple test to check the generation of the page
 */

describe('Game Initialization', () => {
  it('Loads the game canvas', () => {
    cy.visit('http://localhost:3000/index.html')
    cy.get('#gameCanvas').should('be.visible');  // Checks if the game canvas is visible
  });
});
