const {Schema, model} = require('mongoose');

const Movie = new Schema({
    titleRu: {type: String, unique: true, required: true},
    titleEn: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    year: {type: String, required: true},
    pg: {type: String, required: true},
    country: {type: String, required: true},
    genre: {type: String, required: true},
    director: {type: String, required: true},
    actors: {type: String, required: true},
    time: {type: String, required: true},
    imdb: {type: String, required: true},
    kinopoisk: {type: String, required: true},
    img: {type: String, required: true}
})

module.exports = model('Movie', Movie);