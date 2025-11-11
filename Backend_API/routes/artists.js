const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const authArtist = require('../middleware/auth');


router.get('/getAll', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.get('/:id/songs', artistController.getArtistSongs);

router.post('/verify/:id', authArtist, artistController.verifyArtist);
router.post('/register', authArtist, artistController.registerArtist);

router.put('/:id', authArtist, artistController.updateArtistProfile);


module.exports = router