"use strict";

process.title = 'node-screwy';
var webSocketsServerPort = 1337;

var webSocketServer = require('websocket').server;
var http = require('http');
var Worker = require('webworker-threads').Worker;

//######################################################################################################################"
var fonctionWW = function() {
	var liste_roles = new Array();
	var liste_joueurs = new Array();
	var liste_visiteurs = new Array();
	var nbRole;
	var waitForReady = false;
	var gameStarted = false;

	var actionHistory = [];

	function Vote(sender, target) {
		this.sender = sender;
		this.target = target;
	}

	function VoteManager(type) {
		//normal, psycho, ou special
		this.type = type;
		//liste des personnes autorisées a participer au vote
		this.allowedVoters = [];
		//personnes éligibles
		this.targets = [];
		this.votes = [];
	}

	VoteManager.prototype = {
		open : function(allowedVoters, targets){
			this.votes = [];
			this.targets = targets;
			this.allowedVoters = allowedVoters;
		
			var openVote = {
				receivers : this.allowedVoters,
				instruction : {
					type : "voteActivate",
					typeVote : this.type,
					pseudoNominees : this.targets
				}
			};
			postMessage(openVote);
			console.log("Vote " + this.type + " ouvert");
		},
		getIdVoteBySender : function(sender) {
			var i = 0;
			var result = -1;
			while ( i < this.votes.length && result == -1) {
				if (this.votes[i].sender == sender)
					result = i;
				i++;
			}
			return result;
		},	
		registerVote: function(sender, target) {
			if (allowedVoters.indexOf[sender] == -1 || targets.indexOf[target] == -1) {
				console.log("vote non autorisé (type: " + this.type + ", sender : " + sender + ", target : " + target + ")");
				return;
			}
			var id = this.getIdVoteBySender(sender);
			if (id == -1) {
				var v = new Vote(sender, target);
				this.votes.push(v);
				console.log(sender + " a voté " + target);
			} else {
				this.votes[id].target = target;
				console.log(sender + " a changé de vote pour " + target);
			}
		},
		countVotes: function() {
			var max = 0;
			var counter = [];
			var result = [];
		
			//initialisation des compteurs
			for (var i=0; i < this.targets.length; i++)
				counter[i] = 0;
		
			//compta des votes
			for (var i=0; i < this.votes.length; i++) {
				var id = this.targets.indexOf(this.votes[i].target);
				counter[id]++;
				if (counter[id] > max)
					max = counter[id];
			}
		
			//determination des élus
			for (var i=0; i < this.counter.length; i++) {
				if(this.counter[i] == max)
					result.push(this.targets[i]);
			}
		
			return result;
		},
		close : function() {
			var closeVote = {
				receivers : allowedVoters,
				instruction : {
					type : "voteDeactivate",
					typeVote : this.type,
				}
			};
			postMessage(closeVote);
			//on vide la liste des votant pour empecher la reception de nouveaux votes
			this.allowedVoters = [];
			result = this.countVotes();
			this.targets = [];
			this.votes = [];
			console.log("Vote " + this.type + " terminé. Les élus sont " + result);
			return result;
		}
	}
	
	var voteManagers = [];
	voteManagers["normal"] = new VoteManager("normal");
	voteManagers["psycho"] = new VoteManager("psycho");
	voteManagers["special"] = new VoteManager("special");
	
	onmessage = function(event) {
		parseur(event.data);
	}

	function parseur(instruction) {
		var type = instruction.type;
		console.log("$$$ instruction reçue par le salon" + JSON.stringify(instruction));
	
		switch (type) {
	 		case "startSalon" :
				var liste = instruction.roles;
	 			startSalon(liste);
			break;
			case "readyToStart" :
				var sender = instruction.sender;
			 	readyToStart(sender);
			break;
			case "addUser" :
				var pseudo = instruction.pseudo;
				addPlayer(pseudo);
			break;
			case "deleteUser" :
				var pseudo = instruction.pseudo;
				deletePlayer(pseudo);
			break;
			case "message" :
				if (instruction.txt != undefined)
					deliverMsg(instruction);
				else
					console.log("Reception d'un message non conforme.");
			break;
			case "vote" :
				var sender = instruction.sender;
				var target = instruction.pseudoVoted;
				var typeVote = instruction.typeVote;
				if (voteManagers[typeVote] != undefined && sender != undefined && target != undefined)
					voteManagers[typeVote].registerVote(sender, target);
				else
					console.log("Reception d'un vote non conforme.");
			
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

	function deliverMsg(msg) {
		msg.date = (new Date()).getTime();
		actionHistory.push(msg);
	
		var receivers = [];
		receivers.concat(liste_visiteurs);
	
		var i = 0;
		var result = false;
		while (i < liste_joueurs.length && !result) {
			if (msg.sender == listeJoueurs[i])
				result == true;
			i++;
		}
		if (result)
			receivers.concat(liste_joueurs);

		console.log("######################################## " + receivers);
		var newMessage = {
			receivers : receivers,
			instruction : msg
		};
		postMessage(newMessage);
	}

	function sendHistory(pseudo) {
		var history = {
			receivers : [ pseudo ],
			instruction : {
				type : "instructionList",
				instructions : actionHistory
			}
		};
		postMessage(history);
	}

	function activateStarter() {
		var objet = {
			receivers : liste_visiteurs,
			instruction : {
				type : "starterActivate"
			}
		}
		postMessage(objet);
		console.log("Envoi de l'instruction pour activer le starter !");
	}

	function deactivateStarter() {
		var objet = {
			receivers : liste_visiteurs,
			instruction : {
				type : "starterDeactivate"
			}
		}
		postMessage(objet);
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
				postMessage(objet);
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
		postMessage(envoi_psycho);
		console.log(liste_instructions_psycho);
	}
}
//######################################################################################################################"

//-------------------------------CLASSES ANNUAIRE---------------------------------

function Client(pseudo, connexion) {
	this.pseudo = pseudo;
	this.connexion = connexion;
}

Client.prototype = {
	getPseudo: function() {
		return this.pseudo;
	},
	sendString: function(string) {
		this.connexion.sendUTF(string);
		console.log(string + "--ENVOI-->" + this.pseudo);
	}
}

function AnnuaireClients() {
	this.listeClients= [];
}

AnnuaireClients.prototype = {
	addClient: function(pseudo, connexion) {
		var c = new Client(pseudo, connexion);
		this.listeClients.push(c);
	},
	removeClient: function(pseudo) {
		var p = this.getPositionClient(pseudo);
		if (p !== null)
			this.listeClients.splice(p, 1);
	},
	getPositionClient: function(pseudo) {
		var i=0
		var result = null;
		while(i < this.listeClients.length && result === null) {
			if (this.listeClients[i].getPseudo() == pseudo) {
				result = i;
			}
			i++;
		}
		return result;
	},
	sendInstruction: function(listePseudoClients, instruction) {
		var json = JSON.stringify(instruction);
		if (listePseudoClients.length <= 0) {
			this.print();
			for(var i = 0; i < this.listeClients.length; i++) {
				this.listeClients[i].sendString(json);
			}
		} else {
			for (var i = 0; i < listePseudoClients.length; i++) {
				var p = this.getPositionClient(listePseudoClients[i]);
				if (p != null) {
					this.listeClients[p].sendString(json);
				} else {
					console.log("envoi à " + listePseudoClients[i] + "annulé (pseudo inconnu)");
				}
			}
		}	
	},
	print: function(){
		console.log( "-------------");
		for(var i = 0; i < this.listeClients.length; i++) {
			console.log(this.listeClients[i].getPseudo());
		}
		console.log( "-------------");
	}
}

function Salon(id, roles) {
	this.id = id;
	//Le code du webworker est ci-dessous
	this.ww = new Worker(fonctionWW);
	this.ww.listeClients = new AnnuaireClients();
	this.sendInstruction({
		type:"startSalon",
		roles: roles
	});
}

Salon.prototype = {
	getId: function() {
		return this.id;
	},
	addPlayer: function(pseudo, connexion) {
		var instruction = {
			type:"addUser",
			pseudo: pseudo
		};
		this.sendInstruction(instruction);
		this.ww.listeClients.addClient(pseudo, connexion);
	},
	removePlayer: function(pseudo) {
		var instruction = {
			type:"deleteUser",
			pseudo: pseudo
		};
		this.sendInstruction(instruction);
		this.ww.listeClients.removeClient(pseudo);
	},
	sendInstruction: function(instruction) {
		this.ww.postMessage(instruction);
	}
}

function AnnuaireSalons() {
	this.listeSalons= [];
}

AnnuaireSalons.prototype = {
	createSalon: function(id) {
		var roles = ["innocent", "psychopathe", "wise"];
		var s = new Salon(id, roles);
		this.listeSalons.push(s);
		return s;
	},
	removeSalon: function(id) {
		var p = this.getPositionSalon(id);
		if (p !== null)
			this.listeSalons.splice(p, 1);
	},
	getSalonById: function(id) {
		var i = this.getPositionSalon(id);
		var result;
		if (i == null) {
			result = null;
		}
		else {
			result = this.listeSalons[i];
		}
		return result;
	},
	getPositionSalon: function(id) {
		var i=0
		var result = null;
		while(i < this.listeSalons.length && result === null) {
			if (this.listeSalons[i].getId() == id) {
				result = i;
			}
			i++;
		}
		return result;
	},
	print: function(){
		console.log( "-------------");
		for(var i = 0; i < this.listeSalons.length; i++) {
			console.log(this.listeSalons[i].getId());
		}
		console.log( "-------------");
	}
}
//-----------------------------FIN CLASSES ANNUAIRE-------------------------------

//La fonction suivante est exécutée lors de la reception d'un message venant d'un WebWorker
Worker.prototype.onmessage = function(event) {
	console.log("objet reçu : " + JSON.stringify(event.data)); 
	var i = event.data;
	var receivers = i.receivers;
	var instruction = i.instruction;
	console.log("-- " + JSON.stringify(receivers) + " -> "  + JSON.stringify(instruction));
	if (instruction != null) {
		this.listeClients.sendInstruction(receivers, instruction);
	} else {
		console.log("Objet non standard reçu d'un salon : " + event.data); 
	}
}

//init serveur http
var server = http.createServer(function(request, response) {
});
server.listen(webSocketsServerPort, function() {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

//init serveur websocket
var wsServer = new webSocketServer({
	httpServer: server
});

var annuaireSalons = new AnnuaireSalons();

//Toutes les connexions client arrivent dans cette fonction
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
	//TODO vérifier origine requete.
	var connection = request.accept(null, request.origin); 
	var pseudo = false;
	var salon = false;
	console.log((new Date()) + ' Connection accepted.');

	// une instruction est reçue
	connection.on('message', function(message) {
		
		//on vérifie le format du message
		if (message.type !== 'utf8')
			return;
		//on récupere l'instruction contenue dans le message
		try {
			var instruction = JSON.parse(message.utf8Data);
		} catch (e) {
			console.log('Le message suivant n\'est pas au format JSON : ', message.utf8Data);
			return;
		}
		//on vérifie que le client est identifié
		if (pseudo == false ) {
			if (instruction.type != 'connexion') {
				console.log("Un client non identifié tente d'exécuter des instructions.");
				return;
			}
			else {
				//TODO checker la connexion (travail Rocco)
				salon = annuaireSalons.getSalonById(instruction.salon);
				if (salon == null) {
					console.log("Création du salon " + instruction.salon);
					salon = annuaireSalons.createSalon(instruction.salon);
					if (salon == null) {
						//TODO informer user
						//TODO kicker user
						console.log("Création du salon " + instruction.salon + " échouée");
						return;
					}
				}
				pseudo = instruction.pseudo;
				console.log(pseudo + " entre dans le salon " + instruction.salon);
				salon.addPlayer(pseudo, this);	
			}
		}
		//on envoie l'instruction au salon
		else {
			console.log("transmission d'une instruction de " + pseudo + " au salon " + salon.getId());
			instruction.sender = pseudo;
			salon.sendInstruction(instruction);
		}
	});

	// déconnexion
	connection.on('close', function(connection) {
		if (pseudo != false) {
			console.log("Déconnexion de " + pseudo);
			salon.removePlayer(pseudo);			
		}
		else
			console.log("Déconnexion d'un user non identifié")
	});
});
