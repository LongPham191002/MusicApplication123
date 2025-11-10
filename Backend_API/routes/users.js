const express = require('express');
const router = express.Router();
const con = require('../db/connection');
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/avatars/' });


router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/:id/avatar', auth, upload.single('avatar'), usersController.uploadAvatar);
router.post('/request-password-reset', usersController.requestPasswordReset);
router.post('/reset-password', usersController.resetPassword);


router.get('/me', auth,usersController.me);
router.get('/getAll', usersController.getAllUser);
router.get('/:id', auth, usersController.getUserById);

router.put('/:id', auth, usersController.updateProfile);
router.put('/:id/password', auth, usersController.changePassword);


router.delete('/:id', auth, usersController.deleteUser);




module.exports = router;