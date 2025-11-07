
import { mostrarPopup } from './popupManager.js'; 

export function iniciarLogicaRecuperacion() {
    const form = document.getElementById('recuperacion-form');
    if (!form) {
        console.error("Error: No se encontró el formulario 'recuperacion-form'.");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        
        
        const emailInput = this.querySelector('input[name="email"]').value;

     
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser || JSON.parse(storedUser).email !== emailInput) {
            
            mostrarPopup('Recuperación Enviada', 
                         'Si el correo electrónico existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.', 
                         'alert');
            return;
        }


        mostrarPopup(
            '¡Correo Enviado!', 
            'Se ha enviado un mail a ' + emailInput + ' para recuperar la contraseña.', 
            'alert', 
            () => {
                window.location.href = './inicioSesion.html';
            }
        );
    });
}