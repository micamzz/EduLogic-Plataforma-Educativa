import { mostrarPopup } from './popupManager.js'; // Importar la nueva función

// Función auxiliar 
export function iniciarLogin(redirectUrl) {
    const form = document.getElementById('login-form');
     if (!form) {
        console.warn("⚠️ No se encontró el formulario de login.");
        return;
    }

    console.log("✅ Listener de login activo."); // <--- agregá esto

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[name="mail"]').value;
        const passwordInput = this.querySelector('input[name="password"]').value;

        const storedUser = localStorage.getItem('currentUser');

        if (!storedUser) {
            mostrarPopup('Error de Login', 'No hay cuentas registradas. Por favor, regístrate.');
            return;
        }

        const user = JSON.parse(storedUser);

        // Verificación de credenciales
        if (user.email === emailInput && user.password === passwordInput) {
            localStorage.setItem('isLoggedIn', 'true');

            const redirectGuardado = localStorage.getItem("redirectAfterLogin");
            const destino = redirectGuardado || redirectUrl || '../index.html';
            
            mostrarPopup(
              'Éxito',
              'Inicio de sesión exitoso. ¡Bienvenido, ' + user.nombre + '!',
              'alert',
              () => {
                if (redirectGuardado) {
                  localStorage.removeItem("redirectAfterLogin");
                }
                window.location.href = destino;
              }
            );
        } else {
            mostrarPopup('Error de Credenciales', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
    });
}

// Funciones para el ruteo 
export function iniciarLoginNormal() {
    iniciarLogin('../index.html'); 
}

export function iniciarLoginPago() {
    // Redirige a la página de pago después de iniciar sesión
    iniciarLogin('../paginas/formularioDePago.html'); 
}
