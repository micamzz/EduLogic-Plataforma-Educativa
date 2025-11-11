import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";
import { agregarAlCarrito } from './carritoDeCompras.js'; 

const BUSCADOR = new BuscadorElementos();
const CREADOR = new CreadorElementos();
const COSTO_POR_PERSONA_USD = 50;

let contadorPersonas = 1;
const tasaCambioDolar = 1000; // Valor fijo de ejemplo para la conversión ARS/USD


// FUNCIONES DE UTILIDAD Y CÁLCULO

/**
 * Genera el HTML para un bloque de campos de persona (solo para modalidad Empresa).
 * @param {number} id - Identificador único de la persona.
 * @param {boolean} esPrimeraPersona - Indica si es el primer bloque (no se puede eliminar).
 * @returns {HTMLElement} El div con los campos de la persona.
 */
function crearBloquePersona(id, esPrimeraPersona = false) {
    const div = CREADOR.crearUnElemento('div');
    div.classList.add('persona-campos', 'persona-empresa', `persona-${id}`);
    div.dataset.id = id;

    div.innerHTML = `
        <h4>Persona ${id}</h4>
        <label>Nombre y Apellido:</label>
        <input type="text" name="nombre_${id}" placeholder="Nombre y Apellido" required minlength="5">
        <label>DNI:</label>
        <input type="text" inputmode="numeric" name="dni_${id}" placeholder="DNI" pattern="[0-9]{8,12}" required minlength="8">
        <label>Email:</label>
        <input type="email" name="email_${id}" placeholder="Email@example.com" required>
        <label>Teléfono:</label>
        <input type="tel" name="telefono_${id}" placeholder="Teléfono" required minlength="8">
        ${esPrimeraPersona ? 
            `<div class="placeholder-boton-quitar"></div>` : 
            `<button type="button" class="boton-quitar-persona" data-id="${id}">&times;</button>`
        }
    `;
    
    // Agregar listener de eliminación si no es la primera persona
    if (!esPrimeraPersona) {
        const btnQuitar = div.querySelector('.boton-quitar-persona');
        btnQuitar.addEventListener('click', () => eliminarPersona(id, div));
    }
    
    // Agregar listeners para el recálculo en cada cambio de input o select
    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', recalcularTotal);
    });

    return div;
}

/* Calcula el total a pagar en la modalidad Empresa.*/
function recalcularTotal() {
    const totalDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar');
    if (!totalDiv) return;

    const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
    const cursoSeleccionado = selectCurso.options[selectCurso.selectedIndex];
    
    const precioBaseARS = parseFloat(cursoSeleccionado.dataset.precio) || 0;
    const numPersonas = BUSCADOR.buscarVariosElementos('.persona-empresa').length;
    
    const costoFijoUSD = COSTO_POR_PERSONA_USD * numPersonas;
    const costoFijoARS = costoFijoUSD * tasaCambioDolar;

    const totalCursoARS = precioBaseARS;
    const totalPagarARS = totalCursoARS + costoFijoARS;

    const precioCursoFormato = totalCursoARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const costoFijoFormato = costoFijoARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const totalFinalFormato = totalPagarARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });

    totalDiv.innerHTML = `
        **Resumen:**
        <p>Curso: **${precioCursoFormato} ARS**</p>
        <p>Costo administrativo (${numPersonas} personas x ${COSTO_POR_PERSONA_USD} USD): **${costoFijoFormato} ARS**</p>
        <p class="resumen-final-total">Total estimado: **${totalFinalFormato} ARS**</p>
    `;
    totalDiv.dataset.totalPagar = totalPagarARS.toFixed(2);
    totalDiv.dataset.costoEmpresa = costoFijoARS.toFixed(2);
    totalDiv.dataset.numPersonas = numPersonas; // Guardar número de personas
}


// FUNCIONES DE MANEJO DE PERSONAS=

/*Agrega un nuevo bloque de campos para una persona*/
function agregarPersona() {
    contadorPersonas++;
    const personasContainer = BUSCADOR.buscarUnElementoPorId('personas-container');
    const nuevoBloque = crearBloquePersona(contadorPersonas);
    personasContainer.appendChild(nuevoBloque);
    recalcularTotal();
}

/**
 * Elimina un bloque de campos de persona.
 * @param {number} id - ID de la persona a eliminar.
 * @param {HTMLElement} elemento - El elemento div que contiene los campos.
 */
