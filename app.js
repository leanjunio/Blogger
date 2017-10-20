const express = require('express');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost/Blogbook');

app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

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
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log('=========');
  console.log(req.body);
  Blog.create(req.body.blog, (err, newBlog) => (err) ? console.log(err) : res.redirect('/blogs'));
});

// Show Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => (err) ? console.log(err) : res.render('show', { foundBlog: foundBlog }));
});

// Edit Route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => (err) ? console.log(err) : res.render('edit', {blog: foundBlog}));
});

// Update the route
app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => (err) ? console.log(err) : res.redirect(`/blogs/${req.params.id}`))
});

// Delete
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => (err) ? console.log(err) : res.redirect(`/blogs`));
});

app.listen(3000, () => console.log(`Listening on port 3000`));
