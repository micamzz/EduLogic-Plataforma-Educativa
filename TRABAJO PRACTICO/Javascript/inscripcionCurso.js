import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";
import { agregarCustomAlCarrito } from './carritoDeCompras.js';//f añadir curso al carro 
import { ValidadorFormulario } from "./validarFormulario.js";

const BUSCADOR = new BuscadorElementos();
const CREADOR = new CreadorElementos();


const COSTO_ADMINISTRATIVO_ARS = 50000;
let contadorPersonas = 1;



//función para mostrar errores específicos en la inscripción
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

// ESTO AGREGUE PARA EL INICIO DE SESION
// VALIDACION DE INICIO DE SESION PARA Q SI NO ESTA LOGUEADO NO PUEDA INSCRIBIRSE 

function validarSesionAntesDeInscribirse() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Si no está logueado redirigimos al inicio de sesión igual que en el carrito
  if (!isLoggedIn || !currentUser?.email) {
    // Guardamos a dónde tiene que volver después de iniciar 
    localStorage.setItem("redirectAfterLogin", location.pathname + location.search);

        // Determina la ruta correcta según la ubi actual
    const hrefLogin = window.location.pathname.includes("/paginas/")
      ? "./inicioSesion.html"
      : "./paginas/inicioSesion.html";

    window.location.href = hrefLogin;
    return false;
  }

  return true;
}

// Crea un bloque de campos para persona
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
    //si no es primera persona agrega el boton de quitar
    if (!esPrimeraPersona) {
        const btnQuitar = div.querySelector('.boton-quitar-persona');
        btnQuitar.addEventListener('click', () => eliminarPersona(id, div));
    }
    
    div.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', recalcularTotal);//escucha cambio a cadda input
    });                                                  //rec total= calcula cuanto va a pagar si es empresa   

    return div;
}

//renumera las personas despues de agregar o eliminar para sea en orden
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

//Calcula el total a pagar en la modalidad Empresa
function recalcularTotal() {
    const totalDiv = BUSCADOR.buscarUnElementoPorId('total-a-pagar');//obitene el total a pagar del dom
    if (!totalDiv) return;

    const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');// obtiene el select de curso
    const cursoSeleccionado = selectCurso.options[selectCurso.selectedIndex];// la op seleccionada
    
    const precioBaseIndividualARS = parseFloat(cursoSeleccionado.dataset.precio) || 0;//extrae el p del curso del data set
    const numPersonas = BUSCADOR.buscarVariosElementos('.persona-empresa').length;//cant personas 
    
    const costoFijoIndividualARS = COSTO_ADMINISTRATIVO_ARS; 
    
    const costoFijoTotalARS = costoFijoIndividualARS * numPersonas; //aditivo 
    const totalCursoBaseARS = precioBaseIndividualARS * numPersonas;//costo curso
    const totalPagarARS = totalCursoBaseARS + costoFijoTotalARS;//subtotal

    //convierten a cadena de texto en moneda arg
    const precioCursoIndividualFormato = precioBaseIndividualARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const totalCursoBaseFormato = totalCursoBaseARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const costoFijoIndividualFormato = costoFijoIndividualARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const costoFijoTotalFormato = costoFijoTotalARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });
    const totalFinalFormato = totalPagarARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });

    //añade un resumen detallado al div total a pagar
    totalDiv.innerHTML = `
        **Resumen (${numPersonas} personas):**
        <p>Costo del Curso (${precioCursoIndividualFormato} c/u): **${totalCursoBaseFormato} ARS**</p>
        <p>Costo administrativo (${numPersonas} personas x ${costoFijoIndividualFormato}): **${costoFijoTotalFormato} ARS**</p>
        <p class="resumen-final-total">Total estimado: **${totalFinalFormato} ARS**</p>
    `;

    //se alamcenan los valores en data  para usarlo en carrito
    totalDiv.dataset.totalPagar = totalPagarARS.toFixed(2);
    totalDiv.dataset.costoEmpresa = costoFijoTotalARS.toFixed(2);
    totalDiv.dataset.numPersonas = numPersonas; 
}


