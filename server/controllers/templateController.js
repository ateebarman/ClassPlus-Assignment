const Template = require('../models/Template');

// GET /api/templates
const getTemplates = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [templates, total] = await Promise.all([
      Template.find(filter)
        .sort({ usageCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Template.countDocuments(filter),
    ]);

    res.json({ templates, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/templates/:id
const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).lean();
    if (!template) return res.status(404).json({ message: 'Template not found' });

    // Increment usage
    Template.findByIdAndUpdate(req.params.id, { $inc: { usageCount: 1 } }).exec();

    res.json({ template });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/templates/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Template.distinct('category');
    res.json({ categories: ['All', ...categories] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTemplates, getTemplate, getCategories };
