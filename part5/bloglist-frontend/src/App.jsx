import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
const STORE_KEY = 'loggedBlogappUser'

const App = () => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  const notifyWith = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null })
    }, 3000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(STORE_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <>
      {user === null ? (
        <Login
          setUser={setUser}
          notifyWith={notifyWith}
          notification={notification}
        />
      ) : (
        <Blogs
          user={user}
          setUser={setUser}
          notifyWith={notifyWith}
          notification={notification}
        />
      )}
    </>
  )
}

const Login = ({ setUser, notifyWith, notification }) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    try {
      event.preventDefault()
      const user = await loginService.login({ username, password })
      setUser(user)
      notifyWith(`${user.username} welcome back!`)
      window.localStorage.setItem(STORE_KEY, JSON.stringify(user))
      blogService.setToken(user.token)
      setUserName('')
      setPassword('')
    } catch (e) {
      notifyWith('wrong credentials', 'error')
      console.error(e)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>log in to application</h1>
      <Notification notification={notification} />
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

const Blogs = ({ user, setUser, notifyWith, notification }) => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const addBlog = (newBlog) => {
    return blogService.create(newBlog).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      notifyWith(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    }).catch((e) => {
      notifyWith(e.response.data.error, 'error')
    })
  }

  const logout = (event) => {
    event.preventDefault() // is this really helping ?
    window.localStorage.removeItem(STORE_KEY)
    setUser(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {`${user.username} logged in`}
        <button onClick={logout}>logout</button>
      </div>
      <br />
      <BlogForm addBlog={addBlog} />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    addBlog({ title, author, url }).then(() => {
      setTitle('')
      setAuthor('')
      setUrl('')
    })
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
