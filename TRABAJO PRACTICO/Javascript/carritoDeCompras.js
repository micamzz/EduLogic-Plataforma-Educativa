// TRABAJO PRACTICO/Javascript/carritoDeCompras.js

import { BuscadorElementos } from "./buscadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";

const BUSCADOR = new BuscadorElementos();
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const email = currentUser?.email;
let PRODUCTOS_EN_CARRITO = [];

// Definimos el costo administrativo aquí para el cálculo detallado
const COSTO_ADMINISTRATIVO_ARS = 50000;

if (email) {
  PRODUCTOS_EN_CARRITO = JSON.parse(localStorage.getItem(`carrito_${email}`)) || [];
}

// Guardar carrito del usuario actual
function guardarCarrito() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user?.email) return;
  localStorage.setItem(`carrito_${user.email}`, JSON.stringify(PRODUCTOS_EN_CARRITO));
}

function carritoAbierto() {
  const checkbox = BUSCADOR.buscarUnElemento("#Carro");
  return checkbox && checkbox.checked;
}

export function actualizarContador() {
   const contador = BUSCADOR.buscarUnElemento("#cart-count");

  if (!contador) {
    return;
  }

  const total = PRODUCTOS_EN_CARRITO.reduce(
    (acum, curso) => acum + (curso.cantidad || 1),
    0
  );
  contador.textContent = total;
}

function renderCarrito() {
  const contenedor = BUSCADOR.buscarUnElemento("#js-caja-carrito");
  if (!PRODUCTOS_EN_CARRITO.length) {
    contenedor.innerHTML = `<div class="carrito-vacio"><p>Todavía no se obtuvieron
cursos</p></div>`;
    return;
  }

  let subtotal = 0;
  const estoyEnPaginas = window.location.pathname.includes("/paginas/");
  let html = `<div class="carrito-contenido"><h3 class="js-titulo-carrito">Carrito</h3>`;

  PRODUCTOS_EN_CARRITO.forEach(curso => {
    const cantidad = curso.cantidad || 1;
    const precioUnitario = curso.precio;
    subtotal += precioUnitario * cantidad;
    let imagenSrc = curso.imagen;
    if (!estoyEnPaginas) imagenSrc = imagenSrc.replace("../", "./");
    
    // Modificar título y detalle de precio para reflejar el tipo
    let titulo = curso.titulo;
    const tipo = curso.tipo || 'curso'; 
    let detallePrecio = ''; 
    let cantidadTexto = `Cantidad de Unidades: ${cantidad}`;
    
    if (tipo === 'empresa') {
        const precioBaseUnitario = precioUnitario - COSTO_ADMINISTRATIVO_ARS;
        const costoAdministrativoTotal = COSTO_ADMINISTRATIVO_ARS * cantidad;
        const subtotalCursos = precioBaseUnitario * cantidad;
        
        titulo = `${curso.titulo} (Empresa: ${cantidad} pers.)`;
        cantidadTexto = `Total Personas: ${cantidad}`;
        
        detallePrecio = `
          <p class="js-precio-carrito-curso">Precio Base (c/u): ${precioBaseUnitario.toLocaleString("es-AR",{style:"currency",currency:"ARS"})}</p>
          <p class="js-precio-carrito-curso">Adicional Admin. (c/u): ${COSTO_ADMINISTRATIVO_ARS.toLocaleString("es-AR",{style:"currency",currency:"ARS"})}</p>
            `;
        
    } else if (tipo === 'giftcard') {
        titulo = `${curso.titulo} (Gift Card)`;
        detallePrecio = `<p class="js-precio-carrito-curso">Monto: ${precioUnitario.toLocaleString("es-AR",{style:"currency",currency:"ARS"})}</p>`;
    } else {
        // Default course logic
        titulo = curso.titulo;
        detallePrecio = `<p class="js-precio-carrito-curso">Precio Unitario: ${precioUnitario.toLocaleString("es-AR",{style:"currency",currency:"ARS"})}</p>`;
    }


    html += `
      <article class="carrito-item">
        <div class="carrito-item-info">
          <div class="carrito-boton-eliminar">
            <img src="${imagenSrc}" alt="${titulo}" class="js-img-curso">
            <button class="carrito-eliminar" data-id="${curso.id}" data-tipo="${tipo}">&times;</button>
          </div>
          <h4 class="js-titulo-curso">${titulo}</h4>
          ${detallePrecio}
          <p class="js-cantidad-carrito-curso">${cantidadTexto}</p>
        </div>
      </article>
    `;
  });

  const hrefPago = estoyEnPaginas ? './formularioDePago.html' : './paginas/formularioDePago.html';
 

  html += `
    <div class="carrito-subtotal">
      <p class="carrito-subtotal-texto">Subtotal: ${subtotal.toLocaleString("es-AR",{style:"currency",currency:"ARS"})}</p>
      <div class="carrito-pagar-vaciar">
        <a href="${hrefPago}" class="carrito-pagar-boton">Ir a pagar</a>
        <button class="carrito-vaciar">Vaciar carrito</button>
      </div>
    </div>
  </div>
  `;

  contenedor.innerHTML = html;

  contenedor.querySelectorAll(".carrito-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const tipo = btn.dataset.tipo; 
      
      const item = PRODUCTOS_EN_CARRITO.find(c => c.id === id && (c.tipo || 'curso') === tipo);
      if (!item) return;
      if ((item.cantidad || 1) > 1) item.cantidad--;
      
      else PRODUCTOS_EN_CARRITO = PRODUCTOS_EN_CARRITO.filter(c => !(c.id === id && (c.tipo || 'curso') === tipo)); 
      
      guardarCarrito();
      actualizarContador();
      renderCarrito();
    });
  });

  const botonVaciar = contenedor.querySelector(".carrito-vaciar");
  if (botonVaciar) botonVaciar.addEventListener("click", () => {
    PRODUCTOS_EN_CARRITO = [];
    guardarCarrito();
    actualizarContador();
    renderCarrito();
  });
}

