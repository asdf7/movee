//Маршруты, по которым будут отправляться запросы
const Router = require('express');
const controller = require('./authController'); //Все функции по взаимодействию с пользователем
const {check} = require('express-validator'); //Экспорт middleware-функции check для валидации
const authMiddleware = require('./middleware/authMiddleware');

const router = new Router(); //Создание роутера

//Queries
router.post('/search', controller.search);

//Users
router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 3 и меньше 32 символов").isLength({min: 3, max: 32})
], controller.registration);
router.post('/login', controller.login);

//Movies
router.get('/movies', controller.getMovies);
router.get('/movies/:_id', controller.getMovie);

//Comments
router.get('/comments/:movieID', controller.getComments);
router.post('/comments/:movieID', authMiddleware, [
    check('body', "Комментарий не может быть пустым").notEmpty()
], controller.addComment);
router.delete('/comments/:_id', authMiddleware, controller.removeComment);
router.get('/comments/:_id/rates', authMiddleware, controller.getCommentRates);
router.post('/comments/:_id/like', authMiddleware, controller.likeComment); //router.post('/comments/:_id/like', authMiddleware, controller.likeComment);
router.post('/comments/:_id/dislike', authMiddleware, controller.dislikeComment); //router.post('/comments/:_id/dislike', authMiddleware, controller.dislikeComment);

//Rates
router.get('/rates/:movieID', authMiddleware, controller.getMovieRate);
router.post('/rates/:movieID', authMiddleware, controller.rateMovie);

//Playlists
router.get('/playlists/:userID', authMiddleware, controller.getPlaylists);
router.get('/items/:playlistID', authMiddleware, controller.getItems);
router.post('/items', authMiddleware, controller.addToPlaylist);
router.delete(`/items/:_id`, authMiddleware, controller.removeFromPlaylist);

module.exports = router; //Чтобы роутер можно было импортировать