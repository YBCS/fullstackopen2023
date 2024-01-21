import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import anecdoteService from '../services/anecdotes'
import { clearNotification, setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  /* using uncontrolled form */
  const dispatch = useDispatch()
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target[0].value
    event.target[0].value = ''
    const newAnecdote = await anecdoteService.createNew(content) // there is no error handling
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`you created a new anecdote: ${content}`))
    setTimeout(() => {
      dispatch(clearNotification(''))
    }, 3000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input />
        </div>
        <button>create</button>
      </form>
    </>
  )
}
export default AnecdoteForm
