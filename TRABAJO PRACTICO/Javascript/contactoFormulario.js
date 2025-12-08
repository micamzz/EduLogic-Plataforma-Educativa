import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { validadorFormulario } from "./validarFormulario.js";

export function formularioDeContacto() {
    const BUSCADOR = new BuscadorElementos();
    const CREADOR = new CreadorElementos();

    const FORM = BUSCADOR.buscarUnElementoPorId("form-contacto");
    const NOMBRE = BUSCADOR.buscarUnElementoPorId("name");
    const MAIL = BUSCADOR.buscarUnElementoPorId("mail");
    const TELEFONO = BUSCADOR.buscarUnElementoPorId("telefono");
    const MENSAJE = BUSCADOR.buscarUnElementoPorId("mensaje");

      if (!FORM || !NOMBRE || !MAIL || !TELEFONO || !MENSAJE) {
    return;
 }

    // CONTADOR DE CARACTERES
    const CONTADOR = CREADOR.crearUnElemento("p");
    CONTADOR.classList.add("contador");
    MENSAJE.insertAdjacentElement("afterend", CONTADOR); 
    const MAXIMO_CARACTERES = 1000;
    MENSAJE.addEventListener("input", () => {
        const usados = MENSAJE.value.length;
        const restantes = MAXIMO_CARACTERES - usados;
        CONTADOR.textContent = `${usados}/${MAXIMO_CARACTERES} (${restantes} restantes)`;
        if (usados > MAXIMO_CARACTERES) {
            MENSAJE.value = MENSAJE.value.slice(0, MAXIMO_CARACTERES);
        }
    });

 
    function mostrarError(input, mensaje) {
        // Busca si ya existe un elemento justo después del input
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-mensaje")) {
            error = CREADOR.crearUnElemento("div");
            error.classList.add("error-mensaje");
            input.insertAdjacentElement("afterend", error);
        }
        error.textContent = mensaje;
    }

     // si existe el error y se escribe bien los pedido se borra
    function limpiarError(input) {
        const error = input.nextElementSibling;
        if (error && error.classList.contains("error-mensaje")) {
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


        // VALIDACIONES
        if (!validadorFormulario.campoVacio(NOMBRE.value)) {
            mostrarError(NOMBRE, validadorFormulario.MENSAJES.nombreVacio);
            esValido = false;
        } else if (!validadorFormulario.longitudMinima(NOMBRE.value, 3)) {
            mostrarError(NOMBRE, validadorFormulario.MENSAJES.nombreCorto);
            esValido = false;
        }

        if (!validadorFormulario.emailValido(MAIL.value)) {
            mostrarError(MAIL, validadorFormulario.MENSAJES.emailInvalido);
            esValido = false;
        }

        if (!validadorFormulario.telefonoValido(TELEFONO.value)) {
            mostrarError(TELEFONO, validadorFormulario.MENSAJES.telefonoInvalido);
            esValido = false;
        }

        if (!validadorFormulario.longitudTextoValida(MENSAJE.value, MAXIMO_CARACTERES)) {
            mostrarError(MENSAJE, validadorFormulario.MENSAJES.consultaLarga);
            esValido = false;
        }

        if (!esValido) return;

        mostrarPopupDeContacto(CREADOR);
    });
}


// MENSAJE POPUP DE CONFIRMACION 
 function mostrarPopupDeContacto(creador) {
        const POPUP = creador.crearUnElemento("section");
        POPUP.classList.add("popup-confirmacion");
        POPUP.innerHTML = `
            <article class="popup-contenido">
                <h3>✅ Consulta enviada</h3>
                <p>Gracias por contactarnos. Nos comunicaremos pronto.</p>
                <button id="boton-aceptar">Aceptar</button>
            </article>
        `;
        document.body.appendChild(POPUP);

        const BTN_ACEPTAR = POPUP.querySelector("#boton-aceptar");
        BTN_ACEPTAR.addEventListener("click", () => {
            POPUP.remove(); // 
            FORM.reset(); // 
            CONTADOR.textContent = "";
            window.location.href = "../index.html";
        });
    }
