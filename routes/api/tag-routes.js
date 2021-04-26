const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagsData = await Tag.findAll(
      {
        include: [
          { model: Product }
        ]
      });
    const tags = tagsData.map((tag) => tag.get({ plain: true }));
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // checks if tag exists before updating
    const foundTag = await Tag.findByPk(req.params.id);

    if (!foundTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const updatedTag = await Tag.update(
      req.body,
      {
        where: { id: req.params.id }
      }
    );
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    // checks if tage exists before deleting
    const foundTag = await Tag.findByPk(req.params.id);

    if (!foundTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    const deletedTag = await Tag.destroy(
      {
        where: { id: req.params.id }
      }
    );
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
