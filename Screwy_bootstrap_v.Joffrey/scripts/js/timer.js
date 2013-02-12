/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */

//On récupère le nombre de joueurs
var nbJoueurs = listeJoueurs.length;

//On initialise notre compteur de readyToPlay
var countReadyToPlay = 0;


//Méthode qui permet de récupérer les ReadyToPlay et de les compter
function getReadyToPlay(message){
	
	//On vérifie le format du message
	if (message.type !== 'utf8'){
		return;
	}
	
	//On récupere l'instruction contenue dans le message
	try {
		var instruction = JSON.parse(message.utf8Data);
	} catch (e) {
		console.log("Le message suivant n\'est pas au format JSON : ", message.utf8Data);
		return;
	}
	
	//On regarde si l'instruction est de type readyToPlay
	if(instruction.type != 'readyToPlay'){
		console.log("L'instruction reçue n'est pas de type readyToPlay !");
		return;
	}
	else{
		//On incrémente notre compteur de readyToPlay
		countReadyToPlay++;
	}
	
	//On retourne notre compteur pour pouvoir l'utiliser
	return countReadyToPlay;
}


//Méthode permettant de démarrer le jeu. Prend en paramètre le nombre de joueurs et le compteur de readyToPlay
function startGame(nbJoueurs, countReadyToPlay){
	
	//On ne lance la partie que si le nombre de joueurs = nombre de readyToPlay
	if(nbJoueurs != countReadyToPlay){
		console.log("Tous les joueurs doivent cliquer sur Prêt pour que la partie se lance !");
		return;
	}
	else{
		//On lance notre méthode qui permet aux psychopathes de jouer
		roundOfPsychopaths();
	}
}


//Méthode qui gère le tour spécifique des psychopathes
function roundOfPsychopaths(){
	
	//On initialise notre timer de psychopathe pour une durée de 1 minute
	var timerOfPsychopaths = 60;
	
	//On déclare notre countTimerPsychopaths, qui permettra d'arrêter le compte à rebours
	var countTimerPsychopaths;

	//TODO On affiche l'interface pour voter aux psychopathes
	// code ici
	
	//TODO On affiche le timer des psychopathes à tout le monde
	// code ici
	
	//On décrémente le timer des psychopathes toutes les 1s
	setInterval(function(){
		
		console.log("Le timer des psychopathes vaut : "+timerOfPsychopaths);
		
		//On affecte notre variable à notre compte à rebours, ce qui permettra de l'arrêter
		countTimerPsychopaths = timerPsychopaths();
		
		//Si le timerPsychopaths vaut 0, alors on arrête le compte à rebours et on remet notre valeur à sa valeur initiale
		if(timerOfPsychopaths == 0){
			console.log("Le timer des psychopathes vaut 0 ! On arrête tout !");
			
			//On stoppe notre compte à rebours
			clearInterval(countTimerPsychopaths);
			
			//TODO On désactive les votes
			// code ici
			
			//TODO On enlève le timer de l'interface
			// code ici
			
			//TODO Et on passe à l'étape suivante du jeu
			// code ici
		}
		
		//Tant que le timer n'est pas égal à 0, on peut faire notre tour de psychopathe
		while(timerOfPsychopaths != 0){
			
		}
				
	},1000);
	
	//Méthode imbriquée qui permet de faire le compte à rebours pour nos psychopathes
	function timerPsychopaths(){
		return timerOfPsychopaths--;
	}
	
}