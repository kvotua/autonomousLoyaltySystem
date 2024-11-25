const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "йцуфывячс",
    database: "users"
});

db.connect(err => {
    if (err) {
        console.error("Ошибка подключения к базе:", err);
        return;
    }
    console.log("Успешное подключение к базе данных!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "autonomousLoyaltySystem")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "autonomousLoyaltySystem", "index.html"));
});

app.post('/submit', (req, res) => {
    const { first, second, third, bday, gender, phone } = req.body;

    if (!first || !second || !bday || !gender || !phone) {
        return res.status(400).send('Пожалуйста, заполните все обязательные поля.');
    }

    const sql = `INSERT INTO users (first, second, third, bday, gender, phone, balance, discount)
                 VALUES (?, ?, ?, ?, ?, ?, 0, 5)`;
    db.query(sql, [first, second, third, bday, gender, phone], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении данных:', err);
            res.status(500).send('Ошибка сервера');
        } else {
            res.redirect(`/profile?phone=${phone}`);
        }
    });
});


app.get("/profile", (req, res) => {
    const phone = req.query.phone.trim();

    const sql = `SELECT * FROM users WHERE phone = ?`;
    db.query(sql, [phone], (err, results) => {
        if (err) {
            console.error("Ошибка при получении данных из базы:", err);
            res.status(500).send("Ошибка сервера");
        } else if (results.length === 0) {
            res.status(404).send(`Пользователь с номером ${phone} не найден`);
        } else {
            const user = results[0];
            const bday = new Date(user.bday);
            const formattedDate = `${bday.getDate().toString().padStart(2, '0')}.${(bday.getMonth() + 1)
                .toString()
                .padStart(2, '0')}.${bday.getFullYear()}`;

            res.send(`
                <!DOCTYPE html>
                <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Профиль</title>
                    <link rel="stylesheet" href="profile.css">
                </head>
                <body>
                    <div class="profile-container">
                        <div class="header">
                            <div class="FIO">
                                <span>${user.first}</span>
                                <span>${user.second}</span>
                                <span>${user.third || ""}</span>
                            </div>
                            <div class="phone-number">Телефон: ${user.phone}</div>
                            <div class="bday">Дата рождения: ${formattedDate}</div>
                            <div class="discount">Скидка: ${user.discount}%</div>
                        </div>
                        <div class="balance">
                            <p>Баланс: ${user.balance} р</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }
    });
});



app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
