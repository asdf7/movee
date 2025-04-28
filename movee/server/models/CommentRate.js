const {Schema, model} = require('mongoose');

const CommentRate = new Schema({
    commentID: {type: String, required: true},
    userID: {type: String, required: true},
    status: {type: String, required: true},
})

module.exports = model('CommentRate', CommentRate);