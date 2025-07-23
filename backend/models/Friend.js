const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Friend extends Model {
        static associate(models) {
            Friend.hasMany(models.Expense,{
                foreignKey: 'friendId',
                as: 'expenses'
            } )
        }
    }
    Friend.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Friend',
        tableName: 'friends'
    })
    return Friend
}