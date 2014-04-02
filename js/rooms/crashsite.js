var CrashSite = function(engine, div){
	var eng = engine;

	var flashlightIsOn = false;
	var tentIsBuilt = false;
	var fireIsBuilt = false;

	var hurtSurvivors = [];

	var $inventoryDiv;
	var $populationDiv;

	var buttons = {
		rummageInTheDarkButton: Button("Rummage in the dark", 1000,
			function(button) {
				var pg = ProbabilityGenerator();
				pg.generateProbabilitiesFromOptions([
					{
						probability		: 20,
						timelineMessage	: "You find nothing."
					},
					{
						probability		: 20,
						timelineMessage	: "You hit your shin and you find nothing."
					},
					{
						probability		: 20,
						timelineMessage	: "Ooze! You wish you hadn't touched that."
					},
					{
						name			: "flashlight",
						probability		: 10,
						item			: ITEMS.flashlight.name,
						itemAmount		: 1,
						action			: findFlashlight,
						showItems		: function(){return [buttons['flashlight'],$inventoryDiv]}
					}

				]);
				button['pg'] = pg;
			},
			function(button) {
				button['pg'].runNextDefined();
			}
		),

		flashlight: Button(ITEMS.flashlight.text, 1000,function(button){},turnOnFlashlight),

		rummageWreckageButton: Button("Rummage wreckage", 1000,
			function(button) {
				/*
					Possible resources:
						Useful:
							- Hurt survivors {{max 5, population counter appears, random name for suvivor}}
							- Bandages {{max 8, to try to heal other people}}
							- Medicine
							- Plastic tarp
							- Lighter
							- Knife
							- Food
						Not useful:
							- Message: Apparently, {{Random  name}} didn’t make it.
				*/
				var pg = ProbabilityGenerator();
				pg.generateProbabilitiesFromOptions([
					/*
						TODO:
							- (max amount counter) to remove from probablity
							- hide button flag. Pass list of buttons and hide them all
							- All buttons need to be created beforehand
					*/
					{
						name			: "survivor",
						probability		: 10,
						action			: findSurvivor
					},
					{
						name			: "bandage",
						probability		: 10,
						item			: ITEMS.bandage.name,
						itemAmount		: 1,
						action			: findBandage
					},
					{
						name			: "medicine",
						probability		: 10,
						item			: ITEMS.medicine.name,
						itemAmount		: 1,
						action			: findMedicine
					},
					{
						name			: "tarp",
						probability		: 10,
						item			: ITEMS.tarp.name,
						itemAmount		: 1,
						showItems		: function(){return [buttons['buildTent']]}
					},
					{
						name			: "lighter",
						probability		: 10,
						item			: ITEMS.lighter.name,
						itemAmount		: 1,
						showItems		: function(){return [buttons['buildFire']]}
					},
					{
						name			: "knife",
						probability		: 10,
						item			: ITEMS.knife.name,
						itemAmount		: 1,
					},
					{
						name			: "food",
						probability		: 20,
						item			: ITEMS.food.name,
						itemAmount		: 1
					},
					{
						name			: "batteries",
						probability		: 20,
						item			: ITEMS.batteries.name,
						itemAmount		: 1
					}
				]);
				button['pg'] = pg;
			},
			function(button) {
				button['pg'].runNextDefined();
			}
		),

		buildTent: Button("Build tent", 2000,function(button){},buildTent, true),
		buildFire: Button("Build fire", 2000,function(button){},buildFire, true),
	};

	function findFlashlight(){
		var pg = buttons.rummageInTheDarkButton['pg'];
		pg.addProbability('batteries', 20, function() {
			State.inventory.store(ITEMS.batteries.name, 1);
		});
	};

	function turnOnFlashlight() {
		if (State.inventory.get(ITEMS.batteries.name) > 0) {
			if (flashlightIsOn) {
				Timeline.addNotification("The flashlight is already on.");
				return;
			}
			buttons['rummageInTheDarkButton'].hide();
			buttons['rummageWreckageButton'].show();
			Timeline.addNotification("You can see... sort of.");
			engine.setRoomName("Crash site");
			State.inventory.remove(ITEMS.batteries.name, 1);
			flashlightIsOn = true;
			setTimeout(turnOffFlashlight, 300000);
		} else {
			Timeline.addNotification("Click.");
		}
	};

	function turnOffFlashlight() {
		buttons['rummageInTheDarkButton'].show();
		buttons['rummageWreckageButton'].hide();
		engine.setRoomName("The Darkness");
		Timeline.addNotification("You can't see anything.");
		flashlightIsOn = false;
	};

	function findSurvivor(){
		var survivorsDiv = $('#survivors').show();
		var survivor = Survivor(survivorsDiv, useItemOnSurvivor, survivorPatchedUp);
		hurtSurvivors.push(survivor);
	};

	function useItemOnSurvivor(item){
		if(State.inventory.get(item)<=0){
			toggleSurvivorButtons(item, false);
		}
	};

	function survivorPatchedUp(){
		State.population.add(1);
		$populationDiv.show();
	}

	function buildTent(){
		tentIsBuilt = true;
		State.inventory.remove('tarp');
		if(fireIsBuilt){
			engine.setSubmessage("It is dark and raining.");
		}else{
			engine.setSubmessage("It is dark and raining. You are cold.");
		}
		buttons['buildTent'].remove();
	};

	function buildFire(){
		fireIsBuilt = true;
		State.inventory.remove('lighter');
		if(tentIsBuilt){
			engine.setSubmessage("It is dark and raining.");
		}else{
			engine.setSubmessage("It is dark and raining. You are wet.");
		}
		buttons['buildFire'].remove();
	};

	function findMedicine(){
		toggleSurvivorButtons('medicine', true);
	};

	function findBandage(){
		toggleSurvivorButtons('bandage', true);
	};

	function toggleSurvivorButtons(item, enable){
		$.each(hurtSurvivors, function(index, survivor){
			survivor.updateButton(item, enable);
		});
	};

	function setup(){
		var $basic_actions = $('<div />').attr({
			"id": "basic-actions",
			"class": "basic-actions",
		});
		$basic_actions.appendTo(div);

		var $more_actions = $('<div />').attr({
			"id": "more-actions",
			"class": "more-actions",
		});
		$more_actions.appendTo(div);

		var $survivors = $('<div />').attr({
			"id": "survivors",
			"class": "survivors",
			"style": "display:none"
		});
		$survivors.appendTo(div);

		$inventoryDiv = $('<div />').attr({
			"id": "inventory",
			"class": "inventory",
			"style": "display:none"
		});
		$inventoryDiv.appendTo(div.find(".crashsite-sidebar"));

		$populationDiv = $('<div />').attr({
			"id": "population",
			"class": "population",
			"style": "display:none"
		});
		$populationDiv.appendTo(div.find(".crashsite-sidebar"));

		engine.setRoomName("The Darkness");
		engine.setSubmessage("It is dark and raining. You are wet and cold.");

		buttons["rummageInTheDarkButton"].appendTo("#basic-actions");
		buttons['rummageWreckageButton'].hide().appendTo("#basic-actions");

		buttons['flashlight'].hide().appendTo("#more-actions");
		buttons['buildTent'].hide().appendTo("#more-actions");
		buttons['buildFire'].hide().appendTo("#more-actions");


		State.inventory.setup($inventoryDiv);
		State.population.setup($populationDiv);

	};

	function start(){

	};

	return {
		setup	: setup,
		start 	: start
	};
};
