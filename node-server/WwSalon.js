var WwSalon = function() {
	var liste_roles = new Array();
	var liste_joueurs = new Array();
	var liste_visiteurs = new Array();
	var nbRole;
	var waitForReady = false;
	var gameStarted = false;

	var actionHistory = [];

	function Vote(sender, target) {
		this.sender = sender;
		this.target = target;
	}

	function VoteManager(type) {
		//normal, psycho, ou special
		this.type = type;
		//liste des personnes autorisées a participer au vote
		this.allowedVoters = [];
		//personnes éligibles
		this.targets = [];
		this.votes = [];
	}

	VoteManager.prototype = {
		open : function(allowedVoters, targets){
			this.votes = [];
			this.targets = targets;
			this.allowedVoters = allowedVoters;
		
			var openVote = {
				receivers : this.allowedVoters,
				instruction : {
					type : "voteActivate",
					typeVote : this.type,
					pseudoNominees : this.targets
				}
			};
			postMessage(openVote);
			console.log("Vote " + this.type + " ouvert");
		},
		getIdVoteBySender : function(sender) {
			var i = 0;
			var result = -1;
			while ( i < this.votes.length && result == -1) {
				if (this.votes[i].sender == sender)
					result = i;
				i++;
			}
			return result;
		},	
		registerVote: function(sender, target) {
			if (allowedVoters.indexOf[sender] == -1 || targets.indexOf[target] == -1) {
				console.log("vote non autorisé (type: " + this.type + ", sender : " + sender + ", target : " + target + ")");
				return;
			}
			var id = this.getIdVoteBySender(sender);
			if (id == -1) {
				var v = new Vote(sender, target);
				this.votes.push(v);
				console.log(sender + " a voté " + target);
			} else {
				this.votes[id].target = target;
				console.log(sender + " a changé de vote pour " + target);
			}
		},
		countVotes: function() {
			var max = 0;
			var counter = [];
			var result = [];
		
			//initialisation des compteurs
			for (var i=0; i < this.targets.length; i++)
				counter[i] = 0;
		
			//compta des votes
			for (var i=0; i < this.votes.length; i++) {
				var id = this.targets.indexOf(this.votes[i].target);
				counter[id]++;
				if (counter[id] > max)
					max = counter[id];
			}
		
			//determination des élus
			for (var i=0; i < this.counter.length; i++) {
				if(this.counter[i] == max)
					result.push(this.targets[i]);
			}
		
			return result;
		},
		close : function() {
			var closeVote = {
				receivers : allowedVoters,
				instruction : {
					type : "voteDeactivate",
					typeVote : this.type,
				}
			};
			postMessage(closeVote);
			//on vide la liste des votant pour empecher la reception de nouveaux votes
			this.allowedVoters = [];
			result = this.countVotes();
			this.targets = [];
			this.votes = [];
			console.log("Vote " + this.type + " terminé. Les élus sont " + result);
			return result;
		}
	}
	
	var voteManagers = [];
	voteManagers["normal"] = new VoteManager("normal");
	voteManagers["psycho"] = new VoteManager("psycho");
	voteManagers["special"] = new VoteManager("special");
	
	onmessage = function(event) {
		parseur(event.data);
	}

	function parseur(instruction) {
		var type = instruction.type;
		console.log("$$$ instruction reçue par le salon" + JSON.stringify(instruction));
	
		switch (type) {
	 		case "startSalon" :
				var liste = instruction.roles;
	 			startSalon(liste);
			break;
			case "readyToStart" :
				var sender = instruction.sender;
			 	readyToStart(sender);
			break;
			case "addUser" :
				var pseudo = instruction.pseudo;
				addPlayer(pseudo);
			break;
			case "deleteUser" :
				var pseudo = instruction.pseudo;
				deletePlayer(pseudo);
			break;
			case "message" :
				if (instruction.txt != undefined)
					deliverMsg(instruction);
				else
					console.log("Reception d'un message non conforme.");
			break;
			case "vote" :
				var sender = instruction.sender;
				var target = instruction.pseudoVoted;
				var typeVote = instruction.typeVote;
				if (voteManagers[typeVote] != undefined && sender != undefined && target != undefined)
					voteManagers[typeVote].registerVote(sender, target);
				else
					console.log("Reception d'un vote non conforme.");
			
			break;
			default:
				console.log("Instruction erronée : "+objetJSON); 
			break;
		}
	
		document.getElementById("visiteurs").innerHTML = liste_visiteurs;
		document.getElementById("joueurs").innerHTML = liste_joueurs;
	}

	function startSalon(e) {
		liste_roles = e;
		nbRole = e.length;
		console.log("Liste des rôles : "+e+" | Nombre de rôles : "+nbRole);
	}

	function readyToStart(e) {
		id_joueur = liste_visiteurs.indexOf(e);
		if (waitForReady && id_joueur>=0) {
			liste_visiteurs.splice(id_joueur,1);
			liste_joueurs.push(e);
			if (liste_joueurs.length == nbRole ) {
				waitForReady = false;
				deactivateStarter()
				console.log("Lancement de la partie...");
				startGame();
			}
			console.log("Le joueur "+e+" est prêt !");			
		} else {
			console.log(e+" a tenté de se mettre prêt sans y être autorisé !");
		}		
		console.log("Nombre de joueurs prêts : "+liste_joueurs.length+"/"+nbRole);
	}

	function addPlayer(e) {	
		liste_visiteurs.push(e);
		if (!gameStarted && !waitForReady && liste_visiteurs.length == nbRole) {
			waitForReady = true;
			console.log("Le nombre de joueurs est équivalent au nombre de rôle -> en attente");
			activateStarter();
		}
		if (waitForReady)
			activateStarter(e);
		console.log("Le joueur "+e+" a été ajouté au salon !");
		sendHistory(e);
	}

	function deletePlayer(e) {
		var test_joueur = liste_joueurs.indexOf(e);
		if(test_joueur<0) {
			var id_visiteur = liste_visiteurs.indexOf(e);
			liste_visiteurs.splice(id_visiteur,1);
		} else {
			var role;
			if (liste_roles.length != 0) {
				role = liste_roles[test_joueur];
				liste_roles.splice(test_joueur,1);
			}
			liste_joueurs.splice(test_joueur,1);
			objet = {
				receivers : liste_joueurs.concat(liste_visiteurs),
				instruction : {
					type : "userInfo",
					pseudo : e,
					role : role,
					alive : "false"
				}
			};
			actionHistory.push(objet);
			postMessage(objet);	
		}
		if (waitForReady && liste_joueurs.length+liste_visiteurs.length < nbRole) {
				waitForReady = false;
				deactivateStarter()
				console.log("Il n'y a plus assez de joueurs dans le salon !");
				while (liste_joueurs.length > 0) {
					liste_visiteurs.push(liste_joueurs[0])
					liste_joueurs.splice(0,1);
				}
		}
		console.log("Le joueur "+e+" a été supprimé du salon !");
	}

	function deliverMsg(msg) {
		msg.date = (new Date()).getTime();
		actionHistory.push(msg);
	
		var receivers = [];
		receivers = receivers.concat(liste_visiteurs);
		var i = 0;
		var result = false;
		while (i < liste_joueurs.length && !result) {
			if (msg.sender == liste_joueurs[i])
				result = true;
			i++;
		}
		
		if (result)
			receivers = receivers.concat(liste_joueurs);

		var newMessage = {
			receivers : receivers,
			instruction : msg
		};
		postMessage(newMessage);
	}

	function sendHistory(pseudo) {
		if (actionHistory.length != 0) {
			var history = {
				receivers : [ pseudo ],
				instruction : {
					type : "instructionList",
					list_instructions : actionHistory
				}
			};
			postMessage(history);
		}
	}

	function activateStarter(e) {
		var r;
		if (e == undefined)
			r = liste_visiteurs;
		else
			r = [ e ];
		var objet = {
			receivers : r,
			instruction : {
				type : "starterActivate"
			}
		}
		postMessage(objet);
		console.log("Envoi de l'instruction pour activer le starter !");
	}

	function deactivateStarter() {
		var objet = {
			receivers : liste_visiteurs,
			instruction : {
				type : "starterDeactivate"
			}
		}
		postMessage(objet);
		console.log("Envoi de l'instruction pour désactiver le starter !");
	}

	function startGame() {
		console.log("Partie lancée !");
		initUsersInfo();
		distribRoles(liste_joueurs, liste_roles);
		activateTimer(180);
	}

	function activateTimer(time) {
		objet = {
			receivers : liste_joueurs.concat(liste_visiteurs),
			instruction : {
				type : "timerActivate",
				time : time
			}
		};
		postMessage(objet);	
	}
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	    }
	    return array;
	}
	
	function initUsersInfo(){
		var liste_instructions = new Array();
		for(var i = 0; i < liste_joueurs.length; i++){
			liste_instructions.push({
				type :"userInfo",
				pseudo : liste_joueurs[i],
				alive : true
			});
		}
		var instruction = {
			type : "instructionList",
			list_instructions : liste_instructions
		};
		var envoi = {
			receivers : liste_joueurs.concat(liste_visiteurs),
			instruction : instruction
		};
		actionHistory.push(instruction);
		postMessage(envoi);
	}

	function distribRoles(){
		shuffleArray(liste_roles);
		var liste_psychos = new Array();
		var liste_instructions_psycho = new Array();
		var objet;
		for(var i = 0; i < liste_joueurs.length; i++){
			console.log("Le joueur "+liste_joueurs[i]+" est "+liste_roles[i]);
			if(liste_roles[i] == "psychopathe") {
				liste_psychos.push(liste_joueurs[i]);
				liste_instructions_psycho.push({
					type :"userInfo",
					pseudo : liste_joueurs[i],
					role : liste_roles[i],
					alive : true
				});		
			} else {
				objet = {
					receivers : [liste_joueurs[i]],
					instruction : {
						type : "userInfo",
						pseudo : liste_joueurs[i],
						role : liste_roles[i],
						alive : "true"
					}
				}
				postMessage(objet);
				console.log("Le joueur "+liste_joueurs[i]+" reçoit son rôle : "+liste_roles[i]);
			}
		}
		var envoi_psycho = {
			receivers : liste_psychos,
			instruction : {
				type : "instructionList",
				list_instructions : liste_instructions_psycho
			}
		};
		postMessage(envoi_psycho);
		console.log(liste_instructions_psycho);
	}
}

module.exports = WwSalon;
