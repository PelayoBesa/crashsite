var Utils = function(){

	function getRandomInt (min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {
		getRandomInt : getRandomInt
	}
}();