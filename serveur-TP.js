"use strict";

process.title = 'node-screwy';
var webSocketsServerPort = 1337;

var webSocketServer = require('websocket').server;
var http = require('http');
var Worker = require('webworker-threads').Worker;

//liste de tous les clients connectés et identifiés
var clients = [ ];
var salons = [ ];

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

//Toutes les connexions client arrivent dans cette fonction
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
	//TODO vérifier origine requete.
	var connection = request.accept(null, request.origin); 
	var pseudo = false;
	var salon = false;
	var index = false;
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
			console.log('Le message suivant n\'est pas au format JSON ', message.data);
			return;
		}
		//on vérifie que le client est identifié
		if (pseudo === false ) {
			if (instruction.type != 'connexion') {
				console.log("Un client non identifié tente d'exécuter des instructions.");
				return;
			}
			else {
				//TODO checker la connexion
				pseudo = instruction.pseudo;
				index = clients.push(connection) - 1;
			}
		}
		else
			executeClientInstruction(pseudo, instruction);
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

function executeClientInstruction(client, wwSalon, instruction) {
	instruction.sender = client;

}

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
