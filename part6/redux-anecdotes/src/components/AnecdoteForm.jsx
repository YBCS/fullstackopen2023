import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  /* using uncontrolled form */
  const dispatch = useDispatch()
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target[0].value
    event.target[0].value = ''
    dispatch(createAnecdote(content))
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
