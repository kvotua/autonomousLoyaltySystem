const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session"); // Подключаем модуль сессий

const app = express();
const PORT = 3000;

// Настройка базы данных
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "йцуфывячс",
    database: "users"
});

db.connect(err => {
    if (err) {
        console.error("Ошибка подключения к базе данных:", err);
        return;
    }
    console.log("Успешное подключение к базе данных!");
});

// Настройка сессий
app.use(
    session({
        secret: "my_secret_key", // Ключ шифрования сессий
        resave: false,
        saveUninitialized: true
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Установка greet.html как стартовой страницы
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "greet.html"));
});

app.get("/registration", (req, res) => {
    res.sendFile(path.join(__dirname, "registration.html"));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "profile.html"));
});


// Маршрут для сохранения номера телефона
app.post("/confirm-phone", (req, res) => {
    const { phone, smsCode } = req.body;

    if (!phone || !smsCode) {
        return res.status(400).send("Необходимо ввести номер телефона и код");
    }

    // Сохраняем номер телефона в сессии
    req.session.phone = phone;

    // Перенаправляем на страницу без расширения .html
    res.redirect("/registration");
});

// Обработка формы регистрации
app.post("/submit", (req, res) => {
    const { first, second, third, bday, gender } = req.body;
    const phone = req.session.phone; // Получаем номер телефона из сессии

    if (!phone) {
        return res.status(400).send("Номер телефона не найден");
    }

    const checkUserSql = `SELECT * FROM users WHERE phone = ?`;
    db.query(checkUserSql, [phone], (err, results) => {
        if (err) {
            console.error("Ошибка при проверке данных:", err);
            res.status(500).send("Ошибка при проверке данных");
            return;
        }

        if (results.length > 0) {
            // Пользователь уже существует, сохраняем ID в сессии
            req.session.userId = results[0].id;
            console.log("Пользователь найден, переходим к профилю:", results[0]);
            res.redirect("/profile");
        } else {
            // Если пользователя нет, добавляем новую запись
            const insertUserSql = `INSERT INTO users (first, second, third, bday, gender, phone, balance, discount)
                                   VALUES (?, ?, ?, ?, ?, ?, 0, 10)`;
            db.query(insertUserSql, [first, second, third, bday, gender, phone], (err, result) => {
                if (err) {
                    console.error("Ошибка при добавлении данных:", err);
                    res.status(500).send("Ошибка при добавлении данных");
                } else {
                    // Сохраняем ID нового пользователя в сессии
                    req.session.userId = result.insertId;
                    console.log("Новый пользователь создан:", result.insertId);
                    res.redirect("/profile");
                }
            });
        }
    });
});

// API для получения данных профиля
app.get("/api/profile", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("Пользователь не авторизован");
    }

    const sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error("Ошибка при получении данных из базы:", err);
            res.status(500).send("Ошибка сервера");
        } else if (results.length === 0) {
            res.status(404).send("Пользователь не найден");
        } else {
            const user = results[0];
            const formattedDate = new Date(user.bday)
                .toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                });
            user.bday = formattedDate; // Форматируем дату для отправки
            res.json(user); // Возвращаем данные профиля в формате JSON
        }
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
