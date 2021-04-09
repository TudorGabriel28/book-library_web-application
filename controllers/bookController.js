const Book = require('../models/book');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const book_index = (req, res) => {
  
  //Sortby Button handler
  if(!req.query.sortby) {
    var sortCriteria = "createdAt";
  } else {
    var sortCriteria = req.query.sortby;
  }

  //Check if a category is pressed
  if(!req.query.category) {
    var filterCriteria = {};
  } else {
    var filterCriteria = {category: req.query.category};
  }

  //Check if it is a search or not
  if(!req.query.search) {
    Book.find(filterCriteria).collation({locale: "en" }).sort({[sortCriteria] : 1})
      .then(result => {
        res.render('index', { books: result, title: "Library", category: req.query.category, search: false});
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    var searchControl = { $or:[{title: { $regex: req.query.search, $options: "i" }}, {author: { $regex: req.query.search, $options: "i" }}, {category: { $regex: req.query.search, $options: "i" }}]};
    Book.find(searchControl).sort({[sortCriteria] : 1})
      .then(result => {
        res.render('index', { books: result, category: req.query.category, search: true});
      })
      .catch(err => {
        console.log(err);
      });
  }
  
}


const book_details = (req, res) => {
  const id = req.params.id;
  Book.findById(id)
  .then(result => {
    res.render('details', { book: result, title: 'Book Details' });
  })
  .catch(err => {
    console.log(err);
  });
}

const book_create_get = (req, res) => {
  res.render('create', { title: 'Create a new book' });
}

const book_create_post = (req, res) => {
  const book = new Book(req.body);
  saveCover(book, req.body.cover)
  book.save()
    .then(result => {
      res.redirect('/books');
    })
    .catch(err => {
      console.log(err);
    });
  
}

const book_edit_get = (req, res) => {
  const id = req.params.id;
  Book.findById(id)
    .then(result => {
      res.render('edit', { book: result, title: 'Edit Book' });
    })
    .catch(err => {
      console.log(err);
    });
}

const book_edit_post = (req, res) => {
  const id = req.params.id;
  
  Book.findByIdAndUpdate(id, req.body)
    .then(result => {
      res.redirect('/books');
    })
    .catch(err => {
      console.log(err);
    });
}

const book_delete = (req, res) => {
  const id = req.params.id;
  Book.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/books' });
    })
    .catch(err => {
      console.log(err);
    });
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}


module.exports = {
  book_index, 
  book_details, 
  book_create_get, 
  book_create_post, 
  book_delete,
  book_edit_get,
  book_edit_post
}