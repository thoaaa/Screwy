var liste_roles = new Array();
var liste_joueurs = new Array();
var liste_visiteurs = new Array();
var nbRole;
var waitForReady = false;
var gameStarted = false;

function parseur(objetJSON) {
	var instruction = JSON.parse(objetJSON);
	var type = instruction.type;
	
	switch (type) {
 		case "startSalon" :
			var liste = instruction.listRole;
 			startSalon(liste);
		break;
		case "readyToStart" :
			var sender = instruction.sender;
		 	readyToStart(sender);
		break;
		case "addPlayer" :
			var pseudo = instruction.pseudo;
			addPlayer(pseudo);
		break;
		case "deletePlayer" :
			var pseudo = instruction.pseudo;
			deletePlayer(pseudo);
		break;
		default:
			console.log("Instruction erronée : "+objetJSON); 
		break;
	}
	
	document.getElementById("visiteurs").innerHTML = liste_visiteurs;
	document.getElementById("joueurs").innerHTML = liste_joueurs;
}

function startSalon(e) {
	liste_roles = e;
	nbRole = e.length;
	console.log("Liste des rôles : "+e+" | Nombre de rôles : "+nbRole);
}

function readyToStart(e) {
	id_joueur = liste_visiteurs.indexOf(e);
	if (waitForReady && id_joueur>=0) {
		liste_visiteurs.splice(id_joueur,1);
		liste_joueurs.push(e);
		if (liste_joueurs.length == nbRole ) {
			waitForReady = false;
			deactivateStarter()
			console.log("Lancement de la partie...");
			startGame();
		}
		console.log("Le joueur "+e+" est prêt !");			
	} else {
		console.log(e+" a tenté de se mettre prêt sans y être autorisé !");
	}		
	console.log("Nombre de joueurs prêts : "+liste_joueurs.length+"/"+nbRole);
}

function addPlayer(e) {	
	liste_visiteurs.push(e);
	if (!gameStarted && !waitForReady && liste_visiteurs.length == nbRole) {
		waitForReady = true;
		console.log("Le nombre de joueurs est équivalent au nombre de rôle -> en attente");
		activateStarter();
	}
	console.log("Le joueur "+e+" a été ajouté au salon !");
}

function deletePlayer(e) {
	var test_joueur = liste_joueurs.indexOf(e);
	if(test_joueur<0) {
		var id_visiteur = liste_visiteurs.indexOf(e);
		liste_visiteurs.splice(id_visiteur,1);
	} else {
		liste_joueurs.splice(test_joueur,1);	
	}
	if (waitForReady && liste_joueurs.length+liste_visiteurs.length < nbRole) {
			waitForReady = false;
			deactivateStarter()
			console.log("Il n'y a plus assez de joueurs dans le salon !");
			while (liste_joueurs.length > 0) {
				liste_visiteurs.push(liste_joueurs[0])
				liste_joueurs.splice(0,1);
			}
	}
	console.log("Le joueur "+e+" a été supprimé du salon !");
}

function activateStarter() {
	var objet = {
		receivers : liste_visiteurs,
		instruction : {
			type : "starterActivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour activer le starter !");
}

function deactivateStarter() {
	var objet = {
		receivers : liste_visiteurs,
		instruction : {
			type : "starterDeactivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour désactiver le starter !");
}

function startGame() {
	console.log("Partie lancée !");
	distribRoles(liste_joueurs, liste_roles);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function distribRoles(){
	shuffleArray(liste_roles);
	var liste_psychos = new Array();
	var liste_instructions_psycho = new Array();
	var objet;
	for(var i = 0; i < liste_joueurs.length; i++){
		console.log("Le joueur "+liste_joueurs[i]+" est "+liste_roles[i]);
		if(liste_roles[i] == "psychopathe") {
			liste_psychos.push(liste_joueurs[i]);
			liste_instructions_psycho.push('{"type":"userInfo","pseudo":"'+liste_joueurs[i]+'","role":"'+liste_roles[i]+'","alive":"true"}');		
		} else {
			objet = {
				receivers : [liste_joueurs[i]],
				instruction : {
					type : "userInfo",
					pseudo : liste_joueurs[i],
					role : liste_roles[i],
					alive : "true"
				}
			}
			//postMessage(objet);
			console.log("Le joueur "+liste_joueurs[i]+" reçoit son rôle : "+liste_roles[i]);
		}
	}
	var envoi_psycho = {
		receivers : liste_psychos,
		instruction : {
			type : "instructionList",
			list_instructions : liste_instructions_psycho
		}
	}
	//postMessage(envoi_psycho);
	console.log(liste_instructions_psycho);
}