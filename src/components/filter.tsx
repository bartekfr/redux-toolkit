import React from 'react'
import { useAppSelector, useAppDispatch } from '../common/hooks'
import todoSlice from '../store/todos'

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
        onChange={event => dispatch(todoSlice.actions.filterPendingTodos(event.target.checked))}
      />
    </div>
  )
}

export default Filter
