const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.get('/create', bookController.book_create_get);
router.get('/', bookController.book_index);
router.post('/', bookController.book_create_post);
router.get('/:id', bookController.book_details);
router.get('/:id/edit', bookController.book_edit_get);
router.post('/:id', bookController.book_edit_post);
router.delete('/:id', bookController.book_delete);

module.exports = router;