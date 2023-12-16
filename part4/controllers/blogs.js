const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

// because of express-async-errors we don't need to wrap async functions in try-catch blocks

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const user = await User.findById(body.userId);

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
  await Blog.findByIdAndDelete(request.params.id);
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