function eliminarPersona(id, elemento) {
    // Solo permitir eliminar si no es la primera persona
    if (id !== 1) {
        elemento.remove();
        recalcularTotal(); 
    }
}

/**
 * Limpia los campos de la primera persona (no se elimina, solo se vacía).
 * @param {HTMLElement} primerBloque - El div del primer bloque de campos.
 */
function limpiarPrimeraPersona(primerBloque) {
    if (primerBloque) {
        primerBloque.querySelectorAll('input').forEach(input => {
            input.value = ''; // Limpia el valor
        });
    }
    recalcularTotal();
}

// FUNCIÓN PRINCIPAL Y LISTENERS

export function iniciarLogicaInscripcion() {
    const selectorTipo = BUSCADOR.buscarUnElementoPorId('tipo-inscripcion');
    const form = BUSCADOR.buscarUnElementoPorId('form-inscripcion-curso');
    const camposPersonal = BUSCADOR.buscarUnElementoPorId('campos-personal');
    const camposEmpresa = BUSCADOR.buscarUnElementoPorId('campos-empresa');
    const cursoSeleccionadoContainer = BUSCADOR.buscarUnElementoPorId('curso-seleccionado-container');
    const agregarPersonaBtn = BUSCADOR.buscarUnElementoPorId('agregar-persona-btn');
    const personasContainer = BUSCADOR.buscarUnElementoPorId('personas-container');
    
    // Refe para el pop-up de resumen
    const popup = BUSCADOR.buscarUnElementoPorId('popup');
    const popupPersonal = BUSCADOR.buscarUnElementoPorId('popup-contenido-personal');
    const popupEmpresa = BUSCADOR.buscarUnElementoPorId('popup-contenido-empresa');
    
    if (!selectorTipo || !form || !camposPersonal || !camposEmpresa || !agregarPersonaBtn || !personasContainer || !popup) {
        console.error("Faltan elementos DOM para inicializar la lógica de inscripción.");
        return;
    }
    
    // Agregar listener al botón de agregar persona
    agregarPersonaBtn.addEventListener('click', agregarPersona);
    
    // Listener al select de curso (para recalcular al cambiar el precio base)
    const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
    if (selectCurso) {
        selectCurso.addEventListener('change', () => {
            // Limpiar campos de la primera persona al cambiar de curso
            const primeraPersona = personasContainer.querySelector('.persona-1');
            if (primeraPersona) limpiarPrimeraPersona(primeraPersona);
            
            // Eliminar todas las personas extra
            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(p => {
                if (p.dataset.id !== '1') p.remove();
            });
            contadorPersonas = 1;

            recalcularTotal();
        });
    }
    
    // Inicializar el total con el primer curso seleccionado (si existe)
    if (BUSCADOR.buscarUnElementoPorId('curso-empresa')?.value) {
        recalcularTotal();
    }


    /**
     * Muestra/Oculta campos y configura la validación al cambiar el tipo de inscripción.
     */
    function manejarCambioTipoInscripcion() {
        const tipo = selectorTipo.value;

        if (tipo === 'personal') {
            camposPersonal.style.display = 'block';
            camposEmpresa.style.display = 'none';
            cursoSeleccionadoContainer.style.display = 'block';

            // Marcar campos de empresa como opcionales y de personal como requeridos
            camposEmpresa.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
            camposPersonal.querySelectorAll('input, select').forEach(input => input.setAttribute('required', 'required'));
            
            // Se asume que el primer bloque de persona-empresa (si existe) siempre tiene campos
            // que se deben validar si se está en modo empresa
            
        } else if (tipo === 'empresa') {
            camposPersonal.style.display = 'none';
            camposEmpresa.style.display = 'block';
            cursoSeleccionadoContainer.style.display = 'block';

            // Marcar campos de empresa como requeridos y de personal como opcionales
            camposEmpresa.querySelectorAll('input, select').forEach(input => input.setAttribute('required', 'required'));
            camposPersonal.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
            
            recalcularTotal();
        }
    }

    // Inicializar al cargar y añadir listener
    manejarCambioTipoInscripcion();
    selectorTipo.addEventListener('change', manejarCambioTipoInscripcion);
    
    
    
    // LISTENER DE SUBMIT Y LÓGICA DE VALIDACIÓN/RESUMEN

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Limpiar errores previos 
        BUSCADOR.buscarVariosElementos('.error-mensaje-inscripcion').forEach(el => el.remove());
        
        // La validación simple usando el atributo required
        if (!form.checkValidity()) {
             // Si hay campos inválidos, el navegador detiene el submit y muestra su mensaje.
            
            form.reportValidity(); // Forzar la visualización de los mensajes del navegador.
            return;
        }

        const tipo = selectorTipo.value;
        const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
        const nombreCurso = selectCurso.value;
        const idCurso = LISTA_CURSOS.find(c => c.titulo === nombreCurso)?.id;


        if (tipo === 'personal') {
            //  Lógica Personal 
            
            //  Agregar el curso al carrito 
            if (idCurso) {
                 agregarAlCarrito(idCurso); 
                 console.log(`✅ Curso ${nombreCurso} agregado al carrito para pago personal.`);
            }

            const nombre = BUSCADOR.buscarUnElemento('input[name="nombre_personal"]').value;
            const email = BUSCADOR.buscarUnElemento('input[name="email_personal"]').value;
            const telefono = BUSCADOR.buscarUnElemento('input[name="telefono_personal"]').value;

            BUSCADOR.buscarUnElemento('#resumen-personal-detalle').innerHTML = `
                <ul>
                    <li>**Curso:** ${nombreCurso}</li>
                    <li>**Nombre:** ${nombre}</li>
                    <li>**Email:** ${email}</li>
                    <li>**Teléfono:** ${telefono}</li>
                </ul>
            `;
            
            // Ocultar modal de empresa y mostrar el de personal
            popupEmpresa.style.display = 'none';
            popupPersonal.style.display = 'block';
            
        } else if (tipo === 'empresa') {
            //Lógica Empresa
            const personas = [];
            let esValido = true;
            let resumenHTML = '<ul>';
            
            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(bloque => {
                const id = bloque.dataset.id;
                const nombreInput = bloque.querySelector(`input[name="nombre_${id}"]`);
                const dniInput = bloque.querySelector(`input[name="dni_${id}"]`);
                const emailInput = bloque.querySelector(`input[name="email_${id}"]`);
                const telInput = bloque.querySelector(`input[name="telefono_${id}"]`);

                // Validación simple de que todos los campos de una persona no estén vacíos
                if (!nombreInput.value.trim() || !dniInput.value.trim() || !emailInput.value.trim() || !telInput.value.trim()) {
                    esValido = false;
                    }

                personas.push({
                    nombre: nombreInput.value.trim(),
                    dni: dniInput.value.trim(),
                    email: emailInput.value.trim(),
                    telefono: telInput.value.trim()
                });
                
                resumenHTML += `
                    <li>**Persona ${id}:** ${nombreInput.value.trim()} (DNI: ${dniInput.value.trim()})</li>
                `;
            });
            resumenHTML += '</ul>';
            
            if (!esValido) {
                form.reportValidity();
                return;
            }

            const totalDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar');
            const total = totalDiv.dataset.totalPagar;
            const numPersonas = parseInt(totalDiv.dataset.numPersonas);
            
            //  Agregar el curso al carrito 
             if (idCurso) {
                 for (let i = 0; i < numPersonas; i++) {
                     agregarAlCarrito(idCurso);
                 }
                 console.log(`✅ Curso ${nombreCurso} (${numPersonas} unidades) agregado al carrito para pago empresa.`);
             }

            // Actualizar modal de empresa
            BUSCADOR.buscarUnElemento('#resumen-curso-nombre').textContent = nombreCurso;
            BUSCADOR.buscarUnElemento('#resumen-personas-lista').innerHTML = resumenHTML;
            BUSCADOR.buscarUnElemento('#resumen-total-empresa').textContent = `Total a pagar: ${parseFloat(total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}`;

            // Ocultar modal de personal y mostrar el de empresa
            popupPersonal.style.display = 'none';
            popupEmpresa.style.display = 'block';
            
        }

        // Mostrar el modal usando la clase visible para forzar display: flex)
        popup.classList.add('visible');

    });
    
    // Listener para cerrar el modal y limpiar el formulario
    popup.querySelectorAll('.boton-enlace').forEach(enlace => {
        enlace.addEventListener('click', () => {
        
            form.reset();
            const primeraPersona = personasContainer.querySelector('.persona-1');
            limpiarPrimeraPersona(primeraPersona);
            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(p => {
                if (p.dataset.id !== '1') p.remove(); 
            });
            contadorPersonas = 1;
        });
    });
}