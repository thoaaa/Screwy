"use strict";

process.title = 'node-screwy';
var webSocketsServerPort = 1337;

var webSocketServer = require('websocket').server;
var http = require('http');
var Worker = require('webworker-threads').Worker;

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
		if (this.ww.listeClients.listeClients.length == 1)
			annuaireSalons.removeSalon(this.id);
		else {
			var instruction = {
				type:"deleteUser",
				pseudo: pseudo
			};
			this.sendInstruction(instruction);
		}
		this.ww.listeClients.removeClient(pseudo);
	},
	sendInstruction: function(instruction) {
		this.ww.postMessage(instruction);
	},
	close : function() {
		console.log("fermeture du salon " + this.id);
		this.ww.terminate();
	}
}

function AnnuaireSalons() {
	this.listeSalons= [];
}

AnnuaireSalons.prototype = {
	createSalon: function(id) {
		var roles = ["innocent", "psychopathe", "sage"];
		var s = new Salon(id, roles);
		this.listeSalons.push(s);
		return s;
	},
	removeSalon: function(id) {
		var p = this.getPositionSalon(id);
		if (p !== null) {
			this.listeSalons[p].close();
			this.listeSalons.splice(p, 1);
		}
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
