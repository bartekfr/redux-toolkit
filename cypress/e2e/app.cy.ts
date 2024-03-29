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

  it('(Un)completes todo', () => {
    cy.get('.todoList .todo:last-child').as('newItem')
      .should('not.have.class', 'completeTodo')
      .find('.todoCheck').should('have.prop', 'checked', false)

    cy.get('@newItem').find('.todoCheck').click() // complete

    cy.get('@newItem').find('.todoCheck').should('have.prop', 'checked', true)
    cy.get('@newItem').should('have.class', 'completeTodo')
    cy.get('.remaining-count span').contains(2)

    cy.get('@newItem').find('.todoCheck').click() //uncomplete

    cy.get('@newItem').find('.todoCheck').should('have.prop', 'checked', false)
    cy.get('@newItem').should('not.have.class', 'completeTodo')
    cy.get('.remaining-count span').contains(3)

    cy.get('@newItem').find('.todoCheck').click() // complete

    cy.get('@newItem').find('.todoCheck').should('have.prop', 'checked', true)
    cy.get('@newItem').should('have.class', 'completeTodo')
    cy.get('.remaining-count span').contains(2)
  })

  it('Deletes todos', () => {
    let allTodosCount = 3
    let remainingTodosCount = 2
    let completeTodosCount = 1
    cy.get('.todoList .todo').as('todos').should('have.length', allTodosCount)
    cy.get('.remaining-count span').as('remaining').contains(remainingTodosCount)
    cy.get('.todoList .todo:not(.completeTodo)').as('uncompleted').should('have.length', remainingTodosCount)
    cy.get('.todoList .completeTodo').as('completed').should('have.length', completeTodosCount)

    cy.get('.todo .todoDelete').eq(0).click({
      force: true,
    })
    allTodosCount--
    remainingTodosCount--

    cy.get('@todos').should('have.length', allTodosCount)
    cy.get('@remaining').contains(remainingTodosCount)
    cy.get('@uncompleted').should('have.length', remainingTodosCount)
    cy.get('@completed').should('have.length', completeTodosCount)

    cy.get('.completeTodo .todoDelete').click({
      force: true,
    })
    allTodosCount--
    completeTodosCount--

    cy.get('@todos').should('have.length', allTodosCount)
    cy.get('@remaining').contains(remainingTodosCount)
    cy.get('@uncompleted').should('have.length', remainingTodosCount)
    cy.get('@completed').should('have.length', completeTodosCount)
  })

  it('Filters todo', () => {
    cy.get('#todo-input').type(`task-1{enter}`)
    cy.get('#todo-input').type(`task-2{enter}`)

    cy.get('.todo').last().find('.todoCheck').click()
    cy.get('.todoList .todo:first-child').as('firstItem').find('.todoCheck').click()
    cy.get('.remaining-count span').contains(1)
    const expectedCompletedTodosCount = 2
    const expectedAllTodosCount = 3

    cy.get('@firstItem').should('have.class', 'completeTodo')
    cy.get('.completeTodo').should('have.length', expectedCompletedTodosCount)

    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount)

    cy.get('#filterPendingCheckbox').click() // uncheck - shows only completed
    cy.get('.remaining-count span').contains(1)

    cy.get('.todoList .todo')
      .should('have.length', expectedCompletedTodosCount)
      .each($el => {
        cy.wrap($el)
          .should('have.class', 'completeTodo')
          .find('input:checkbox')
          .should('be.checked')
      })

    cy.get('#filterPendingCheckbox').click() // check - shows all
    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount)

    cy.get('#filterCompletedCheckbox').click() // uncheck - shows only uncompleted

    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount - expectedCompletedTodosCount)
      .each($el => {
        cy.wrap($el)
          .should('not.have.class', 'completeTodo')
          .find('input:checkbox')
          .should('not.be.checked')
      })

    cy.get('#filterPendingCheckbox').click() // uncheck - shows nothing
    cy.get('.todoList .todo').should('not.exist')

    cy.get('#filterPendingCheckbox').click()
    cy.get('#filterCompletedCheckbox').click()

    cy.get('.todoList .todo')
      .should('have.length', expectedAllTodosCount)
  })

  it('Filters and deletes todos', () => {
    let title = 'Ipsum'
    cy.contains(title).should('not.exist')
    cy.get('#todo-input').type(`${title}{enter}`)

    title = 'Ipsum 2'
    cy.contains(title).should('not.exist')
    cy.get('#todo-input').type(`${title}{enter}`)

    cy.get('.todoList .todo')
      .should('have.length', 5)
      .last()
      .contains(title)

    cy.get('.remaining-count span').contains(3)
    cy.get('.todoList .todo:not(.completeTodo)').should('have.length', 3)
    cy.get('.todoList .completeTodo').should('have.length', 2)


    cy.get('#filterPendingCheckbox').click()
    cy.get('.completeTodo .todoDelete').click({
      force: true,
      multiple: true
    })

    cy.get('.todoList .todo')
      .should('not.exist')

    cy.get('#filterPendingCheckbox').click()

    cy.get('.todoList .todo')
      .should('have.length', 3)
      .each($el => {
        cy.wrap($el)
          .should('not.have.class', 'completeTodo')
          .find('input:checkbox')
          .should('not.be.checked')
      })

    cy.get('#filterCompletedCheckbox').click()

    cy.get('.remaining-count span').contains(3)
    cy.get('.todo').should('have.length', 3)
    cy.get('.todoList .todo:not(.completeTodo)').should('have.length', 3)
    cy.get('.todoList .completeTodo').should('not.exist')

    cy.get('.todo .todoDelete').click({
      force: true,
      multiple: true
    })

    cy.get('.todoList .todo').should('not.exist')

    cy.get('.remaining-count span').contains(0)
  })

  it('Handles failed requestt error', () => {
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
    cy.get('.error').contains('Request failed')
  })

  it('Handles 4XX request errors', () => {
    const statusCode = 401
    cy.intercept(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos'
      }, {
        statusCode
      }
    ).as('getTodos')

    cy.visit('/')
    cy.get('.loader')
    cy.get('.error').should('not.exist')
    cy.wait('@getTodos')

    cy.get('.loader').should('not.exist')
    cy.get('.error').contains(`Something went wrong ${statusCode}`)
  })
})
