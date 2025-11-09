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

    const TITULO_MES_ANIO = BUSCADOR.buscarUnElemento('.js-titulo');
    const DIAS = BUSCADOR.buscarUnElemento('.js-calendar-numbers');

    function calendario(fecha) {
      DIAS.innerHTML = '';

      const ANIO = fecha.getFullYear();
      const MES = fecha.getMonth();
      const NOMBRE_MES = fecha.toLocaleDateString('es-ES', { month: 'long' });

      const PRIMER_DIA_DEL_MES = new Date(ANIO, MES, 1);
      const ULTIMO_DIA_DEL_MES = new Date(ANIO, MES + 1, 0);

      const PRIMER_DIA_SEMANA = PRIMER_DIA_DEL_MES.getDay();
      const TOTAL_DIAS = ULTIMO_DIA_DEL_MES.getDate();

      // Días vacíos antes del día 1
      for (let i = 0; i < PRIMER_DIA_SEMANA; i++) {
        const DIA_VACIO = CREADOR.crearUnElemento('article');
        DIA_VACIO.classList.add('dia');
        DIAS.appendChild(DIA_VACIO);
      }

      const HOY = new Date();

      // Días del mes
      for (let i = 1; i <= TOTAL_DIAS; i++) {
        const DIA_VALIDO = CREADOR.crearUnElemento('article');
        DIA_VALIDO.classList.add('dia', 'diaValido');
        DIA_VALIDO.textContent = i;

        // Fecha formateada para buscar en el array
        const fechaISO = `${ANIO}-${String(MES + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const cursosDelDia = CURSOS_CALENDARIO.find(c => c.fecha === fechaISO);

        // marcar el día actual
        if (i === HOY.getDate() && MES === HOY.getMonth() && ANIO === HOY.getFullYear()) {
          DIA_VALIDO.classList.add('dia-actual');
        }

        // mostrar cursos del día
          if (cursosDelDia) {
          cursosDelDia.cursos.forEach(curso => {
            const enlace = CREADOR.crearUnElemento("span");
            enlace.textContent = curso.nombre;
            enlace.classList.add("curso-en-calendario");
            enlace.title = curso.nombre;

            enlace.addEventListener("click", (e) => {
              e.stopPropagation();
              mostrarPopup(curso);
            });

            DIA_VALIDO.appendChild(enlace);
          });

          DIA_VALIDO.classList.add("dia-curso");
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
    }

    calendario(fechaActual);

function mostrarPopup(curso) {
  const fondoPopup = CREADOR.crearUnElemento("div");
  fondoPopup.classList.add("popup-fondo");

  const ventanaPopup= CREADOR.crearUnElemento("div");
 ventanaPopup.classList.add("popup");

  ventanaPopup.innerHTML = `
    <h3>${curso.nombre}</h3>
    <p>${curso.mensaje || "Conocé más sobre este curso y anotate."}</p>
    <a href="${curso.url}">
      <button class="popup-boton">Ver detalle del curso</button>
    </a>
    <button class="popup-agregarCarrito popup-boton js-producto-agregar" data-id="${curso.id}">Agregar al carrito
</button>
    <button class="popup-cerrar">Cerrar</button>
  `;

  fondoPopup.appendChild(ventanaPopup);
  document.body.appendChild(fondoPopup);

  // Cerrar popup al hacer click en el botón o fuera del popup
  ventanaPopup.querySelector(".popup-cerrar").addEventListener("click", () => fondoPopup.remove());
  fondoPopup.addEventListener("click", e => { if (e.target === fondoPopup) fondoPopup.remove(); });
}
  }
}