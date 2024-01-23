import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      console.log('on success new anecdote called 1 ', newAnecdote)

      queryClient.invalidateQueries({ queryKey: ['anecdotes'] }) // this makes sure that the query is refetched when the mutation is completed
      dispatch({
        type: 'SET',
        notification: `new anecdote ${newAnecdote.content} created`,
      })

      setTimeout(() => {
        dispatch({
          type: 'CLEAR',
        })
      }, 3000)

      // manually updating state in react query
      // const anecdotes = queryClient.getQueryData({ queryKey: ['anecdotes'] }) // todo : this is not working
      // // console.log('on success new anecdote called ', anecdotes)
      // queryClient.setQueryData(
      //   { queryKey: ['anecdotes'] },
      //   anecdotes.concat(newAnecdote)
      // )
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
