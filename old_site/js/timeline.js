var Timeline = function() {

	var target = '#sidebar';
  
    return {  
        addNotification : function(text) {
            var $notification = $('<p></p>').text(text).addClass('notification');
            $notification.css('opacity', '0').prependTo(target);
            $notification.animate({opacity: 1}, 500, 'linear');;
        }
    };
}();
