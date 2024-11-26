<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получение данных из формы
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Проверка, что поля заполнены
    if (!empty($name) && !empty($email) && !empty($message)) {
        // Настройки письма
        $to = "rotbartsemen@gmail.com"; // Укажите здесь ваш email
        $subject = "Новое сообщение с формы обратной связи";
        $body = "Имя: $name\nEmail: $email\nСообщение:\n$message";

        // Заголовки письма
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";

        // Отправка письма
        if (mail($to, $subject, $body, $headers)) {
            echo "Сообщение успешно отправлено!";
        } else {
            echo "Ошибка при отправке сообщения. Попробуйте позже.";
        }
    } else {
        echo "Пожалуйста, заполните все поля формы.";
    }
} else {
    echo "Некорректный метод отправки данных.";
}
?>
