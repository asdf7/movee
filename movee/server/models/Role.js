//Схема того как выглядит сущность роли в базе данных
const {Schema, model} = require('mongoose');

const Role = new Schema({ //Схема, описывающая то, как роль будет храниться в базе данных
    value: {type: String, unique: true, default: "USER"}
})

module.exports = model('Role', Role); //Экспорт модели, созданной на основе схемы