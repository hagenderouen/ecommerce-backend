const router = require('express').Router();
const { Category, Product } = require('../../models');


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

router.get('/:id', async (req, res) => {
  
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    });
    const category = categoryData.get({ plain: true });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.post('/', async (req, res) => {
  
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }

});

// TODO: doesn't return updated row
router.put('/:id', async (req, res) => {
  
  try {
    const updatedCat = await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: { id: req.params.id },
        returning: true,
        plain: true
      }
    );
    res.status(200).json(updatedCat);
  } catch (err) {
    res.status(500).json(err);
  }

});

// TODO: doesn't return deleted Cat
router.delete('/:id', async (req, res) => {
  
  try {
    const deletedCat = await Category.destroy({ 
      where: { id: req.params.id },
      returning: true,
      plain: true
    });
    res.status(200).json(deletedCat);
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
