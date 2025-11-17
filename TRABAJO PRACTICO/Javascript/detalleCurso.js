import { LISTA_CURSOS } from "../Javascript/constantes/ArrayDeCursos.js";
import { BuscadorElementos } from "./buscadorElementos.js";

const BUSCADOR = new BuscadorElementos();

export class DetalleCursos {
  MostrarModulos() {
    //extrae el nombre del curso de la URL
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = params.get("curso");

    const curso = LISTA_CURSOS.find(cursoActual => cursoActual.titulo.toLowerCase() === nombreCurso.toLowerCase());

    const contenedor = BUSCADOR.buscarUnElementoPorId("js-curso-detalle");

    if (!curso) {
        if (contenedor) {
             contenedor.innerHTML = '<section class="block-informacion-curso"><h1>Curso no encontrado</h1><p>Por favor, asegúrate de que el curso exista o intenta buscarlo en el catálogo.</p></section>';
        }
        return; 
    }
    
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
    let modulosHTML = "";//variable para ir guardando los modulos

    for (let i = 0; i < modulos.length; i++) {
      const mod = modulos[i];

      modulosHTML += `<details ${i === 0 ? "open" : ""}>`;//widget desplegable=details
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

    // PARA EL ASIDE MOSTRAR OTROS CURSOS
    this.mostrarCursosRelacionados(curso);
  }

  // MÉTODO PARA MOSTRAR CURSOS RELACIONADOS
  mostrarCursosRelacionados(cursoActual) {
    console.log('🎯 Buscando contenedor para cursos relacionados...');
    
    // Buscar el contenedor correcto según tu HTML
    let contenedorRelacionados = BUSCADOR.buscarUnElementoPorId("js-cursos-relacionados");
    
    console.log('🔍 Contenedor js-cursos-relacionados:', contenedorRelacionados);

    if (!contenedorRelacionados) {
        console.log('⚠️ No se encontró el contenedor js-cursos-relacionados');
        return; // No hacer nada si no existe
    }

    console.log('📚 Mostrando cursos relacionados para:', cursoActual.titulo);

    // FILTRA POR LOS CURSOS QUE SEA DIFERENTE AL QUE ESTA SELECCIONADO
    const cursosRelacionados = LISTA_CURSOS.filter(cursoItem => cursoItem.titulo !== cursoActual.titulo);

    // MUESTRA EL SLICE -- EL 5 ES EL MAXIMO DE CURSOS QUE MUESTRA.
    const sugerencias = cursosRelacionados.slice(0, 5);

    console.log('📚 Cursos relacionados encontrados:', sugerencias.length);

    // PARA CONSTRUIR EL TEMPLATE DE CURSOS SUGERIDOS DEL HTML.
    let sugeridosHTML = "";

    //ciclo q recorre los cursos sugeridos y los agrega al HTML
    for (const sugerido of sugerencias) {
      sugeridosHTML += `
        <div class="slider-slide">
          <a href="./detalleCurso.html?curso=${encodeURIComponent(sugerido.titulo)}" class="course-card">
            <article>
              <img src="${sugerido.imagen}" alt="Curso de ${sugerido.titulo}">
              <h3>${sugerido.titulo}</h3>
              <p>Duración: ${sugerido.duracion}</p>
              <p class="price">${sugerido.precio} ARS</p>
              <h4>Ver Detalle</h4>
            </article>
          </a>
        </div>
      `;
    }

    // INSERTÁ EL CONTENIDO EN EL SLIDER
    if (sugeridosHTML) {
        contenedorRelacionados.innerHTML = sugeridosHTML;
        console.log('✅ Cursos relacionados insertados correctamente en el slider');
        
        // Inicializar el slider después de agregar los cursos
        this.inicializarSlider();
    } else {
        console.log('⚠️ No hay cursos relacionados para mostrar');
        contenedorRelacionados.innerHTML = '<p>No hay cursos relacionados disponibles en este momento.</p>';
    }
  }

  // MÉTODO PARA INICIALIZAR EL SLIDER
  inicializarSlider() {
    const track = BUSCADOR.buscarUnElementoPorId("js-cursos-relacionados");
    const slides = track.querySelectorAll('.slider-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const pagination = document.querySelector('.slider-pagination');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slidesToShow = this.getSlidesToShow();

    // Crear paginación
    if (pagination) {
        const totalSlides = Math.ceil(slides.length / slidesToShow);
        pagination.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `pagination-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            pagination.appendChild(dot);
        }
    }

    // Configurar botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Actualizar slider
    this.updateSlider();
  }

  getSlidesToShow() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  updateSlider() {
    const track = BUSCADOR.buscarUnElementoPorId("js-cursos-relacionados");
    const slides = track.querySelectorAll('.slider-slide');
    const slidesToShow = this.getSlidesToShow();
    const slideWidth = 100 / slidesToShow;
    
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    
    // Actualizar paginación
    const dots = document.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
  }

  nextSlide() {
    const slides = document.querySelectorAll('.slider-slide');
    const slidesToShow = this.getSlidesToShow();
    const maxIndex = Math.ceil(slides.length / slidesToShow) - 1;
    
    currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    this.updateSlider();
  }

  prevSlide() {
    const slides = document.querySelectorAll('.slider-slide');
    const slidesToShow = this.getSlidesToShow();
    const maxIndex = Math.ceil(slides.length / slidesToShow) - 1;
    
    currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    this.updateSlider();
  }

  goToSlide(index) {
    const slides = document.querySelectorAll('.slider-slide');
    const slidesToShow = this.getSlidesToShow();
    const maxIndex = Math.ceil(slides.length / slidesToShow) - 1;
    
    currentIndex = Math.min(Math.max(index, 0), maxIndex);
    this.updateSlider();
  }

  // PARA LLAMAR AL CURSO DESDE EL JS PRINCIPAL
  static mostrarDetalleDeCurso() {
    const detalle = new DetalleCursos();
    detalle.MostrarModulos();
  }
}

// Variables globales para el slider
let currentIndex = 0;