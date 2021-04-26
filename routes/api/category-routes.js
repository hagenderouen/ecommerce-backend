const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all Categories
router.get('/', async (req, res) => {
  
  try {
    const categoryData = await Category.findAll({
      include: [
        { model: Product }
      ]
    });
    const categories = categoryData.map((category) => category.get({ plain: true }));
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }

});

// GET Category by id
router.get('/:id', async (req, res) => {
  
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    });
    
    if (!categoryData) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const category = categoryData.get({ plain: true });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }

});

// POST new Category 
router.post('/', async (req, res) => {
  
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }

});

// PUT update Category by id
router.put('/:id', async (req, res) => {
  
  try {

    const foundUpdatedCatData = await Category.findByPk(req.params.id);

    if (!foundUpdatedCatData) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const foundCat = foundUpdatedCatData.get({ plain: true });
    
    await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: { id: foundCat.id }
      }
    );

    const updatedCatData = await Category.findByPk(foundCat.id);
    const updatedCat = updatedCatData.get({ plain: true });
    
    res.status(200).json(updatedCat);
  } catch (err) {
    res.status(500).json(err);
  }

});

// DELETE Category by id. Deletes associated Products
router.delete('/:id', async (req, res) => {
  
  try {
    const foundCatData = await Category.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    });

    if (!foundCatData) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const foundCat = foundCatData.get({ plain: true });
    
    await foundCat.products.forEach(product => {
      Product.destroy({ where: { id: product.id } });
    });
    
    await Category.destroy({ 
      where: { id: foundCat.id }
    });
    res.status(200).json(foundCat);
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
