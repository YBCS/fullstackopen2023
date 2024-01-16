import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

/* debugging -- does this still work in configure store */
store.subscribe(() => {
  const storeNow = store.getState()
  console.log('store now in subscribe ', storeNow)
})


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)