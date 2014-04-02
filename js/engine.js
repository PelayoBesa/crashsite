function Engine(){

    var rooms = {};
    var currentRoom;

    this.start = function(){
        this.generateRoom("crashsite", "CrashSite", CrashSite);
        currentRoom = rooms["crashsite"];
        currentRoom.div.show();
    };

    this.generateRoom = function(id, name, roomGenerationFunc){
        var $div = $('<div />').attr({
            "id": "crashsite",
            "style": "display:none"
        });
        var $sidebar = $('<div />').attr({
            "class": "crashsite-sidebar"
        });
        $sidebar.appendTo($div);
        $div.appendTo("#room-content");

        var room = roomGenerationFunc(this, $div);
        room.setup();
        room.start();

        rooms[id] = {
            name : name,
            div  : $div,
            room : room
        };
    };

    this.setCurrentRoom = function(id){
        currentRoom.div.hide();
        currentRoom = rooms[id];
        currentRoom.div.show();
    };

    this.setRoomName = function(name){
        $("#location").text(name);
        document.title = name;
    };

    this.setSubmessage = function(message){
        $("#submessage").text(message);
    };
}