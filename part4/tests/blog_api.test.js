const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const newBlog = {
  title: "new title ",
  author: "Author San",
  url: "http://blog.coder.com/uncle-bob.html",
  likes: 2,
};

beforeEach(async () => {
  // use for of // for each will not support promises // alt. use promises.all
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
  console.log("before each done");
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200) // supertest
    .expect("Content-Type", /application\/json/);
}, 100000);

test("unique identifier property of the blog posts is named id", async () => {
  const blogs = await helper.blogsInDb();
  blogs.forEach((blog) => expect(blog.id).toBeDefined());
});

describe("addition of a new blog", () => {
  beforeEach(async () => { /* create user */
    await User.deleteMany({});
    await api.post("/api/users").send({ username: "root", password: "sekret" });
  });

  test("a valid blog can be added ", async () => {
    const user = await api.post("/api/login").send({ username: "root", password: "sekret" });
    const token = user.body.token;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const urls = blogsAtEnd.map((n) => n.url);
    expect(urls).toContain("http://blog.coder.com/uncle-bob.html");
  });

  test("a blog saved without like has to default to 0 likes", async () => {
    const blog = {
      title: "new title ",
      author: "Author San",
      url: "http://blog.coder.com/uncle-bob.html",
    };
    const blogObject = new Blog(blog);
    const saved = await blogObject.save();
    expect(saved.likes).toBe(0);
  });

  test("a blog cannot be created without title or url", async () => {
    const newBlog = {
      title: "no title or url ",
      author: "Author San",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

// NOTE: please check the model solution for this test
describe("deletion of a blog", () => {
  beforeEach(async () => { /* create user and a blog */
    await Blog.deleteMany({});
    await User.deleteMany({});
    await api.post("/api/users").send({ username: "root", password: "sekret" });
    const user = await api.post("/api/login").send({ username: "root", password: "sekret" });
    const token = user.body.token;
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);    
  }, 100000);

  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const user = await api.post("/api/login").send({ username: "root", password: "sekret" });
    const token = user.body.token;
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const urls = blogsAtEnd.map((r) => r.url);

    expect(urls).not.toContain(blogToDelete.url);
  });
});

describe("update a blog", () => {
  test("by updating likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = {
      ...blogsAtStart[0],
      likes: blogsAtStart[0].likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);
    const blogsAtEnd = await helper.blogsInDb();

    const updated = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    expect(updated.likes).toBe(blogsAtStart[0].likes + 1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
