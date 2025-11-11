const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const authAlbum = require('../middleware/auth');

router.get('/getAll', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbumById);
router.get('/artist/:artistId', albumController.getAlbumsByArtist);

router.post('/create', authAlbum, albumController.createAlbum);

router.put('/update/:id', authAlbum, albumController.updateAlbum);

router.delete('/delete/:id', authAlbum, albumController.deleteAlbum);

module.exports = router;