import { BuscadorElementos } from "./buscadorElementos.js";  

const BUSCADOR = new BuscadorElementos();

//refe a los elementos del popup deben existir en el html que lo use
const popup = BUSCADOR.buscarUnElementoPorId('custom-popup');
const popupTitle = BUSCADOR.buscarUnElementoPorId('popup-title');
const popupMessage = BUSCADOR.buscarUnElementoPorId('popup-message');
const btnAceptar = BUSCADOR.buscarUnElementoPorId('btn-aceptar');
const btnCancelar = BUSCADOR.buscarUnElementoPorId('btn-cancelar'); 

//variable para almacenar la funcion a ejecutar cuando rpesiona aceptar
let currentOnConfirmAction = null;


//carga los pop ups y añade los listeners fijos 
function inicializarPopupListeners() {
    if (!popup || !btnAceptar) return;

    //Al presionar aceptar
    btnAceptar.addEventListener('click', () => {
        popup.style.display = 'none';
        if (currentOnConfirmAction) {
            currentOnConfirmAction(); // Ejecutar la acción guardada
        }
    });

    //al presionar cancelar 
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            popup.style.display = 'none';
            //se cierra el pop-up
        });
    }

    //cerrar al hacer clic fuera del popup
    popup.addEventListener("click", e => { 
        if (e.target === popup) popup.style.display = 'none'; 
    });
}

//llamamos a la funcion para inicializar los listeners
inicializarPopupListeners();

//func para mostrar el popup
export function mostrarPopup(title, message, type = 'alert', onConfirm = () => {}) {
    if (!popup || !btnAceptar) {
        return;
    }

    //config del contenido 
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    currentOnConfirmAction = onConfirm; //guardar la accion a ejecutar al confirmar
    
    //Configurar botones s/el tipo
    const isConfirm = type === 'confirm' && btnCancelar;
    
    if (isConfirm) {
        btnAceptar.textContent = 'Aceptar';
        btnCancelar.style.display = 'inline-block'; //cancelar se muestra al lado
        btnAceptar.classList.remove('full-width-btn');
    } else { 
        btnAceptar.textContent = 'OK';
        if (btnCancelar) btnCancelar.style.display = 'none'; 
        
        btnAceptar.classList.add('full-width-btn');
    }

    //Muestra pop-up
    popup.style.display = 'flex';
}