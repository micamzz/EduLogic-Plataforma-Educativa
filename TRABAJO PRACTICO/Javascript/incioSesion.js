
// Función auxiliar que contiene la lógica central
export function iniciarLogin(redirectUrl) {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[name="mail"]').value;
        const passwordInput = this.querySelector('input[name="password"]').value;

        const storedUser = localStorage.getItem('currentUser');

        if (!storedUser) {
            alert('No hay cuentas registradas. Por favor, regístrate.');
            return;
        }

        const user = JSON.parse(storedUser);

        // Verificación de credenciales
        if (user.email === emailInput && user.password === passwordInput) {
            localStorage.setItem('isLoggedIn', 'true');
            alert('Inicio de sesión exitoso. ¡Bienvenido, ' + user.nombre + '!');

            // Redirige al destino especificado
            window.location.href = redirectUrl || '../index.html';
        } else {
            alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
    });
}

// Funciones para el ruteo en JavaScript.js
export function iniciarLoginNormal() {
    iniciarLogin('../index.html'); 
}

export function iniciarLoginPago() {
    // Redirige a la página de pago después de iniciar sesión
    iniciarLogin('./pago.html'); // Ajusta la URL de pago si es necesario
}