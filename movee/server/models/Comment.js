const {Schema, model} = require('mongoose');

const Comment = new Schema({
    movieID: {type: String, required: true},
    userID: {type: String, required: true},
    username: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: String, required: true},
    likes: {type: String, required: true},
    dislikes: {type: String, required: true}
})

module.exports = model('Comment', Comment);