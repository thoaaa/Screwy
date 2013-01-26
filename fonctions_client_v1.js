function test_json() {	
	var json_test = '{"type":"message","sender":"Damien","date":"01/10/2012","txt":"Phrase de test","color":"blue"}';
	var object = JSON.parse(json_test);
	if(object.type == "message") {
		reception_message(object);
	} else if (object.type == "voteActivate") {
		activate_vote(object);	
	} else if (object.type == "voteDeactivate") {
		deactivate_vote_vote(object);
	} else if (object.type == "starterActivate") {
		activate_starter();
	} else if (object.type == "starterDeactivate") {
		deactivate_starter();
	} else if (object.type == "role") {
		maj_profil(object);
	} else if (object.type == "userInfo") {
		maj_players(object);
	} else if (object.type == "timerActivate") {
		start_timer(object);
	} else if (object.type == "errorMessage") {
		show_error_msg(object);
	}
}

function reception_message(e) {
	var sender = e.sender;
	var	date = e.date;
	var	txt = e.txt;
	var	color = e.color;
	
	var message = "<p><span style='color:"+color+";'>"+sender+"("+date+") :</span><span> "+txt+"</span></p>";
	document.getElementById("chat").innerHTML = message;
}

function activate_vote(e) {
	var typeVote = e.typeVote;
	var	pseudoNominees = e.pseudoNominees; //liste des condidats
	if (typeVote == "normal") {
	
	} else if (typeVote == "psycho") {
	
	} else if (typeVote == "special") {
	
	} 
}

function deactivate_vote(e) {
	var typeVote = e.typeVote;
}

function activate_starter() {

}

function deactivate_starter() {

}

function maj_profil(e) {
	var role = e.role;	
}

function maj_players(e) {
	var pseudo = e.pseudo;
	var	role = e.role; //role du joueur (null si inconnu)
	var	alive = e.alive; //booléen
}

function start_timer(e) {
	var time = e.time; //temps en secondes
}

function show_error_msg(e) {
	var txt = e.txt;	
}