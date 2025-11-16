import { LISTA_CURSOS } from "../Javascript/constantes/ArrayDeCursos.js";
import { BuscadorElementos } from "./buscadorElementos.js";

const BUSCADOR = new BuscadorElementos();

export class DetalleCursos {
  render() {
    //extrae el nombre del curso de la URL
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = params.get("curso");

    // PARA BUSCAR EL CURSO DENTRO DEL ARRAY, EL FIND TRAE AL OBJETO.
    // SE PASA A MINUSCULA PARA QUE NO HAYA CONFLICTOS SI EL NOMBRE DEL CURSO ESTA ESCRITO DIFERENTE.
    const curso = LISTA_CURSOS.find(cursoActual => cursoActual.titulo.toLowerCase() === nombreCurso.toLowerCase());

    //  BUSCAR EL CONTENEDOR DEL HTML PARA MOSTRAR EL CURSO
    const contenedor = BUSCADOR.buscarUnElementoPorId("js-curso-detalle");

    // GUARDAR LAS PROPIEDADES DE LOS CURSOS EN VARIABLES.
    const id = curso.id;
    const titulo = curso.titulo;
    const descripcion = curso.descripcion;
    const duracion = curso.duracion;
    const dedicacion = curso.dedicacion;
    const requisitos = curso.requisitos;
    const precio = curso.precio;
    const imagen = curso.imagen;
    const rating = curso.rating;
    const docente = curso.docente;
    const modulos = curso.modulos;

    // RECORRER LOS MODULOS (CONTENIDOS X CLASES) acordeon
    let modulosHTML = "";

    for (let j = 0; j < modulos.length; j++) {
      const mod = modulos[j];

      modulosHTML += `<details ${j === 0 ? "open" : ""}>`;//widget desplegable=details
      modulosHTML += `<summary>${mod.nombre}</summary>`;//titulo del widget
      modulosHTML += `<article class="summary-contenidos_desplegable"><ul>`;//contenido del widget

      // RECORRER LAS CLASES DENTRO DE CADA MODULO
      for (let k = 0; k < mod.clases.length; k++) {
        const clase = mod.clases[k];
        modulosHTML += `
          <li class="summary-contenidos_desplegable_temas">
            <span>${clase}</span>
          </li>`;
      }

      modulosHTML += `</ul></article></details>`;
    }

    // CREAR EL TEMPLATE CON TODA LA INFORMACION DE LOS CURSOS DEL HTML Y LAS CLASES
    const template = `
  <section class="block-informacion-curso">
    <h1>${titulo}</h1>
      <div class="rating-container">
          <span class="star-checked">&#9733;</span>
          <span class="star-checked">&#9733;</span> 
          <span class="star-checked">&#9733;</span> 
          <span class="star-checked">&#9733;</span> 
          <span class="star">&#9733;</span> 
        </div>
    <article class="block-informacion-curso__descripcion">
      <p>${descripcion}</p>
    </article>
  </section>

  <section class="block-informacion-curso__informacion">
    <span class="span-block-informacion-curso__informacion"><h4>Duración:</h4> ${duracion}</span> 
    <span class="span-block-informacion-curso__informacion"><h4>Tiempo de dedicación:</h4> ${dedicacion}</span>
    <span class="span-block-informacion-curso__informacion"><h4>Requisitos previos:</h4> ${requisitos}</span> 
  </section>

  <section class="block-informacion-contenidos">
    <article class="block-informacion-contenidos_temas">
      <h3>Contenidos Por Clase</h3>
      ${modulosHTML}

      <article class="block-informacion-contenidos_precio-y-boton">
        <span class="block-informacion-contenidos__precio">Precio final: ${precio} ARS</span>
        <div class="boton-carrito-inscripcion-curso">
        <a href="../paginas/inscripcionCurso.html"> <button class="block-informacion-contenidos__boton">Inscribirse</button>  
        </a>
         <button class="block-informacion-contenidos__boton js-producto-agregar" data-id="${curso.id}">Agregar al carrito</button>
        </div>
      </article>
    </article>

    <article class="block-informacion-contenidos__imagen">
      <img src="${imagen}" alt="${titulo}" class="block-informacion-contenidos__imagen-propiedades">
    </article>
  </section>

  <div>
    <h2 class="h2-docente-a-cargo">Docente a Cargo</h2>
    <section class="block-informacion-docente">
      <img src="${docente.imagen}" alt="${docente.nombre}" class="block-informacion-docente_imagen">
      <article>
        <h3>${docente.nombre}</h3>
        <h4>${docente.profesion}</h4>
        <div class="rating-container">
          <span class="star-checked">&#9733;</span>
          <span class="star-checked">&#9733;</span> 
          <span class="star-checked">&#9733;</span> 
          <span class="star-checked">&#9733;</span> 
          <span class="star">&#9733;</span> 
        </div>
        <p class="block-informacion-docente_presentacion">${docente.descripcion}</p> 
      </article>
    </section>
  </div>
`;

    contenedor.innerHTML = template;

    // PARA EL SLIDER DE CURSOS RELACIONADOS
    this.renderizarCursosRelacionados(curso);
  }

