import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js'; 
import { restaurarCarritoUsuario } from './carritoDeCompras.js';
import { ValidadorFormulario } from "./validarFormulario.js";



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
  evento.preventDefault();

  // Limpiar errores previos
  formularioLogin.querySelectorAll(".error-mensaje").forEach(el => el.remove());
  formularioLogin.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

  const campoEmail = formularioLogin.querySelector('input[name="mail"]');
  const campoContrasena = formularioLogin.querySelector('input[name="password"]');

  if (!campoEmail || !campoContrasena) {
    console.error("No se encontraron los campos de email o contraseña.");
    return;
  }

  const emailIngresado = campoEmail.value.trim();
  const contrasenaIngresada = campoContrasena.value.trim();

  let formularioValido = true;

  // === VALIDAR EMAIL ===
  if (!ValidadorFormulario.campoVacio(emailIngresado)) {
    mostrarError(campoEmail, "El email no puede estar vacío.");
    formularioValido = false;
  } else if (!ValidadorFormulario.emailValido(emailIngresado)) {
    mostrarError(campoEmail, ValidadorFormulario.MENSAJES.emailInvalido);
    formularioValido = false;
  }

  // === VALIDAR CONTRASEÑA ===
  if (!ValidadorFormulario.campoVacio(contrasenaIngresada)) {
    mostrarError(campoContrasena, "La contraseña no puede estar vacía.");
    formularioValido = false;
  }

  if (!formularioValido) return; 

  // === SI TODO ESTÁ OK ===
  const usuariosRegistrados = obtenerUsuariosRegistrados();

  if (usuariosRegistrados.length === 0) {
    mostrarError(campoEmail, "No hay cuentas registradas. Por favor, registrate.");
    return;
  }

  const usuario = usuariosRegistrados.find(
    user => user.email === emailIngresado && user.password === contrasenaIngresada
  );

  if (usuario) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    restaurarCarritoUsuario(usuario.email);

    const redireccionGuardada = localStorage.getItem("redirectAfterLogin");
    const destino = redireccionGuardada || urlRedireccion || '../index.html';
    
    window.location.href = destino;
  } else {
    // mostrarError(campoEmail, "Correo o contraseña incorrectos.");
    mostrarError(campoContrasena, "Correo o contraseña incorrectos.");
  }
});

function mostrarError(input, mensaje) {
  input.classList.add("input-error");
  const error = document.createElement("p");
  error.className = "error-mensaje";
  error.textContent = mensaje;
  input.insertAdjacentElement("afterend", error);
}
}
export function iniciarLoginNormal() {
  iniciarLogin('../index.html'); 
}



