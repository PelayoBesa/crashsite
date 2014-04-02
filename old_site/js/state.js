var State = function(){

	var inventory = Inventory();

	var population = Population();


	return {
		inventory : inventory,
		population : population
	};
}();