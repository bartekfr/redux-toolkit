import React, { useState } from 'react'
import { useAppDispatch } from '../common/hooks'
import todos from '../store/todos'

const TodoInput: React.FC = () => {
  const dispatch =  useAppDispatch()
  const [inputValue, setInputValue] = useState('')

  return (
    <form
      className='todoInput'
      onSubmit={event => {
        event.preventDefault()
        dispatch(todos.actions.addTodo(inputValue))
        setInputValue('')
      }}
    >
      <label htmlFor='todo-input'>Enter Todo Here</label>
      <input
        id='todo-input'
        value={inputValue}
        onChange={event => setInputValue(event.currentTarget.value)}
      />
      <button type='submit'>Add Todo</button>
    </form>
  )
}

export default TodoInput
