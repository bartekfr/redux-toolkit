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
    cy.get('.loader')

    cy.wait('@getTodos')

    cy.get('.loader').should('not.exist')
    cy.get('.todoList .todo')
      .should('have.length', 2)
      .each($el => {
        cy.wrap($el).should('not.have.class', 'completeTodo')
      })

    cy.get('.remaining-count span').contains(2)
  })

  it('Adds todo', () => {
    const title = 'Shopping'
    cy.contains(title).should('not.exist')
    cy.get('#todo-input').type(`${title}{enter}`)

    cy.get('.todoList .todo')
      .should('have.length', 3)
      .last()
      .contains(title)

    cy.get('.remaining-count span').contains(3)
  })

  it('Completes todo', () => {
    cy.get('.todoList .todo:last-child').as('newItem')
      .should('not.have.class', 'completeTodo')

    cy.get('@newItem').find('.todoCheck').should('have.prop', 'checked', false)
    cy.get('@newItem').find('.todoCheck').click()
    cy.get('@newItem').find('.todoCheck').should('have.prop', 'checked', true)
    cy.get('@newItem').should('have.class', 'completeTodo')

    cy.get('.remaining-count span').contains(2)
  })

  it('Filters todo', () => {
    cy.get('.todoList .todo:first-child').as('firstItem').find('.todoCheck').click()
    cy.get('.remaining-count span').contains(1)
    const expectedCompletedTodosCount = 2
    const expectedAllTodosCount = 3

    cy.get('@firstItem').should('have.class', 'completeTodo')
    cy.get('.completeTodo').should('have.length', expectedCompletedTodosCount)

    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount)

    cy.get('#filterCheckbox').click()

    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount - expectedCompletedTodosCount)
      .each($el => {
        cy.wrap($el).should('not.have.class', 'completeTodo')
      })

    cy.get('#filterCheckbox').click()
    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount)
  })

  it('Deletes todo', () => {
    const lastItemTitle = 'Shopping'
    cy.get('.todoList .todo')
      .should('have.length', 3)

    cy.get('.todo').contains(lastItemTitle)

    cy.get('.todoList .todo:last-child').as('lastItem').contains(lastItemTitle)
    cy.get('@lastItem').find('.todoDelete').click()

    cy.get('.todoList .todo')
      .should('have.length', 2)

    cy.get('@lastItem').contains('Go for a walk')
    cy.get('.todo').contains(lastItemTitle).should('not.exist')
    cy.get('.remaining-count span').contains(1)
  })

  it('Handles load request erros', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos'
      }, {
        forceNetworkError: true
      }
    ).as('getTodos')

    cy.visit('/')
    cy.get('.loader')
    cy.get('.error').should('not.exist')
    cy.wait('@getTodos')

    cy.get('.loader').should('not.exist')
    cy.get('.error')
  })
})
