document.addEventListener('DOMContentLoaded', function () {
    const confirmBtn = document.querySelector('.submit');
    const confirmCodeButton = document.getElementById('confirm-code');

    confirmBtn.addEventListener('click', function () {
        const form = document.querySelector('.registration');
        form.submit();
    });

    confirmCodeButton.addEventListener('click', function (e) {
        e.preventDefault(); // Останавливаем стандартное поведение формы
        window.location.href = "index.html"; // Переход на страницу регистрации
    });

});
