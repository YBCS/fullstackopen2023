const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require('jsonwebtoken')

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const user = request.user;
  if (!user) {
    response.status(401).json({ error: 'Unauthorized, token not provided' })
  }
  const body = request.body;

  if (!body.likes) {
    // should it be handled in 2 places ?
    // note: if client makes the request then there is no need but if postman makes the request then there is a need
    body.likes = 0;
  }
  if (!body.title || !body.url) {
    response.status(400).end();
    return;
  }
  const newBlog = { ...body, user: user.id };
  const blog = new Blog(newBlog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);
  if (blogToDelete && blogToDelete.user.toString() !== user.id) { // eg if root login but try to delete buda's blog
    return response.status(401).json({ error: 'please login with correct credentials' })
  }

  user.blogs = user.blogs.filter((blog) => blog.id !== request.params.id);

  await Blog.findByIdAndDelete(request.params.id);
  await user.save();
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
  });
  response.json(updatedBlog);
});

// notesRouter.get('/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

module.exports = blogsRouter;
