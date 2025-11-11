import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js'; 
import { restaurarCarritoUsuario } from './carritoDeCompras.js';

const buscador = new BuscadorElementos();

// Función auxiliar 
export function iniciarLogin(urlRedireccion) {
  const formularioLogin = buscador.buscarUnElementoPorId('login-form');

  if (!formularioLogin) {
    console.warn("⚠️ No se encontró el formulario de inicio.");
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

    const usuarioGuardadoTexto = localStorage.getItem('currentUser');

    if (!usuarioGuardadoTexto) {
      mostrarPopup('Error de Login', 'No hay cuentas registradas. Por favor, regístrate.');
      return;
    }

    const usuario = JSON.parse(usuarioGuardadoTexto);

    // Verificación de credenciales
    if (usuario.email === emailIngresado && usuario.password === contrasenaIngresada) {

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(usuario));

      // Restaurar carrito si había backup
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
    } else {
      mostrarPopup('Error de Credenciales', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  });
}

export function iniciarLoginNormal() {
  iniciarLogin('../index.html'); 
}


