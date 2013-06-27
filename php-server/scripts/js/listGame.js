/** listGame.js ****************/
/*
 * Ajax functions for Screwy
 * Copyright 2012-2013 Parisot Joffrey alias Joottle
 * Released under the MIT and GPL licenses.
 */
	
//Lors du clic sur une partie
$(".liste_li").on("click", function(event){
	
	//Si l'élément ciblé n'a pas déjà la classe "choice"
	if($(this).hasClass("choice") == false){
		
		//On enlève la classe "choice" de toutes nos cibles potentielles
		$(".liste_li").removeClass("choice");
		//On enlève leur couleur de fond
		/*$(".liste_li").animate({
			backgroundColor: "transparent"
		}, 100 );*/
		
		//Et on ajoute la classe "choice" à l'élément ciblé
		$(this).addClass("choice");

		//On change de couleur le fond du li
		/*$(this).animate({
			backgroundColor: "#9A2D04"
		}, 100 );*/
	}
	
});