import { BuscadorElementos } from "./buscadorElementos.js";
import { vaciarCarrito } from "./carritoDeCompras.js";
import { ValidadorFormulario } from "./validarFormulario.js";

//costo administrativo para calculo detallado en el resumen
const COSTO_ADMINISTRATIVO_ARS = 50000;

export function iniciarFormularioDePago() {
  const BUSCADOR = new BuscadorElementos();
  

  //trae user loggeado ysu email para buscar su carrito
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const carritoActual = JSON.parse(localStorage.getItem(`carrito_${user?.email}`)) || [];
  //resumen de compra 
  let total = 0;
  const infoCurso = document.createElement("div");
  infoCurso.classList.add("info-curso");

  if (carritoActual.length === 0) {
    infoCurso.innerHTML = `<p>No hay cursos en el carrito.</p>`;
  } else {

    //Inicia el resumen
    infoCurso.innerHTML = `<h3>Resumen de compra:</h3>`;
    const lista = document.createElement("ul");
    let detalleAdministrativo = "";
    let hayDetalleAdmin = false;

    // Recorre los items del carrito para mostrarlos en el resumen
    carritoActual.forEach(item => {
      const precioUnitario = item.precio || 0;
      const cantidad = item.cantidad || 1; 
      const subtotalItem = precioUnitario * cantidad;
      total += subtotalItem;
      
      let nombreItem = item.titulo;//nombre del curso o giftcard 
      const li = document.createElement("li");

      //si es empresa o giftcard hace el desglose especial
      if (item.tipo === "empresa") {
        const precioBaseUnitario = precioUnitario - COSTO_ADMINISTRATIVO_ARS;
        const costoAdministrativoTotal = COSTO_ADMINISTRATIVO_ARS * cantidad;
        const subtotalCursos = precioBaseUnitario * cantidad;

        hayDetalleAdmin = true;
        
        nombreItem = `${item.titulo} (Empresa: ${cantidad} pers.)`;// esto hace que en el resumen se vea que es inscripcion de empresa
        
        //presentación del desglose
        detalleAdministrativo += `
          <li>Costo Base Curso (${cantidad} uds.): ${subtotalCursos.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}</li>
          <li>Costo Administrativo (${cantidad} uds. x ${COSTO_ADMINISTRATIVO_ARS.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}): ${costoAdministrativoTotal.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}</li>
        `;
        
        li.innerHTML = `<strong>${nombreItem}</strong>: ${subtotalItem.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}`;
        
      } else if (item.tipo === "giftcard") {
        nombreItem = `${item.titulo}`;
        li.innerHTML = `<strong>${nombreItem}</strong>: ${subtotalItem.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })}`;
      } else {
        nombreItem = item.titulo;
        li.textContent = `${nombreItem} - ${precioUnitario.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 })} x ${cantidad}`;
      }
      
      lista.appendChild(li);
    });

    infoCurso.appendChild(lista);

    //muestra el desglose administrativo separado
    if (hayDetalleAdmin) {
      infoCurso.innerHTML += `<p><strong>Desglose por Inscripción de Empresa:</strong></p>`;
      infoCurso.innerHTML += `<ul class="detalle-costos-empresa">${detalleAdministrativo}</ul>`;
    }
    
    //muestra total a pagar
    infoCurso.innerHTML += `<p><strong>Total Final a Pagar: ${total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</strong></p>`;
  }

  //FROMULARIO DE PAGO
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
    let valor = e.target.value.replace(/\D/g, ""); // PERMITE SOLO NUMEROS
    if (valor.length > 4) {
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
     
    const grupos = [];//aaray para ir guardando los grupos de 4 numeros
    for (let i = 0; i < valor.length; i += 4) {
      grupos.push(valor.slice(i, i + 4));
    }
    // LE AGREGA EL ESPACIO A LOS NUMEROS
    e.target.value = grupos.join(" ");
   });

  //VALIDACION AL ENVIAR EL FORMULARIO
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarErrores();

    let esValido = true;

    // NOMBRE
    if (!ValidadorFormulario.campoVacio(nombre.value)) {
      mostrarError(nombre, "El nombre es obligatorio.");
      esValido = false;
    } else if (!ValidadorFormulario.longitudMinima(nombre.value, 3)) {
      mostrarError(nombre, ValidadorFormulario.MENSAJES.nombreCorto);
      esValido = false;
    }

    // EMAIL
    if (!ValidadorFormulario.campoVacio(email.value)) {
      mostrarError(email, "El email es obligatorio.");
      esValido = false;
    } else if (!ValidadorFormulario.emailValido(email.value)) {
      mostrarError(email, ValidadorFormulario.MENSAJES.emailInvalido);
      esValido = false;
    }

    // NÚMERO DE TARJETA
    const numeroSinEspacios = numeroTarjeta.value.replace(/\s/g, "");
    if (!ValidadorFormulario.campoVacio(numeroSinEspacios)) {
      mostrarError(numeroTarjeta, ValidadorFormulario.MENSAJES.tarjetaVacia);
      esValido = false;
    } else if (!ValidadorFormulario.numeroTarjetaValido(numeroTarjeta.value)) {
      mostrarError(numeroTarjeta, ValidadorFormulario.MENSAJES.tarjetaInvalida);
      esValido = false;
    }

    // FECHA DE VENCIMIENTO
    if (!ValidadorFormulario.campoVacio(vencimiento.value)) {
      mostrarError(vencimiento, ValidadorFormulario.MENSAJES.vencimientoVacio);
      esValido = false;
    } else if (!ValidadorFormulario.vencimientoValido(vencimiento.value)) {
      mostrarError(vencimiento, ValidadorFormulario.MENSAJES.vencimientoInvalido);
      esValido = false;
    }

    // CÓDIGO DE SEGURIDAD 
    if (!ValidadorFormulario.campoVacio(codigoSeguridad.value)) {
      mostrarError(codigoSeguridad, ValidadorFormulario.MENSAJES.cvvVacio);
      esValido = false;
    } else if (!ValidadorFormulario.cvvValido(codigoSeguridad.value)) {
      mostrarError(codigoSeguridad, ValidadorFormulario.MENSAJES.cvvInvalido);
      esValido = false;
    }


    //TODOS LOS CAMPOS PASARON LA VALIDACION
   if (esValido) {
      
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const carritoActual = JSON.parse(localStorage.getItem(`carrito_${user?.email}`)) || [];

      if (user && carritoActual.length > 0) {
          user.cursosObtenidos = user.cursosObtenidos || [];
          
          carritoActual.forEach(item => {
              const cursoExistente = user.cursosObtenidos.find(c => c.titulo === item.titulo && c.tipo === item.tipo);
              if (cursoExistente) {
                  cursoExistente.cantidad += item.cantidad;
              } else {
              
                  user.cursosObtenidos.push({
                      titulo: item.titulo,
                      precio: item.precio,
                      cantidad: item.cantidad,
                      tipo: item.tipo, 
                      fechaCompra: new Date().toLocaleDateString('es-AR')
                  });
              }
          });

         
          localStorage.setItem('currentUser', JSON.stringify(user));
      }
    
      popup.style.display = "flex";

      if (infoCurso && infoCurso.parentNode) {
        infoCurso.parentNode.removeChild(infoCurso) }
      vaciarCarrito();
    }}); 

  cerrarPopup?.addEventListener("click", (e) => {
    e.preventDefault();  window.location.href = './perfil.html'; });


  //PARA ERRORES
  function mostrarError(input, mensaje) {
    let error = input.nextElementSibling; 

    if (!error || !error.classList.contains("error-mensaje")) {
      error = document.createElement("div");
      error.classList.add("error-mensaje");

      input.insertAdjacentElement("afterend", error);
    }
    
    error.textContent = mensaje;
    input.classList.add("input-error");
  }

  function limpiarErrores() {
    BUSCADOR.buscarVariosElementos(".error-mensaje").forEach(e => e.remove());//elimina todos los mensajes de error
    BUSCADOR.buscarVariosElementos(".input-error").forEach(i => i.classList.remove("input-error"));//elimina la clase de error de los inputs
  }
}
