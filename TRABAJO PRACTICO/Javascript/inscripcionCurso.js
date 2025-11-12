// TRABAJO PRACTICO/Javascript/inscripcionCurso.js - MODIFICADO

import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";
import { agregarCustomAlCarrito } from './carritoDeCompras.js'; 

const BUSCADOR = new BuscadorElementos();
const CREADOR = new CreadorElementos();
const COSTO_ADMINISTRATIVO_ARS = 50000;

let contadorPersonas = 1;


/**
 * Genera el HTML para un bloque de campos de persona.
 */
function crearBloquePersona(id, esPrimeraPersona = false) {
    const div = CREADOR.crearUnElemento('div');
    div.classList.add('persona-campos', 'persona-empresa', `persona-data-${id}`);
    div.dataset.id = id;

    div.innerHTML = `
        <h4 class="persona-titulo">Persona ${id}</h4>
        <label>Nombre y Apellido:</label>
        <input type="text" name="nombre_${id}" placeholder="Nombre y Apellido" required minlength="5">
        <label>DNI:</label>
        <input type="text" inputmode="numeric" name="dni_${id}" placeholder="DNI" pattern="[0-9]{8,12}" required minlength="8">
        <label>Email:</label>
        <input type="email" name="email_${id}" placeholder="Email@example.com" required>
        <label>Teléfono:</label>
        <input type="tel" name="telefono_${id}" placeholder="Teléfono" required minlength="8" maxlength="15">
        ${esPrimeraPersona ? 
            `<div class="placeholder-boton-quitar"></div>` : 
            `<button type="button" class="boton-quitar-persona" data-id="${id}">&times;</button>`
        }
    `;
    
    if (!esPrimeraPersona) {
        const btnQuitar = div.querySelector('.boton-quitar-persona');
        btnQuitar.addEventListener('click', () => eliminarPersona(id, div));
    }
    
    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', recalcularTotal);
    });

    return div;
}

/**
 * Re-numera los títulos de las personas (Persona 1, Persona 2, etc.) en orden secuencial.
 */
function actualizarNumeracionPersonas() {
    const personas = BUSCADOR.buscarVariosElementos('#personas-container .persona-empresa');
    let indice = 1;
    
    personas.forEach(bloque => {
        const titulo = bloque.querySelector('.persona-titulo');
        if (titulo) {
            titulo.textContent = `Persona ${indice}`;
        }
        indice++;
    });
}

/* Calcula el total a pagar en la modalidad Empresa.*/
function recalcularTotal() {
    const totalDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar');
    if (!totalDiv) return;

    const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
    const cursoSeleccionado = selectCurso.options[selectCurso.selectedIndex];
    
    const precioBaseIndividualARS = parseFloat(cursoSeleccionado.dataset.precio) || 0;
    const numPersonas = BUSCADOR.buscarVariosElementos('.persona-empresa').length;
    
    const costoFijoIndividualARS = COSTO_ADMINISTRATIVO_ARS; 
    
    const costoFijoTotalARS = costoFijoIndividualARS * numPersonas; 
    const totalCursoBaseARS = precioBaseIndividualARS * numPersonas;
    const totalPagarARS = totalCursoBaseARS + costoFijoTotalARS;

    const precioCursoIndividualFormato = precioBaseIndividualARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const totalCursoBaseFormato = totalCursoBaseARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const costoFijoIndividualFormato = costoFijoIndividualARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const costoFijoTotalFormato = costoFijoTotalARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const totalFinalFormato = totalPagarARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });

    totalDiv.innerHTML = `
        **Resumen (${numPersonas} personas):**
        <p>Costo del Curso (${precioCursoIndividualFormato} c/u): **${totalCursoBaseFormato} ARS**</p>
        <p>Costo administrativo (${numPersonas} personas x ${costoFijoIndividualFormato}): **${costoFijoTotalFormato} ARS**</p>
        <p class="resumen-final-total">Total estimado: **${totalFinalFormato} ARS**</p>
    `;
    totalDiv.dataset.totalPagar = totalPagarARS.toFixed(2);
    totalDiv.dataset.costoEmpresa = costoFijoTotalARS.toFixed(2);
    totalDiv.dataset.numPersonas = numPersonas; 
}


/*Agrega un nuevo bloque de campos para una persona*/
function agregarPersona() {
    contadorPersonas++; 
    const personasContainer = BUSCADOR.buscarUnElementoPorId('personas-container');
    
    const nuevoBloque = crearBloquePersona(contadorPersonas);
    personasContainer.appendChild(nuevoBloque);
    
    recalcularTotal();
    actualizarNumeracionPersonas(); 
}

