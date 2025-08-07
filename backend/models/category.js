const { Model } = require('sequelize');


module.exports = ( sequelize, Datatypes ) =>{
    class category extends Model{
        static associate(models){
            category.hasMany(models.Expense,{
                foreignKey : 'categoryId'
            });
        }
    }

    category.init({
        id: {
            type : Datatypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name : {
            type : Datatypes.STRING,
            allowNull: false,
            unique : true,
        },
        icon : {
            type : Datatypes.STRING,
            allowNull: true,
        },
    },{
        sequelize,
        modelName: 'category',
        tableName: 'categories',
        timestamps : true
    }
)

    return category;
}