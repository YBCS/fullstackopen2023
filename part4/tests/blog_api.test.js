const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const helper = require('./test_helper')

beforeEach(async () => {
  // use for of // for each will not support promises // alt. use promises.all
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200) // supertest
    .expect("Content-Type", /application\/json/);
}, 100000);

test("unique identifier property of the blog posts is named id", async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach((blog) => expect(blog.id).toBeDefined());
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "new title ",
    author: "Author San",
    url: "http://blog.coder.com/uncle-bob.html",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const urls = blogsAtEnd.map((n) => n.url);
  expect(urls).toContain("http://blog.coder.com/uncle-bob.html");
});

// Write a test that verifies that if the likes property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet

afterAll(async () => {
  await mongoose.connection.close();
});
