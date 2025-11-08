import { mostrarPopup } from './popupManager.js';
import { ValidadorFormulario } from './validarFormulario.js';

// Función auxiliar que maneja el proceso de inicio de sesión
export function iniciarLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[name="mail"]').value;
        const passwordInput = this.querySelector('input[name="password"]').value;

        // Validación de formato de mail
        if (!ValidadorFormulario.emailValido(emailInput)) {
             mostrarPopup('Error de Validación', ValidadorFormulario.MENSAJES.emailInvalido);
             return;
        }

        const storedUsersJSON = localStorage.getItem('registeredUsers');

        if (!storedUsersJSON) {
             mostrarPopup('Error de Login', 'No hay cuentas registradas. Por favor, regístrate.');
             return;
        }

        const users = JSON.parse(storedUsersJSON);

        // Buscar el usuario en el array 
        const user = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());

        if (!user) {
            mostrarPopup('Error de Credenciales', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
            return;
        }

        // Verificación 
        if (user.password === passwordInput) {
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            
            let redirectUrl = localStorage.getItem("redirectAfterLogin");
            if (redirectUrl) {
                localStorage.removeItem("redirectAfterLogin");
            } else {
                redirectUrl = '../index.html'; 
            }

            mostrarPopup('¡Éxito!', 'Inicio de sesión exitoso.', 'success', () => {
                window.location.href = redirectUrl;
            });

        } else {
            mostrarPopup('Error de Credenciales', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
    });
}
// Iniciar el login automáticamente 
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('inicioSesion.html')) {
        iniciarLogin();
    }
});