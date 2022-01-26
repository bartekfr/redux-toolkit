// TODO move to fixtures

const todos = [{
  id: 1,
  title: "Buy eggs"
}, {
  id: 2,
  title: "Go for a walk"
}]

describe('App test', () => {
  it('Renders correct elements', () => {
    cy.visit('/')
    cy.get('h2')

    cy.intercept(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos'
      },
      [...todos]
    ).as('getTodos')

    cy.get('.todoList .todo').should('have.length', 2)
  })
})
