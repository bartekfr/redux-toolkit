import { createSelector } from '@reduxjs/toolkit'
import React from 'react'
import cn from 'classnames'
import { useAppSelector, useAppDispatch } from '../common/hooks'
import todoSlice, { fetchTodos } from '../store/todos'
import type { AppState } from '../store/store'


const selectTodos = (state: AppState) => state.todos.list
const selectPendingFilter = (state: AppState) => state.todos.filterPendingTodos

const selectFilteredTodos = createSelector(selectTodos, selectPendingFilter, (items, filter) =>
  filter ? items.filter(item => item.completed === false) :  items
)

const uncompletedTodosLength = createSelector(selectTodos, (items) => items.filter(item => item.completed === false).length)

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch()
  // to avoid unnecessary re-renders multiple selectors could be used if `todos` was complex object with more properties
  const todos = useAppSelector(selectFilteredTodos)
  const remainingTodos = useAppSelector(uncompletedTodosLength)
  const loading = useAppSelector(state => state.todos.loading)
  const errorMsg = useAppSelector(state => state.todos.errorMessage)

  React.useEffect(() => {
    const loadTodos = async () => {
      const loadResult = await dispatch(fetchTodos())
      if (fetchTodos.fulfilled.match(loadResult)) {
        const list = loadResult.payload
        console.log(`Loaded result ${list}`)
      }
    }

    loadTodos()
  }, [dispatch])

  return (
    <>
      <div className='todoList'>
        {loading && <div className='loader'>Loading...</div>}
        {errorMsg && <div className='error'>{errorMsg}</div>}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={cn('todo', {
              completeTodo: todo.completed
            })}
          >
            <input
              className='todoCheck'
              type='checkbox'
              checked={todo.completed}
              onChange={() => dispatch(todoSlice.actions.completeTodo(todo.id))}
            />
            <span className='todoMessage'>{todo.title}</span>
            <button
              type='button'
              className='todoDelete'
              onClick={() => dispatch(todoSlice.actions.deleteTodo(todo.id))}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className='remaining-count'>Remaining tasks number: <span>{remainingTodos}</span></div>
    </>
  )
}

export default TodoList
