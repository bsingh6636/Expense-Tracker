const db = require("../models");
const logger = require("../utils/logger");

const getAlCategories = async () =>{
    try {
       const query = 'SELECT name , icon ,id from categories;' 
       const [res ]= await  db.sequelize.query(query)
       return { success : true , data : res };
    } catch (error) {
        logger.error(error, 'getAllCategories');
        return error;
    }
}

module.exports = {
    getAlCategories
}