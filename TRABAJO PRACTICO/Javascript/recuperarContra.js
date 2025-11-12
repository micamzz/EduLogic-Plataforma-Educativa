import { BuscadorElementos } from "./buscadorElementos.js";
import { mostrarPopup } from './popupManager.js'; 

const buscador = new BuscadorElementos();

export function iniciarLogicaRecuperacion() {
  //buscamos el formulario por id usando la clase BuscadorElementos
  const formularioRecuperacion = buscador.buscarUnElementoPorId('recuperacion-form');

  if (!formularioRecuperacion) {
    //console.error("Error: No se encontró el formulario 'recuperacion-form'.");
    return;
  }

  //escuha el envio del formulario
  formularioRecuperacion.addEventListener('submit', (evento) => {
    evento.preventDefault();

    //Buscamos el input de email dentro del formulario
    const campoEmail = formularioRecuperacion.querySelector('input[name="email"]');

    if (!campoEmail) {
      //console.error("Error: No se encontró el campo de email dentro del formulario.");
      return;
    }

    const emailIngresado = campoEmail.value.trim();

    //Usuario guardado en localStorage
    const usuarioGuardadoTexto = localStorage.getItem('currentUser');

    //Si no hay usuario guardado o el email no coincide, mostramos mensaje genérico
    if (!usuarioGuardadoTexto || JSON.parse(usuarioGuardadoTexto).email !== emailIngresado) {
      mostrarPopup(
        'Recuperación Enviada', 
        'Si el correo electrónico existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.', 
        'alert'
      );
      return;
    }

    //Si el email coincide con el usuario guardado
    mostrarPopup(
      '¡Correo Enviado!', 
      'Se ha enviado un mail a ' + emailIngresado + ' para recuperar la contraseña.', 
      'alert', 
      () => {
        window.location.href = './inicioSesion.html';
      }
    );
  });
}