/**
 * Elimina un bloque de campos de persona.
 */
function eliminarPersona(id, elemento) {
    if (id !== 1 || !elemento.classList.contains('persona-1')) { 
        elemento.remove();
        recalcularTotal(); 
        actualizarNumeracionPersonas(); 
    }
}

/**
 * Limpia los campos de la primera persona.
 */
function limpiarPrimeraPersona(primerBloque) {
    if (primerBloque) {
        primerBloque.querySelectorAll('input').forEach(input => {
            input.value = ''; 
        });
    }
    recalcularTotal();
    actualizarNumeracionPersonas(); 
}

export function iniciarLogicaInscripcion() {
    const selectorTipo = BUSCADOR.buscarUnElementoPorId('tipo-inscripcion');
    const form = BUSCADOR.buscarUnElementoPorId('form-inscripcion-curso');
    const camposPersonal = BUSCADOR.buscarUnElementoPorId('campos-personal');
    const camposEmpresa = BUSCADOR.buscarUnElementoPorId('campos-empresa');
    const cursoSeleccionadoContainer = BUSCADOR.buscarUnElementoPorId('curso-seleccionado-container');
    const agregarPersonaBtn = BUSCADOR.buscarUnElementoPorId('agregar-persona-btn');
    const personasContainer = BUSCADOR.buscarUnElementoPorId('personas-container');
    const totalAPagarDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar'); 
    
    const popup = BUSCADOR.buscarUnElementoPorId('popup');
    const popupPersonal = BUSCADOR.buscarUnElementoPorId('popup-contenido-personal');
    const popupEmpresa = BUSCADOR.buscarUnElementoPorId('popup-contenido-empresa');
    
    // Referencia al checkbox del carrito
    const carritoCheckbox = BUSCADOR.buscarUnElemento('#Carro'); // <-- Nueva referencia

    
    if (!selectorTipo || !form || !camposPersonal || !camposEmpresa || !agregarPersonaBtn || !personasContainer || !popup || !totalAPagarDiv) {
        console.error("Faltan elementos DOM para inicializar la lógica de inscripción.");
        return;
    }
    
    const primerH4 = personasContainer.querySelector('.persona-1 h4');
    if (primerH4) {
        primerH4.classList.add('persona-titulo');
    }
    
    agregarPersonaBtn.addEventListener('click', agregarPersona); 
    
    const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
    if (selectCurso) {
        selectCurso.addEventListener('change', () => {
            const primeraPersona = personasContainer.querySelector('.persona-1');
            if (primeraPersona) limpiarPrimeraPersona(primeraPersona);
            
            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(p => {
                if (p.dataset.id !== '1') p.remove();
            });

            recalcularTotal();
            actualizarNumeracionPersonas(); 
        });
    }
    
    if (BUSCADOR.buscarUnElementoPorId('curso-empresa')?.value) {
        recalcularTotal();
    }
    actualizarNumeracionPersonas();


    /**
     * Muestra/Oculta campos y el botón de agregar persona.
     */
    function manejarCambioTipoInscripcion() {
        const tipo = selectorTipo.value;

        if (tipo === 'personal') {
            camposPersonal.style.display = 'block';
            camposEmpresa.style.display = 'none';
            cursoSeleccionadoContainer.style.display = 'block';
            
            // Ocultar el botón para la modalidad Personal
            agregarPersonaBtn.style.display = 'none'; 
            // OCULTAR EL BLOQUE DE RESUMEN DE PRECIOS
            totalAPagarDiv.style.display = 'none'; 

            camposEmpresa.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
            camposPersonal.querySelectorAll('input, select').forEach(input => input.setAttribute('required', 'required'));
            
        } else if (tipo === 'empresa') {
            camposPersonal.style.display = 'none';
            camposEmpresa.style.display = 'block';
            cursoSeleccionadoContainer.style.display = 'block';
            
            // Mostrar el botón para la modalidad Empresa
            agregarPersonaBtn.style.display = 'inline-block'; 
            // MOSTRAR EL BLOQUE DE RESUMEN DE PRECIOS
            totalAPagarDiv.style.display = 'block'; 

            camposEmpresa.querySelectorAll('input, select').forEach(input => input.setAttribute('required', 'required'));
            camposPersonal.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
            
            recalcularTotal();
            actualizarNumeracionPersonas();
        }
    }

    manejarCambioTipoInscripcion();
    selectorTipo.addEventListener('change', manejarCambioTipoInscripcion);
    
    
    
    // LÓGICA DE SUBMIT

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        BUSCADOR.buscarVariosElementos('.error-mensaje-inscripcion').forEach(el => el.remove());
        
        if (!form.checkValidity()) {
            form.reportValidity(); 
            return;
        }
        
        // CERRAR CARRITO ANTES DE MOSTRAR EL POPUP
        if (carritoCheckbox) { // <-- Se utiliza la referencia
            carritoCheckbox.checked = false;
        }


        const tipo = selectorTipo.value;
        const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
        const nombreCurso = selectCurso.value;
        const cursoBase = LISTA_CURSOS.find(c => c.titulo === nombreCurso);
        const precioBase = cursoBase?.precio || 0;


        if (tipo === 'personal') {
            
            const totalPagarPersonal = precioBase; 

            if (cursoBase) {
                 const itemPersonal = {
                     ...cursoBase, 
                     tipo: 'curso', 
                     precio: totalPagarPersonal, // Precio original sin adicional.
                     cantidad: 1 
                 };
                 agregarCustomAlCarrito(itemPersonal); 
                 console.log(`✅ Curso ${nombreCurso} agregado al carrito para pago personal. Precio: ${totalPagarPersonal}`);
            }

            const nombre = BUSCADOR.buscarUnElemento('input[name="nombre_personal"]').value;
            const email = BUSCADOR.buscarUnElemento('input[name="email_personal"]').value;
            const telefono = BUSCADOR.buscarUnElemento('input[name="telefono_personal"]').value;

            // Muestra el resumen personal (limpio de **)
            BUSCADOR.buscarUnElemento('#resumen-personal-detalle').innerHTML = `
                <ul>
                    <li><strong>Curso:</strong> ${nombreCurso}</li>
                    <li><strong>Costo Total:</strong> ${totalPagarPersonal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}</li>
                    <li style="margin-top: 1em;"><strong>Nombre:</strong> ${nombre}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Teléfono:</strong> ${telefono}</li>
                </ul>
            `;
            
            popupEmpresa.style.display = 'none';
            popupPersonal.style.display = 'block';
            
        } else if (tipo === 'empresa') {
            // Lógica Empresa (limpio de **)
            let esValido = true;
            let resumenHTML = '<ul>';
            
            const dnisEncontrados = new Set(); 
            let dniDuplicado = false; 

            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(bloque => {
                const id = bloque.dataset.id;
                const nombreInput = bloque.querySelector(`input[name="nombre_${id}"]`);
                const dniInput = bloque.querySelector(`input[name="dni_${id}"]`);
                
                if (!nombreInput.value.trim() || !dniInput.value.trim()) {
                    esValido = false;
                }

                const dni = dniInput.value.trim();
                if (dnisEncontrados.has(dni)) {
                    dniDuplicado = true;
                }
                dnisEncontrados.add(dni);
                
                const tituloVisible = bloque.querySelector('.persona-titulo')?.textContent || `Persona ${id}`;

                resumenHTML += `
                    <li><strong>${tituloVisible}:</strong> ${nombreInput.value.trim()} (DNI: ${dniInput.value.trim()})</li>
                `;
            });
            resumenHTML += '</ul>';
            
            if (dniDuplicado) {
                 alert("Error de validación: No se pueden inscribir personas con el mismo DNI.");
                 return; 
            }

            if (!esValido) {
                form.reportValidity();
                return;
            }

            const totalDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar');
            const total = totalDiv.dataset.totalPagar;
            const numPersonas = parseInt(totalDiv.dataset.numPersonas);
            
            //  Agregar el curso al carrito con precio modificado y cantidad
            if (cursoBase) {
                const precioUnitarioEmpresa = precioBase + COSTO_ADMINISTRATIVO_ARS; 
                
                const itemEmpresa = {
                    ...cursoBase, 
                    tipo: 'empresa', 
                    precio: precioUnitarioEmpresa, 
                    cantidad: numPersonas 
                };

                agregarCustomAlCarrito(itemEmpresa); 
                
                console.log(` Curso ${nombreCurso} (${numPersonas} unidades) agregado al carrito para pago empresa. Precio Unitario (c/adicional): ${precioUnitarioEmpresa}`);
            }

            // Actualizar modal de empresa
            BUSCADOR.buscarUnElemento('#resumen-curso-nombre').textContent = nombreCurso;
            BUSCADOR.buscarUnElemento('#resumen-personas-lista').innerHTML = resumenHTML;
            BUSCADOR.buscarUnElemento('#resumen-total-empresa').textContent = `Total a pagar: ${parseFloat(total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}`;

            popupPersonal.style.display = 'none';
            popupEmpresa.style.display = 'block';
            
        }

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
            actualizarNumeracionPersonas(); 
        });
    });
}