import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote, // what if I want to use the return value of the mutationFn? --> onSuccess
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] }) // this makes sure that the query is refetched when the mutation is completed
    },
  })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch({
      type: 'SET',
      notification: `anecdote ${anecdote.content} voted`,
    })

    // todo : that timeout bug still exist ; I might have fixed it in my 2020 code
    // description of bug:
    // a notification triggers a timeout
    // if another notification is triggered before the timeout is completed, 
    // the previous timeout is NOT cleared!
    // expected behavior: the previous timeout should be cleared;
    // notification 1
    // notitication 2 (if before notification 1 is finished; this should be rendered in UI and it should show for the full duration of the timeout)

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 3000)
    console.log('vote')
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })
  console.log(JSON.parse(JSON.stringify(result)))

  const anecdotes = result.data

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  if (result.isError) {
    return (
      <div>anecdote service not available due to problems in the server</div>
    )
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
