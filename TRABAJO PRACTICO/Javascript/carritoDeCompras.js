import { BuscadorElementos } from "./buscadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";

const BUSCADOR = new BuscadorElementos();
let PRODUCTOS_EN_CARRITO = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(PRODUCTOS_EN_CARRITO));
}

function carritoAbierto() {
  const checkbox = BUSCADOR.buscarUnElemento("#Carro");
  return checkbox && checkbox.checked;
}

function actualizarContador() {
  const contador = BUSCADOR.buscarUnElemento("#cart-count");
  
  const total = PRODUCTOS_EN_CARRITO.reduce(
    (acum, curso) => acum + (curso.cantidad || 1),
    0
  );
  contador.textContent = total;
}

function renderCarrito() {
  const contenedor = BUSCADOR.buscarUnElemento("#js-caja-carrito");

  if (!PRODUCTOS_EN_CARRITO.length) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
      <p></p>
        <p>No hay cursos agregados en el carrito.</p>
      </div>`;
    return;
  }

  let subtotal = 0;

  // Template 
  let html = `<div class="carrito-contenido">
   <h3 class="js-titulo-carrito">Carrito</h3>
  `;

  PRODUCTOS_EN_CARRITO.forEach(curso => {
    const cantidad = curso.cantidad || 1;

    const precioNumero = curso.precio;
    subtotal += precioNumero * cantidad; 

    const precioFormateado = precioNumero.toLocaleString("es-AR", {style: "currency", currency: "ARS" });

    html += `
      <article class="carrito-item">
        <div class="carrito-item-info">
         <div class="carrito-boton-eliminar">
          <img src="${curso.imagen}" alt="${curso.titulo}" class="js-img-curso"><button class="carrito-eliminar" data-id="${curso.id}">&times;</button>
         </div>
          <h4 class="js-titulo-curso">${curso.titulo}</h4>
          <p class="js-precio-carrito-curso">Precio: ${precioFormateado}</p>
          <p class="js-cantidad-carrito-curso">Cantidad: ${cantidad} </p>
        </div>
      </article>
    `;
  });

  const subtotalFormateado = subtotal.toLocaleString("es-AR", {style: "currency",currency: "ARS" });

  //const hrefPago = window.location.pathname.includes('/paginas/')
    //? './formularioDePago.html'
    //: './paginas/formularioDePago.html';
    const hrefPago = window.location.pathname.includes('/paginas/')
  ? `./formularioDePago.html?curso=${encodeURIComponent(curso.titulo)}&precio=${curso.precio}`
  : `./paginas/formularioDePago.html?curso=${encodeURIComponent(curso.titulo)}&precio=${curso.precio}`;


  html += `
       <div class="carrito-subtotal">
        <p class="carrito-subtotal-texto ">Subtotal: ${subtotalFormateado}</p>
        <div class="carrito-pagar-vaciar">
        <a href="${hrefPago}" class="carrito-pagar-boton">Ir a pagar</a>
        <button class="carrito-vaciar">Vaciar carrito</button>
        </div>
      </div>
    </div>
  `;

  contenedor.innerHTML = html;

  const botonesEliminar = contenedor.querySelectorAll(".carrito-eliminar");

  botonesEliminar.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      const cursoEnCarrito = PRODUCTOS_EN_CARRITO.find(curso => curso.id === id);

      if ((cursoEnCarrito.cantidad || 1) > 1) {
        cursoEnCarrito.cantidad--;
      } else {
        PRODUCTOS_EN_CARRITO = PRODUCTOS_EN_CARRITO.filter(curso => curso.id !== id);
      }

      guardarCarrito();
      actualizarContador();
      renderCarrito();
    });
  });


  const botonVaciar = contenedor.querySelector(".carrito-vaciar");
  if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
      PRODUCTOS_EN_CARRITO = [];      
      guardarCarrito();               
      actualizarContador();           
      renderCarrito();       
    });
  }
}

function agregarAlCarrito(idCurso) {
  if (!idCurso) return;

  const productoAgregado = LISTA_CURSOS.find(curso => curso.id === idCurso);
  if (!productoAgregado) return;

  const existeElProducto = PRODUCTOS_EN_CARRITO.find(curso => curso.id === idCurso);

  if (existeElProducto) {
    existeElProducto.cantidad++;
  } else {
    PRODUCTOS_EN_CARRITO.push({ ...productoAgregado, cantidad: 1 });
  }

  guardarCarrito();
  actualizarContador();

  if (carritoAbierto()) {
    renderCarrito();
  }
}

export function inicializarCarrito() {
  actualizarContador();

  const checkbox = BUSCADOR.buscarUnElemento("#Carro");
  
  if (checkbox) {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        renderCarrito(); 
      }
    });
  }

  // Si no inicio sesion cuando apreta agregar al carrito lo lleva para ahi
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-producto-agregar");
    
    if (!btn) return;

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) { 
      e.preventDefault();
      localStorage.setItem("redirectAfterLogin", location.pathname + location.search);

 
      const hrefLogin = window.location.pathname.includes("/paginas/")
        ? "./inicioSesion.html"        
        : "./paginas/inicioSesion.html"; 

      window.location.href = hrefLogin;
      return;
    }

    const idCurso = btn.dataset.id || btn.id;
    agregarAlCarrito(idCurso);
  });
}