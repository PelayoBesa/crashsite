var SurvivorConstants = {
	damageMsg : {
		1 : "damage-1",
		2 : "damage-2",
		3 : "damage-3",
		4 : "damage-4"
	},
	survivorNames : {
		male 	: ["Luke","Clifford","Kevin","Willie","Bertram","Christian","Erick","Terence","Quentin","Dee","Tristan","Randal","Glenn","Emile","Clayton","Gilberto","Randolph","Nick","Cody","Noe"],
		female	: ["Delora","Estefana","Lawanna","Adina","Milagros","Jacqueline","Marilu","Nelida","Pauline","Lucinda","Ha","Doretta","Synthia","Marcene","Caterina","Jonelle","Loni","Amiee","Onita","Nadene"]
	}
};

var Survivor = function(div, itemUsedFunction, damageEliminated){

	var bandageButton;
	var medicineButton;

	var sex = getSex();
	var index = Utils.getRandomInt(0,SurvivorConstants.survivorNames[sex].length-1);

	var name = SurvivorConstants.survivorNames[sex].splice(index,1)[0];
	var	damage = Utils.getRandomInt(1,4);

	function getSex(){
		var val = Utils.getRandomInt(0,1);
		if(val === 0){
			return "female";
		}else{
			return "male";
		}
	};

	function addSurvivorToDiv(){
		var $component = $('<div />').attr({
			"class": "survivor-component",
		});
		$component.appendTo(div);

		var pronoun = "He";
		if(sex==="female"){
			pronoun = "She";
		}
		var $text = $('<div class="survivor"/>').html("You find "+name+". "+pronoun+" appears to have a "+SurvivorConstants.damageMsg[damage]);
		$text.appendTo($component);

		function updateDamage(item){
			var amountRemoved = State.inventory.remove(item, 1);
			if(amountRemoved>0){
				damage = damage-1;
			}
			itemUsedFunction(item);
			$text.text("You find "+name+". "+pronoun+" appears to have a "+SurvivorConstants.damageMsg[damage]);
			if(damage<=0){
				$component.remove();
				damageEliminated();
			}
		}

		bandageButton = Button("Bandage", 2000,function(button){},function(button){
			updateDamage('bandage');
		});
		bandageButton.hide().appendTo($component);
		if(State.inventory.get('bandage')>0){
			bandageButton.show();
		}

		medicineButton = Button("Medicine", 2000,function(button){},function(button){
			updateDamage('medicine');
		});
		medicineButton.hide().appendTo($component);
		if(State.inventory.get('medicine')>0){
			medicineButton.show();
		}
	};
	addSurvivorToDiv();

	var button = {
		medicine : function(enable){
			if(enable){
				medicineButton.show();
			}else{
				medicineButton.hide();
			}
		},
		bandage : function(enable){
			if(enable){
				bandageButton.show();
			}else{
				bandageButton.hide();
			}
		}
	};

	function updateButton(item, enable){
		button[item](enable);
	};

	return {
		name : name,
		damage : damage,
		updateButton : updateButton
	};
};