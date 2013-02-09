"use strict";

process.title = 'node-screwy';
var webSocketsServerPort = 1337;

var webSocketServer = require('websocket').server;
var http = require('http');
var Worker = require('webworker-threads').Worker;

Worker.prototype.onmessage = function(event) {
	var receivers = event.data.receivers;
	var instruction = event.data.instruction;
	if (receivers && instruction)
		listeClients.sendInstruction(receveirs, instruction);
	else
		console.log("Objet non standard reçu d'un salon : "); 
}

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
		connexion.sendUTF(string);
		console.log(this.pseudo + "->" + string);
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
		for (var i = 0; i < listePseudoClients.length; i++) {
			var p = this.getPositionClient(listePseudoClients[i]);
			if (p !== null)
				this.listeClients[p].sendString(json);
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
	this.ww = new Worker(scriptWW.js);
	this.ww.listeClients = new AnnuaireClients();
	this.sendInstruction({
		type:"startInfos",
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
			type:"removeUser",
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
		var s = new Salon(s);
		this.listeSalons.push(s);
	},
	removeSalon: function(pseudo) {
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
	sendInstruction: function(listePseudoClients, instruction) {
		var json = JSON.stringify(instruction);
		for (var i = 0; i < listePseudoClients.length; i++) {
			var p = this.getPositionClient(listePseudoClients[i]);
			if (p !== null)
				this.listeClients[p].sendString(json);
		}
	
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
			var instruction = JSON.parse(message.data);
		} catch (e) {
			console.log('Le message suivant n\'est pas au format JSON : ', message.data);
			return;
		}
		//on vérifie que le client est identifié
		if (pseudo === false ) {
			if (instruction.type != 'connexion') {
				console.log("Un client non identifié tente d'exécuter des instructions.");
				return;
			}
			else {
				//TODO checker la connexion (travail Rocco)
				salon = annuaireSalons.getSalonById(instruction.salon);
				if (salon == null) {
					salon = annuaireSalons.createSalon(instruction.salon);
					if (salon == null) {
						//TODO informer user
						//TODO kicker user
						console.log("Creation du salon " + instruction.salon + "échouée");
						return;
					}
				}
				pseudo = instruction.pseudo;
				salon.addPlayer(pseudo);	
			}
		}
		//on envoie l'instruction au salon
		else
			instruction.sender = pseudo;
			salon.sendInstruction(instruction);
	});

	// déconnexion
	connection.on('close', function(connection) {
		if (userName !== false) {
			console.log((new Date()) + " Peer "
				+ connection.remoteAddress + " disconnected.");
			//Supprimer le client de la liste des clients connectés
			clients.splice(index, 1);
			//TODO informer WW salon
		}
	});
});

function executeSalonInstruction(salon, instruction) {

}

function checkUser(pseudo, key) {

	return true;
}

function getSalonInfo(idSalon) {

}


/*
// creer un WW
var worker = new Worker(scriptWW.js);
// recevoir data
worker.onmessage = function(event) {
  console.log("Worker said : " + event.data);
};
//envoyer data
worker.postMessage('ali');*/
