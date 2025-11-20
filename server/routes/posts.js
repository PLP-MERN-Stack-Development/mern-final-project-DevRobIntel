import express from 'express';
import postController from '../controllers/postController.js';  // Default import
import { validatePost } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';   // ← curly braces!
const router = express.Router();

// CORRECT: postController.getPosts (from default export object)
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.post('/', validatePost, postController.createPost);
router.put('/:id', validatePost, postController.updatePost);
router.delete('/:id', postController.deletePost);

// Like
router.post('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.user.id)) {
    post.likes.push(req.user.id);
    await post.save();
    // Emit Socket.IO event (see Step 1.3)
    req.io.to(post.userId.toString()).emit('newLike', { postId: post._id, userId: req.user.id });
  }
  res.json(post);
});

// Comment
router.post('/:id/comment', auth, async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.id);
  post.comments.push({ userId: req.user.id, content, createdAt: new Date() });
  await post.save();
  const comment = post.comments[post.comments.length - 1];
  req.io.to(post.userId.toString()).emit('newComment', comment);
  res.json(comment);
});

export default router;