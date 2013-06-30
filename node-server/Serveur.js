"use strict";

var NodeServerParam = require("./conf/NodeServerParam.js");
var AnnuaireSalons = require("./AnnuaireSalons.js");

process.title = NodeServerParam.processTitle;
var webSocketsServerPort = NodeServerParam.port;

console.log("top ------------ " + NodeServerParam.port);

var webSocketServer = require('websocket').server;
var http = require('http');
var Worker = require('webworker-threads').Worker;

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
