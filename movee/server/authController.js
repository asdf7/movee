//Все функции по взаимодействию с пользователем
//Все функции принимают 2 параметра: запрос и ответ
const User = require('./models/User'); //Экспорт модели пользователя
const Role = require('./models/Role'); //Экспорт модели роли
const bcrypt = require('bcryptjs'); //Экспорт модуля для хеширования пароля
const jwt = require('jsonwebtoken'); //Экспорт модуля для использования JWT-токенов
const { validationResult } = require('express-validator'); //Экспорт функции validationResult, которая возвращает результат валидации
const {secret} = require('./config'); //Экспорт секретного ключа из отдельного файла, нужного для генерации токена
const Movie = require('./models/Movie');
const Comment = require('./models/Comment');
const Rate = require('./models/Rate');
const CommentRate = require('./models/CommentRate');
const Playlist = require('./models/Playlist');
const Item = require('./models/Item');

const {json} = require("express");

const generateAccessToken = (id, roles) => { //Создание функции для генерации access-токена, принимающая идентификатор пользователя и его роли
    const payload = { //Создание объекта payload, необходимого для создания подписи (sign) токена
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"}); //Возврат готового токена
}

class authController {
    async search(req, res) {
        try {
            const {searchQuery} = req.body;
            const movies = await Movie.find();
            const result = [...movies].filter((movie) => movie.titleRu.toLowerCase().startsWith(searchQuery.toLowerCase()));
            return res.json({result});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при поиске'});
        }
    }

    async registration(req, res) {
        try {
            const errors = validationResult(req); //Функция для валидации принимает в себя запрос и валидирует указанные в роутере поля
            if (!errors.isEmpty()) { //Если массив ошибок не пустой
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password} = req.body; //Получение имени пользователя и пароля из запроса
            const candidate = await User.findOne({username}); //Запрос на поиск в базе данных пользователя с таким именем
            if (candidate) { //Если в базе данных уже есть пользователь с таким именем
                return res.status(400).json({message: "Пользователь с таким именем уже существует"});
            }
            const hashPassword  = bcrypt.hashSync(password, 7); //Хеширование пароля
            const userRole = await Role.findOne({value: "USER"}); //Поиск в базе данных роли со значением USER
            const user = new User({username, password: hashPassword, roles: [userRole.value]}); //Создание объекта нового пользователя с использованием модели
            await user.save(); //Сохранение объекта пользователя в базе данных
            const currentUser = await User.findOne({username});
            const playlist = new Playlist({userID: currentUser._id, title: "Смотреть позже"});
            await playlist.save();
            return res.json({message: "Пользователь успешно зарегистрирован"});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при регистрации'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body; //Получение имени пользователя и пароля из запроса
            const user = await User.findOne({username}); //Запрос на поиск в базе данных пользователя с таким именем
            if (!user) { //Если в базе данных нет пользователя с таким именем
                return res.status(400).json({message: `Пользователь ${username} не найден`});
            }
            const validPassword = bcrypt.compareSync(password, user.password); //Сравнение пароля из запроса с паролем из базы данных
            if (!validPassword) { //Если пароль не совпадает с паролем из баззы данных
                return res.status(400).json({message: 'Введен неверный пароль'});
            }
            const token = generateAccessToken(user._id, user.roles); //Вызов функции для генерации токена, которая описана за классом
            const userData = {
                userID: user._id,
                username: username,
                roles: user.roles,
                token: token
            }
            return res.json({userData}); //Возвращение ответа, содержащего токен на клиент
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при авторизации'});
        }
    }

    async getMovies(req, res) {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при загрузке фильмов'});
        }
    }

    async getMovie(req, res) {
        try {
            const _id = req.params._id;
            const movie = await Movie.findOne({_id});
            res.json(movie);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при загрузке фильма'});
        }
    }

    async getComments(req, res) {
        try {
            const movieID = req.params.movieID;
            const comments = await Comment.find({movieID});
            res.json(comments);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при загрузке комментариев'});
        }
    }

    async addComment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при попытке оставить комментарий", errors});
            }
            const movieID = req.params.movieID;
            const userID = req.user.id;
            const {username, body, date} = req.body;
            const newComment = new Comment({movieID: movieID, userID: userID, username: username, body: body, date: date, likes: "0", dislikes: "0"});
            await newComment.save();
            return res.json({message: "Новый комменатий оставлен"});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при попытке оставить комментарий'});
        }
    }
    
    async removeComment(req, res) {
        try {
            const commentID = req.params._id;
            const comment = await Comment.findOne({_id: commentID});
            if (comment) {
                await Comment.deleteOne(comment);
                return res.json({message: "Комментарий успешно удален"})
            }
        } catch (e) {
            res.status(400).json({message: "Неопознанная ошибка при попытке удалить комментарий"})
        }
    }

    async getCommentRates(req, res) {
        try {
            const commentID = req.params._id;
            const rates = await CommentRate.find({commentID: commentID});
            res.json(rates);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при загрузке оценок комментариев'});
        }
    }

    async likeComment(req, res) {
        try {
            const commentID = req.params._id;
            const userID = req.user.id;
            const {status} = req.body;
            const candidate = await CommentRate.findOne({commentID: commentID, userID: userID});
            if (!candidate) {
                const like = new CommentRate({commentID: commentID, userID: userID, status: status});
                await like.save();
                return res.json({message: "Вы поставили отметку \"Нравится\" под комментарием"})
            } else {
                if (candidate.status === 'like') {
                    await CommentRate.deleteOne(candidate);
                    return res.json({message: "Вы удалили отметку \"Нравится\" под комментарием"})
                } else {
                    await candidate.updateOne({status: status})
                    return res.json({message: "Вы поставили отметку \"Нравится\" под комментарием"})
                }
            }

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Неопознанная ошибка при попытке оценить комментарий'});
        }
    }

    async dislikeComment(req, res) {
        try {const commentID = req.params._id;
            const userID = req.user.id;
            const {status} = req.body;
            const candidate = await CommentRate.findOne({commentID: commentID, userID: userID});
            if (!candidate) {
                const dislike = new CommentRate({commentID: commentID, userID: userID, status: status});
                await dislike.save();
                return res.json({message: "Вы поставили отметку \"Не нравится\" под комментарием"})
            } else {
                if (candidate.status === 'dislike') {
                    await CommentRate.deleteOne(candidate);
                    return res.json({message: "Вы удалили отметку \"Не нравится\" под комментарием"})
                } else {
                    await candidate.updateOne({status: status})
                    return res.json({message: "Вы поставили отметку \"Не нравится\" под комментарием"})
                }
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Неопознанная ошибка при попытке оценить комментарий'});
        }
    }

    async getMovieRate(req, res) {
        try {
            const movieID = req.params.movieID;
            const userID = req.user.id;
            const rate = await Rate.findOne({movieID: movieID, userID: userID});
            if (!rate) {
                return res.json({message: "Оценка не найдена"});
            } else {
                return res.json({rate});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при загрузке оценки фильма пользователем'})
        }
    }

    async rateMovie(req, res) {
        try {
            const {rate} = req.body;
            const movieID = req.params.movieID;
            const userID = req.user.id;
            const candidate = await Rate.findOne({movieID: movieID, userID: userID});
            if (!candidate) {
                const newRate = new Rate({movieID: movieID, userID: userID, value: rate});
                await newRate.save();
                return res.json({message: "Оценка добавлена"});
            } else {
                await candidate.updateOne({value: rate});
                return res.json({message: "Оценка обновлена"});
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка при попытке оценить фильм'});
        }
    }

    async getPlaylists(req, res) {
        try {
            const userID = req.params.userID;
            const playlists = await Playlist.findOne({userID: userID});
            return res.json(playlists);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка'});
        }
    }

    async addToPlaylist(req, res) {
        try {
            const {playlistID, movieID} = req.body;
            const candidate = await Item.findOne({playlistID: playlistID, movieID: movieID});
            if (!candidate) {
                const item = new Item({playlistID: playlistID, movieID: movieID});
                await item.save();
                return res.json({message: "Добавлено в \"Смотреть позже\""})
            } else {
                return res.json({message: "Вы уже добавили этот фильм в \"Смотреть позже\""})
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка'});
        }
    }

    async removeFromPlaylist(req, res) {
        try {
            const itemID = req.params._id;
            const item = await Item.findOne({_id: itemID});
            await Item.deleteOne(item);
            return res.json({message: "Удалено из \"Смотреть позже\""})
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка'});
        }
    }

    async getItems(req, res) {
        try {
            const playlistID = req.params.playlistID;
            const items = await Item.find({playlistID: playlistID});
            return res.json(items);
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Неопознанная ошибка'});
        }
    }
}

module.exports = new authController(); //Экспорт объекта класса authController