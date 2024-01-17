import { useDispatch, useSelector } from 'react-redux'
import { castVoteOf } from '../reducers/anecdoteReducer'
import Filter from './Filter'
import { clearNotification, setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes)
  const filterName = useSelector((state) => state.filter) // redux is very composable
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(castVoteOf(id))
    const voted = anecdotes.find((a) => a.id === id)
    // there is a bug here. When I set '' after 5 seconds it will overwrite the notification
    dispatch(setNotification(`you voted ${voted.content}`))
    setTimeout(() => {
      dispatch(clearNotification(''))
    }, 3000)
  }

  const anecdotesToShow = filterName
    ? anecdotes.filter((c) =>
        c.content.toLowerCase().includes(filterName.toLowerCase())
      )
    : anecdotes
  
    // woah --> why do I have to do this // does the solution does this too ?
  const anecdotesSortedByVotes = [...anecdotesToShow].sort(
    (a, b) => b.votes - a.votes
  )

  return (
    <>
      <Filter />
      {anecdotesSortedByVotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
