
import { mostrarPopup } from './popupManager.js'; 

const CONTRASEÑA_VERIF = /^(?=.*[A-Z])(?=.*\d).{6,}$/; //Debe tener al menos 6 caracteres, una mayus y un num

//obtener todos los usuarios registrados o un array vacio si no hay
function obtenerUsuariosRegistrados() {
    const usuariosTexto = localStorage.getItem('registeredUsers');
    try {
        return usuariosTexto ? JSON.parse(usuariosTexto) : [];
    } catch (e) {
        console.error("Error al parsear 'registeredUsers' de localStorage", e);
        return [];
    }
}

// guardar la lista completa de usuarios
function guardarUsuariosRegistrados(usuarios) {
    localStorage.setItem('registeredUsers', JSON.stringify(usuarios));
}

export function iniciarRegistro(redirectUrl) {
    const form = document.getElementById('registro-form');
    if (!form) {
        console.error("Error crítico: No se encontró el formulario 'registro-form'.");
        return;
    }

    //FUNCION CENTRAL DE REGISTRO
    function registrarUsuario(form) {
        // Obtener datos y validar contraseñas
        const nombre = form.querySelector('input[name="nombre"]').value;
        const apellido = form.querySelector('input[name="apellido"]').value; 
        const dni = form.querySelector('input[name="dni"]').value; 
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const confirmPassword = form.querySelector('input[name="confirm_password"]').value;

        if (password !== confirmPassword) {
            
            mostrarPopup('Error de Registro', 'Las contraseñas no coinciden. Por favor, verifícalas.');
            return;
        }


        //VALIDACION DE CONTRASEÑA
        if (!CONTRASEÑA_VERIF.test(password)) {
            mostrarPopup(
                'Error de Contraseña',
                'La contraseña debe tener al menos 6 caracteres, incluir al menos una mayúscula y un número.'
            );
            return;
        }

        //OBTENER USUARIOS EXISTENTES
        const usuarios = obtenerUsuariosRegistrados();

        //VALIDAR DUPLICADOS DE EMAIL O DNI
        const emailExiste = usuarios.some(user => user.email === email);
        const dniExiste = usuarios.some(user => user.dni === dni);

        if (emailExiste) {
             mostrarPopup('Error de Registro', 'Ya existe una cuenta registrada con este correo electrónico.');
             return;
        }

        if (dniExiste) {
             mostrarPopup('Error de Registro', 'Ya existe una cuenta registrada con este DNI.');
             return;
        }
        
        //CREA NUEVO OBJETO DE USUARIO
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
        
        //AÑADIR NUEVO USUARIO Y GUARDAR LA LISTA COMPLETA
        usuarios.push(userData);
        guardarUsuariosRegistrados(usuarios);

        //Establecer como el usuario como logueado
        localStorage.setItem('currentUser', JSON.stringify(userData)); 

        // Muestra popup y ejecuta la redireccion al hacer clic en ok
        mostrarPopup('Éxito', '¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.', 'alert', () => {
            window.location.href =  './inicioSesion.html';
        });
    }

    // Listener principal para el envio del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        registrarUsuario(form);
    });
}

export function iniciarRegistroNormal() {
    iniciarRegistro('./inicioSesion.html'); 
}