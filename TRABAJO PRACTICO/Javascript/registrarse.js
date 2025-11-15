
import { mostrarPopup } from './popupManager.js'; 

const CONTRASEÑA_VERIF = /^(?=.*[A-Z])(?=.*\d).{6,}$/; //Debe tener al menos 6 caracteres, una mayus y un num

//obtener todos los usuarios registrados o un array vacio si no hay
function obtenerUsuariosRegistrados() {
    const usuariosTexto = localStorage.getItem('registeredUsers');
    try {//try pq convertir textJSON a un objeto puede fallar, lo convertimos a objeto xq viene en texto
        return usuariosTexto ? JSON.parse(usuariosTexto) : [];//usamos parse porque viene en texto y lo convertimos a objeto
    } catch (e) {
       return [];//array vacio
    }
}

// guardar la lista completa de usuarios
function guardarUsuariosRegistrados(usuarios) {
    localStorage.setItem('registeredUsers', JSON.stringify(usuarios));
}


export function iniciarRegistro(redirectUrl) {
    const form = document.getElementById('registro-form');
    if (!form) {
       return;//si no se encuentra el form
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
        if (!CONTRASEÑA_VERIF.test(password)) {//llamamos a la expresion regular
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
        usuarios.push(userData);//push para agregar al array
        guardarUsuariosRegistrados(usuarios);//llama a la funcion que guarda en localstorage

        //establece como el usuario como logueado
        localStorage.setItem('currentUser', JSON.stringify(userData)); //json stringify para convertir a texto para guardar en localstorage

        //muestra popup y ejecuta la redireccion al hacer clic en ok
        mostrarPopup('Éxito', '¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.', 'alert', () => {
            window.location.href =  './inicioSesion.html';
        });
    }

    //al registrarse guarda en localstorage
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        registrarUsuario(form);
    });
}

export function iniciarRegistroNormal() {
    iniciarRegistro('./inicioSesion.html'); //redirige a inicioSesion despues de registrar
}