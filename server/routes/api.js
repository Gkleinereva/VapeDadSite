const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/addComic', controller.AddComic);

module.exports = router;