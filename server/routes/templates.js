const express = require('express');
const router = express.Router();
const { getTemplates, getTemplate, getCategories } = require('../controllers/templateController');

// GET /api/templates/categories — must be before /:id
router.get('/categories', getCategories);

// GET /api/templates
router.get('/', getTemplates);

// GET /api/templates/:id
router.get('/:id', getTemplate);

module.exports = router;
