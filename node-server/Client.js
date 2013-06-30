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

module.exports = Client;
