const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Enables us to restrict API routes to authenticated users
const jwt = require('express-jwt');
const config = require('../users/config.js');
const auth = jwt({
	secret: config.SECRET,
	
	// Tells express-jwt to store the JWT in the payload property on the req object
	userProperty: 'payload'
});

router.post('/login', controller.Login);

// Now this route will only be available to authenticated users
router.post('/addComic', auth ,controller.AddComic);

router.get('/getLatest', controller.GetLatest);

router.get('/comic/:comicNum', controller.GetComic);

router.get('/list', controller.GetComicNumberList);

router.get('/adminList', auth ,controller.GetComicAdminData);

router.delete('/comic/:comicNum', auth, controller.DeleteComic);

module.exports = router;