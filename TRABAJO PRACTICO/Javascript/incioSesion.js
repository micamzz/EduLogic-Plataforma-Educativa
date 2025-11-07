// Archivo: Javascript/incioSesion.js
import { mostrarPopup } from './popupManager.js'; // Importar la nueva función

// Función auxiliar 
export function iniciarLogin(redirectUrl) {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Aplicamos .trim() y .toLowerCase() para la búsqueda
        const emailInput = this.querySelector('input[name="mail"]').value.trim().toLowerCase();
        const passwordInput = this.querySelector('input[name="password"]').value;
        
        // --- VALIDACIONES DE FORMULARIO (SÓLO CAMPOS NO VACÍOS) ---
        if (!emailInput || !passwordInput) {
            mostrarPopup('Error de Validación', 'Por favor, completa todos los campos (Correo electrónico y Contraseña).');
            return;
        }
        // --- FIN VALIDACIONES ---

        const usersJSON = localStorage.getItem('registeredUsers');
        
        if (!usersJSON) {
            mostrarPopup('Error de Login', 'No hay cuentas registradas. Por favor, regístrate.');
            return;
        }
        
        let users;
        // Intenta parsear el JSON de usuarios de forma segura
        try {
            users = JSON.parse(usersJSON);
            // Si por alguna razón no es un array (por datos viejos), lo inicializamos vacío
            if (!Array.isArray(users)) users = []; 
        } catch (e) {
            // Si el JSON está corrupto, lo tratamos como una lista vacía para evitar fallos críticos.
            users = [];
        }
        
        // Buscar al usuario en el array (Case-insensitive email, case-sensitive password)
        const userFound = users.find(user => 
            user.email.toLowerCase() === emailInput && user.password === passwordInput
        );

        if (userFound) {
            // Credenciales correctas: Establecer sesión
            localStorage.setItem('isLoggedIn', 'true');
            // Guardar el usuario encontrado como el usuario actual
            localStorage.setItem('currentUser', JSON.stringify(userFound)); 
            
            mostrarPopup('Éxito', 'Inicio de sesión exitoso. ¡Bienvenido, ' + userFound.nombre + '!', 'alert', () => {
                 window.location.href = redirectUrl || '../index.html';
            });
        } else {
            // Mensaje genérico por seguridad
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