//agrega un nuevo bloque para una persona
function agregarPersona() {
    contadorPersonas++; 

    //busca al cont padre donde se van a agregar los bloques
    const personasContainer = BUSCADOR.buscarUnElementoPorId('personas-container');
    
    const nuevoBloque = crearBloquePersona(contadorPersonas); //llama f aux, devuelve un nuevo div con todos los inputs + btn quitar
    personasContainer.appendChild(nuevoBloque); //inserta el nuevo elemnto
    

    //llama funcuones para ctualizar total perso y numeracion
    recalcularTotal();
    actualizarNumeracionPersonas(); 
}

//Elimina un bloque de campos de persona
function eliminarPersona(id, elemento) {
    if (id !== 1 || !elemento.classList.contains('persona-1')) { 
        elemento.remove();
        recalcularTotal(); 
        actualizarNumeracionPersonas(); 
    }
}

//limpia los datos de la primera persona
 
function limpiarPrimeraPersona(primerBloque) {
    if (primerBloque) {
        primerBloque.querySelectorAll('input').forEach(input => {
            input.value = ''; 
        });
    }
    recalcularTotal();
    actualizarNumeracionPersonas(); 
}


//F inicial 
export function iniciarLogicaInscripcion() {

    //busca los componentes necesarios, 
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
    const carritoCheckbox = BUSCADOR.buscarUnElemento('#Carro'); 

    //si falta se detiene y da error
    if (!selectorTipo || !form || !camposPersonal || !camposEmpresa || !agregarPersonaBtn || !personasContainer || !popup || !totalAPagarDiv) {
        console.error("Faltan elementos DOM para inicializar la lógica de inscripción.");
        return;
    }
    

    //asegura que el primer bloque de persona tenga el estilo 
    const primerH4 = personasContainer.querySelector('.persona-1 h4');
    if (primerH4) {
        primerH4.classList.add('persona-titulo');
    }
    
    //si da click se agrega otra persona
    agregarPersonaBtn.addEventListener('click', agregarPersona); 
    
    const selectCursoCambio = BUSCADOR.buscarUnElementoPorId('curso-empresa');
    

    //si cambia el curso seleccionado se limpia y actualiza todo
    if (selectCursoCambio) {
        selectCursoCambio.addEventListener('change', () => {
            const primeraPersona = personasContainer.querySelector('.persona-1');
            if (primeraPersona) limpiarPrimeraPersona(primeraPersona);
            
            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(p => {
                if (p.dataset.id !== '1') p.remove();
            });

            recalcularTotal();//recalcula el curso seleccionado
            actualizarNumeracionPersonas(); //se reinicio
        });
    }
    
    if (BUSCADOR.buscarUnElementoPorId('curso-empresa')?.value) {
        recalcularTotal();
    }
    actualizarNumeracionPersonas();


    // Muestra/Oculta campos y el botón de agregar persona
     
    function manejarCambioTipoInscripcion() {
        const tipo = selectorTipo.value;

        //si es personal
        if (tipo === 'personal') {
            camposPersonal.style.display = 'block';
            camposEmpresa.style.display = 'none';
            cursoSeleccionadoContainer.style.display = 'block';
            
            // Ocultar el botón para la modalidad Personal
            agregarPersonaBtn.style.display = 'none'; 
            // OCULTAR EL BLOQUE DE RESUMEN DE PRECIOS
            totalAPagarDiv.style.display = 'none'; 

            
            //SI ES DE EMORESA
        } else if (tipo === 'empresa') {
            camposPersonal.style.display = 'none';
            camposEmpresa.style.display = 'block';
            cursoSeleccionadoContainer.style.display = 'block';
            
            // Mostrar el botón para la modalidad Empresa
            agregarPersonaBtn.style.display = 'inline-block'; 
            // MOSTRAR EL BLOQUE DE RESUMEN DE PRECIOS
            totalAPagarDiv.style.display = 'block'; 

            recalcularTotal();
            actualizarNumeracionPersonas();
        }
    }

       //segun el tipo perso o emp nuestra det campos 
    manejarCambioTipoInscripcion();
    selectorTipo.addEventListener('change', manejarCambioTipoInscripcion);
    
    
    // LÓGICA DE SUBMIT

    form.addEventListener('submit', (e) => {
        e.preventDefault();//detiene comportamiento por defecto del form, js toma control


        //elimina todos los errores visibles antes de validar
        BUSCADOR.buscarVariosElementos('.error-mensaje').forEach(el => el.remove());
        BUSCADOR.buscarVariosElementos('.input-error').forEach(i => i.classList.remove('input-error')); // ESTO AGREGUE

        //obtiene datos
        const tipo = selectorTipo.value;
        const selectCurso = BUSCADOR.buscarUnElementoPorId('curso-empresa');
        const nombreCurso = selectCurso ? selectCurso.value : "";

        // validación del curso seleccionado, hay q elegir uno
        if (!nombreCurso) {
            mostrarErrorInscripcion(selectCurso, "El curso es obligatorio.");
            return;
        }

        //bsuca en el array de cursos el curso seleccionado
        const cursoBase = LISTA_CURSOS.find(c => c.titulo === nombreCurso);
        const precioBase = cursoBase?.precio || 0; //busca el precio base del curso/ ? ebcadenamiento opcional /0 si no lo encuentra


        if (tipo === 'personal') {
            
            //validaciones con ValidadorFormulario para modo personal
            let esValido = true;

            const nombreInputPersonal = BUSCADOR.buscarUnElemento('input[name="nombre_personal"]');
            const emailInputPersonal = BUSCADOR.buscarUnElemento('input[name="email_personal"]');
            const telInputPersonal = BUSCADOR.buscarUnElemento('input[name="telefono_personal"]');

            // Nombre
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

            //  ahora pregunto si está logueado
            if (!validarSesionAntesDeInscribirse()) {
                return;
            }

            // CERRAR CARRITO ANTES DE MOSTRAR EL POPUP 
            if (carritoCheckbox) { 
                carritoCheckbox.checked = false;
            }
            
            const totalPagarPersonal = precioBase; 

            if (cursoBase) {
                 const itemPersonal = {
                     ...cursoBase, 
                     tipo: 'curso', 
                     precio: totalPagarPersonal, // Precio original sin adicional.
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
            

            //TIPO EMRPESA
        } else if (tipo === 'empresa') {
            
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

                //validaciones con ValidadorFormulario para cada persona 

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
                    esValido = false;
                }

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
        

            // valida sesión recién cuando el formulario es válido
            if (!validarSesionAntesDeInscribirse()) {
                return;
            }

            // CERRAR CARRITO ANTES DE MOSTRAR EL POPUP 
            if (carritoCheckbox) { 
                carritoCheckbox.checked = false;
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

            // Actualizar popup de empresa
            BUSCADOR.buscarUnElemento('#resumen-curso-nombre').textContent = nombreCurso;
            BUSCADOR.buscarUnElemento('#resumen-personas-lista').innerHTML = resumenHTML;
            BUSCADOR.buscarUnElemento('#resumen-total-empresa').textContent = `Total a pagar: ${parseFloat(total).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}`;

            popupPersonal.style.display = 'none';
            popupEmpresa.style.display = 'block';
            
        }

        popup.classList.add('visible');

    });
    
    //cerrar el modal y limpiar el formulario al clickar boton
    popup.querySelectorAll('.boton-enlace').forEach(enlace => {
        enlace.addEventListener('click', () => {
        
            form.reset();//resetea form

            //limpia 1er persona y elimina las demas
            const primeraPersona = personasContainer.querySelector('.persona-1');
            limpiarPrimeraPersona(primeraPersona);
            BUSCADOR.buscarVariosElementos('.persona-empresa').forEach(p => {
                if (p.dataset.id !== '1') p.remove(); 
            });

            //reinicia ocntador y numeracion
            contadorPersonas = 1;
            actualizarNumeracionPersonas(); 
        });
    });
}
