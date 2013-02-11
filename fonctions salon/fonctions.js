var liste_roles = new Array();
var liste_joueurs = new Array();
var liste_visiteurs = new Array();
var nbRole;
var waitForReady = false;
var gameStarted = false;

var actionHistory = [];

var voteManagers = [];
voteManagers["normal"] = new VoteManager("normal");
voteManagers["psycho"] = new VoteManager("psycho");
voteManagers["special"] = new VoteManager("special");

function Vote(sender, target) {
	this.sender = sender;
	this.target = target;
}

function voteManager(type) {
	//normal, psycho, ou special
	this.type = type;
	//liste des personnes autorisées a participer au vote
	this.allowedVoters = [];
	//personnes éligibles
	this.targets = [];
	this.votes = [];
}

voteManager.prototype = {
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
				type : "voteDesactivate",
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

function parseur(objetJSON) {
	var instruction = JSON.parse(objetJSON);
	var type = instruction.type;
	
	switch (type) {
 		case "startSalon" :
			var liste = instruction.listRole;
 			startSalon(liste);
		break;
		case "readyToStart" :
			var sender = instruction.sender;
		 	readyToStart(sender);
		break;
		case "addPlayer" :
			var pseudo = instruction.pseudo;
			addPlayer(pseudo);
		break;
		case "deletePlayer" :
			var pseudo = instruction.pseudo;
			deletePlayer(pseudo);
		break;
		case "message" :
			if (instruction.txt != undefined)
				deliverMessage(instruction);
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
			desactivateStarter();
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
	console.log("Le joueur "+e+" a été ajouté au salon !");
}

function deletePlayer(e) {
	var test_joueur = liste_joueurs.indexOf(e);
	if(test_joueur<0) {
		var id_visiteur = liste_visiteurs.indexOf(e);
		liste_visiteurs.splice(id_visiteur,1);
	} else {
		liste_joueurs.splice(test_joueur,1);	
	}
	if (waitForReady && liste_joueurs.length+liste_visiteurs.length < nbRole) {
			waitForReady = false;
			desactivateStarter();
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
	receivers.concat(liste_visiteurs);
	
	var i = 0;
	var result = false;
	while (i < liste_joueurs.length && !result) {
		if (msg.sender == listeJoueurs[i])
			result == true;
		i++;
	}
	if (result)
		receivers.concat(liste_joueurs);

	var newMessage = {
		receivers : receivers,
		instruction : msg
	};
	//postMessage(newMessage);
}

function sendHistory(pseudo) {
	var history = {
		receivers : [ pseudo ],
		instruction : {
			type : "instructionList",
			instructions : actionHistory
		}
	};
	//postMessage(history);
}

function activateStarter() {
	var objet = {
		receivers : liste_visiteurs,
		instruction : {
			type : "starterActivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour activer le starter !");
}

function desactivateStarter() {
	var objet = {
		receivers : liste_visiteurs,
		instruction : {
			type : "starterDesactivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour désactiver le starter !");
}

function startGame() {
	console.log("Partie lancée !");
	distribRoles(liste_joueurs, liste_roles);
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

function distribRoles(){
	shuffleArray(liste_roles);
	var liste_psychos = new Array();
	var liste_instructions_psycho = new Array();
	var objet;
	for(var i = 0; i < liste_joueurs.length; i++){
		console.log("Le joueur "+liste_joueurs[i]+" est "+liste_roles[i]);
		if(liste_roles[i] == "psychopathe") {
			liste_psychos.push(liste_joueurs[i]);
			liste_instructions_psycho.push('{"type":"userInfo","pseudo":"'+liste_joueurs[i]+'","role":"'+liste_roles[i]+'","alive":"true"}');		
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
			//postMessage(objet);
			console.log("Le joueur "+liste_joueurs[i]+" reçoit son rôle : "+liste_roles[i]);
		}
	}
	var envoi_psycho = {
		receivers : liste_psychos,
		instruction : {
			type : "instructionList",
			list_instructions : liste_instructions_psycho
		}
	}
	//postMessage(envoi_psycho);
	console.log(liste_instructions_psycho);
	
	//Et on commence notre tour de jeu !
	roundOfPsychopaths();
}

//Méthode qui permet d'activer le timer pour les personnes spécifiées dans le paramètre
function activateTimer(receiversTimer) {
	var objet = {
		receivers : receiversTimer,
		instruction : {
			type : "timerActivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour activer le timer pour les "+receiversTimer+" !");
}

//Méthode qui permet de désactiver le timer pour les personnes spécifiées dans le paramètre
function desactivateTimer(receiversTimer) {
	var objet = {
		receivers : receiversTimer,
		instruction : {
			type : "timerDesactivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour désactiver le timer pour les "+receiversTimer+" !");
}

//Méthode qui permet d'activer le vote pour les personnes spécifiées dans le paramètre
function activateVote(receiversTimer) {
	var objet = {
		receivers : receiversTimer,
		instruction : {
			type : "voteActivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour activer le vote pour les "+receiversTimer+" !");
}

//Méthode qui permet de désactiver le vote pour les personnes spécifiées dans le paramètre
function desactivateVote(receiversTimer) {
	var objet = {
		receivers : receiversTimer,
		instruction : {
			type : "voteDesactivate"
		}
	}
	//postMessage(objet);
	console.log("Envoi de l'instruction pour désactiver le vote pour les "+receiversTimer+" !");
}


//Méthode qui gère le tour spécifique des psychopathes
function roundOfPsychopaths(){
	
	//On initialise notre timer pour une durée de 1 minute
	var timerOfPsychopaths = 60;
	
	//On déclare notre countTimerPsychopaths, qui permettra d'arrêter le compte à rebours
	var countTimerPsychopaths;

	//TODO On désactive le chat pour les joueurs autres que psychopathes
	console.log("Les joueurs autres que psychopathes ne peuvent pas parler.");
	
	//TODO On active le chat pour les psychopathes
	console.log("Les psychopathes peuvent parler.");
	
	//TODO On affiche un message système pour informer les joueurs que c'est le tour des psychopathes
	console.log("Les psychopathes jouent leur tour...");

	//On affiche l'interface pour voter aux psychopathes
	activateVote(liste_psychos);
	
	//On affiche le timer des psychopathes aux psychopathes
	activateTimer(liste_psychos);
	
	//On décrémente le timer des psychopathes toutes les 1s
	setInterval(function(){
		
		console.log("Le timer des psychopathes vaut : "+timerOfPsychopaths);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerPsychopaths = timerPsychopaths();
		
		//Si le timerPsychopaths vaut 0, alors on arrête le compte à rebours
		if(timerOfPsychopaths == 0){
			console.log("Le timer des psychopathes vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerPsychopaths);
			
			//On désactive les votes
			desactivateVote(liste_psychos);
			
			//On enlève le timer de l'interface
			desactivateTimer(liste_psychos);
			
			//TODO On désactive le chat des psychopathes
			console.log("Les psychopathes ne peuvent plus parler.");
			
			//TODO On affiche un message pour dire aux joueurs que le tour des psychopathes s'achève
			console.log("Fin du tour des psychopathes.");
			
			//Et on passe à l'étape suivante du jeu : on tue l'élu
			killPsychopathsChoice(resultVotePsychopaths);
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour de psychopathe
		while(timerOfPsychopaths != 0){
			//TODO On procède au vote (cf. voteManager) + on stocke le résultat du vote
			var resultVotePsychopaths = votePsychopaths.target;
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerPsychopaths(){
		return timerOfPsychopaths--;
	}
	
}

//Méthode qui permet de faire des vérifications avant de tuer la personne choisie par les psychopathes
function killPsychopathsChoice(resultVotePsychopaths){
	
	//TODO On récupère le rôle de l'élu
	var roleElu = resultVotePsychopaths.role;
	
	//On a 3 cas de figure : 
	//1- Si l'élu est un miraculé, on ne le tue pas,
	//2- Si l'élu est un zombie, on le tue et on active son pouvoir,
	//3- Sinon, on tue l'élu :)
	switch(roleElu){
		case "miracule":
			//TODO On désactive son pouvoir pour le restant de la partie
			console.log("Pouvoir du miraculé utilisé. Inutilisable pour le reste de la partie");
			//TODO On envoie un message aux joueurs pour dire ce qu'il s'est passé
			console.log("Personne n'est mort !");
			break;
		case "zombie":
			//TODO On vérifie que le pouvoir est disponible
			//On active le pouvoir du zombie
			var miam = iMHungry();
			
			//TODO On vérifie s'il a choisi quelqu'un : si personne, on ne fait rien. Mais là on s'en branle
			
			//TODO On envoie un message aux joueurs pour dire ce qu'il va se passer
			console.log(resultVotePsychopaths+" est un zombie, et a décidé de manger "+miam+".");
			//TODO On tue la personne choisie
			console.log("Élimination de "+miam+".");
			killSomeone(miam);
			break;
		default:
			//TODO On envoie un message aux joueurs pour dire ce qu'il va se passer
			console.log(resultVotePsychopaths+" est l'heureux élu ! Il va donc mourir dans la joie et la bonne humeur. :)");
			//TODO On tue la personne choisie
			console.log("Élimination de "+resultVotePsychopaths+".");
			killSomeone(resultVotePsychopaths);
		break;
	}

	//Et on passe à l'étape suivante du jeu
	iBelieveICanSpeakWithTheDead();
}

//Méthode qui permet de manger une personne. BRAIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIINNNNNNNNNNNNSSSSSSSSSSSSSSSSSSSS
function iMHungry(){
	
	//On initialise notre timer pour une durée de 10 secondes
	var timerOfZombie = 10;
	
	//On déclare notre countTimerZombie, qui permettra d'arrêter le compte à rebours
	var countTimerZombie;
	
	//TODO On affiche un message au zombie pour lui dire qu'il peut manger quelqu'un
	console.log("Mr le Zombie, si tu veux manger de la cervelle fraîche, tu peux te servir !");
	
	//On affiche l'interface pour vote au zombie
	activateVote(zombie);
	
	//On affiche le timer du zombie
	activateTimer(zombie);
	
	//On décrémente le timer des psychopathes toutes les 1s
	setInterval(function(){
		
		console.log("Le timer du zombie vaut : "+timerOfZombie);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerZombie = timerZombie();
		
		//Si le timerZombie vaut 0, alors on arrête le compte à rebours
		if(timerOfZombie == 0){
			console.log("Le timer du zombie vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerZombie);
			
			//On désactive le vote
			desactivateVote(zombie);
			
			//On enlève le timer de l'interface
			desactivateTimer(zombie);
			
			//TODO On désactive son pouvoir pour plus de "sécurité"
			console.log("Pouvoir du Zombie utilisé. Désactivé pour le restant de la partie.");
			
			//Et on retourne le résultat 
			return youAreSoSweet;
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour de psychopathe
		while(timerOfZombie != 0){
			//TODO On procède au choix + on stocke le résultat du vote
			var youAreSoSweet = voteZombie.target;
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerZombie(){
		return timerOfZombie--;
	}
	
}


//Méthode qui permet de tuer quelqu'un joyeusement
function killSomeone(elu){
	//TODO On tue la personne choisie
	console.log("Élimination de "+elu+".")
}


//Méthode qui permet à l'hérétique de parler aux morts
function iBelieveICanSpeakWithTheDead(){
	
	//On initialise notre timer pour une durée de 30 secondes
	var timerOfHeretique = 30;
	
	//On déclare notre countTimerHeretique, qui permettra d'arrêter le compte à rebours
	var countTimerHeretique;

	//On affiche le timer de l'hérétique
	activateTimer(heretique);
	
	//On décrémente le timer de l'hérétique toutes les 1s
	setInterval(function(){
		
		console.log("Le timer de l'hérétique vaut : "+timerOfHeretique);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerHeretique = timerHeretique();
		
		//Si le timerHeretique vaut 0, alors on arrête le compte à rebours
		if(timerOfHeretique == 0){
			console.log("Le timer du zombie vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerHeretique);
			
			//On enlève le timer de l'interface
			desactivateTimer(heretique);
			
			//TODO On ne permet plus à l'hérétique d'écouter les morts
			console.log("Votre 6ème sens rencontre quelques bugs. Vous n'entendez plus les morts.");
			
			//TODO On ne permet plus aux morts de parler à l'hérétique
			console.log("L'hérétique est actuellement indisponible, veuillez réessayer plus tard.");
			
			//Et on passe à l'étape suivante de la partie
			iMASuperHero();
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour d'hérétique
		while(timerOfHeretique != 0){
			//TODO On affiche un message à l'hérétique pour lui dire qu'il peut écouter les morts
			console.log("Hérétique ! Au bûcher ! Non, je déconne. Tu peux maintenant écouter les morts.");
			
			//TODO On affiche un message aux morts pour leur dire qu'ils peuvent parler à l'hérétique
			console.log("Bande de morts, vous pouvez parler à l'hérétique");
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerHeretique(){
		return timerOfHeretique--;
	}
}


//Méthode qui permet aux joueurs spéciaux d'activer leur pouvoir
function iMASuperHero(){
	
	//TODO On affiche aux joueurs que c'est le tour des super héros
	console.log("Le mentaliste, le ninja, et le tentateur ont l'opportunité d'utiliser leur pouvoir.");
	
	//On initialise notre timer de pour une durée de 10 secondes
	var timerOfSuperHeroes = 10;
	
	//On déclare notre countTimerSuperHeros, qui permettra d'arrêter le compte à rebours
	var countTimerSuperHeroes;

	//On affiche le timer des super héros
	activateTimer(superHeroes);
	
	//On active le vote pour les super héros
	activateVote(superHeroes);
	
	//On décrémente le timer toutes les 1s
	setInterval(function(){
		
		console.log("Le timer des super héros vaut : "+timerOfSuperHeroes);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerSuperHeroes = timerSuperHeroes();
		
		//Si le timerSuperHero vaut 0, alors on arrête le compte à rebours
		if(timerOfHeretique == 0){
			console.log("Le timer des super héros vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerSuperHeroes);
			
			//On enlève le timer de l'interface
			desactivateTimer(superHeroes);
			
			//On enlève le vote de l'interface
			desactivateVote(superHeroes);
			
			//Et on passe à l'étape suivante
			theEliteFour();
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour d'hérétique
		while(timerOfSuperHeroes != 0){
			//TODO On affiche un messages aux personnes concernées : mentaliste, ninja, tentateur
			console.log("Mentaliste, tu peux découvrir la vérité sur une personne.");
			console.log("Ninja, tu peux tuer furtivement la personne de ton choix.");
			console.log("Tentateur, tu peux faire passer une personne dans le côté obscur de la Force.");
			
			//TODO On récupère les votes dans une variable
			console.log("Récupération du vote du Mentaliste/Ninja/Tentateur.");
			//var voteSuperHero = ???;
			
			//On effectue une action suivant le type de vote
			if(voteSuperHero.type = "Mentalist"){
				console.log("Le Mentaliste a choisi de voir le rôle de "+voteSuperHero.target+".");
				
				//On permet au mentaliste de voir le rôle du joueur qu'il a voté
				chuckNorrisIsNothingVsPatrickJane(voteSuperHero.target);
			}
			
			if(voteSuperHero.type = "Ninja"){
				console.log("Le Ninja a choisi de tuer "+voteSuperHero.target+".");
				
				//On permet au ninja de tuer furtivement le joueur qu'il a voté
				killSomeone(voteSuperHero.target);
				
				//TODO On désactive le pouvoir du ninja
				console.log("Pouvoir du Ninja utilisé. Désactivé pour le restant de la partie.")
			}
			
			if(voteSuperHero.type = "Tentateur"){
				console.log("Le tentateur a choisi de convertir "+voteSuperHero.target+".");
				
				//On permet au tentateur de convertir le joueur qu'il a voté à sa noble cause
				theForceIsMine(voteSuperHero.target);
			}
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerSuperHeroes(){
		return timerOfSuperHeroes--;
	}
	
}


//Méthode permettant au mentaliste de voir le rôle de la personne qu'il veut
function chuckNorrisIsNothingVsPatrickJane(choixMentaliste){
	//TODO On affiche le rôle de la cible seulement au mentaliste
	console.log(choixMentaliste+" est "+choixMentaliste.role".");
}


//Méthode permettant au tentateur de convertir le joueur qu'il a voté à sa noble cause
function theForceIsMine(choixTentateur){
	//TODO On ajoute ce joueur à la liste des fidèles du tentateur
	console.log(choixTentateur+" a été ajouté à la liste des fidèles du tentateur.");
	
	//Si la liste des tentateurs contient tous les joueurs (-1 car on ne compte pas le tentateur lui-même), alors le tentateur a gagné
	if(liste_fidele.length == (liste_joueurs.length - 1)){
		//TODO On termine la partie
		console.log("Le tentateur a gagné ! Vous vous êtes tous fait berner, maintenant vous lui devez obéissance mouhahahahahah !");
		
		var whoWin = "Tentateur";
		
		finishGame(whoWin);
	}
}


//Méthode qui permet à tout le monde de voter
function theEliteFour(){
	
	//TODO On active le chat pour tout le monde
	console.log("Chat de tous les joueurs activé.");
	
	//On initialise notre timer pour une durée de 120 secondes
	var timerOfTheEliteFour = 120;
	
	//On déclare notre countTimerTheEliteFour, qui permettra d'arrêter le compte à rebours
	var countTimerTheEliteFour;
	
	//On affiche le timer pour tout le monde
	activateTimer(liste_joueurs);
	
	//On active le vote pour tout le monde
	activateVote(liste_joueurs);
	
	//On décrémente le timer toutes les 1s
	setInterval(function(){
		
		console.log("Le timer du conseil des 4 vaut : "+timerOfTheEliteFour);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerTheEliteFour = timerTheEliteFour();
		
		//Si le timerSuperHero vaut 0, alors on arrête le compte à rebours
		if(timerOfHeretique == 0){
			console.log("Le timer du conseil des 4 vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerTheEliteFour);
			
			//On désactive le timer pour tout le monde
			desactivateTimer(liste_joueurs);
			
			//On désactive le vote pour tout le monde
			desactivateVote(liste_joueurs);
			
			//TODO On désactive le chat pour tout le monde
			console.log("Chat de tous les joueurs désactivé.");
			
			//Et on passe à l'étape suivante du jeu
			iWillDieButIMHappy(theEliteFourVote);
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour
		while(timerOfSuperHeros != 0){
			//TODO On affiche un message système qui dit à tout le monde qu'on peut maintenant voter
			console.log("Vous pouvez maintenant délibérer et choisir qui sera la prochaine victime. Choisissez bien...");

			//TODO On récupère l'élu
			var theEliteFourVote = vote.target;
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerTheEliteFour(){
		return timerOfTheEliteFour--;
	}
	
}


//Méthode qui permet de faire une vérification avant de flinguer l'élu
function iWillDieButIMHappy(theFourEliteChoice){
	//TODO On récupère le rôle de l'élu
	var roleElu = theFourEliteChoice.role;
	
	//On a 3 cas de figure : 
	//1- Si l'élu est un miraculé, on ne le tue pas,
	//2- Si l'élu est un zombie, on le tue et on active son pouvoir,
	//3- Sinon, on tue l'élu :)
	switch(roleElu){
		case "miracule":
			//TODO On vérifie que son pouvoir est disponible			
			//TODO On désactive son pouvoir pour le restant de la partie
			console.log("Pouvoir du miraculé utilisé. Inutilisable pour le reste de la partie");
			//TODO On envoie un message aux joueurs pour dire ce qu'il s'est passé
			console.log("Personne n'est mort !");
			break;
		case "zombie":
		
			//TODO On vérifie que le pouvoir est disponible
			//On active le pouvoir du zombie
			var miam = iMHungry();
			
			//TODO On vérifie s'il a choisi quelqu'un : si personne, on ne fait rien. Mais là on s'en branle
			
			//TODO On envoie un message aux joueurs pour dire ce qu'il va se passer
			console.log(theFourEliteChoice+" est un zombie, et a décidé de manger "+miam+".");
			//TODO On tue la personne choisie
			console.log("Élimination de "+miam+".");
			killSomeone(miam);
			break;
		default:
			//TODO On envoie un message aux joueurs pour dire ce qu'il va se passer
			console.log(theFourEliteChoice+" est l'heureux élu ! Il va donc mourir dans la joie et la bonne humeur. :)");
			
			//TODO le télékinésiste peut intervenir
			console.log("Télékinésiste, tu utiliser ton pouvoir extra-sensoriel pour tuer quelqu'un d'autre.");
			
			//TODO On tue la personne choisie
			console.log("Élimination de "+theFourEliteChoice+".");
			killSomeone(theFourEliteChoice);
		break;
	}

	//Et on passe à l'étape suivante du jeu
	theReturnOfTheSuperHeroes();
}


//Méthode qui permet aux joueurs spéciaux d'activer leur pouvoir
function theReturnOfTheSuperHeroes(){
	
	//TODO On affiche aux joueurs que c'est le tour des super héros
	console.log("Le ninja a l'opportunité d'utiliser son pouvoir.");
	
	//On initialise notre timer de pour une durée de 10 secondes
	var timerOfTheReturnOfTheSuperHeroes = 10;
	
	//On déclare notre countTimerSuperHeros, qui permettra d'arrêter le compte à rebours
	var countTimerTheReturnOfTheSuperHeroes;

	//On affiche le timer des super héros
	activateTimer(returnSuperHeroes);
	
	//On active le vote pour les super héros
	activateVote(returnSuperHeroes);
	
	//On décrémente le timer toutes les 1s
	setInterval(function(){
		
		console.log("Le timer des super héros vaut : "+timerOfTheReturnOfTheSuperHeroes);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerTheReturnOfTheSuperHeroes = timerSuperHero();
		
		//Si le timerSuperHero vaut 0, alors on arrête le compte à rebours
		if(timerOfTheReturnOfTheSuperHeroes == 0){
			console.log("Le timer des super héros vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerTheReturnOfTheSuperHeroes);
			
			//On enlève le timer de l'interface
			desactivateTimer(returnSuperHeroes);
			
			//On enlève le vote de l'interface
			desactivateVote(returnSuperHeroes);
			
			//TODO Et on passe à l'étape suivante
			gameIsFinished();
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour d'hérétique
		while(timerOfTheReturnOfTheSuperHeroes != 0){
			//TODO On vérifie que le pouvoir est disponible
			
			//TODO On affiche un messages aux personnes concernées : ninja
			console.log("Ninja, tu peux tuer furtivement la personne de ton choix.");
			
			//TODO On récupère les votes dans une variable
			console.log("Récupération du vote du Ninja.");
			//var voteReturnSuperHeroes = ???;
			
			if(voteReturnSuperHeroes.type = "Ninja"){
				console.log("Le Ninja a choisi de tuer "+voteReturnSuperHeroes.target+".");
				
				//On permet au ninja de tuer furtivement le joueur qu'il a voté
				killSomeone(voteReturnSuperHeroes.target);
				
				//TODO On désactive le pouvoir du ninja
				console.log("Pouvoir du Ninja utilisé. Désactivé pour le restant de la partie.")
			}

		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerTheReturnOfTheSuperHeroes(){
		return timerOfTheReturnOfTheSuperHeroes--;
	}
	
}


//Méthode qui permet de définir si la partie est terminée ou non
function gameIsFinished(){
	
	console.log("Est-ce que la partie est terminée ?");
	
	//TODO créer une liste d'innocents
	
	//Si le nombre de psychopathes est égal à 2 et que celui des innocents est égal à 1, on termine
	if((liste_psychos.length == 2) && (liste_innocents == 1)){
		//TODO On affiche un message système
		console.log("Les psychopathes ont gagné !");
		
		//On stocke notre gagnant
		var whoWin = "Psychos";
		
		//Et on le met en paramètre
		finishGame(whoWin);
	}
	//Si le nombre de psychopathes est égal à 0
	else if(liste_psychos.length == 0){
		//TODO On affiche un message système
		console.log("Bravo ! Les innocents ont survécu aux psychopathes !");
		
		//On stocke notre gagnant
		var whoWin = "Innocent";
		
		//Et on le met en paramètre
		finishGame(whoWin);
	}
	//Sinon on relance un tour de jeu
	else{
		roundOfPsychopaths();
	}
}


//Méthode qui permet de terminer la partie
function finishGame(gagnant){
	
	//Suivant le gagnant et le nombre de joueurs en vie, on attribue les points
	switch(gagnant){
		case "Psychos":
			//TODO Calcul points + udpate bdd des joueurs concernés
			break;
		case "Tentateur":
			//TODO Calcul points + udpate bdd des joueurs concernés
			break;
		case "Innocent":
			//TODO Calcul points + udpate bdd des joueurs concernés
			break;
	}
	
	//On initialise notre timer de pour une durée de 300 secondes
	var timerOfSalon = 300;
	
	//On déclare notre countTimerSalon, qui permettra d'arrêter le compte à rebours
	var countTimerSalon;
	
	//On décrémente le timer toutes les 1s
	setInterval(function(){
		
		console.log("Le timer des super héros vaut : "+timerOfSalon);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerSalon = timerSalon();
		
		//Si le timerSuperHero vaut 0, alors on arrête le compte à rebours
		if(timerOfSalon == 0){
			console.log("Le timer des super héros vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerSalon);
			
			//TODO On désactive le chat et on détruit la partie dans la bdd
			console.log("La partie va être supprimée...");
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour d'hérétique
		while(timerOfSalon != 0){
			//TODO On active le chat pour tout le monde
			console.log("Tout le monde peut parler pendant 5 min.");
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours
	function timerSalon(){
		return timerOfSalon--;
	}
	
}
