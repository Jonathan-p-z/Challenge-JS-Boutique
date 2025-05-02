document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');

    // Rend visible les formulaires après le chargement
    if (loginContainer) {
        loginContainer.classList.add('visible');
    }
    if (registerContainer) {
        registerContainer.classList.add('visible');
    }
});

function toggleForm(form) {
    const container = document.querySelector('.container');
    if (!container) {
        return;
    }
    // Active l'affichage du formulaire d'inscription ou de connexion
    if (form === 'register') {
        container.classList.add('active-register');
    } else if (form === 'login') {
        container.classList.remove('active-register');
    }
}

const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche l'envoi classique du formulaire
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        try {
            // Envoi de la requête POST vers /login
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('loginData', JSON.stringify(data)); // Stocke les données de connexion
                window.location.href = '/accueil'; // Redirige vers la page d'accueil
            } else {
                const errorText = await response.text();
                alert(errorText); // Affiche l'erreur reçue
            }
        } catch (error) {
            alert('Erreur de connexion.');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche l'envoi classique du formulaire
        const email = document.querySelector('#register-email').value;
        const password = document.querySelector('#register-password').value;
        try {
            // Envoi de la requête POST vers /register
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const data = await response.json();
                toggleForm('login'); // Revient automatiquement au formulaire de login
                alert('Inscription réussie, connectez-vous.');
            } else {
                const errorText = await response.text();
                alert(errorText); // Affiche l'erreur reçue
            }
        } catch (error) {
            alert('Erreur d\'inscription.');
        }
    });
}
