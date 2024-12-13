const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Подключение к MongoDB
mongoose.connect("mongodb+srv://seeemmmen:Parol2017@cluster0.y8ytq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  name: String,         // Imię
  lastname: String,     // Nazwisko
  gender: String,       // Płeć
  address: String,      // Adres
  bio: String           // Biografia
});


// Middleware для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Статические файлы (например, ваш HTML)
app.use(express.static(__dirname));

app.use(express.json());

// Определение схемы пользователя

const User = mongoose.model("User", userSchema);
// Обработка POST-запроса для регистрации
// Обработка POST-запроса для регистрации
// Обработка POST-запроса для регистрации
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Otrzymane dane:', req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Proszę wypełnić wszystkie pola." });
  }

  // Проверка на существующего пользователя
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // Отправка email на ваш адрес, если email уже существует
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.eu",
      port: 465,
      secure: true,
      auth: {
        user: "rotbartsemen@zohomail.eu", // Ваш email
        pass: "Parol2017", // Ваш пароль
      },
    });

    const mailOptions = {
      from: "rotbartsemen@zohomail.eu",
      to: "rotbartsemen@zohomail.eu", // Тот же email для уведомления
      subject: "Próba rejestracji z istniejącym emailem",
      html: ` 
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
          <p><strong>Próba rejestracji z istniejącym emailem:</strong></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p style="color: #e74c3c;">Ten email jest już zarejestrowany w systemie.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Błąd podczas wysyłania emaila:", error);
    }

    return res.status(400).json({ message: "Użytkownik z takim emailem już istnieje. Proszę użyć innego emaila." });
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Сохранение пользователя
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "Użytkownik został pomyślnie zarejestrowany." });
});

// Обработка POST-запроса для логина
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Proszę wypełnić wszystkie pola." });
  }

  // Поиск пользователя
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Niepoprawny email lub hasło." });
  }

  // Проверка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Niepoprawny email lub hasło." });
  }

  // Создание токена
  const token = jwt.sign({ email: user.email }, "secret_key", { expiresIn: "1h" });
  res.status(200).json({ message: "Zalogowano pomyślnie", token });
});

// Обработка POST-запроса с формы
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Proszę wypełnić wszystkie pola." });
  }

  // Настройка Nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: "rotbartsemen@zohomail.eu",
      pass: "Parol2017",
    },
  });

  const mailOptions = {
    from: "rotbartsemen@zohomail.eu",
    to: "rotbartsemen@zohomail.eu",
    subject: "Warsztat",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
      <p><strong>Imię:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Wiadomość:</strong></p>
      <div style="padding: 10px; background: #fff; border: 1px solid #eee; border-radius: 5px;">
        ${message.replace(/\n/g, "<br>")}
      </div>
      <hr style="margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #aaa;">Warsztat.inc.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Wiadomość została wysłana pomyślnie!" });
  } catch (error) {
    console.error("Błąd podczas wysyłania emaila:", error);
    res.status(500).json({ message: "Nie udało się wysłać wiadomości." });
  }
});


// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
