import { BuscadorElementos } from "./buscadorElementos.js";
import { vaciarCarrito } from './carritoDeCompras.js';

// Definimos el costo administrativo aquí para el cálculo detallado en el resumen
const COSTO_ADMINISTRATIVO_ARS = 50000;

export function iniciarFormularioDePago() {
  const BUSCADOR = new BuscadorElementos();
  
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const carritoActual = JSON.parse(localStorage.getItem(`carrito_${user?.email}`)) || [];
  
  let total = 0;
  const infoCurso = document.createElement("div");
  infoCurso.classList.add("info-curso");

  if (carritoActual.length === 0) {
    infoCurso.innerHTML = `<p>No hay cursos en el carrito.</p>`;
  } else {
    // 1. Iniciar el resumen
    infoCurso.innerHTML = `<h3>Resumen de compra:</h3>`;
    const lista = document.createElement("ul");
    let detalleAdministrativo = '';
    let hayDetalleAdmin = false;

    carritoActual.forEach(item => {
      const precioUnitario = item.precio || 0;
      const cantidad = item.cantidad || 1;
      const subtotalItem = precioUnitario * cantidad;
      total += subtotalItem;
      
      let nombreItem = item.titulo;
      const li = document.createElement("li");
      
      if (item.tipo === 'empresa') {
        const precioBaseUnitario = precioUnitario - COSTO_ADMINISTRATIVO_ARS;
        const costoAdministrativoTotal = COSTO_ADMINISTRATIVO_ARS * cantidad;
        const subtotalCursos = precioBaseUnitario * cantidad;

        hayDetalleAdmin = true;
        
        nombreItem = `${item.titulo} (Empresa: ${cantidad} pers.)`;
        
        // 2. Simplificar la presentación del desglose
        detalleAdministrativo += `
          <li>Costo Base Curso (${cantidad} uds.): ${subtotalCursos.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}</li>
          <li>Costo Administrativo (${cantidad} uds. x ${COSTO_ADMINISTRATIVO_ARS.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}): ${costoAdministrativoTotal.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}</li>
        `;
        
        li.innerHTML = `<strong>${nombreItem}</strong>: ${subtotalItem.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}`;
        
      } else if (item.tipo === 'giftcard') {
        nombreItem = `${item.titulo}`;
        li.innerHTML = `<strong>${nombreItem}</strong>: ${subtotalItem.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}`;
      } else {
        nombreItem = item.titulo;
        li.textContent = `${nombreItem} - ${precioUnitario.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })} x ${cantidad}`;
      }
      
      lista.appendChild(li);
    });

    infoCurso.appendChild(lista);
    
    // 3. Mostrar el desglose administrativo como un grupo separado (más limpio)
    if (hayDetalleAdmin) {
         infoCurso.innerHTML += `<p><strong>Desglose por Inscripción de Empresa:</strong></p>`;
         infoCurso.innerHTML += `<ul class="detalle-costos-empresa">${detalleAdministrativo}</ul>`;
    }
    
    // 4. Mostrar el total final
    infoCurso.innerHTML += `<p><strong>Total Final a Pagar: ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</strong></p>`;
  }

  const contenedorFormulario = BUSCADOR.buscarUnElemento(".formulario-inscripcion");
  if (contenedorFormulario) contenedorFormulario.prepend(infoCurso);


  const form = BUSCADOR.buscarUnElementoPorId("formulario-pago");
  const nombre = BUSCADOR.buscarUnElementoPorId("nombre-titular");
  const email = BUSCADOR.buscarUnElementoPorId("email");
  const numeroTarjeta = BUSCADOR.buscarUnElementoPorId("numero-tarjeta");
  const vencimiento = BUSCADOR.buscarUnElementoPorId("vencimiento");
  const codigoSeguridad = BUSCADOR.buscarUnElementoPorId("codigo-seguridad");
  const popup = BUSCADOR.buscarUnElementoPorId("popup");
  const cerrarPopup = BUSCADOR.buscarUnElemento(".cerrar-popup");

  if (!form) return;

  // VALIDACION PARA LA FECHA DE VENCIMIENTO, CUANDO ESCRIBA LOS NUMEROS QUE SE AGREGUE LA / AUTOMATICAMENTE
 vencimiento.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, ""); //PERMITE SOLO NUMEROS /D --> NO DIGITO.
    if (valor.length > 4) {
      // slice te da los caracteres desde la posicion que le indiques.
      // desde cero hasta antes del 4, no lo incluye
      valor = valor.slice(0, 4);
    }
    let mes = valor.slice(0, 2);
    let anio = valor.slice(2);
    if (valor.length >= 3) {
      e.target.value = `${mes}/${anio}`;
    } else {
      e.target.value = mes;
    }
  });

  // PARA CUANDO PONGA EL NUMERO DE LA TARJETA LE AGREGUE ESPACIOS 
  numeroTarjeta.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
     
   const grupos = [];
  for (let i = 0; i < valor.length; i += 4) {
    grupos.push(valor.slice(i, i + 4));
  }
  // LE AGREGA EL ESPACIO A LOS NUMEROS
  e.target.value = grupos.join(" ");
});


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

    const valorVencimiento = vencimiento.value.replace(/\D/g, ""); 
    if (valorVencimiento === "") {
      mostrarError(vencimiento, "La fecha de expiración es obligatoria.");
      esValido = false;
    } else if (!/^(0[1-9]|1[0-2])[0-9]{2}$/.test(valorVencimiento)) {
      mostrarError(vencimiento, "Formato incorrecto (MM/AA, ej: 12/31).");
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
      console.log('🎯 PAGO EXITOSO - llamando a vaciarCarrito()');
      popup.style.display = "flex";

      if (infoCurso && infoCurso.parentNode) {
      infoCurso.parentNode.removeChild(infoCurso);
    }
        vaciarCarrito();
    }
  });

  cerrarPopup?.addEventListener("click", () => {
    popup.style.display = "none";
    form.reset();
  });

function mostrarError(input, mensaje) {
  
  let error = input.nextElementSibling; // para buscar un error

  if (!error || !error.classList.contains("error-mensaje")) {
    error = document.createElement("div");
    error.classList.add("error-mensaje");

    // SE INSERTA EL MSJ DE ERROR DESPUES DEL INPUT
    input.insertAdjacentElement("afterend", error);
  }
  
  error.textContent = mensaje;
  input.classList.add("input-error");
}

  function limpiarErrores() {
    BUSCADOR.buscarVariosElementos(".error-mensaje").forEach(e => e.remove());
    BUSCADOR.buscarVariosElementos(".input-error").forEach(i => i.classList.remove("input-error"));
  }
}