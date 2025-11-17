import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";
import { agregarCustomAlCarrito } from './carritoDeCompras.js';
import { ValidadorFormulario } from "./validarFormulario.js";

const BUSCADOR = new BuscadorElementos();
const CREADOR = new CreadorElementos();


const COSTO_ADMINISTRATIVO_ARS = 50000;
let contadorPersonas = 1;


function mostrarErrorInscripcion(input, mensaje) {
    if (!input) return;

    let error = input.nextElementSibling;

    if (!error || !error.classList.contains("error-mensaje")) {
        error = document.createElement("div");
        error.classList.add("error-mensaje");
        input.insertAdjacentElement("afterend", error);
    }

    error.textContent = mensaje;
    input.classList.add("input-error");
}


function validarSesionAntesDeInscribirse() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!isLoggedIn || !currentUser?.email) {
        
        localStorage.setItem("redirectAfterLogin", location.pathname + location.search);

        
        const hrefLogin = window.location.pathname.includes("/paginas/")
            ? "./inicioSesion.html"
            : "./paginas/inicioSesion.html";

        window.location.href = hrefLogin;
        return false;
    }

    return true;
}


function crearBloquePersona(id, esPrimeraPersona = false) {
    const div = CREADOR.crearUnElemento('div');
    div.classList.add('persona-campos', 'persona-empresa', `persona-data-${id}`);
    div.dataset.id = id;

    div.innerHTML = `
        <h4 class="persona-titulo">Persona ${id}</h4>
        <label>Nombre y Apellido:</label>
        <input type="text" name="nombre_${id}" placeholder="Nombre y Apellido" minlength="5">
        <label>DNI:</label>
        <input type="text" inputmode="numeric" name="dni_${id}" placeholder="DNI" pattern="[0-9]{8,12}" minlength="8">
        <label>Email:</label>
        <input type="email" name="email_${id}" placeholder="Email@example.com">
        <label>Teléfono:</label>
        <input type="tel" name="telefono_${id}" placeholder="Teléfono" minlength="8" maxlength="15">
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



function agregarPersona() {
    contadorPersonas++;

    
    const personasContainer = BUSCADOR.buscarUnElementoPorId('personas-container');

    const nuevoBloque = crearBloquePersona(contadorPersonas); 
    personasContainer.appendChild(nuevoBloque); 


   
    recalcularTotal();
    actualizarNumeracionPersonas();
}


function eliminarPersona(id, elemento) {
    if (id !== 1 || !elemento.classList.contains('persona-1')) {
        elemento.remove();
        recalcularTotal();
        actualizarNumeracionPersonas();
    }
}


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

    const carritoCheckbox = BUSCADOR.buscarUnElemento('#Carro');


    if (!selectorTipo || !form || !camposPersonal || !camposEmpresa || !agregarPersonaBtn || !personasContainer || !popup || !totalAPagarDiv) {
        console.error("Faltan elementos DOM para inicializar la lógica de inscripción.");
        return;
    }


    const primerH4 = personasContainer.querySelector('.persona-1 h4');
    if (primerH4) {
        primerH4.classList.add('persona-titulo');
    }

  
    agregarPersonaBtn.addEventListener('click', agregarPersona);

    const selectCursoCambio = BUSCADOR.buscarUnElementoPorId('curso-empresa');


o
    if (selectCursoCambio) {
        selectCursoCambio.addEventListener('change', () => {
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



    function manejarCambioTipoInscripcion() {
        const tipo = selectorTipo.value;

        if (tipo === 'personal') {
            camposPersonal.style.display = 'block';
            camposEmpresa.style.display = 'none';
            cursoSeleccionadoContainer.style.display = 'block';

           
            agregarPersonaBtn.style.display = 'none';
            
            totalAPagarDiv.style.display = 'none';


           
        } else if (tipo === 'empresa') {
            camposPersonal.style.display = 'none';
            camposEmpresa.style.display = 'block';
            cursoSeleccionadoContainer.style.display = 'block';

            agregarPersonaBtn.style.display = 'inline-block';
       
            totalAPagarDiv.style.display = 'block';

            recalcularTotal();
            actualizarNumeracionPersonas();
        }
    }

    manejarCambioTipoInscripcion();
    selectorTipo.addEventListener('change', manejarCambioTipoInscripcion);


 

    form.addEventListener('submit', (e) => {
        e.preventDefault();


        BUSCADOR.buscarVariosElementos('.error-mensaje').forEach(el => el.remove());
        BUSCADOR.buscarVariosElementos('.input-error').forEach(i => i.classList.remove('input-error')); 

  
        const tipo = selectorTipo.value;
        const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
        const nombreCurso = selectCurso ? selectCurso.value : "";


        if (!nombreCurso) {
            mostrarErrorInscripcion(selectCurso, "El curso es obligatorio.");
            return;
        }

        const cursoBase = LISTA_CURSOS.find(c => c.titulo === nombreCurso);
        const precioBase = cursoBase?.precio || 0; 


        if (tipo === 'personal') {
          
            let esValido = true;

            const nombreInputPersonal = BUSCADOR.buscarUnElemento('input[name="nombre_personal"]');
            const emailInputPersonal = BUSCADOR.buscarUnElemento('input[name="email_personal"]');
            const telInputPersonal = BUSCADOR.buscarUnElemento('input[name="telefono_personal"]');


            if (!ValidadorFormulario.campoVacio(nombreInputPersonal.value)) {
                mostrarErrorInscripcion(nombreInputPersonal, "El nombre es obligatorio.");
                esValido = false;
            } else if (!ValidadorFormulario.longitudMinima(nombreInputPersonal.value, 5)) {
                mostrarErrorInscripcion(nombreInputPersonal, ValidadorFormulario.MENSAJES.nombreCorto);
                esValido = false;
            }

            // Email
            if (!ValidadorFormulario.campoVacio(emailInputPersonal.value)) {
                mostrarErrorInscripcion(emailInputPersonal, "El email es obligatorio.");
                esValido = false;
            } else if (!ValidadorFormulario.emailValido(emailInputPersonal.value)) {
                mostrarErrorInscripcion(emailInputPersonal, ValidadorFormulario.MENSAJES.emailInvalido);
                esValido = false;
            }

            // Teléfono
            if (!ValidadorFormulario.campoVacio(telInputPersonal.value)) {
                mostrarErrorInscripcion(telInputPersonal, "El teléfono es obligatorio.");
                esValido = false;
            } else if (!ValidadorFormulario.telefonoValido(telInputPersonal.value)) {
                mostrarErrorInscripcion(telInputPersonal, ValidadorFormulario.MENSAJES.telefonoInvalido);
                esValido = false;
            }

            if (!esValido) {
                return;
            }

         
            if (!validarSesionAntesDeInscribirse()) {
                return;
            }

           
            if (carritoCheckbox) {
                carritoCheckbox.checked = false;
            }

            const totalPagarPersonal = precioBase;

            if (cursoBase) {
                const itemPersonal = {
                    ...cursoBase,
                    tipo: 'curso',
                    precio: totalPagarPersonal, 
                    cantidad: 1
                };
                agregarCustomAlCarrito(itemPersonal);

            }
            // Muestra el resumen  en el popup 
            const nombre = nombreInputPersonal.value;
            const email = emailInputPersonal.value;
            const telefono = telInputPersonal.value;

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
    } 
             
            //VALIDACIONES TIPO EMPRESA 
             else if (tipo === 'empresa') {

            let esValido = true;
            let resumenHTML = '<ul>';

            const dnisEncontrados = new Set();
            let dniDuplicado = false;

            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(bloque => {
                const id = bloque.dataset.id;
                const nombreInput = bloque.querySelector(`input[name="nombre_${id}"]`);
                const dniInput = bloque.querySelector(`input[name="dni_${id}"]`);
                const emailInput = bloque.querySelector(`input[name="email_${id}"]`);
                const telefonoInput = bloque.querySelector(`input[name="telefono_${id}"]`);

              

                // Nombre
                if (!ValidadorFormulario.campoVacio(nombreInput.value)) {
                    mostrarErrorInscripcion(nombreInput, "El nombre es obligatorio.");
                    esValido = false;
                } else if (!ValidadorFormulario.longitudMinima(nombreInput.value, 5)) {
                    mostrarErrorInscripcion(nombreInput, ValidadorFormulario.MENSAJES.nombreCorto);
                    esValido = false;
                }

                // Email
                if (!ValidadorFormulario.campoVacio(emailInput.value)) {
                    mostrarErrorInscripcion(emailInput, "El email es obligatorio.");
                    esValido = false;
                } else if (!ValidadorFormulario.emailValido(emailInput.value)) {
                    mostrarErrorInscripcion(emailInput, ValidadorFormulario.MENSAJES.emailInvalido);
                    esValido = false;
                }

                // Teléfono
                if (!ValidadorFormulario.campoVacio(telefonoInput.value)) {
                    mostrarErrorInscripcion(telefonoInput, "El teléfono es obligatorio.");
                    esValido = false;
                } else if (!ValidadorFormulario.telefonoValido(telefonoInput.value)) {
                    mostrarErrorInscripcion(telefonoInput, ValidadorFormulario.MENSAJES.telefonoInvalido);
                    esValido = false;
                }

                // DNI 
                const dni = dniInput.value.trim();
                if (!dni) {
                    mostrarErrorInscripcion(dniInput, "El DNI es obligatorio."); 
                    esValido = false;
                } else if (!/^\d{8,12}$/.test(dni)) { // ESTO AGREGUE
                    mostrarErrorInscripcion(dniInput, "El DNI debe tener entre 8 y 12 números."); 
                    esValido = false; // ESTO AGREGUE
                }

                if (dnisEncontrados.has(dni)) {
                    mostrarErrorInscripcion(dniInput, "Este DNI está repetido."); 
                    dniDuplicado = true; 
                    esValido = false;
                }
                dnisEncontrados.add(dni);

                const tituloVisible = bloque.querySelector('.persona-titulo')?.textContent || `Persona ${id}`;

                resumenHTML += `
                    <li><strong>${tituloVisible}:</strong> ${nombreInput.value.trim()} (DNI: ${dniInput.value.trim()})</li>
                `;
            });
            resumenHTML += '</ul>';

      
            if (!esValido || dniDuplicado) {
                return; 
            }

            if (!validarSesionAntesDeInscribirse()) {
                return;
            }

            if (carritoCheckbox) {
                carritoCheckbox.checked = false;
            }

            const totalDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar');
            const total = totalDiv.dataset.totalPagar;
            const numPersonas = parseInt(totalDiv.dataset.numPersonas);

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

            // Actualizar popup de empresa
            BUSCADOR.buscarUnElemento('#resumen-curso-nombre').textContent = nombreCurso;
            BUSCADOR.buscarUnElemento('#resumen-personas-lista').innerHTML = resumenHTML;
            BUSCADOR.buscarUnElemento('#resumen-total-empresa').textContent = `Total a pagar: ${parseFloat(total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}`;

            popupPersonal.style.display = 'none';
            popupEmpresa.style.display = 'block';

        }

        popup.classList.add('visible');

    });

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
