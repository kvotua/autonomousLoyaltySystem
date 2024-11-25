document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const submitBtn = document.querySelector('.submit');
    const confirmBtn = document.querySelector('.confirm-button');
    const fixBtn = document.querySelector('.cancel-button');

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        popup.classList.remove('hidden');
    });

    confirmBtn.addEventListener('click', function () {
        const form = document.querySelector('.registration');
        form.submit();
    });

    fixBtn.addEventListener('click', function () {
        popup.classList.add('hidden');
    });
});
