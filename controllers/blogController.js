const Blog = require('../models/Blog');
const logger = require('../utils/logger');

exports.getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, state, author, title, tags, sortBy, order = 'desc' } = req.query;
        const query = { state: 'published' };

        if (state) query.state = state;
        if (author) query.author = new RegExp(author, 'i');
        if (title) query.title = new RegExp(title, 'i');
        if (tags) query.tags = { $in: tags.split(',') };

        const blogs = await Blog.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('author', 'first_name last_name email');

        res.json(blogs);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
        if (!blog || blog.state !== 'published') {
            return res.status(404).json({ message: 'Blog not found' });
        }
        blog.read_count += 1;
        await blog.save();
        res.json(blog);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, description, tags, body } = req.body;
        const blog = new Blog({ title, description, tags, body, author: req.user._id });
        await blog.save();
        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        Object.assign(blog, req.body);
        await blog.save();
        res.json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await blog.remove();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.publishBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        blog.state = 'published';
        await blog.save();
        res.json({ message: 'Blog published successfully', blog });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id });
        res.json(blogs);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
