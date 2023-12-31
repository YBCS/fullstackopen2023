import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
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
    blogService
      .getAll()
      .then((blogs) => blogs.sort((a, b) => b.likes - a.likes))
      .then((blogs) => setBlogs(blogs))
  }, [])

  const addBlog = (newBlog) => {
    // my implementation is a lil different from the course
    blogFormRef.current.toggleVisibility()
    return blogService
      .create(newBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        notifyWith(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        )
      })
      .catch((e) => {
        notifyWith(e.response.data.error, 'error')
      })
  }

  const logout = (event) => {
    event.preventDefault() // is this really helping ?
    window.localStorage.removeItem(STORE_KEY)
    setUser(null)
  }

  const handleLike = (blog) => {
    // some blogs were created without user field
    const updatedBlog = { ...blog, user: blog.user?.id, likes: blog.likes + 1 }
    blogService
      .update(blog.id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs(
          blogs.map((blog) =>
            blog.id !== returnedBlog.id ? blog : returnedBlog
          )
        )
      })
      .catch((e) => {
        notifyWith(e.response.data.error, 'error')
      })
  }

  const handleRemove = (blog) => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      console.log('remove ', blog)
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== blog.id))
        })
        .catch((e) => {
          notifyWith(e.response?.data?.error, 'error')
        })
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {`${user.username} logged in`}
        <button onClick={logout}>logout</button>
      </div>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={() => handleLike(blog)}
          handleRemove={() => handleRemove(blog)}
          isSameAuthor={user.username === blog.user?.username}
        />
      ))}
    </div>
  )
}

export default App
