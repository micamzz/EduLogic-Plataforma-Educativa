import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js'; 
import { restaurarCarritoUsuario } from './carritoDeCompras.js';

const buscador = new BuscadorElementos();

//obtiene el array completo de usuarios registrados
function obtenerUsuariosRegistrados() {
    const usuariosTexto = localStorage.getItem('registeredUsers');
    try {//con try pq convertir textJSON a un objeto puede fallar

        //devuelve el array de usuarios o un array vacio si no hay datos
        return usuariosTexto ? JSON.parse(usuariosTexto) : [];

    } catch (e) {//si falla el parseo
        
        return [];//array vacio
    }
}

// Func auxiliar 
export function iniciarLogin(urlRedireccion) {
  const formularioLogin = buscador.buscarUnElementoPorId('login-form');

  if (!formularioLogin) { //no encuentra form
    console.warn("No se encontró el formulario de inicio.");
    return;
  }

  //cuando clickea en iniciar sesion
  formularioLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();//detiene el comportamiento por defecto

    //busco los campos de email y contraseña
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

    if (usuario) { // Login exitoso

      //Guardar el usuario logueado en currentUser
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(usuario));

      //traer carrito si habia backup
      restaurarCarritoUsuario(usuario.email);

     const redireccionGuardada = localStorage.getItem("redirectAfterLogin");//guardamos en la variable la url guardada
     const destino = redireccionGuardada || urlRedireccion || '../index.html';
          
      mostrarPopup(
        'Éxito',
        'Inicio de sesión exitoso. ¡Bienvenido, ' + (usuario.nombre || '') + '!',
        'alert',
        () => {
          if (redireccionGuardada) {
            localStorage.removeItem("redirectAfterLogin");
          }
          window.location.href = destino;//index.html o la guardada arriba
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


