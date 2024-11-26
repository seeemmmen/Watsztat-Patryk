const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Middleware для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Статические файлы (например, ваш HTML)
app.use(express.static(__dirname));

// Обработка POST-запроса с формы
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send("Пожалуйста, заполните все поля.");
  }

  // Настройка Nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true, // Или другой сервис, например, Outlook
    auth: {
      user: "rotbartsemen@zohomail.eu", // Ваш email
      pass: "Parol2017",    // Ваш пароль или токен
    },
  });

  const mailOptions = {
    from: "rotbartsemen@zohomail.eu",
    to: "rotbartsemen@zohomail.eu", // Email, куда отправлять сообщения
    subject: "Warsztat",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
      <p><strong>Imié:</strong> ${name}</p>
      <p><strong>Mail:</strong> ${email}</p>
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
    res.status(500).json({ error: "Nie udało się wysłać wiadomości." });
}
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
