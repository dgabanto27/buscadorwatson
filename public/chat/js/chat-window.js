$(document).ready(function(){
    $('.panel-heading span.icon_minim').trigger('click');
});

$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');

        $this.parents('.panel').find('.panel-footer').slideUp();
        $this.addClass('panel-collapsed');

        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');

        $('#makeMeDraggable').css({'top': 0, 'left': 0,'width':'240px'})
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');

        $this.parents('.panel').find('.panel-footer').slideDown();
        $this.removeClass('panel-collapsed');
         $('#makeMeDraggable').css({'width': '635px'})

        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});

$(document).on('click', '.icon_close', function (e) {
    $("#chat_window_1").remove();
});
