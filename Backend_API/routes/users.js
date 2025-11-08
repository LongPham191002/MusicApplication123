const express = require('express');
const router = express.Router();
const con = require('../db/connection');
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/avatars/' });


router.post('/register', usersController.register);
router.post('/login', usersController.login);



module.exports = router;