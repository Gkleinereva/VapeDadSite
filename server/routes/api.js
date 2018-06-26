const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.post('/addComic', controller.AddComic);

router.get('/getLatest', controller.GetLatest);

router.get('/comic/:comicNum', controller.GetComic);

router.get('/list', controller.GetComicNumberList);

router.get('/adminList', controller.GetComicAdminData);

module.exports = router;