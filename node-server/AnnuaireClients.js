var Client = require("./Client.js");

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

module.exports = AnnuaireClients;
