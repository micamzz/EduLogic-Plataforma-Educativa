import { BuscadorElementos } from "./buscadorElementos.js";
import { CURSOS_CALENDARIO } from "../Javascript/constantes/cursosDelMesCalendario.js";
import { CreadorElementos } from "./creadorElementos.js";

export class Calendario {

  static iniciar() {
    const BUSCADOR = new BuscadorElementos();
    const CREADOR = new CreadorElementos();

    let fechaActual = new Date();

    const BOTON_ATRAS = BUSCADOR.buscarUnElemento('.js-boton-link-atras');
    const BOTON_SIGUENTE = BUSCADOR.buscarUnElemento('.js-boton-link-siguiente');

    // eventos para cambiar de mes
    if (BOTON_ATRAS && BOTON_SIGUENTE) {
      BOTON_ATRAS.addEventListener('click', () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        calendario(fechaActual);
      });

      BOTON_SIGUENTE.addEventListener('click', () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        calendario(fechaActual);
      });
    }

    // elementos del calendario
    const TITULO_MES_ANIO = BUSCADOR.buscarUnElemento('.js-titulo');
    const DIAS = BUSCADOR.buscarUnElemento('.js-calendar-numbers');

    // Función para manejar la visualización según el tamaño de pantalla
    function manejarVisualizacionCursos() {
      const esMovil = window.matchMedia("(max-width: 480px)").matches;
      const botonesCursos = document.querySelectorAll('.boton-cursos-mobile');
      const contenedoresCursos = document.querySelectorAll('.contenedor-cursos-mobile');
      
      botonesCursos.forEach(boton => {
        boton.style.display = esMovil ? 'block' : 'none';
      });
      
      contenedoresCursos.forEach(contenedor => {
        if (esMovil) {
          contenedor.classList.remove('mostrar');
          contenedor.classList.remove('cursos-desktop');
        } else {
          contenedor.classList.add('mostrar');
          contenedor.classList.add('cursos-desktop');
        }
      });
    }

    //MOTOR DEL CALENDARIO
    function calendario(fecha) {
      DIAS.innerHTML = '';//limpia los dias

      const ANIO = fecha.getFullYear();
      const MES = fecha.getMonth();
      const NOMBRE_MES = fecha.toLocaleDateString('es-ES', { month: 'long' });

      //calcula los dias del mes
      const PRIMER_DIA_DEL_MES = new Date(ANIO, MES, 1);
      const ULTIMO_DIA_DEL_MES = new Date(ANIO, MES + 1, 0);

      //obtiene el de la semana del primer dia del mes (0=Domingo, 1=Lunes, ..., 6=Sábado)
      const PRIMER_DIA_SEMANA = PRIMER_DIA_DEL_MES.getDay();
      const TOTAL_DIAS = ULTIMO_DIA_DEL_MES.getDate();

      //dibuja las celdas vacias antes del primer dia
      for (let i = 0; i < PRIMER_DIA_SEMANA; i++) {
        const DIA_VACIO = CREADOR.crearUnElemento('article');
        DIA_VACIO.classList.add('dia');
        DIAS.appendChild(DIA_VACIO);
      }

      const HOY = new Date();//crea la fecha actual para marcar el dia actual

      // Días del mes
      for (let i = 1; i <= TOTAL_DIAS; i++) {
        const DIA_VALIDO = CREADOR.crearUnElemento('article');
        DIA_VALIDO.classList.add('dia', 'diaValido');
        
        // Número del día
        const numeroDia = CREADOR.crearUnElemento('span');
        numeroDia.textContent = i;
        numeroDia.classList.add('numero-dia');
        DIA_VALIDO.appendChild(numeroDia);

        // Fecha formateada para buscar en el array
        const fechaISO = `${ANIO}-${String(MES + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const cursosDelDia = CURSOS_CALENDARIO.find(c => c.fecha === fechaISO);

        // marcar el día actual
        if (i === HOY.getDate() && MES === HOY.getMonth() && ANIO === HOY.getFullYear()) {
          DIA_VALIDO.classList.add('dia-actual');
        }

        // mostrar cursos del día
        if (cursosDelDia) {
          DIA_VALIDO.classList.add("dia-curso");
          
          // Crear botón para móviles
          const botonCursos = CREADOR.crearUnElemento("button");
          botonCursos.classList.add("boton-cursos-mobile");
          botonCursos.textContent = `${cursosDelDia.cursos.length} curso(s)`;
          
          // Crear contenedor para los cursos
          const contenedorCursos = CREADOR.crearUnElemento("div");
          contenedorCursos.classList.add("contenedor-cursos-mobile");
          
          // Crear los enlaces de cursos
          cursosDelDia.cursos.forEach(curso => {
            const enlace = CREADOR.crearUnElemento("span");
            enlace.textContent = curso.nombre;
            enlace.classList.add("curso-en-calendario");
            enlace.title = curso.nombre;

            enlace.addEventListener("click", (e) => {
              e.stopPropagation();
              mostrarPopup(curso);
            });

            contenedorCursos.appendChild(enlace);
          });
          
          // Evento para mostrar/ocultar cursos en móviles
          botonCursos.addEventListener("click", (e) => {
            e.stopPropagation();
            contenedorCursos.classList.toggle("mostrar");
          });
          
          // Agregar elementos al día
          DIA_VALIDO.appendChild(botonCursos);
          DIA_VALIDO.appendChild(contenedorCursos);
        }

        DIAS.appendChild(DIA_VALIDO);
      }

      // Rellenar hasta 35 celdas
      const TOTAL_CELDAS = DIAS.childElementCount;
      for (let i = TOTAL_CELDAS; i < 35; i++) {
        const DIA_VACIO = CREADOR.crearUnElemento('article');
        DIA_VACIO.classList.add('dia');
        DIAS.appendChild(DIA_VACIO);
      }

      // Actualizar el título
      TITULO_MES_ANIO.textContent = `${NOMBRE_MES.toUpperCase()} ${ANIO}`;
      
      // Aplicar visualización correcta según tamaño de pantalla
      setTimeout(manejarVisualizacionCursos, 0);
    }

    calendario(fechaActual);

    // Event listener para cambios de tamaño de pantalla
    window.addEventListener('resize', manejarVisualizacionCursos);

    //pop ups de los cursos al hacer click
    function mostrarPopup(curso) {
      const fondoPopup = CREADOR.crearUnElemento("div");
      fondoPopup.classList.add("popup-fondo");

      const ventanaPopup = CREADOR.crearUnElemento("div");
      ventanaPopup.classList.add("popup");

      ventanaPopup.innerHTML = `
        <h3>${curso.nombre}</h3>
        <p>${curso.mensaje || "Conocé más sobre este curso y anotate."}</p>
        <a href="${curso.url}">
          <button class="popup-boton">Ver detalle del curso</button>
        </a>
        <button class="popup-agregarCarrito popup-boton js-producto-agregar" data-id="${curso.id}">
          Agregar al carrito
        </button>
        <button class="popup-cerrar popup-boton">Cerrar</button>
      `;

      fondoPopup.appendChild(ventanaPopup);
      document.body.appendChild(fondoPopup);

      const botonCerrar = ventanaPopup.querySelector(".popup-cerrar");
      const botonAgregar = ventanaPopup.querySelector(".popup-agregarCarrito");

      // Cerrar popup al hacer click en cerrar
      botonCerrar.addEventListener("click", () => {
        fondoPopup.remove();
      });

      // para mostrar otro popup cuando se agrega al carrito el curso
      botonAgregar.addEventListener("click", () => {
        fondoPopup.remove();
        mostrarPopupAgregadoAlCarrito(curso);
      });
    }

    // popup de confirmacion de agregado al carrito
    function mostrarPopupAgregadoAlCarrito(curso) {
      const fondoPopup = CREADOR.crearUnElemento("div");
      fondoPopup.classList.add("popup-fondo");

      const ventanaPopup = CREADOR.crearUnElemento("div");
      ventanaPopup.classList.add("popup");

      ventanaPopup.innerHTML = `
        <h3>Curso agregado al carrito</h3>
        <p>El curso <strong>${curso.nombre}</strong> fue agregado a tu carrito.</p>
        <button class="popup-boton popup-cerrar2">Aceptar</button>`;

      fondoPopup.appendChild(ventanaPopup);
      document.body.appendChild(fondoPopup);

      const botonCerrar = ventanaPopup.querySelector(".popup-cerrar2"); 

      botonCerrar.addEventListener("click", () => {
        fondoPopup.remove();
      });

      fondoPopup.addEventListener("click", (e) => {
        if (e.target === fondoPopup) {
          fondoPopup.remove();
        }
      });
    }
  }
}