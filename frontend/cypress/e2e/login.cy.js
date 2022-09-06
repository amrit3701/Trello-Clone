describe('Check Login page', () => {
  it('Login Success', () => {
    const user = Cypress.env('user');
    cy.visit('/login');
    cy.get('#input-24').type(user.username);
    cy.get('#input-27').type(user.password);
    cy.get('.v-form > .v-btn').should('be.visible').click();
    cy.url().should('not.contain', '/login');
    cy.url().should('contain', '/boards');
  });
  it('Login Failed', () => {
    cy.visit('/login');
    cy.get('#input-24').type('not_exist');
    cy.get('#input-27').type('not_exist');
    cy.get('.v-form > .v-btn').should('be.visible').click();
    cy.url().should('contain', '/login');
  });
});
