// Archivo: Javascript/registrarse.js

// Función auxiliar que contiene la lógica central
export function iniciarRegistro(redirectUrl) {
    const form = document.getElementById('registro-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.querySelector('input[name="nombre"]').value;
        // Capturamos el apellido del formulario
        const apellido = this.querySelector('input[name="apellido"]').value; 
        const dni = this.querySelector('input[name="dni"]').value; 
        const email = this.querySelector('input[name="email"]').value;
        const password = this.querySelector('input[name="password"]').value;
        const confirmPassword = this.querySelector('input[name="confirm_password"]').value;
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }

        const userData = {
            nombre: nombre,
            apellido: apellido, 
            dni: dni,
            email: email,
            password: password,
            telefono: '',
            direccion: '',
            localidad: '',
            provincia: '',
            codigo_postal: '',
            pais: ''
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));

        alert('¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.');

        // Redirige al destino especificado
        window.location.href = redirectUrl || './inicioSesion.html';
    });
}

// Funciones para el ruteo en JavaScript.js
export function iniciarRegistroNormal() {
    iniciarRegistro('./inicioSesion.html'); 
}

export function iniciarRegistroPago() {
    // Redirige al login de pago
    iniciarRegistro('./inicioSesionPago.html');
}
