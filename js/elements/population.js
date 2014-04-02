var Population = function(){

	var amount = 1;

	var divs = [];

	function setup(div){
		var $fieldset = $('<fieldset />');
		$fieldset.appendTo(div);

        $('<legend />').html("Population").appendTo($fieldset);

        var $table = $('<table />');
        $table.appendTo($fieldset);

        var $tr = $('<tr />').appendTo($table);

    	$('<td />').html('Population').appendTo($tr);
    	$('<td />').attr({
			"class": 'POPULATION_AMOUNT'
		}).html(State.population.amount).appendTo($tr);

		divs.push($fieldset);
	};

	function add(num){
		amount = amount + num;
		update();
	};

	function sub(num){
		amount = amount - num;
		update();
	};

	function update(){
		$.each(divs, function(index, div){
			div.find('.POPULATION_AMOUNT').html(amount);
		});
	};

	return{
		amount	: amount,
		setup	: setup,
		add		: add,
		sub		: sub
	}
};