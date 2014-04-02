var Timeline = function() {
    var el = {
        el : '.sidebar'
    };
  
    return {  
        addNotification : function(text) {
            var $notification = $('<p></p>').text(text).addClass('notification');
            $notification.css('opacity', '0').prependTo(el);
            $notification.animate({opacity: 1}, 500, 'linear');;
        }
    };
}();
