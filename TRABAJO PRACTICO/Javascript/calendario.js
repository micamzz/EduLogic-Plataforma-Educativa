import { BuscadorElementos } from "../Javascript/buscadorElementos.js";

export class Calendario {

  static iniciar() { 
    const BUSCADOR = new BuscadorElementos();

    let fechaActual = new Date();

    const BOTON_ATRAS = BUSCADOR.buscarUnElemento('.js-boton-link-atras');
    const BOTON_SIGUENTE = BUSCADOR.buscarUnElemento('.js-boton-link-siguiente');

    if (BOTON_ATRAS && BOTON_SIGUENTE) {

        BOTON_ATRAS.addEventListener('click', (evento) => {

            fechaActual.setMonth(fechaActual.getMonth() - 1);
            calendario(fechaActual);
        });
        
        BOTON_SIGUENTE.addEventListener('click', (evento) =>{

            fechaActual.setMonth(fechaActual.getMonth() +1);
            calendario(fechaActual);
        });
    }

    const TITULO_MES_ANIO = BUSCADOR.buscarUnElemento('.js-titulo');
    const DIAS = BUSCADOR.buscarUnElemento('.js-calendar-numbers');

    function calendario(fecha){
     DIAS.innerHTML = '';
       
     const ANIO = fecha.getFullYear();
     const MES = fecha.getMonth();

     const NOMBRE_MES = fecha.toLocaleDateString('es-ES', { month: 'long' }); 

     const PRIMER_DIA_DEL_MES = new Date(ANIO,MES,1);
     const ULTIMO_DIA_DEL_MES = new Date(ANIO,MES + 1,0); 
     
     const PRIMER_DIA_SEMANA = PRIMER_DIA_DEL_MES.getDay();
     const TOTAL_DIAS = ULTIMO_DIA_DEL_MES.getDate();


    // LOS DIAS VACIOS ANTES DEL 1
     for (let i = 0; i < PRIMER_DIA_SEMANA; i++) {

     const DIA_VACIO = document.createElement('article');
     DIA_VACIO.classList.add('dia');
     DIAS.appendChild(DIA_VACIO);
    }

      const HOY = new Date();

      for (let i = 1 ; i <= TOTAL_DIAS ; i++){ 
        const DIA_VALIDO = document.createElement('article');
        DIA_VALIDO.classList.add('dia', 'diaValido'); 
        DIA_VALIDO.textContent = i;

        if (i === HOY.getDate() && MES === HOY.getMonth() && ANIO === HOY.getFullYear()){

            DIA_VALIDO.classList.add('dia-actual');
        }

        DIAS.appendChild(DIA_VALIDO);
      }

      // PARA EL TOTAL DE LAS CELDAS -- 5 SEMANAS

      const TOTAL_CELDAS = DIAS.childElementCount;
      for( let i = TOTAL_CELDAS ; i < 35 ; i++){
       const DIA_VACIO = document.createElement('article');
       DIA_VACIO.classList.add('dia');
       DIAS.appendChild(DIA_VACIO);
      }

      // SE ACTUALIZA EL NOMBRE DEL MES .
      TITULO_MES_ANIO.textContent = `${NOMBRE_MES.toUpperCase()} ${ANIO}`;

    }

    calendario(fechaActual); 
  }
}
