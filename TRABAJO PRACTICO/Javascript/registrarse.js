// Archivo: Javascript/registrarse.js
import { mostrarPopup } from './popupManager.js'; // Importar la nueva función

export function iniciarRegistro(redirectUrl) {
    const form = document.getElementById('registro-form');
    if (!form) {
        console.error("Error crítico: No se encontró el formulario 'registro-form'.");
        return;
    }

    // La lógica de los listeners del popup ahora está en popupManager.js, 
    // solo usamos la función mostrarPopup()

    // FUNCIÓN CENTRAL DE REGISTRO
    function registrarUsuario(form, redirectUrl) {
        // Obtener datos y validar contraseñas
        const nombre = form.querySelector('input[name="nombre"]').value;
        const apellido = form.querySelector('input[name="apellido"]').value; 
        const dni = form.querySelector('input[name="dni"]').value; 
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirm_password"]').value;

        if (password !== confirmPassword) {
            // Usar mostrarPopup (tipo 'alert' por defecto)
            mostrarPopup('Error de Registro', 'Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }
        
        // Crear el objeto de usuario a guardar
        const userData = {
            nombre,
            apellido,
            dni,
            email,
            password,
            telefono: '',
            direccion: '',
            localidad: '',
            provincia: '',
            codigo_postal: '',
            pais: ''
        };
        
        // Guardar datos en localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Muestra pop-up y ejecuta la redirección al hacer clic en OK.
        mostrarPopup('Éxito', '¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.', 'alert', () => {
            window.location.href = redirectUrl || './inicioSesion.html';
        });
    }

    // Listener principal para el envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        registrarUsuario(form, redirectUrl);
    });
}

// Funciones para el ruteo en JavaScript.js
export function iniciarRegistroNormal() {
    iniciarRegistro('./inicioSesion.html'); 
}

export function iniciarRegistroPago() {
    iniciarRegistro('./inicioSesionPago.html');
}