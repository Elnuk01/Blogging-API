const express = require('express');
const {
    getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, publishBlog, getUserBlogs
} = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.put('/:id/publish', protect, publishBlog);
router.get('/user/:id/blogs', protect, getUserBlogs);

module.exports = router;
