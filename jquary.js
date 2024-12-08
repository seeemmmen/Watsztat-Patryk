$(document).ready(function() {
    // Открытие окна логина
    $("#open").click(function() {
        $("#loginModal").fadeIn();
    });

    // Закрытие модального окна
    $(".close").click(function() {
        $(this).closest('.modal').fadeOut();
    });

    // Показать форму регистрации
    $("#show-register").click(function(e) {
        e.preventDefault();
        $("#loginModal").fadeOut(function() {
            $("#registrationModal").fadeIn();
        });
    });

    // Показать форму логина
    $("#show-login").click(function(e) {
        e.preventDefault();
        $("#registrationModal").fadeOut(function() {
            $("#loginModal").fadeIn();
        });
    });

    // Обработка логина
    $("#login-form").submit(function(event) {
        event.preventDefault();
        const username = $("#login-username").val();
        const password = $("#login-password").val();

        // AJAX-запрос для логина
        $.ajax({
            url: '/api/login', // URL для обработки логина
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                $("#login-responseMessage").text(response.message);
            },
            error: function(xhr, status, error) {
                $("#login-responseMessage").text('Ошибка: ' + error);
            }
        });
    });

    // Обработка регистрации
    $("#registration-form").submit(function(event) {
        event.preventDefault();
        const username = $("#username").val();
        const email = $("#email").val();
        const password = $("#password").val();

        // AJAX-запрос для регистрации
        $.ajax({
            url: '/api/register', // URL для обработки регистрации
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, password }),
            success: function(response) {
                $("#responseMessage").text(response.message);
            },
            error: function(xhr, status, error) {
                $("#responseMessage").text('Ошибка: ' + error);
            }
        });
    });
});
