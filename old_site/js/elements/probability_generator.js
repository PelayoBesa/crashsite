var ProbabilityGenerator = function(options){
	var probabilities = [];
	var functions = {}

	function addProbability(name, probability, func){
		probabilities.push({
			name		: name,
			probability	: probability/100,
			func		: func
		});
	};

	function removeProbability(name){
		for(i=0; i<probabilities.length; i++){
			if(probabilities[i].name===name){
				probabilities.splice(i,1);
				return;
			}
		}
	}

	function getNext(){
		var r = Math.random();
		var p = 0;
		var i;
		for(i=0; i<probabilities.length; i++){
			var prob = probabilities[i].probability;
			if( r>=p && r<p+prob ){
				return probabilities[i];
			}
			p = p + prob;
		}
		return {
			name 		: "item not found",
			probability : 0,
			func 		: function(){}
		};
	};

	function runNext(){
		getNext().func();
	};

	function getNextDefined(){
		var p = getNext();
		while(p.probability==0)
			p = getNext();
		return p;
	}

	function runNextDefined(){
		getNextDefined().func();
	}

	function generateProbabilitiesFromOptions(options){
		$.each(options, function(index, option){
			var name = option.name;
			if(name=='undefined'){
				if(option.item!=undefined){
					name = option.item;
				}else{
					name = '';
				}
			}

			function action(){
				if(option.timelineMessage!=undefined){
					Timeline.addNotification(option.timelineMessage);
				}
				if(option.item!=undefined){
					var amount = 1;
					if(option.itemAmount!=undefined){
						amount = option.itemAmount;
					}
					State.inventory.store(option.item, amount);
				}
				if(option.action!=undefined){
					option.action();
				}
				if(option.item!=undefined && ITEMS[option.item].unique===true){
					removeProbability(name);
				}
				if(option.showItems!=undefined){
					var items = option.showItems;
					if(typeof option.showItems === 'function'){
						items = option.showItems();
					}
					$.each(items, function(index, element){
						element.show();
					})
				}
				if(option.hideItems!=undefined){
					var items = option.hideItems;
					if(typeof option.hideItems === 'function'){
						items = option.hideItems();
					}
					$.each(items, function(index, element){
						element.hide();
					})
				}
			}

			addProbability(name, option.probability, action);
		});
	}

	if(options!=undefined){
		return generateProbabilitiesFromOptions(options);
	}else{
		return {
			probabilities					 : probabilities,
			addProbability					 : addProbability,
			generateProbabilitiesFromOptions : generateProbabilitiesFromOptions,
			removeProbability				 : removeProbability,
			getNext							 : getNext,
			runNext							 : runNext,
			getNextDefined					 : getNextDefined,
			runNextDefined					 : runNextDefined,
		};
	}
};

/*
	Example:
		var pg = ProbabilityGenerator();
		pg.addProbability("p10", 10, function(){console.log("p10")});
		pg.addProbability("p5", 5, function(){console.log("p5")});
		pg.addProbability("p15", 15, function(){console.log("p15")});
		pg.addProbability("p35", 35, function(){console.log("p35")});
		pg.addProbability("p25", 25, function(){console.log("p25")});
		pg.addProbability("p7", 7, function(){console.log("p7")});
		pg.addProbability("p3", 3, function(){console.log("p3")});

		pg.runNext();
*/