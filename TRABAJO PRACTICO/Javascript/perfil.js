import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js'; 
import { vaciarCarrito } from './carritoDeCompras.js';

const buscador = new BuscadorElementos(); 

export function iniciarLogicaPerfil() {
  const estaLogueado = localStorage.getItem('isLoggedIn') === 'true';
  const usuarioGuardado = localStorage.getItem('currentUser');

  
  if (!estaLogueado) {
    if (window.location.href.includes('perfil.html')) {
      window.location.href = '../paginas/inicioSesion.html'; 
      return;
    }
  }

  // Si esta logueado y hay usuario guardado
  if (estaLogueado && usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);

    // Campos del perfil
    const inputNombre = buscador.buscarUnElementoPorId('perfil-nombre');
    const inputApellido = buscador.buscarUnElementoPorId('perfil-apellido');
    const inputDni = buscador.buscarUnElementoPorId('perfil-dni');
    const inputEmail = buscador.buscarUnElementoPorId('perfil-email');
    const inputTelefono= buscador.buscarUnElementoPorId('perfil-telefono');
    const inputDireccion= buscador.buscarUnElementoPorId('perfil-direccion');
    const inputLocalidad = buscador.buscarUnElementoPorId('perfil-localidad');
    const inputProvincia = buscador.buscarUnElementoPorId('perfil-provincia');
    const inputPostal = buscador.buscarUnElementoPorId('perfil-postal');
    const inputPais  = buscador.buscarUnElementoPorId('perfil-pais');

    // Rellenar campos con los datos del usuario
    if (inputNombre)    inputNombre.value    = usuario.nombre        || '';
    if (inputApellido)  inputApellido.value  = usuario.apellido      || '';
    if (inputDni)       inputDni.value       = usuario.dni           || '';
    if (inputEmail)     inputEmail.value     = usuario.email         || '';
    if (inputTelefono)  inputTelefono.value  = usuario.telefono      || '';
    if (inputDireccion) inputDireccion.value = usuario.direccion     || '';
    if (inputLocalidad) inputLocalidad.value = usuario.localidad     || '';
    if (inputProvincia) inputProvincia.value = usuario.provincia     || '';
    if (inputPostal)    inputPostal.value    = usuario.codigo_postal || '';
    if (inputPais)      inputPais.value      = usuario.pais          || '';

    // Mostrar nombre en el encabezado
    const textoNombreUsuario = buscador.buscarUnElementoPorId('nombre-usuario');
    if (textoNombreUsuario) {
      const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
      textoNombreUsuario.textContent = nombreCompleto || 'Mi Perfil';
    }

    // FORMULARIO DE PERFIL actualizar datos
    const formularioPerfil = buscador.buscarUnElementoPorId('perfil-form');
    if (formularioPerfil) {
      formularioPerfil.addEventListener('submit', (evento) => {
        evento.preventDefault();

        //Actualiza datos del usuario con lo que está en los inputs
        if (inputNombre)    usuario.nombre        = inputNombre.value;
        if (inputApellido)  usuario.apellido      = inputApellido.value;
        if (inputEmail)     usuario.email         = inputEmail.value;
        if (inputTelefono)  usuario.telefono      = inputTelefono.value;
        if (inputDireccion) usuario.direccion     = inputDireccion.value;
        if (inputLocalidad) usuario.localidad     = inputLocalidad.value;
        if (inputProvincia) usuario.provincia     = inputProvincia.value;
        if (inputPostal)    usuario.codigo_postal = inputPostal.value;
        if (inputPais)      usuario.pais          = inputPais.value;

        localStorage.setItem('currentUser', JSON.stringify(usuario));
        
        //Guardar cambios  popup
        mostrarPopup(
          'Éxito',
          '¡Datos de perfil actualizados con éxito!',
          'alert',
          () => {
            window.location.reload();
          }
        );
      });
    }

    //BOTÓN CERRAR SESIÓN
    const botonCerrarSesion = buscador.buscarUnElementoPorId('logout-button');
    if (botonCerrarSesion) {
      botonCerrarSesion.addEventListener('click', () => {
        mostrarPopup(
          'Cerrar Sesión',
          '¿Estás seguro de que deseas cerrar tu sesión?',
          'confirm',
          () => {
            const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));
            
            //Guardar backup del carrito antes de cerrar sesión
            if (usuarioActual?.email) {
              const carritoActual = JSON.parse(localStorage.getItem(`carrito_${usuarioActual.email}`)) || [];
              localStorage.setItem(`carrito_backup_${usuarioActual.email}`, JSON.stringify(carritoActual));
            }

            localStorage.removeItem('isLoggedIn');
            vaciarCarrito();

            mostrarPopup(
              'Adiós',
              'Sesión cerrada correctamente.',
              'alert',
              () => {
                window.location.href = '../index.html';
              }
            );
          }
        );
      });
    }

    //BOTÓN ELIMINAR CUENTA
    const botonEliminarCuenta = buscador.buscarUnElementoPorId('eliminar-cuenta-button');
    if (botonEliminarCuenta) {
      botonEliminarCuenta.addEventListener('click', () => {
        mostrarPopup(
          'Eliminar Cuenta', 
          'ADVERTENCIA: ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus datos locales.', 
          'confirm', 
          () => {
            const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));
            const emailAEliminar = usuarioActual ? usuarioActual.email : null;

            // 1. Obtener la lista de todos los usuarios registrados
            const usuariosGuardados = localStorage.getItem('registeredUsers');
            let usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

            if (emailAEliminar) {
              // 2. Filtrar el array para excluir al usuario actual
              usuarios = usuarios.filter(user => user.email !== emailAEliminar);
              
              // 3. Guardar la lista actualizada en localStorage
              localStorage.setItem('registeredUsers', JSON.stringify(usuarios));
              
              // Opcional: Eliminar el carrito específico del usuario
              localStorage.removeItem(`carrito_${emailAEliminar}`);
            }

            // Eliminar la sesión local (currentUser ya no es necesario, pero lo eliminamos por seguridad)
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            vaciarCarrito(); // Asegurar que el carrito actual esté vacío

            mostrarPopup(
              'Cuenta Eliminada',
              'Tu cuenta ha sido eliminada. Serás redirigido al inicio.',
              'alert',
              () => {
                window.location.href = '../index.html';
              }
            );
          }
        );
      });
    }
  }
}
