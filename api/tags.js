const { post } = require('curl');
const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log('A request is being made to /tags');

  next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;

  try {
    // use our method to get posts by tag name from the db
    const posts = await getPostsByTagName(tagName);
    // send out an object to the client { posts: // the posts }
    res.send({ posts: posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

tagsRouter.get('/', async (req, res) => {
  try {
    const allTags = await getAllTags();

    const tags = allTags.filter((tag) => {
      return tag.active || (req.user && tag.author.id === req.user.id);
    });
    res.send({
      tags,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
