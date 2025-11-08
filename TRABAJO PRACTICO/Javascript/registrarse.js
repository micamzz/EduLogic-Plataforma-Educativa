import { mostrarPopup } from './popupManager.js';
import { ValidadorFormulario } from './validarFormulario.js';

function validarContraseniaComplejidad(password) {
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'La contraseña debe contener al menos una mayúscula.';
    }
    if (!/[0-9]/.test(password)) {
        return 'La contraseña debe contener al menos un número.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return 'La contraseña debe contener al menos un símbolo (ej: !, @, #, $).';
    }
    return null; 
}

// Función auxiliar para validar campos de texto
function validarCampoTexto(valor, nombreCampo) {
    const patron = /^[A-Za-zñÑáÁéÉíÍóÓúÚ\s]+$/;
    if (!valor.trim()) {
        return `El campo ${nombreCampo} es obligatorio.`;
    }
    if (!patron.test(valor)) {
        return `El campo ${nombreCampo} solo debe contener letras y espacios.`;
    }
    return null;
}


function validarDNI(dni) {
    const patron = /^[0-9]{8,12}$/;
    if (!dni.trim()) {
        return 'El campo DNI es obligatorio.';
    }
    if (!patron.test(dni)) {
        return 'El DNI debe contener entre 8 y 12 dígitos numéricos.';
    }
    return null;
}


export function iniciarRegistro() { 
    const form = document.getElementById('registro-form');
    if (!form) {
        return;
    }

    
    function registrarUsuario(form) { 
    
        const nombre = form.querySelector('input[name="nombre"]').value.trim();
        const apellido = form.querySelector('input[name="apellido"]').value.trim(); 
        const dni = form.querySelector('input[name="dni"]').value.trim(); 
        const email = form.querySelector('input[name="email"]').value.trim();
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirm_password"]').value;
        
        // Validaciones
        let error = validarCampoTexto(nombre, 'Nombre');
        if (error) { mostrarPopup('Error de Validación', error); return; }
        
        error = validarCampoTexto(apellido, 'Apellido');
        if (error) { mostrarPopup('Error de Validación', error); return; }
        
        error = validarDNI(dni);
        if (error) { mostrarPopup('Error de Validación', error); return; }
        
        if (!ValidadorFormulario.emailValido(email)) { 
            mostrarPopup('Error de Validación', ValidadorFormulario.MENSAJES.emailInvalido);
            return; 
           
        }
        
        error = validarContraseniaComplejidad(password);
        if (error) { 
            mostrarPopup('Error de Contraseña', error); 
            return; 
        }

        if (password !== confirmPassword) {
            mostrarPopup('Error de Registro', 'Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }

        //multiples usuarios
        const usersJSON = localStorage.getItem('registeredUsers');
        const users = usersJSON ? JSON.parse(usersJSON) : [];//Array de usuarios
        
        //Validación 
        const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            mostrarPopup('Error de Registro', 'El correo electrónico ya está registrado.');
            return;
        }
        
        // Crear el objeto de usuario 
        const newUserData = {
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

    
        users.push(newUserData);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Limpiar cualquier sesión previa
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        
        mostrarPopup('Éxito', '¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.', 'alert', () => {
            window.location.href = './inicioSesion.html';
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        registrarUsuario(form);
    });
}
