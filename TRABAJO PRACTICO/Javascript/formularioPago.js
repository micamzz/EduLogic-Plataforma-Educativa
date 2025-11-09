import { BuscadorElementos } from "./buscadorElementos.js";

export function iniciarFormularioDePago() {
  const BUSCADOR = new BuscadorElementos();
  const params = new URLSearchParams(window.location.search);

  const cursosSeleccionados = [
    params.get("curso1"),
    params.get("curso2"),
    params.get("curso3")
  ].filter(c => c); 

  // Precios de cursos
  const cursosPrecios = {
    "frontend": 120000,
    "backend": 250000,
    "ciberseguridad": 400000,
    "ingles": 120000,
    "marketing": 90000,
    "finanzas": 75000
  };

  // Mostrar info de los cursos y calcular total
  let total = 0;
  const infoCurso = document.createElement("div");
  infoCurso.classList.add("info-curso");

  if (cursosSeleccionados.length === 0) {
    infoCurso.innerHTML = `<p>No seleccionaste ningún curso.</p>`;
  } else {
    infoCurso.innerHTML = `<h3>Cursos seleccionados:</h3>`;
    const lista = document.createElement("ul");

    cursosSeleccionados.forEach(curso => {
      const precio = cursosPrecios[curso.toLowerCase()] || 0;
      total += precio;
      const li = document.createElement("li");
      li.textContent = `${curso} - $${precio.toLocaleString("es-AR")}`;
      lista.appendChild(li);
    });

    infoCurso.appendChild(lista);
    infoCurso.innerHTML += `<p><strong>Total: $${total.toLocaleString("es-AR")}</strong></p>`;
  }

  const contenedorFormulario = BUSCADOR.buscarUnElemento(".formulario-inscripcion");
  if (contenedorFormulario) contenedorFormulario.prepend(infoCurso);

  // Elementos del formulario
  const form = BUSCADOR.buscarUnElementoPorId("formulario-pago");
  const nombre = BUSCADOR.buscarUnElementoPorId("nombre-titular");
  const email = BUSCADOR.buscarUnElementoPorId("email");
  const numeroTarjeta = BUSCADOR.buscarUnElementoPorId("numero-tarjeta");
  const vencimiento = BUSCADOR.buscarUnElementoPorId("vencimiento");
  const codigoSeguridad = BUSCADOR.buscarUnElementoPorId("codigo-seguridad");
  const popup = BUSCADOR.buscarUnElementoPorId("popup");
  const cerrarPopup = BUSCADOR.buscarUnElemento(".cerrar-popup");

  if (!form) return;

  // Listener submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErrores();

    let esValido = true;

    if (nombre.value.trim() === "") {
      mostrarError(nombre, "El nombre es obligatorio.");
      esValido = false;
    } else if (nombre.value.trim().length < 3) {
      mostrarError(nombre, "El nombre debe tener al menos 3 letras.");
      esValido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
      mostrarError(email, "El email es obligatorio.");
      esValido = false;
    } else if (!emailRegex.test(email.value)) {
      mostrarError(email, "Formato de email no válido");
      esValido = false;
    }

    const numeroSinEspacios = numeroTarjeta.value.replace(/\s/g, "");
    if (numeroSinEspacios === "") {
      mostrarError(numeroTarjeta, "El número de tarjeta es obligatorio.");
      esValido = false;
    } else if (!/^\d{13,19}$/.test(numeroSinEspacios)) {
      mostrarError(numeroTarjeta, "Debe tener entre 13 y 19 dígitos numéricos.");
      esValido = false;
    }

    const valorVencimiento = vencimiento.value.replace(/\s/g, "");
    if (valorVencimiento === "") {
      mostrarError(vencimiento, "La fecha de expiración es obligatoria.");
      esValido = false;
    } else if (!/^(0[1-9]|1[0-2])[0-9]{2}$/.test(valorVencimiento)) {
      mostrarError(vencimiento, "Formato incorrecto (MMAA, ej: 1231).");
      esValido = false;
    }

    if (codigoSeguridad.value.trim() === "") {
      mostrarError(codigoSeguridad, "El código de seguridad es obligatorio.");
      esValido = false;
    } else if (!/^\d{3}$/.test(codigoSeguridad.value.trim())) {
      mostrarError(codigoSeguridad, "Debe tener 3 dígitos numéricos.");
      esValido = false;
    }

    if (esValido) {
      popup.style.display = "flex";
      resetearCarrito();
    }
  });

  cerrarPopup?.addEventListener("click", () => {
    popup.style.display = "none";
    form.reset();
  });

  // Funciones auxiliares
  function mostrarError(input, mensaje) {
    const contenedor = input.parentElement;
    let error = contenedor.querySelector(".error-mensaje");
    if (!error) {
      error = document.createElement("small");
      error.classList.add("error-mensaje");
      contenedor.appendChild(error);
    }
    error.textContent = mensaje;
    input.classList.add("input-error");
  }

  function limpiarErrores() {
    BUSCADOR.buscarVariosElementos(".error-mensaje").forEach(e => e.remove());
    BUSCADOR.buscarVariosElementos(".input-error").forEach(i => i.classList.remove("input-error"));
  }

  function resetearCarrito() {
    const contador = BUSCADOR.buscarUnElementoPorId("cart-count");
    if (contador) contador.textContent = "0";
  }
}
