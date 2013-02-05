//choisir le bon objet websocket en fonction du navigateur
function webSocket() {
	window.WebSocket = window.WebSocket || window.MozWebSocket;

	if (!window.WebSocket) {
	//TODO traiter ici le cas ou websocket n'est pas supporté (afficher un message d'erreur)
	return;
	}

	// creer une connection
	var connection = new WebSocket('ws://127.0.0.1:1337');

	connection.onopen = function () {
	//TODO actions a faire lorsque la connection réussi (récuperer le pseudo et la cle de connexion et les envoyer via la WebSocket)(travail de Rocco)
	};

	connection.onerror = function (error) {
	//TODO actions a faire lorsque une erreur de connexion survient (afficher un message d'erreur)
	};

	// reception d'instructions entrantes
	connection.onmessage = function (message) {
		try {
		    var instruction = JSON.parse(message.data);
		} catch (e) {
		    //TODO traiter le cas ou les donnes reçues ne forment pas une instruction valide
		    return;
		}

		//TODO traiter l'instruction json
	};

	// envoyer une instruction
	function sendInstruction(instruction) {
		var msg = JSON.parse(instruction);
		connection.send(msg);
	}

	//verifier régulierement que la connection est operationnelle
	setInterval(function() {
	if (connection.readyState !== 1) {
		//TODO traiter la cas ou un probleme de connection survient (afficher message d'erreur)
	}
	}, 3000);
}
