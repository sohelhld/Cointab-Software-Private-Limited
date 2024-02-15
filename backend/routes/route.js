const express = require('express');
const router = express.Router();
const axios = require('axios');
const { userModel } = require('../modules/user.model');
const { postModel } = require('../modules/post.model');

router.get('/all', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = response.data;
    res.render('home', { users });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/add', async (req, res) => {
  try {
    const user = req.body;
    await userModel.create(user);
    res.redirect('/users/all');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = response.data;
    res.render('post', { posts });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/bulk-add/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = req.body;
    await postModel.create(posts);
    res.redirect(`/users/posts/${userId}`);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/download/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await postModel.find({ userId });
    const fields = ['userId', 'title', 'body'];
    const opts = { fields };
    const csv = json2csv(posts, opts);
    const filePath = `./downloads/user_${userId}_posts.csv`;
    fs.writeFileSync(filePath, csv);
    res.download(filePath);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
