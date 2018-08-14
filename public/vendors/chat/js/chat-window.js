$(document).ready(function(){

    function limpiarPassage2(text){
        text = text.replace(/<[^>]*>/g, ".");
        text = text.replace(/(\r\n|\n|\r)/gm,".");
        text = text.replace("TLMK)Las","TLMK). Las")
        text = text.replace('" style="list-style-type: lower-alpha">El','El')
        text = text.replace('<a href="http://enciclopediadvp.lima.dvp.com.pe/uploads/docs/documentos/creditos/Ficha_CEF.pdf" id','.')
        text = text.replace(' El','El')
        text = text.replace('modalidades2','modalidades.')
        text = text.replace('MonedaCréditos','Moneda. Crédito')
        text = text.replace('RequisitosPara','.Para')
        text = text.replace('RestriccionesNo','Restricciones.No')
        text = text.replace("<", ".");
        text = text.replace(">", ".");
        if(text.indexOf('MIC Paraguas estará disponible todos los días') == -1){
        text = text.replace(":", "");
        }
        
        text=text.split('.');

        var textoCambiado =[];
        for(var i=0; i<text.length;i++){
            if(text[i].length>20){
                textoCambiado.push(text[i]);
            }
        }
        console.log(textoCambiado)

     return textoCambiado
}

    $('#style-1').on('click','.alternar-respuesta', function() {
        var index=$('.alternar-respuesta').index(this);
        console.log(index)
        console.log($(this).text())
        if($(this).text() == "- Ver más"){
            $('.respuesta-busqueda:eq('+index+')').slideDown();
            $(this).text("- Ver menos")
        }else{
            $('.respuesta-busqueda:eq('+index+')').slideUp();
            $(this).text("- Ver más")
        }
    
    });

    $('#style-1').on('click','.mostrar-detalle',function(){
      var index2= $(this).attr('data-index');
      console.log(arrayResultadoDiscovery[0]);
      console.log(index2);
      $('#panel-bienvenida').hide();
      $('.dvp-panel-detalle-parrafo').empty();
      $('.dvp-panel-detalle-parrafo').append(arrayResultadoDiscovery[index2].html);
      if(arrayResultadoDiscovery[index2].passage[0] != undefined){
          $("#content").mark(limpiarPassage2(arrayResultadoDiscovery[index2].passage[0].passage_text),{diacritics:false,accuracy:"parcially",separateWordSearch:false, className: 'passages'});
      }      
      $('#detalle-busqueda').show();
    });

    $("#cerrar-detalle").click(function(e) {
    e.preventDefault();
    $('#detalle-busqueda').hide();
    $('#panel-bienvenida').show();
      
  });
});