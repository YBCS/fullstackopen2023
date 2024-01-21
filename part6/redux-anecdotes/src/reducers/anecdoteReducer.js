/* eslint-disable no-case-declarations */
import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    castVoteOf(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((n) => n.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }
      // to get correct output
      // console.log('state castVoteOf ', JSON.parse(JSON.stringify(state)))
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
    createAnecdote(state, action) {
      state.push(action.payload) // possible because of immer
      return
    },
    appendAnecdote(state, action) { // will append one at a time
      state.push(action.payload)
    },
    setAnecdotes(state, action) { // will replace entire state
      return action.payload
    }    
  },
})

export const { castVoteOf, createAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
