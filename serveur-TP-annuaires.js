Worker.prototype.onmessage = function(event) {
	var instruction = event.data;
	//TODO
}

function Salon(id, nbPlayersRequired, roles) {
	this.id = id;
	this.ww = new Worker(scriptWW.js);
	this.ww.listeClients = new AnnuaireClients();
	this.sendInstruction({
		type:"startInfos",
		nbPlayers: nbPlayersRequired,
		roles: roles
	});
}

Salon.prototype = {
	getId: function() {
		return this.id;
	}
	addPlayer: function(pseudo, connexion) {
		var instruction = {
			type:"addUser",
			pseudo: pseudo
		};
		this.sendInstruction(instruction);
		this.ww.listeClients.addClient(pseudo, connexion);
	}
	removePlayer: function(pseudo) {
		var instruction = {
			type:"removeUser",
			pseudo: pseudo
		};
		this.sendInstruction(instruction);
		this.ww.listeClients.removeClient(pseudo);
	}
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

function Client(pseudo, connexion) { 
	this.pseudo = pseudo;
	this.connexion = connexion;
}

Client.prototype = {
	getPseudo: function() {
		return this.pseudo;
	},
	sendString: function(string) {
		//connexion.sendUTF(string);
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
