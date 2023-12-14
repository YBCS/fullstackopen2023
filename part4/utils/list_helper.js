const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  return blogs.reduce(reducer, 0);
};

const mostLikes = (blogs) => {
  let blog = _.sortBy(blogs, "likes").reverse()[0];
  return { title: blog.title, author: blog.author, likes: blog.likes };
};

// check the solution on this one
const mostBlogs = (blogs) => {
  let byAuthor = _.groupBy(blogs, "author")
  let out = null
  let mostBlogs = 0;
  for (const author in byAuthor) {
    const count = byAuthor[author].length
    if (count > mostBlogs) {
        out = {
            author: author,
            blogs: count
        }
        mostBlogs = count
    }
  }  

  return out;
};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
};
