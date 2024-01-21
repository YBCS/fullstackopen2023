/* eslint-disable no-case-declarations */
import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    castVote(state, action) {
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
    appendAnecdote(state, action) { // will append one at a time
      state.push(action.payload) // possible because of immer
    },
    setAnecdotes(state, action) { // will replace entire state
      return action.payload
    }    
  },
})

// redux thunk - asynchronous action creators
export const initializeAnecdotes = () => {
  return async dispatch => { // where is this dispatch coming from ?
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const castVoteOf = (anecdote) => {
  return async dispatch => {
    const new_anecdote = { ...anecdote, votes: anecdote.votes + 1}
    await anecdoteService.update(anecdote.id, new_anecdote)
    dispatch(castVote(new_anecdote.id))
  }
}

export const { castVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
