document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
        loginContainer.classList.add('visible');
    }

    const registerContainer = document.querySelector('.register-container');
    if (registerContainer) {
        registerContainer.classList.add('visible');
    }
});

document.querySelector('.register-form').addEventListener('submit', async (e) => {
    event.preventDefault();

    const email = document.querySelector('.register-email').value;
    const password = document.querySelector('.register-password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error('Error');
        }
    }
    catch (error) {
        console.error(error);
    }
});

document.querySelector('.switch-to-register').addEventListener('click', () => {
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');
    loginContainer.style.transform = 'translateY(-100%)';
    registerContainer.style.transform = 'translateY(-100%)';
});

function toggleForm() {
    document.querySelector('.container').classList.toggle('active');
}