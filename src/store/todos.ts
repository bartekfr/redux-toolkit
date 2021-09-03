import uuid from 'uuid/v4'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export interface ToDosState {
  list: Todo[]
  loading?: boolean
}

export const fetchTodos = createAsyncThunk(
  'todos/list',
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`)
    console.log('response')
    return (await response.json()) as Todo[]
  }
)

const todos = createSlice({
  name: 'todos',
  initialState: {
    list: []
  } as ToDosState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.list.push({ id: uuid(), title: action.payload, completed: false })
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((todo) => todo.id !== action.payload)
    },
    completeTodo: (state, action: PayloadAction<string>) => {
      const completedTodo = state.list.find(
        (todo) => todo.id === action.payload
      )
      if (completedTodo) {
        completedTodo.completed = !completedTodo.completed
      }

      return state
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.list = action.payload.slice(0, 5)
        state.loading = false
      })
  }
})

export default todos
