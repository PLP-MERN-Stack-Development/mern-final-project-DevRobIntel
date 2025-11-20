import Category from '../models/Category.js';

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).select('name');
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const existingCategory = await Category.findOne({ 
      name: name.toUpperCase().trim() 
    });
    
    if (existingCategory) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    const category = new Category({ name: name.toUpperCase().trim() });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export default {
  getCategories,
  createCategory
};