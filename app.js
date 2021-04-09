const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://admin:admin@cluster0.o4cmt.mongodb.net/bookshelf?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/books');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// book routes
app.use('/books', bookRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});