const express = require('express');
const router = express.Router();
const {getMenu,addMenuItem,updateMenuItem,deleteMenuItem} =require('../controllers/menuController');
router.get('/menu',getMenu,);
router.post('/menu',addMenuItem);
router.put('/menu/:id',updateMenuItem);
router.delete('/menu/:id',deleteMenuItem);
module.exports = router;