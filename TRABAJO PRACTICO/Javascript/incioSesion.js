import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js'; 
import { restaurarCarritoUsuario } from './carritoDeCompras.js';

const buscador = new BuscadorElementos();

//Obtiene el array completo de usuarios registrados.
function obtenerUsuariosRegistrados() {
    const usuariosTexto = localStorage.getItem('registeredUsers');
    try {
        // Devuelve el array de usuarios o un array vacío si no hay datos.
        return usuariosTexto ? JSON.parse(usuariosTexto) : [];
    } catch (e) {
        console.error("Error al parsear 'registeredUsers' de localStorage en login", e);
        return [];
    }
}

// Función auxiliar 
export function iniciarLogin(urlRedireccion) {
  const formularioLogin = buscador.buscarUnElementoPorId('login-form');

  if (!formularioLogin) {
    console.warn("No se encontró el formulario de inicio.");
    return;
  }


  formularioLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campoEmail = formularioLogin.querySelector('input[name="mail"]');
    const campoContrasena = formularioLogin.querySelector('input[name="password"]');

    if (!campoEmail || !campoContrasena) {
      console.error("Error: No se encontraron los campos de email o contraseña en el formulario.");
      return;
    }

    const emailIngresado = campoEmail.value;
    const contrasenaIngresada = campoContrasena.value;

    //Busca en el array de todos los usuarios registrados
    const usuariosRegistrados = obtenerUsuariosRegistrados();

    if (usuariosRegistrados.length === 0) {
      mostrarPopup('Error de Login', 'No hay cuentas registradas. Por favor, regístrate.');
      return;
    }

    //Busca el usuario que coincide con los ingresos
    const usuario = usuariosRegistrados.find(
        user => user.email === emailIngresado && user.password === contrasenaIngresada
    );

    // Verificación de credenciales

    if (usuario) { // Login exitoso

      //Guardar el usuario logueado en currentUser
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(usuario));

      //Restaurar carrito si habia backup
      restaurarCarritoUsuario(usuario.email);

      const redireccionGuardada = localStorage.getItem("redirectAfterLogin");
     const destino = redireccionGuardada || urlRedireccion || '../index.html';
          
      mostrarPopup(
        'Éxito',
        'Inicio de sesión exitoso. ¡Bienvenido, ' + (usuario.nombre || '') + '!',
        'alert',
        () => {
          if (redireccionGuardada) {
            localStorage.removeItem("redirectAfterLogin");
          }
          window.location.href = destino;
        }
      );
    } else { //Credenciales incorrectas o usuario no encontrado
      mostrarPopup('Error de Credenciales', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  });
}

export function iniciarLoginNormal() {
  iniciarLogin('../index.html'); 
}


