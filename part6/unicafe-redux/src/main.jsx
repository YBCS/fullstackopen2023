import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

// if inside a component it will resubscribe every time the component is rendered.
// so it needs to be cleaned up in the component's cleanup function.
store.subscribe(() => {
  const storeNow = store.getState()
  console.log('subs ',storeNow)
}) 

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  return (
    <div>
      <button onClick={good}>good</button> 
      <button>ok</button> 
      <button>bad</button>
      <button>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok</div>
      <div>bad</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
