
import { mostrarPopup } from './popupManager.js'; 



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


// Función que actualiza el usuario en la lista global de registeredUsers
function actualizarUsuarioGlobal(oldEmail, newUserData) {
    const usersJSON = localStorage.getItem('registeredUsers');
    if (!usersJSON) return false; 
    
    let users = JSON.parse(usersJSON);
    
    // Buscar al usuario por el email original
    const index = users.findIndex(user => user.email.toLowerCase() === oldEmail.toLowerCase());
    
    if (index !== -1) {
        // Reemplazar la información vieja con la nueva.
        // Usa el spread operator para fusionar, manteniendo la contraseña y otros campos no enviados
        users[index] = { ...users[index], ...newUserData }; 
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        return true;
    }
    return false;
}


// Función para manejar la subida y conversión de la imagen
function manejarCambioFoto(e, currentUser) {
    const file = e.target.files[0];
    if (!file) return;

    // Validación básica del tipo de archivo
    if (!file.type.startsWith('image/')) {
        mostrarPopup('Error de Carga', 'Por favor, selecciona un archivo de imagen válido.', 'alert');
        e.target.value = ''; // Limpiar el input
        return;
    }
    
    // Usar FileReader para convertir la imagen a Base64
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Image = event.target.result;
        
        // 1. Actualizar el DOM (pre-visualización)
        document.getElementById('perfil-foto').src = base64Image;

        const oldEmail = currentUser.email; 
        const newFieldsToUpdate = {
            fotoPerfilUrl: base64Image 
        };
        
        const updatedCurrentUser = { ...currentUser, ...newFieldsToUpdate }; 

        const globalUpdate = actualizarUsuarioGlobal(oldEmail, newFieldsToUpdate);

        if (globalUpdate) {
            localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
            Object.assign(currentUser, newFieldsToUpdate);
            mostrarPopup('Éxito', '¡Foto de perfil actualizada!', 'alert');
        } else {
             mostrarPopup('Error', 'No se pudo guardar la foto en la base de datos.');
        }
    };
    //Lee el contenido del archivo y lo codifica como una URL de datos (Base64)
    reader.readAsDataURL(file);
}


//Función para cargar los datos del usuario en los inputs del formulario (MODIFICADO)
function cargarDatosUsuario(user) {
    const fields = ['nombre', 'apellido', 'dni', 'email', 'telefono', 'direccion', 'localidad', 'provincia', 'codigo_postal', 'pais'];
    
    fields.forEach(field => {
        const input = document.querySelector(`#perfil-${field}`);
        if (input && user[field]) {
            input.value = user[field];
        }
        // Desactivar campos clave (DNI y Email)
        if (field === 'dni' || field === 'email') {
             if (input) input.disabled = true;
        }
    });

    //Cargar la foto de perfil desde los datos del usuario
    const fotoElement = document.getElementById('perfil-foto');
    if (fotoElement && user.fotoPerfilUrl) {
        fotoElement.src = user.fotoPerfilUrl;
    }

    const nombreUsuario = document.getElementById('nombre-usuario');
    if (nombreUsuario) nombreUsuario.textContent = (user.nombre + ' ' + user.apellido).trim() || 'Mi Perfil';
}

// Maneja la actualización de los datos personales
function manejarActualizacionDatos(e, currentUser) {
    e.preventDefault();
    const form = e.target;
    const oldEmail = currentUser.email; 

    // Obtener y limpiar los valores del formulario
    const nombre = form.querySelector('input[name="nombre"]').value.trim();
    const apellido = form.querySelector('input[name="apellido"]').value.trim();
    const dni = form.querySelector('input[name="dni"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const telefono = form.querySelector('input[name="telefono"]').value.trim();
    const direccion = form.querySelector('input[name="direccion"]').value.trim();
    const localidad = form.querySelector('input[name="localidad"]').value.trim();
    const provincia = form.querySelector('input[name="provincia"]').value.trim();
    const codigo_postal = form.querySelector('input[name="codigo_postal"]').value.trim();
    const pais = form.querySelector('input[name="pais"]').value.trim();

   
    let error = validarCampoTexto(nombre, 'Nombre');
    if (error) { mostrarPopup('Error de Validación', error); return; }

    error = validarCampoTexto(apellido, 'Apellido');
    if (error) { mostrarPopup('Error de Validación', error); return; }

    // Validación para otros campos obligatorios
    if (!telefono || !direccion || !localidad || !provincia || !codigo_postal || !pais) {
         mostrarPopup('Error de Validación', 'Por favor, completa todos los campos de dirección/contacto.');
         return;
    }
    

    // Crear el objeto de datos actualizados 
    const newUserData = {
        nombre, apellido, dni, email, telefono, direccion, localidad, provincia, codigo_postal, pais
    };

    //Actualiza el array  de usuarios
    const globalUpdate = actualizarUsuarioGlobal(oldEmail, newUserData);

    if (globalUpdate) {
        const updatedCurrentUser = { ...currentUser, ...newUserData };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

        mostrarPopup('Éxito', '¡Tus datos de perfil han sido actualizados con éxito!', 'alert');
    } else {
        mostrarPopup('Error', 'No se pudo actualizar la información en la base de datos.');
    }
}


// Maneja el cierre de sesión
function manejarCerrarSesion() {
    mostrarPopup('Confirmar', '¿Estás seguro que deseas cerrar la sesión?', 'confirm', () => {
        // Eliminar las variables de sesión
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser'); 
        
        // Redirigir a la página de inicio 
        window.location.href = '../index.html';
    });
}

//eliminación de la cuenta
function manejarEliminarCuenta() {
    mostrarPopup('PELIGRO', 'Esta acción es irreversible. ¿Estás absolutamente seguro de eliminar tu cuenta?', 'confirm', () => {
    
        const currentUserJSON = localStorage.getItem('currentUser');
        if (!currentUserJSON) return;
        
        const oldEmail = JSON.parse(currentUserJSON).email;
        const usersJSON = localStorage.getItem('registeredUsers');
        if (!usersJSON) return;
        
        let users = JSON.parse(usersJSON);
        
        // Filtrar usuario a eliminar
        const usersUpdated = users.filter(user => user.email.toLowerCase() !== oldEmail.toLowerCase());
        
        // Sobrescribir array sin el usuario eliminado
        localStorage.setItem('registeredUsers', JSON.stringify(usersUpdated));
        
        // Cerrar sesión
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');

        mostrarPopup('Cuenta Eliminada', 'Tu cuenta ha sido eliminada permanentemente.', 'alert', () => {
            window.location.href = '../index.html';
        });
    });
}



export function iniciarLogicaPerfil() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUserJSON = localStorage.getItem('currentUser');

    if (!isLoggedIn || !currentUserJSON) {
        window.location.href = './inicioSesion.html';
        return;
    }

    let currentUser = JSON.parse(currentUserJSON);

    // Cargar datos en el formulario
    cargarDatosUsuario(currentUser);

    // Asignar manejadores de eventos
    const formDatos = document.getElementById('perfil-form');
    const btnLogout = document.getElementById('logout-button');
    const btnEliminar = document.getElementById('eliminar-cuenta-button');
    const inputFoto = document.getElementById('input-foto');


    if (formDatos) {
        formDatos.addEventListener('submit', (e) => manejarActualizacionDatos(e, currentUser));
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', manejarCerrarSesion);
    }
    if (btnEliminar) {
        btnEliminar.addEventListener('click', manejarEliminarCuenta);
    }
    
    // Listener para el cambio de foto
    if (inputFoto) {
        inputFoto.addEventListener('change', (e) => manejarCambioFoto(e, currentUser));
    }
}