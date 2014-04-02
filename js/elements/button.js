var Button = function(text, cooldown, postCreationFunc, onClickFunc, onClickAfterCooldown) {

	if(onClickAfterCooldown==undefined){
		onClickAfterCooldown=false;
	}

	if(onClickFunc===undefined){
		return buttonGenerator(text, cooldown, postCreationFunc, onClickAfterCooldown);
	}else{
		var button = buttonGenerator(text, cooldown, onClickFunc, onClickAfterCooldown);
		postCreationFunc(button);
		return button;
	}

	function buttonGenerator(text, cooldown, onClickFunc, onClickAfterCooldown) {
		var btnWidth;
	    var btnHeight;
	    var $btnFiller;

		var cool = cooldown;

		function setCooldown(newCooldown){
			cool = newCooldown;
		}

		function textSize(text) {
			var $calc = $('<div />').attr({
				"class": "button calc",
				"style": "display:none"
			}).append( $('<div />').addClass('text').text(text) );

			var width = $calc.appendTo('body').width();
			var height = $calc.appendTo('body').height();
			$('.calc').remove();

			return {
	            "width" : width,
	            "height" : height
	        };
		};

		function createButtonHtml() {
	        var btnSize = textSize(text);
			btnWidth = btnSize.width;
			btnHeight = btnSize.height;

			var $btnContainer = $('<div />').attr({
				"class": "button"
			}).width(btnWidth).height(btnHeight);

			$btnFiller = $('<div />').attr({
				"class": "filler"
			}).height(btnHeight);

			var $btnText = $('<div />').attr({
				"class": "text",
			}).text(text);

	        $btnText.css('top', '-' + btnHeight + 'px');

			return $btnContainer.append($btnFiller).append($btnText);
		};

		var $button = createButtonHtml();

		$button.click(function() {
			if ($btnFiller.width() === 0) {
				$btnFiller.width(btnWidth);
				if(!onClickAfterCooldown){
					onClickFunc(button);
					$btnFiller.width(btnWidth).animate({
						width: 0
					}, cool);
				}else{
					$btnFiller.width(btnWidth).animate({
						width: 0
					}, cool, function(){onClickFunc(button)});
				}
			}
		});


		return $button;
	};

}
