const db = require("../models");
const logger = require("../utils/logger");

const getAllFriends = async ()  =>{
    try {
        const friends = await db.Friend.findAll();
        return friends;
    } catch (error) {
      logger.error('Error fetching friends:', error);  
      return error;
    }
}

module.exports = {
    getAllFriends
}