import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../common/hooks'
import todoSlice, { fetchTodos } from '../store/todos'
import todos from '../store/todos'

const Filter: React.FC = () => {
  const dispatch = useAppDispatch()
  const filterChecked = useAppSelector(state => state.todos.filterPendingTodos)

  return (
    <div
      className='filter'
    >
      <label htmlFor='filterCheckbox'>Show only uncompleted items</label>
      <input
        id='filterCheckbox'
        type='checkbox'
        checked={filterChecked}
        onChange={event => dispatch(todoSlice.actions.filterPendingTodos(!filterChecked))}
      />
    </div>
  )
}

export default Filter