/**
 * Agrega un producto estándar o un producto personalizado al carrito.
 */
export function agregarCustomAlCarrito(item) {
    if (!item || !item.id) return;
    
    const tipo = item.tipo || 'curso'; 

    const existe = PRODUCTOS_EN_CARRITO.find(p => p.id === item.id && (p.tipo || 'curso') === tipo);
    
    if (existe) {
        existe.cantidad += item.cantidad || 1;
    } else {
        PRODUCTOS_EN_CARRITO.push({ ...item, tipo: tipo, cantidad: item.cantidad || 1 });
    }
    
    guardarCarrito();
    actualizarContador();
    if (carritoAbierto()) renderCarrito();
}

/**
 * Agrega un curso estándar (sin modificar el precio) al carrito.
 */
export function agregarAlCarrito(idCurso) {
  if (!idCurso) return;
  const producto = LISTA_CURSOS.find(c => c.id === idCurso);
  if (!producto) return;
  
  agregarCustomAlCarrito({ ...producto, tipo: 'curso', cantidad: 1 });
}

export function agregarGiftCardAlCarrito(giftCard) {
  const item = { ...giftCard, tipo: 'giftcard', cantidad: giftCard.cantidad || 1 }; 
  agregarCustomAlCarrito(item);
}


export function vaciarCarrito() {
  
  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  if (user?.email) {
 
    PRODUCTOS_EN_CARRITO = [];
    
    localStorage.setItem(`carrito_${user.email}`, JSON.stringify([]));
   
    actualizarContador();
    
    const carritoCheckbox = document.querySelector('#Carro');
    if (carritoCheckbox?.checked) {
      renderCarrito();
    }
    
  } 
  
}

export function inicializarCarrito() {
   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn && currentUser?.email) {
        PRODUCTOS_EN_CARRITO = JSON.parse(localStorage.getItem(`carrito_${currentUser.email}`)) || [];
        actualizarContador();
    } else {
        PRODUCTOS_EN_CARRITO = [];
        actualizarContador();
    }
  const checkbox = BUSCADOR.buscarUnElemento("#Carro");
  if (checkbox) checkbox.addEventListener("change", () => { if (checkbox.checked) renderCarrito(); });

  document.addEventListener("click", e => {
    const btn = e.target.closest(".js-producto-agregar");
    if (!btn) return;
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      e.preventDefault();
      localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
      const hrefLogin = window.location.pathname.includes("/paginas/") ? "./inicioSesion.html" : "./paginas/inicioSesion.html";
      window.location.href = hrefLogin;
      return;
    }
    const idCurso = btn.dataset.id || btn.id;
    agregarAlCarrito(idCurso);
  });
}
export function restaurarCarritoUsuario(email) {
    if (!email) return;
    
    setTimeout(() => {
        try {
            const carritoBackup = JSON.parse(localStorage.getItem(`carrito_backup_${email}`)) || [];
            if (carritoBackup.length > 0) {
                PRODUCTOS_EN_CARRITO = carritoBackup;
                guardarCarrito();
                actualizarContador();
                localStorage.removeItem(`carrito_backup_${email}`);
            }
        } catch (error) {
            console.error('Error restaurando carrito:', error);
        }
    }, 100);
}

export { PRODUCTOS_EN_CARRITO };