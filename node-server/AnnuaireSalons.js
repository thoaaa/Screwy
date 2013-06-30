var Salon = require("./Salon.js");

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

module.exports = AnnuaireSalons;
