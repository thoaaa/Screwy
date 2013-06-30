var AnnuaireClients = require("./AnnuaireClients.js");
var WwSalon = require("./WwSalon.js");

function Salon(id, roles) {
	this.id = id;
	this.ww = new Worker(WwSalon);
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

module.exports = Salon;
