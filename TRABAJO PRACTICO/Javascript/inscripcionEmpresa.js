import { BuscadorElementos } from "./buscadorElementos.js";
import { CreadorElementos } from "./creadorElementos.js";
import { LISTA_CURSOS } from "./constantes/ArrayDeCursos.js";

// Precio fijo por persona (según consigna: "fijo por ejemplo U$D 20")
const COSTO_FIJO_PERSONA = 20;

const BUSCADOR = new BuscadorElementos();
const CREADOR = new CreadorElementos();
let contadorPersonas = 0;
let inscritos = [];

// Función para obtener el template HTML de un participante
function crearCampoParticipante(index) {
    const id = `participante-${index}`;
    contadorPersonas = index; 

    return `
        <div class="persona participante-dinamico" data-index="${index}" id="${id}">
            <h4>Participante #${index}</h4>
            <label>Nombre y Apellido:</label>
            <input type="text" name="nombre-${index}" placeholder="Nombre y Apellido" required minlength="3" class="input-nombre-apellido">
            
            <label>DNI:</label>
            <input type="text" name="dni-${index}" placeholder="DNI" required inputmode="numeric" pattern="[0-9]{8,12}" minlength="8" maxlength="12" class="input-dni">
            
            <label>Email:</label>
            <input type="email" name="email-${index}" placeholder="Email" required class="input-email">
            
            <label>Teléfono:</label>
            <input type="tel" name="telefono-${index}" placeholder="Teléfono" class="input-telefono">
            
            ${index > 1 ? `<label for="eliminar-${index}" class="toggle-label quitar btn-eliminar-persona" data-id="${id}">Quitar Persona</label>` : ''}
            <hr>
        </div>
    `;
}

//  actualizar el total y el display
function actualizarTotal() {
    inscritos = BUSCADOR.buscarVariosElementos('.participante-dinamico');
    const total = inscritos.length * COSTO_FIJO_PERSONA;
    
    const displayTotal = BUSCADOR.buscarUnElementoPorId('total-pago');
    if(displayTotal) {
        displayTotal.innerHTML = `Total a Pagar: **U$D ${total}**`;
    }
}

// eliminación y limpieza
function manejarEliminacion(e) {
    const botonEliminar = e.target.closest('.btn-eliminar-persona');
    if (!botonEliminar) return;

    e.preventDefault();
    const idEliminar = botonEliminar.dataset.id;
    const elemento = BUSCADOR.buscarUnElementoPorId(idEliminar);
    
    if (elemento) {
        const index = parseInt(elemento.dataset.index);

        if (index > 1) {
            // Eliminar elemento del DOM si no es el primer participante
            elemento.remove();
        } else {
            // Limpiar los valores del primer participante
            elemento.querySelectorAll('input').forEach(input => {
                if (input.type !== 'email' && input.type !== 'tel') { 
                }
            });
        }
        actualizarTotal();
        asignarManejadoresParticipantes();
    }
}


function construirResumenModal() {
    const participantes = BUSCADOR.buscarVariosElementos('.participante-dinamico');
    const resumenDiv = BUSCADOR.buscarUnElementoPorId('resumen-inscripcion');
    let resumenHTML = '<ul>';
    let totalPersonas = 0;
    
    participantes.forEach((p, index) => {
        const nombre = p.querySelector('.input-nombre-apellido').value;
        const dni = p.querySelector('.input-dni').value;
        if (nombre && dni) {
            resumenHTML += `<li>**Participante ${index + 1}:** ${nombre} (DNI: ${dni})</li>`;
            totalPersonas++;
        }
    });

    resumenHTML += '</ul>';
    resumenDiv.innerHTML = resumenHTML;
    
    const totalPagar = totalPersonas * COSTO_FIJO_PERSONA;
    BUSCADOR.buscarUnElementoPorId('resumen-total').textContent = `U$D ${totalPagar}`;
    
   
    if (totalPersonas === 0) {
        return false;
    }
    return true;
}

function asignarManejadoresParticipantes() {
    const contenedor = BUSCADOR.buscarUnElementoPorId('contenedor-participantes');
    if (contenedor) {
        // Se adjunta el manejador de eventos al contenedor padre
        contenedor.addEventListener('click', manejarEliminacion);
    }
}


export function iniciarFormularioEmpresa() {
    const contenedorPrincipal = BUSCADOR.buscarUnElemento(".formulario-inscripcion");
    if (!contenedorPrincipal) return;

    const radioPersonal = BUSCADOR.buscarUnElementoPorId('radio-personal');
    const radioEmpresa = BUSCADOR.buscarUnElementoPorId('radio-empresa');
    const contenedorPersonal = BUSCADOR.buscarUnElementoPorId('contenedor-personal');
    const contenedorEmpresa = BUSCADOR.buscarUnElementoPorId('contenedor-empresa');
    const btnAgregar = BUSCADOR.buscarUnElementoPorId('btn-agregar-persona');
    const formEmpresa = BUSCADOR.buscarUnElementoPorId('formulario-empresa');
    const contenedorParticipantes = BUSCADOR.buscarUnElementoPorId('contenedor-participantes');


    // Lógica para alternar vistas
    function alternarVista(tipo) {
        if (tipo === 'personal') {
            contenedorPersonal.style.display = 'block';
            contenedorEmpresa.style.display = 'none';
        } else {
            contenedorPersonal.style.display = 'none';
            contenedorEmpresa.style.display = 'block';
        }
    }

    radioPersonal.addEventListener('change', () => alternarVista('personal'));
    radioEmpresa.addEventListener('change', () => alternarVista('empresa'));
    
    // Lógica agregar persona
    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            const newIndex = contadorPersonas + 1;
            contenedorParticipantes.insertAdjacentHTML('beforeend', crearCampoParticipante(newIndex));
            actualizarTotal();
        });
    }

    // Lógica de Submit y Popup 
    if (formEmpresa) {
        formEmpresa.addEventListener('submit', (e) => {
            e.preventDefault();
            
            
            if (!formEmpresa.checkValidity()) {
                 formEmpresa.reportValidity(); 
                 return;
            }

            
            if (construirResumenModal()) {
                BUSCADOR.buscarUnElementoPorId('popup').style.display = 'flex';
            }
        });
    }
    
    
    BUSCADOR.buscarUnElementoPorId('btn-cerrar-popup-empresa').addEventListener('click', (e) => {
        e.preventDefault();
        BUSCADOR.buscarUnElementoPorId('popup').style.display = 'none';
    });


    if (contenedorParticipantes) {
        contenedorParticipantes.insertAdjacentHTML('beforeend', crearCampoParticipante(1));
        actualizarTotal();
        asignarManejadoresParticipantes(); //listeners de eliminación
        
        //inicializa en personal
        alternarVista('personal');
    }
}


iniciarFormularioEmpresa();