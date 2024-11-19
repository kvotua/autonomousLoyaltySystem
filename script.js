document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const submitBtn = document.querySelector('.submit');
    const errorMessage = document.getElementById('error-message');
    const correctPhoneBtn = document.querySelector('.cancel-button');
    const phoneNumberDiv = document.querySelector('.phone-number');

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const firstName = document.getElementById('first').value.trim();
        const lastName = document.getElementById('second').value.trim();
        const birthDay = document.getElementById('bday').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const gender = document.querySelector('input[name="gender"]:checked');
        const agree = document.getElementById('agree').checked;

        if (firstName && lastName && birthDay && phone && gender && agree) {
            errorMessage.classList.add('hidden');
            errorMessage.classList.remove('visible');

            phoneNumberDiv.textContent = phone;

            popup.classList.remove('hidden');
        } else {
            errorMessage.textContent = 'Пожалуйста, заполните все обязательные поля.';
            errorMessage.classList.add('visible');
            errorMessage.classList.remove('hidden');
        }
    });

    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            popup.classList.add('hidden');
        }
    });

    correctPhoneBtn.addEventListener('click', function () {
        popup.classList.add('hidden');
    });
});
