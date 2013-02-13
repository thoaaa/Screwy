var list_players = new Array();
var list_pseudos = new Array();
var pseudo_perso = document.getElementById("pseudo_hidden").value;
var time = 0;

function webSocket() {
	var WebSocket = window.WebSocket || window.MozWebSocket;

	if (!window.WebSocket) {
		alert("Votre navigateur ne supporte pas les websockets, vous ne pouvez donc pas jouer !");
		document.location.href="index.php";
	} else {
		console.log("Le navigateur supporte les websockets !");
		return;
	}

	var connection = new WebSocket('ws://127.0.0.1:1337');

	connection.onopen = function () {
		sendInstruction('connexion');
	};

	connection.onerror = function (error) {
		console.log("Erreur de connexion !");
	};

	connection.onmessage = function (message) {
		try {
		    var object = JSON.parse(message);
		} catch (e) {
		    console.log("Les données reçues sont non valides !");
		    return;
		}	
		test_type(object);
	};

	//////////Test du type de requête//////////
	function test_type(object) {	
		if(object.type == "message") {
			reception_message(object);
		} else if (object.type == "voteActivate") {
			activate_vote(object);	
		} else if (object.type == "votedesactivate") {
			desactivate_vote(object);
		} else if (object.type == "starterActivate") {
			activate_starter();
		} else if (object.type == "starterdesactivate") {
			desactivate_starter();
		} else if (object.type == "userInfo") {
			maj_players(object);
		} else if (object.type == "timerActivate") {
			start_timer(object);
		} else if (object.type == "errorMessage") {
			show_error_msg(object);
		} else if (object.type == "deconnexion") {
			deconnect_player(object);
		} else if (object.type == "instructionList") {
			analyse_instruction(object);
		}
	}
	
	//////////Analyse des listes d'instructions//////////
	function analyse_instruction(e) {
		var list_instructions = e.instructions;
		for(var i=0;i<list_instructions.length;i++) {
			test_type(list_instructions[i]);
		}
	}
	
	//////////Réception des messages//////////
	function reception_message(e) {
		var sender = e.sender;
		var	date = e.date;
		var	txt = e.txt;
		var newMessage = document.createElement("p");
			
		if (sender == "null") {
			newMessage.className = "msg_server";
			newMessage.innerHTML = txt;
		} else {
			var pseudo = list_pseudos.indexOf(sender);
			if (list_players[pseudo].alive == "true") {
				newMessage.className = "msg_user";
				newMessage.innerHTML = "<span>"+sender+" ("+date+") : </span>"+txt;
			} else {
				newMessage.className = "msg_mort";
				newMessage.innerHTML = sender+" ("+date+") : "+txt;
				
			}
		}
		document.getElementById("area_chat").appendChild(newMessage);
		document.getElementById("area_chat").scrollTop = document.getElementById("area_chat").scrollHeight;
	}
	
	//////////Activer les votes//////////
	function activate_vote(e) {
		var typeVote = e.typeVote;
		var	pseudoNominees = e.pseudoNominees;
		if (typeVote == "normal") {
			for(var i=0;i<pseudoNominees.length;i++) {
				document.getElementById("select_normal").options[this.length+(1+i)] = new Option(pseudoNominees[i], pseudoNominees[i]);
			}
			document.getElementById("vote_normal").style.display = "block";
		} else if (typeVote == "psycho") {
			for(var i=0;i<pseudoNominees.length;i++) {
				document.getElementById("select_psycho").options[this.length+(1+i)] = new Option(pseudoNominees[i], pseudoNominees[i]);
			}
			document.getElementById("vote_psycho").style.display = "block";
		} else if (typeVote == "special") {
			for(var i=0;i<pseudoNominees.length;i++) {
				document.getElementById("select_special").options[this.length+(1+i)] = new Option(pseudoNominees[i], pseudoNominees[i]);
			}
			document.getElementById("vote_special").style.display = "block";
		} 
	}
	
	//////////Désactiver les votes//////////
	function desactivate_vote(e) {
		var typeVote = e.typeVote;
		if (typeVote == "normal") {
			document.getElementById("vote_normal").style.display = "none";
		} else if (typeVote == "psycho") {
			document.getElementById("vote_psycho").style.display = "none";
		} else if (typeVote == "special") {
			document.getElementById("vote_special").style.display = "none";
		} 
	}
	
	//////////Activation du starter//////////
	function activate_starter() {
		document.getElementById("pret").style.display = "block";
	}
	
	//////////Désactivation du starter//////////
	function desactivate_starter() {
		document.getElementById("pret").style.display = "none";
	}
	
	//////////Mise à jour du profil des joueurs//////////
	function maj_players(e) {
		var pseudo = e.pseudo;
		if (pseudo != pseudo_perso) {
			if (list_players.length == 0) {
				list_players.push(e);
				list_pseudos.push(e.pseudo);
				var newPlayer = document.createElement("tr");
				newPlayer.id = e.pseudo;
				newPlayer.innerHTML = "<td>"+e.pseudo+"</td>";
				document.getElementById("list_players").appendChild(newPlayer);		
			} else {
				for(i=0;i<list_players.length;i++) {
					if (list_pseudos.indexOf(list_players[i].pseudo)<0) {
						list_pseudos.push(list_players[i].pseudo);
					}
				}
				var test_pseudo = list_pseudos.indexOf(pseudo);
				if(test_pseudo<0) {
					list_players.push(e);
					list_pseudos.push(e.pseudo);
					var newPlayer = document.createElement("tr");
					newPlayer.id = e.pseudo;
					newPlayer.innerHTML = "<td>"+e.pseudo+"</td>";
					document.getElementById("list_players").appendChild(newPlayer);
				} else {
					list_players[test_pseudo] = e;
					if (list_players[test_pseudo].alive == "false") {
						document.getElementById(e.pseudo).innerHTML = "<td><del>"+e.pseudo+" ("+e.role+")</del></td>";
						//reception_message();
					} else if (list_players[test_pseudo].role == "null") {
						document.getElementById(e.pseudo).innerHTML = "<td>"+e.pseudo+"</td>";
					} else {
						document.getElementById(e.pseudo).innerHTML = "<td>"+e.pseudo+" ("+e.role+")</td>";
					}
				}
			}
		} else {
			var imageRole = document.createElement("img");
			imageRole.src = "../../style/images/cartes"+e.role+".jpg";
			imageRole.align = "middle";
			document.getElementById("role_image").appendChild(imageRole);
		}
	}
	
	//////////Lancement du timer//////////
	function start_timer(e) {
		time = e.time;
		time = parseInt(time);
		var minutes=(time/60)%60; minutes=parseInt(minutes); minutes=parseFloat(minutes);
		var secondes=(time%60); secondes=parseInt(secondes); secondes=parseFloat(secondes);
		document.getElementById("chrono").style.display = "block";
		document.getElementById("chrono").innerHTML = "<i class='icon-time icon-white'></i>0"+minutes+":"+secondes;
		montimer=window.setInterval("decompte()",1000);	
	}
	
	//////////Affichage du décompte//////////
	function decompte()
	{
		if (time > 0) {
			time--;
			var minutes=(time/60)%60; minutes=parseInt(minutes); minutes=parseFloat(minutes);
			var secondes=(time%60); secondes=parseInt(secondes); secondes=parseFloat(secondes);
			if (secondes > 9) {
				document.getElementById("chrono").innerHTML = "<i class='icon-time icon-white'></i>0"+minutes+":"+secondes;  
			} else {
				document.getElementById("chrono").innerHTML = "<i class='icon-time icon-white'></i>0"+minutes+":0"+secondes; 
			}
		} else {
			document.getElementById("chrono").style.display = "none";
			time = 0;
		}
	}
	
	//////////Affichage des erreurs//////////
	function show_error_msg(e) {
		var txt = e.txt;
		alert(txt);	
	}
	
	//////////Déconnexion des joueurs//////////
	function deconnect_player(e) {
		var pseudo = e.pseudo;
		var id = list_pseudos.indexOf(pseudo);
		list_players.splice(id,1);
		list_pseudos.splice(id,1);
		document.getElementById(pseudo).parentNode.removeChild(document.getElementById(pseudo));
	}

	//////////Envoi des instructions au serveur//////////
	function sendInstruction(t) {
		var type = t;
		var instruction = new Object();
		if (type == "message") {
			var txt = document.getElementById("area_type").value;
			if (txt != "") {
				instruction.type = type;
				instruction.txt = txt;
				document.getElementById("area_type").value = "";
			} else {
				return;
			}
		} else if (type == "voteNormal") {
			var liste = document.getElementById("select_normal");
			var pseudo = liste.options[liste.selectedIndex].value;
			instruction.type = type;
			instruction.pseudo = pseudo;
		} else if (type == "votePsycho") {
			var liste = document.getElementById("select_psycho");
			var pseudo = liste.options[liste.selectedIndex].value;
			instruction.type = type;
			instruction.pseudo = pseudo;
			
		} else if (type == "voteSpecial") {
			var liste = document.getElementById("select_special");
			var pseudo = liste.options[liste.selectedIndex].value;
			instruction.type = type;
			instruction.pseudo = pseudo;
		} else if (type == "pret") {
			instruction.type = type;
		} else if (type == "connexion") {
			var key = document.getElementById("key_hidden").value;
			var id_salon = document.getElementById("id_salon_hidden").value;
			instruction.type = type;
			instruction.pseudo = pseudo_perso;
			instruction.key = key;
			instruction.id_salon = id-salon;
		}
		var msg = JSON.stringify(instruction);
		connection.send(msg);
	}
}