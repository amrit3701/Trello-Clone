describe('Boards Page', () => {
  beforeEach(() => {
    const user = Cypress.env('user');
    cy.login(user.username, user.password);
  })
  it('Create new board', () => {

    const user = Cypress.env('user');
    cy.visit('/boards');
    cy.url().should('contain', '/boards');
    cy.get('.v-toolbar__content').should('contain.text', user.username);
    // cy.get('.container').contains('Create Board').closest('form');
    // cy.wait(5000);
    const newBoradName = (Math.random() + 1).toString(36).substring(7);
    const form = cy.get('form input');
    form.first().type(newBoradName);
    cy.get('form').children('button').click();
    cy.get('.container').should('contain.text', newBoradName);
  });
});
