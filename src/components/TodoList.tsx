import { createSelector } from '@reduxjs/toolkit'
import React from 'react'
import cn from 'classnames'
import { useAppSelector, useAppDispatch } from '../common/hooks'
import todoSlice, { fetchTodos } from '../store/todos'
import type { AppState } from '../store/store'


const selectTodos = (state: AppState) => state.todos.list
const selectPendingFilter = (state: AppState) => state.todos.filterPendingTodos
const selectCompletedTodos = (state: AppState) => state.todos.filterCompletedTodos

const selectFilteredTodos = createSelector(selectTodos, selectPendingFilter, selectCompletedTodos, (items, pendingFilter, completedFilter) => {
  if (pendingFilter && completedFilter) {
    return items
  } else if (pendingFilter) {
    return items.filter(item => item.completed === false)
  } else if (completedFilter) {
    return items.filter(item => item.completed === true)
  } else {
    return []
  }

})

const uncompletedTodosLength = createSelector(selectTodos, (items) => items.filter(item => item.completed === false).length)

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch()
  // to avoid unnecessary re-renders multiple selectors could be used if `todos` was complex object with more properties
  const todos = useAppSelector(selectFilteredTodos)
  const remainingTodos = useAppSelector(uncompletedTodosLength)
  const status = useAppSelector(state => state.todos.status)
  const errorMsg = useAppSelector(state => state.todos.errorMessage)
  const loading = status === 'loading'

  React.useEffect(() => {
    const loadTodos = async () => {
      const loadResult = await dispatch(fetchTodos())
      console.log('Fetch dispatch result:', loadResult)

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
