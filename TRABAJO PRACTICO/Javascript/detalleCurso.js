import { LISTA_CURSOS } from "../Javascript/constantes/ArrayDeCursos.js";
import { BuscadorElementos } from "./buscadorElementos.js";

const BUSCADOR = new BuscadorElementos();

export class DetalleCursos {
  render() {

    const params = new URLSearchParams(window.location.search);
    const nombreCurso = params.get("curso");

    // PARA BUSCAR EL CURSO DENTRO DEL ARRAY, EL FIND TRAE AL OBJETO.
    // SE PASA A MINUSCULA PARA QUE NO HAYA CONFLICTOS SI EL NOMBRE DEL CURSO ESTA ESCRITO DIFERENTE.
    const curso = LISTA_CURSOS.find(cursoActual => cursoActual.titulo.toLowerCase() === nombreCurso.toLowerCase());

    //  BUSCAR EL CONTENEDOR DEL HTML PARA MOSTRAR EL CURSO
    const contenedor = BUSCADOR.buscarUnElementoPorId("js-curso-detalle");

    // GUARDAR LAS PROPIEDADES DE LOS CURSOS EN VARIABLES.
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

    // RECORRER LOS MODULOS 
    let modulosHTML = "";

    for (let j = 0; j < modulos.length; j++) {
      const mod = modulos[j];

      modulosHTML += `<details ${j === 0 ? "open" : ""}>`;
      modulosHTML += `<summary>${mod.nombre}</summary>`;
      modulosHTML += `<article class="summary-contenidos_desplegable"><ul>`;

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
        <span class="block-informacion-contenidos__precio">Precio final: ${precio}</span>
          
        <div class="boton-carrito-inscripcion-curso>
          <!-- BOTON INSCRIPCION CURSO DSP BORRAR ESTE COMENTARIO ANTES DE ENTREGAR-->
        <a href="../inscripcionCurso.html">
          <button class="block-informacion-contenidos__boton">Inscribirse</button>  
        </a>
         <!-- BOTON CARRITO  BORRAR COMENTARIO ANTES DE ENTREGAR PORQ SI NO SE VE EN EL DOM-->
        <a href="../inscripcionCurso.html">
          <button class="block-informacion-contenidos__boton">Agregar al carrito</button>  
        </a>
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
const contenedorRelacionados =BUSCADOR.buscarUnElemento(".courses-carousel"); 

// FILTRA POR LOS CURSOS QUE SEA DIFERENTE AL QUE ESTA SELECCIONADO
const cursosRelacionados = LISTA_CURSOS.filter(cursoItem => cursoItem.titulo !== curso.titulo);

// MUESTA EL SLICE -- EL 5 ES EL MAXIMO DE CURSOS QUE MUESTRA.
const sugerencias = cursosRelacionados.slice(0, 5);

// PARA CONSTRUIR EL TEMPLATE DE CURSOS SUGERIDOS DEL HTML.S
let sugeridosHTML = "";

for (const sugerido of sugerencias) {
  sugeridosHTML += `
    <a href="./detalleCurso.html?curso=${encodeURIComponent(sugerido.titulo)}" class="course-card">
      <article>
        <img src="${sugerido.imagen}" alt="Curso de ${sugerido.titulo}">
        <h3>${sugerido.titulo}</h3>
        <p>Duración: ${sugerido.duracion}</p>
        <p class="price">${sugerido.precio}</p>
        <h4>Ver Detalle</h4>
      </article>
    </a>
  `;
}
// INSERTA EL CONTENIDO EN EL CAROUSEL DE CURSOS EN EL DIV.
contenedorRelacionados.innerHTML = sugeridosHTML;
  }
  // PARA LLAMAR AL CURSO DESDE EL JS PRINCIPAL.
  static mostrarDetalleDeCurso() {
    const detalle = new DetalleCursos();
    detalle.render();
  }
  
}

// CARRUSEL DEL ASIDE



