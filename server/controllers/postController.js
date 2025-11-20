import Post from '../models/Post.js';

const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find()
      .populate('category', 'name')
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Post.countDocuments();
    
    res.json({ 
      posts, 
      total, 
      page: parseInt(page), 
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category', 'name');
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = new Post(req.body);
    await post.save();
    await post.populate('category', 'name');
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('category', 'name');
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json({ msg: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};