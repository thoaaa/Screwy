/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/**
 * Distribuer les rôles mélangés.
 * Prend en paramètre le tableau contenant les joueurs
 * et celui contenant les rôles
 */
function distribRoles(listeJoueurs, listeRoles){
	//On mélange les rôles
	shuffleArray(listeRoles);
	
	//On distribue les rôles
	for(var i = 0; i < listeJoueurs.length; i++){
		listeJoueurs[i].role = listeRoles[i];
		console.log("Le joueur "+listeJoueurs[i]+" a le rôle "+listeRoles[i]);
	}
}
