const {Schema, model} = require('mongoose');

const Item = new Schema({
    playlistID: {type: String, required: true},
    movieID: {type: String, required: true}
})

module.exports = model('Item', Item);