const express = require('express');
const router = express.Router();

const personController = require('../controllers/personController');


router.get('/',personController.get);
router.get('/:id',personController.getById);
router.post('/',personController.post);
router.put('/:id',personController.put);
router.delete('/:id',personController.delete);


module.exports = router;