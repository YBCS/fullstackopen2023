import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
const STORE_KEY = 'loggedBlogappUser'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(STORE_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // blogService.setToken(user.token)
    }
  }, [])

  return (
    <>
      {user === null ? (
        <Login setUser={setUser} />
      ) : (
        <Blogs user={user} setUser={setUser} />
      )}
    </>
  )
}

const Login = ({ setUser }) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    const user = await loginService.login({ username, password })
    setUser(user)
    window.localStorage.setItem(STORE_KEY, JSON.stringify(user))
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>log in to application</h1>
      <div>
        username:{' '}
        <input
          value={username}
          onChange={({ target }) => setUserName(target.value)}
        />
      </div>
      <div>
        password:{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <button type="submit">login</button>
      </div>
    </form>
  )
}

const Blogs = ({ user, setUser }) => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const logout = (event) => {
    event.preventDefault() // is this really helping ?
    window.localStorage.removeItem(STORE_KEY)
    setUser(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
        {`${user.username} logged in`}
        <button onClick={logout}>logout</button>
      </div>
      <br />
      <BlogForm />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = (event) => {
    event.preventDefault();
  }
  return (
    <form onSubmit={onSubmit}>
      <h2>create new</h2>
      <div>
        title:{' '}
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:{' '}
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:{' '}
        <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default App
