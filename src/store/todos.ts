import uuid from 'uuid/v4'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export interface ToDosState {
  list: Todo[]
  status?: 'loading' | 'completed'
  filterPendingTodos?: boolean
  filterCompletedTodos?: boolean
  errorMessage?: string
}

const initialState: ToDosState = {
  filterCompletedTodos: true,
  filterPendingTodos: true,
  status: 'loading',
  list: []
}

export const fetchTodos = createAsyncThunk(
  'todos/list',
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`)
    return (await response.json()) as Todo[]
  }
)

const todos = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.list.push({ id: uuid(), title: action.payload, completed: false })
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((todo) => todo.id !== action.payload)
    },
    completeTodo: (state, action: PayloadAction<string>) => {
      const itemToComplete = state.list.find(
        (todo) => todo.id === action.payload
      )
      if (itemToComplete) {
        itemToComplete.completed = !itemToComplete.completed
      }
      console.log(5, itemToComplete)
    },
    filterCompletedTodos: (state, action: PayloadAction<boolean>) => {
      state.filterCompletedTodos = action.payload
    },
    filterPendingTodos: (state, action: PayloadAction<boolean>) => {
      state.filterPendingTodos = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.list = action.payload.slice(0, 5)
        state.status = 'loading'
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.errorMessage = action.error.message
        console.log('error')
        state.status = 'completed'
      })
  }
})

export default todos
