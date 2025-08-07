
const express = require('express');
const { getAlCategories } = require('../controllers/category');

const router = express.Router();

router.get('/', async ( req , res ) =>{
    const data = await getAlCategories();
    res.json(data);
} )

module.exports = router;