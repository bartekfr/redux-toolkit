import React from 'react'
import { useAppSelector, useAppDispatch } from '../common/hooks'
import todoSlice from '../store/todos'

const Filter: React.FC = () => {
  const dispatch = useAppDispatch()
  const pendingFilterChecked = useAppSelector(state => state.todos.filterPendingTodos)
  const completedFilterChecked = useAppSelector(state => state.todos.filterCompletedTodos)

  return (
    <div
      className='filter'
    >
      <div>
        <label htmlFor='filterPendingCheckbox'>Show uncompleted items</label>
        <input
          id='filterPendingCheckbox'
          type='checkbox'
          checked={pendingFilterChecked}
          onChange={event => dispatch(todoSlice.actions.filterPendingTodos(event.target.checked))}
        />
      </div>
      <div>
        <label htmlFor='filterCompletedCheckbox'>Show completed items</label>
        <input
          id='filterCompletedCheckbox'
          type='checkbox'
          checked={completedFilterChecked}
          onChange={event => dispatch(todoSlice.actions.filterCompletedTodos(event.target.checked))}
        />
      </div>

    </div>
  )
}

export default Filter
