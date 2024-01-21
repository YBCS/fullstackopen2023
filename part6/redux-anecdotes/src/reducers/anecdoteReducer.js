/* eslint-disable no-case-declarations */
import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

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

// redux thunk
export const initializeAnecdotes = () => {
  return async dispatch => { // where is this dispatch coming from ?
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const { castVoteOf, createAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
