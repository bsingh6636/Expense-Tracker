
const express = require('express');
const { getAllFriends } = require('../controllers/friend');
const router = express.Router();

router.get('/',async (  req , res  )  =>{
    const data = await getAllFriends();
    res.json(data);
})

module.exports = router;