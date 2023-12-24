import { useState } from 'react'

const Blog = ({ blog, isCurrentUser }) => {
  // NOTE : check solution
  const [showAll, setShowALl] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowALl(!showAll)}>
          {showAll ? 'hide' : 'view'}
        </button>
      </div>
      {showAll && (
        <div>
          <div>{blog.url}</div>
          <div>
            {`likes ${blog.likes} `}
            <button>like</button>
          </div>
          {isCurrentUser && <div>{blog.user.username}</div>}
        </div>
      )}
    </div>
  )
}

export default Blog
