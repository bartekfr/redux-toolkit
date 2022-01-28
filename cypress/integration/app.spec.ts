describe('App test', () => {
  it('Renders loaded elements', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos'
      }, {
        fixture: 'todos.json'
      }
    ).as('getTodos')

    cy.visit('/')
    cy.get('h2')

    cy.wait('@getTodos')

    cy.get('.todoList .todo')
      .should('have.length', 2)
      .each($el => {
        cy.wrap($el).should('not.have.class', 'completeTodo')
      })
  })

  it('Adds todo', () => {
    cy.get('#todo-input').type('Shopping{enter}')

    cy.get('.todoList .todo')
      .should('have.length', 3)
      .last()
      .contains('Shopping')
  })

  it('Completes todo', () => {
    cy.get('.todoList .todo:last-child').as('newItem')
      .should('not.have.class', 'completeTodo')

    cy.get('@newItem').find('.todoCheck').click()
    cy.get('@newItem').should('have.class', 'completeTodo')
  })
})
