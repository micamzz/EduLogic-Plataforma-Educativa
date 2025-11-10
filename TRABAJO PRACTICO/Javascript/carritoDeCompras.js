import { BuscadorElementos } from "./buscadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";

const BUSCADOR = new BuscadorElementos();
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const email = currentUser?.email;
let PRODUCTOS_EN_CARRITO = [];

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
  const total = PRODUCTOS_EN_CARRITO.reduce((acum, curso) => acum + (curso.cantidad || 1), 0);
  contador.textContent = total;
}

function renderCarrito() {
  const contenedor = BUSCADOR.buscarUnElemento("#js-caja-carrito");
  if (!PRODUCTOS_EN_CARRITO.length) {
    contenedor.innerHTML = `<div class="carrito-vacio"><p>No hay cursos agregados en el carrito.</p></div>`;
    return;
  }

  let subtotal = 0;
  const estoyEnPaginas = window.location.pathname.includes("/paginas/");
  let html = `<div class="carrito-contenido"><h3 class="js-titulo-carrito">Carrito</h3>`;

  PRODUCTOS_EN_CARRITO.forEach(curso => {
    const cantidad = curso.cantidad || 1;
    subtotal += curso.precio * cantidad;
    let imagenSrc = curso.imagen;
    if (!estoyEnPaginas) imagenSrc = imagenSrc.replace("../", "./");

    html += `
      <article class="carrito-item">
        <div class="carrito-item-info">
          <div class="carrito-boton-eliminar">
            <img src="${imagenSrc}" alt="${curso.titulo}" class="js-img-curso">
            <button class="carrito-eliminar" data-id="${curso.id}">&times;</button>
          </div>
          <h4 class="js-titulo-curso">${curso.titulo}</h4>
          <p class="js-precio-carrito-curso">Precio: ${curso.precio.toLocaleString("es-AR",{style:"currency",currency:"ARS"})}</p>
          <p class="js-cantidad-carrito-curso">Cantidad: ${cantidad}</p>
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
      const item = PRODUCTOS_EN_CARRITO.find(c => c.id === id);
      if (!item) return;
      if ((item.cantidad || 1) > 1) item.cantidad--;
      else PRODUCTOS_EN_CARRITO = PRODUCTOS_EN_CARRITO.filter(c => c.id !== id);
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

export function agregarAlCarrito(idCurso) {
  if (!idCurso) return;
  const producto = LISTA_CURSOS.find(c => c.id === idCurso);
  if (!producto) return;
  const existe = PRODUCTOS_EN_CARRITO.find(c => c.id === idCurso);
  if (existe) existe.cantidad++;
  else PRODUCTOS_EN_CARRITO.push({ ...producto, cantidad: 1 });
  guardarCarrito();
  actualizarContador();
  if (carritoAbierto()) renderCarrito();
}
export function agregarGiftCardAlCarrito(giftCard) {
  if (!giftCard || !giftCard.id) return;
  
  const existe = PRODUCTOS_EN_CARRITO.find(p => p.id === giftCard.id);
  if (existe) existe.cantidad++;
  else PRODUCTOS_EN_CARRITO.push({ ...giftCard, cantidad: giftCard.cantidad || 1 });
  
  guardarCarrito();
  actualizarContador();
  if (carritoAbierto()) renderCarrito();
}


export function vaciarCarrito() {
  console.log('🔄 EJECUTANDO vaciarCarrito()');
  
  const user = JSON.parse(localStorage.getItem("currentUser"));
  console.log('👤 Usuario actual:', user);
  console.log('📧 Email del usuario:', user?.email);
  
  // Verificar estado ANTES de vaciar
  const carritoAntes = localStorage.getItem(`carrito_${user?.email}`);
  console.log('📦 Carrito en localStorage ANTES:', carritoAntes);
  console.log('📦 PRODUCTOS_EN_CARRITO ANTES:', PRODUCTOS_EN_CARRITO);
  
  if (user?.email) {
 
    PRODUCTOS_EN_CARRITO = [];
    
    localStorage.setItem(`carrito_${user.email}`, JSON.stringify([]));
    

    const carritoDespues = localStorage.getItem(`carrito_${user.email}`);
   
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
    
    // Usar setTimeout para que no bloquee el login
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