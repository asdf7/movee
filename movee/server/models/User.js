//Схема того как выглядит сущность пользователя в базе данных
const {Schema, model} = require('mongoose');

const User = new Schema({ //Схема, описывающая то, как пользователь будет храниться в базе данных
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}] //ref: 'Role' - это ссылка на другую сущность
})

module.exports = model('User', User); //Экспорт модели, созданной на основе схемы