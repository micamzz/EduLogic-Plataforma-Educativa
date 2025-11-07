
import { mostrarPopup } from './popupManager.js'; 

export function iniciarLogicaRecuperacion() {
    const form = document.getElementById('recuperacion-form');
    if (!form) {
        console.error("Error: No se encontró el formulario 'recuperacion-form'.");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[name="email"]').value.trim().toLowerCase();

        if (!emailInput) {
            mostrarPopup('Error de Validación', 'Por favor, introduce tu correo electrónico.');
            return;
        }
       
     
        const usersJSON = localStorage.getItem('registeredUsers');
        
        // Asumimos que no hay usuarios registrados si usersJSON es nulo
        if (!usersJSON) {
             mostrarPopup('Recuperación Enviada', 
                         'Si el correo electrónico existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.', 
                         'alert', 
                         () => {
                             window.location.href = './inicioSesion.html';
                         });
            return;
        }

        const users = JSON.parse(usersJSON);

        // Buscar el usuario en el array
        const userFound = users.find(user => 
            user.email.toLowerCase() === emailInput
        );

        if (userFound) {
             mostrarPopup(
                '¡Correo Enviado!', 
                'Se ha enviado un mail a ' + emailInput + ' para recuperar la contraseña.', 
                'alert', 
                () => {
                    window.location.href = './inicioSesion.html';
                }
            );
        } else {
            
            mostrarPopup('Recuperación Enviada', 
                         'Si el correo electrónico existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.', 
                         'alert', 
                         () => {
                            window.location.href = './inicioSesion.html';
                         });
        }
    }); 
       
}