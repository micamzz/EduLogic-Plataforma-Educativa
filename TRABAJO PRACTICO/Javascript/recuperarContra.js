import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js';
import { ValidadorFormulario } from "./validarFormulario.js"; // ✅ importamos el validador

const buscador = new BuscadorElementos();

export function iniciarLogicaRecuperacion() {
  // Buscamos el formulario
  const formularioRecuperacion = buscador.buscarUnElementoPorId('recuperacion-form');

  if (!formularioRecuperacion) return;

  formularioRecuperacion.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Buscamos el input de email
    const campoEmail = formularioRecuperacion.querySelector('input[name="email"]');
    if (!campoEmail) return;

    const emailIngresado = campoEmail.value.trim();

    //  Limpiamos errores previos si los hubiera
    formularioRecuperacion.querySelectorAll(".error-mensaje").forEach(el => el.remove());
    campoEmail.classList.remove("input-error");

    // VALIDAR MAIL
    if (!ValidadorFormulario.campoVacio(emailIngresado)) {
      mostrarError(campoEmail, "El email no puede estar vacío.");
      return;
    }
    if (!ValidadorFormulario.emailValido(emailIngresado)) {
      mostrarError(campoEmail, ValidadorFormulario.MENSAJES.emailInvalido);
      return;
    }

    // Usuario guardado en localStorage
    const usuarioGuardadoTexto = localStorage.getItem('currentUser');

    // Si no hay usuario guardado o el email no coincide
    if (!usuarioGuardadoTexto || JSON.parse(usuarioGuardadoTexto).email !== emailIngresado) {
      mostrarPopup(
        'Mensaje Enviado',
        'Si el correo electrónico existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.',
        'alert'
      );
      return;
    }

    // Si el email coincide con el usuario guardado
    mostrarPopup(
      '¡Correo Enviado!',
      'Se ha enviado un mail a ' + emailIngresado + ' para recuperar la contraseña.',
      'alert',
      () => {
        window.location.href = './inicioSesion.html';
      }
    );
  });

  // ✅ Función para mostrar errores debajo del input
  function mostrarError(input, mensaje) {
    input.classList.add("input-error");
    const error = document.createElement("p");
    error.className = "error-mensaje";
    error.textContent = mensaje;
    input.insertAdjacentElement("afterend", error);
  }


}
