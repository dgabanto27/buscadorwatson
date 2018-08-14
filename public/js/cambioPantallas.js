
$(document).ready(function () {

    $("#adv").click(function (e) {
        e.preventDefault();
            $('#adv').addClass('active');
            $('#resultado').removeClass('active');
            $('.col-lg-4.col-md-4.dvp-space').show();
            $('.col-lg-12.col-md-12.dvp-space').removeAttr('style');
            $('#pagination-content-ta').hide();
            $('#pagination-content').show();
    });

    $("#resultado").click(function (e) {
        e.preventDefault();
            $('#resultado').addClass('active');
            $('#adv').removeClass('active');
            $('.col-lg-4.col-md-4.dvp-space').hide();
            $('.col-lg-12.col-md-12.dvp-space').css({"width":"100%","min-width":"1200px"})
            $('#pagination-content-ta').show();
            $('#pagination-content').hide();
    });

    $(document).on('click','.conversation-html',function(){
     var index=$(this).data('val');
     console.log("Clickeando en el indice: ",$(this).data('val'));
     $("#modal-html").empty()
     $("#modal-html").append('<h2>'+golbal[index].extracted_metadata.title+'</h2>')
     $("#modal-html").append(golbal[index].html)
 })

});