const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost/Blogbook');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// TEST BLOG
// Blog.create({
//   title: 'Test Blog',
//   image: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=633',
//   body: 'Hello, this is a blog post'
// });

// RESTful routes
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => (err) ? console.log(err) : res.render('index', { blogs: blogs }));
});

// New Route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Create Route
app.post('/blogs', (req, res) => {
  Blog.create(req.body.blog, (err, newBlog) => (err) ? console.log(err) : res.redirect('/blogs'));
});

// Show Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => (err) ? console.log(err) : res.render('show', { foundBlog: foundBlog }));
});

app.get('/blogs/:id/edit', (req, res) => {
  res.send('This is a get request');
});

app.put('/blogs/:id', (req, res) => {
  res.send('This is a put request');
});

app.delete('/blogs/:id', (req, res) => {
  res.send('This is a DELETE request');
});

app.listen(3000, () => console.log(`Listening on port 3000`));
