var Inventory = function(){

    var amounts = {};

    var divs = [];

    function get(itemName){
        var amount = amounts[itemName];
        if(amount===undefined){
            return 0;
        }
        return amount;
    }

    function store(itemName, amount){
        var itemAmount = amounts[itemName];
        if(itemAmount===undefined){
            itemAmount = 0;
            $.each(divs, function(index, div){
                addItemToTable(div.find('table'), itemName, amount);
            });
        }
        if(ITEMS[itemName]['timelineOnStore'] !== undefined){
            Timeline.addNotification(ITEMS[itemName]['timelineOnStore']);
        }
        itemAmount = itemAmount + amount;
        amounts[itemName] = itemAmount;
        updateItem(itemName);
    }

    function remove(itemName, amount){
        var itemAmount = amounts[itemName];
        if(itemAmount===undefined){
            return 0;
        }
        if(itemAmount<amount){
            amounts[itemName] = 0;
            updateItem(itemName);
            return itemAmount;
        }
        itemAmount = itemAmount - amount;
        amounts[itemName] = itemAmount;
        updateItem(itemName);
        return amount;
    }

    function setup(div){
        var $inventoryDiv = $('<fieldset />');
        $inventoryDiv.appendTo(div);

        $('<legend />').html("Inventory").appendTo($inventoryDiv);

        var $table = $('<table />');
        $table.appendTo($inventoryDiv);

        $.each(amounts, function(key, value){
            addItemToTable($table, key, value);
        });
        divs.push($inventoryDiv);
    }

    function addItemToTable(table, itemName, amount){
        var $tr = $('<tr />').attr({
            "class": 'INV'+itemName
        }).appendTo(table);

        $('<td />').html(ITEMS[itemName].text).appendTo($tr);
        $('<td />').attr({
            "class": 'INV_AMOUNT'+itemName
        }).html(amount).appendTo($tr);
    }

    function updateItem(itemName){
        $.each(divs, function(index, div){
            if(amounts[itemName]>0){
                div.find('.INV'+itemName).show();
                div.find('.INV_AMOUNT'+itemName).html(amounts[itemName]);
            }else{
                div.find('.INV'+itemName).hide();
                div.find('.INV_AMOUNT'+itemName).html(amounts[itemName]);
            }
        });
    }

    return {
        get : get,
        store : store,
        remove : remove,
        setup : setup
    };
};

var ITEMS = {
    flashlight : {
        name            : "flashlight",
        text            : "Flashlight",
        unique          : true,
        timelineOnStore : "You find a flashlight."
    },
    batteries : {
        name            : "batteries",
        text            : "Batteries",
        unique          : false,
        timelineOnStore : "You find batteries."
    },
    tarp : {
        name            : "tarp",
        text            : "Tarp",
        unique          : true,
        timelineOnStore : "You find a tarp."
    },
    lighter : {
        name            : "lighter",
        text            : "Lighter",
        unique          : true,
        timelineOnStore : "You find a lighter."
    },
    food : {
        name            : "food",
        text            : "Food",
        unique          : false,
        timelineOnStore : "You find some food."
    },
    knife : {
        name            : "knife",
        text            : "Knife",
        unique          : true,
        timelineOnStore : "You find a knife."
    },
    bandage : {
        name            : "bandage",
        text            : "Bandage",
        unique          : false,
        timelineOnStore : "You find a bandage."
    },
    medicine : {
        name            : "medicine",
        text            : "Medicine",
        unique          : false,
        timelineOnStore : "You find some medicine."
    },
};