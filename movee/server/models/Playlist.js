const {Schema, model} = require('mongoose');

const Playlist = new Schema({
    userID: {type: String, required: true},
    title: {type: String, required: true}
})

module.exports = model('Playlist', Playlist);