  renderizarCursosRelacionados(cursoActual) {
    const sliderTrack = BUSCADOR.buscarUnElementoPorId("js-cursos-relacionados");
    const paginationContainer = BUSCADOR.buscarUnElemento(".slider-pagination");

    // FILTRA LOS CURSOS QUE SEA DIFERENTE AL QUE ESTA SELECCIONADO
    const cursosRelacionados = LISTA_CURSOS.filter(
        cursoItem => cursoItem.titulo !== cursoActual.titulo
    );

    // LIMPIA EL CONTENIDO PREVIO
    sliderTrack.innerHTML = "";
    if (paginationContainer) {
        paginationContainer.innerHTML = "";
    }

    // CREA LOS SLIDES
    cursosRelacionados.forEach((curso, index) => {
        const slide = document.createElement("div");
        slide.className = "slider-slide";
        slide.innerHTML = `
            <a href="./detalleCurso.html?curso=${encodeURIComponent(curso.titulo)}" class="course-card">
                <article>
                    <img src="${curso.imagen}" alt="Curso de ${curso.titulo}">
                    <h3>${curso.titulo}</h3>
                    <p>Duración: ${curso.duracion}</p>
                    <p class="price">${curso.precio}</p>
                    <h4>Ver Detalle</h4>
                </article>
            </a>
        `;
        sliderTrack.appendChild(slide);
    });

    // CREA LOS PUNTOS DE PAGINACIÓN
    if (paginationContainer) {
        cursosRelacionados.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.className = `pagination-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', index);
            paginationContainer.appendChild(dot);
        });
    }

    // INICIALIZA EL SLIDER
    this.inicializarSlider();
  }

  inicializarSlider() {
    const track = BUSCADOR.buscarUnElemento(".slider-track");
    const slides = BUSCADOR.buscarVariosElementos(".slider-slide");
    const prevBtn = BUSCADOR.buscarUnElemento(".slider-prev");
    const nextBtn = BUSCADOR.buscarUnElemento(".slider-next");
    const dots = BUSCADOR.buscarVariosElementos(".pagination-dot");

    if (!track || !slides.length) return;

    let currentSlide = 0;
    const slidesPerView = this.calcularSlidesPerView();

    const updateSlider = () => {
        const slideWidth = slides[0].offsetWidth + 20; // width + gap
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const nextSlide = () => {
        const maxSlide = Math.max(0, slides.length - slidesPerView);
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlider();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Navegación por dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Auto-play opcional
    let autoPlay = setInterval(nextSlide, 5000);

    // Pausar auto-play al interactuar
    const sliderContainer = BUSCADOR.buscarUnElemento(".slider-container");
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
        sliderContainer.addEventListener('mouseleave', () => {
            autoPlay = setInterval(nextSlide, 5000);
        });
    }

    // Responsive - recalcular al redimensionar
    window.addEventListener('resize', () => {
        currentSlide = 0;
        updateSlider();
    });

    // Inicializar
    updateSlider();
  }

  calcularSlidesPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;    // Móvil: 1 slide
    if (width < 1024) return 2;   // Tablet: 2 slides
    return 3;                     // Desktop: 3 slides
  }

  // PARA LLAMAR AL CURSO DESDE EL JS PRINCIPAL
  static mostrarDetalleDeCurso() {
    const detalle = new DetalleCursos();
    detalle.render();
  }
}