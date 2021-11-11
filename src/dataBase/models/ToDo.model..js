const Sequelize = require('sequelize');
const { sequelize } = require('..');
const User = require('./User.model');
const Token = require('./Token.model');


class ToDo extends Sequelize.Model {}

ToDo.init(
    {
        id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4
        },
        title: {
            type: Sequelize.STRING,
            defaultValue: 'Title',
        },
        description:{
            type: Sequelize.STRING
        },
        isDone: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        isFavourite: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        priority: {
            type: Sequelize.INTEGER
        }
    },
    { sequelize: sequelize, underscored: true, modelName: 'todo' }
);

ToDo.belongsTo(User,{
    foreignKey: 'UserId',
});

User.hasMany(ToDo);

User.hasMany(Token);

Token.belongsTo(User,{
        foreignKey: 'userId',
    });

module.exports = ToDo;
