const {Schema, model} = require('mongoose')

const Rate = new Schema({
    movieID: {type: String, required: true},
    userID: {type: String, required: true},
    value: {type: String, required: true}
})

module.exports = model('Rate', Rate);