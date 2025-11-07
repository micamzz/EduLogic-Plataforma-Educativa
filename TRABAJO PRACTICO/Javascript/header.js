import { BuscadorElementos } from "../Javascript/buscadorElementos.js";


const BUSCADOR = new BuscadorElementos();


export function manejarBusqueda() {
  const form = BUSCADOR.buscarUnElementoPorId("search-form");
  const input = BUSCADOR.buscarUnElementoPorId("curso-input");
  const options = BUSCADOR.buscarVariosElementos("#cursos-list option");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valor = input.value.trim();
    let destino = null;

    options.forEach(option => {
      if (option.value.toLowerCase() === valor.toLowerCase()) {
        destino = option.dataset.url;
      }
    });

    if (destino) {
      window.location.href = destino;  
    } else {
      
    }
  });
}

//visualizar u ocultar los enlaces del Header
export function manejarVisualizacionHeader() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const perfilLink = document.querySelector('.perfil-link');
    const loginButton = document.querySelector('.login-button');
    const signupButton = document.querySelector('.signup-button');

    if (isLoggedIn) {
        if (perfilLink) perfilLink.style.display = 'block';
        if (loginButton) loginButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'none';
    } else {
        if (perfilLink) perfilLink.style.display = 'none';
        if (loginButton) loginButton.style.display = 'flex'; 
        if (signupButton) signupButton.style.display = 'block';
    }
}
