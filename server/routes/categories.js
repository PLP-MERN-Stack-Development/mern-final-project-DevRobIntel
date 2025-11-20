import express from 'express';
import { body, validationResult } from 'express-validator';
import categoryController from '../controllers/categoryController.js';  // Default import

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be 2-50 characters')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  categoryController.createCategory
);

export default router;