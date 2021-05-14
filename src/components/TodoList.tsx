import React from 'react'
import cn from 'classnames'
import { useAppSelector, useAppDispatch } from '../common/hooks'
import todoSlice, { fetchTodos } from '../store/todos'

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(state => state.todos)

  React.useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  return (
    <div className='todoList'>
      {todos.loading && 'Loading...'}
      {todos.list.map((todo) => (
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
  )
}

export default TodoList
