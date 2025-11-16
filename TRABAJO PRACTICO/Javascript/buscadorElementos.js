export class BuscadorElementos{

    constructor(){
        
    };

    buscarUnElemento(selectorCss){
          return document.querySelector(selectorCss)
    };

    buscarVariosElementos(selectorCss){
         return document.querySelectorAll(selectorCss)
    };

    buscarUnElementoPorId(selectorCss){
         return document.getElementById(selectorCss);
    }

} 