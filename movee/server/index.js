const express = require('express'); //Сервер
const mongoose = require('mongoose'); //MongoDB ODM
const authRouter = require('./authRouter'); //Маршруты, по которым будут отправляться запросы
const PORT = process.env.PORT || 5000
const cors = require('cors');

const app = express()

app.use(cors());

app.use(express.json()); //Чтобы сервер мог парсить JSON
app.use("/auth", authRouter); //Прослушка роутера


const start = async () => {
    try {
        await mongoose.connect(``); //Подключение к базе данных
        app.listen(PORT, () =>  console.log(`server started on port ${PORT}`)); //Прослушка порта 5000
    } catch (e) {
        console.log(e);
    }
}

start();