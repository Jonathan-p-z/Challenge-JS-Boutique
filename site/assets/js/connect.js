document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');
    if (loginContainer) {
        loginContainer.classList.add('visible');
    }
    if (registerContainer) {
        registerContainer.classList.add('visible');
    }
});

function toggleForm() {
    const container = document.querySelector('.container');
    if (container) {
        container.classList.toggle('active');
        console.log("Toggle active state on container");
    } else {
        console.error("Element .container introuvable");
    }
}

document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Connexion réussie:', data);
            localStorage.setItem('loginData', JSON.stringify(data));
        } else {
            const errorText = await response.text();
            console.error('Erreur lors de la connexion:', errorText);
        }
    } catch (error) {
        console.error('Exception lors de la connexion:', error);
    }
});

document.querySelector('.register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#register-email').value;
    const password = document.querySelector('#register-password').value;
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Inscription réussie:', data);
        } else {
            const errorText = await response.text();
            console.error('Erreur lors de l\'inscription:', errorText);
        }
    } catch (error) {
        console.error('Exception lors de l\'inscription:', error);
    }
});