import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { ValidadorFormulario } from "./validarFormulario.js";

export function formularioDeContacto() {
    const BUSCADOR = new BuscadorElementos();
    const CREADOR = new CreadorElementos();

    const FORM = BUSCADOR.buscarUnElementoPorId("form-contacto");
    const NOMBRE = BUSCADOR.buscarUnElementoPorId("name");
    const MAIL = BUSCADOR.buscarUnElementoPorId("mail");
    const TELEFONO = BUSCADOR.buscarUnElementoPorId("telefono");
    const MENSAJE = BUSCADOR.buscarUnElementoPorId("mensaje");

    // CONTADOR DE CARACTERES
    const CONTADOR = CREADOR.crearUnElemento("p");
    CONTADOR.classList.add("contador");
    MENSAJE.insertAdjacentElement("afterend", CONTADOR);  // LO INSERTA DESPUES DEL TEXTAREA MSJ

    const MAXIMO_CARACTERES = 1000;
    MENSAJE.addEventListener("input", () => {
        const usados = MENSAJE.value.length;
        const restantes = MAXIMO_CARACTERES - usados;
        CONTADOR.textContent = `${usados}/${MAXIMO_CARACTERES} (${restantes} restantes)`;
        if (usados > MAXIMO_CARACTERES) {
            MENSAJE.value = MENSAJE.value.slice(0, MAXIMO_CARACTERES);
        }
    });

    // SI HAY UN ERROR SE CREA UN ELEMENTO PARA PONER EL TEXTO.
    function mostrarError(input, mensaje) {
        // Busca si ya existe un elemento justo después del input
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-texto")) {
            error = CREADOR.crearUnElemento("div");
            error.classList.add("error-texto");
            input.insertAdjacentElement("afterend", error);
        }
        error.textContent = mensaje;
    }

     // si existe el error y se escribe bien los pedido se borra
    function limpiarError(input) {
        const error = input.nextElementSibling;
        if (error && error.classList.contains("error-texto")) {
            error.remove();
        }
    }

    FORM.addEventListener("submit", (e) => {
        e.preventDefault();

        let esValido = true;

        limpiarError(NOMBRE);
        limpiarError(MAIL);
        limpiarError(TELEFONO);
        limpiarError(MENSAJE);

        if (!ValidadorFormulario.campoVacio(NOMBRE.value)) {
            mostrarError(NOMBRE, ValidadorFormulario.MENSAJES.nombreVacio);
            esValido = false;
        } else if (!ValidadorFormulario.longitudMinima(NOMBRE.value, 3)) {
            mostrarError(NOMBRE, ValidadorFormulario.MENSAJES.nombreCorto);
            esValido = false;
        }

        if (!ValidadorFormulario.emailValido(MAIL.value)) {
            mostrarError(MAIL, ValidadorFormulario.MENSAJES.emailInvalido);
            esValido = false;
        }

        if (!ValidadorFormulario.telefonoValido(TELEFONO.value)) {
            mostrarError(TELEFONO, ValidadorFormulario.MENSAJES.telefonoInvalido);
            esValido = false;
        }

        if (!ValidadorFormulario.longitudTextoValida(MENSAJE.value, MAXIMO_CARACTERES)) {
            mostrarError(MENSAJE, ValidadorFormulario.MENSAJES.consultaLarga);
            esValido = false;
        }

        if (!esValido) return;


        mostrarPopupDeContacto(CREADOR);
    });
}

// POPUP 
function mostrarPopupDeContacto(CREADOR) {
        mostrarPopup(CREADOR);
    }


// POPUP 
function mostrarPopup(CREADOR) {
    const POPUP = CREADOR.crearUnElemento("section");
    POPUP.classList.add("popup-confirmacion");
    POPUP.innerHTML = `
    <article class="popup-contenido">
      <h3>Consulta enviada</h3>

      <p>Gracias por contactarnos</p>
      <p> Nos comunicaremos pronto.</p>

      <p>Gracias por contactarnos. Nos comunicaremos pronto.</p>
      <button id="boton-aceptar">Aceptar</button>
    </article>
  `;
    document.body.appendChild(POPUP);

    const BTN_ACEPTAR = POPUP.querySelector("#boton-aceptar");
    BTN_ACEPTAR.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}
