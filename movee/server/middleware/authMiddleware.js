//Middleware для проверки на авторизованность
const jwt = require('jsonwebtoken'); //Экспорт модуля для расшифровки токена
const {secret} = require('../config'); //Экспорт секретного ключа из отдельного файла, нужного для валидации токена

module.exports = function (req, res, next) {
    if (req.method ===  "OPTIONS") { //?
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; //Получение токена из запроса
        if (!token) { //Если токена нет
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData; //В заросе создает новое поле user и туда добавляются данные из токена (идентификатор и роли)
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован"});
    }
};