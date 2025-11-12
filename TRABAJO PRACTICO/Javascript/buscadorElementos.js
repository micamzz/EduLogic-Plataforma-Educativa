export class BuscadorElementos{

    constructor(){
        
    };

    buscarUnElemento(selectorCss){//retorna el primer elemento que coincide con el selector CSS
        return document.querySelector(selectorCss)
    };

    buscarVariosElementos(selectorCss){//retorna todos los elementos que coinciden con el selector CSS
        return document.querySelectorAll(selectorCss)
    };

    buscarUnElementoPorId(selectorCss){//retorna el elemento que coincide con el id
        return document.getElementById(selectorCss);
    }

} 