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
		$(".liste_li").animate({
			backgroundColor: "transparent"
		}, 100 );
		
		//Et on ajoute la classe "choice" à l'élément ciblé
		$(this).addClass("choice");

		//On change de couleur le fond du li
		$(this).animate({
			backgroundColor: "#abcdef"
		}, 100 );
	}
	
});
	
	
function joinGame(id_utilisateur){
	console.log("Dans joinGame ajax");
	
	//Faire en sorte de ne pas autoriser le clic tant qu'on a pas reçu de message
	 $("#join_game input[type='button']").attr("disabled", true);
	
	//On récupère l'id passé dans la fonction, qui correspond à l'id de la personne
	var idUtilisateur = id_utilisateur;
	
	//On cache tous les messages d'erreur et on les vide
	$("#join_game .help-inline").fadeOut().html("");	
	//On vire la classe error de tous les control-group
	$("#join_game .control-group").removeClass("error");
	
	//On récupère l'id de l'élément qui a la classe choice
	var idCible = $(".choice").attr("idSalon");
	console.log(idCible);
	
	$.post(
		'scripts/php/joinGame.php', //Script ciblé
		{
		idUtilisateur : idUtilisateur,
		idCible : idCible
		},
		function(data){ //Fonction de retour de la requête
			console.log(data.error_no_exist);
			console.log(data.success);

			if (data.error_no_exist == 'Erreur_No_Exist'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#join_game .help-inline").html("Cette partie n'existe plus");
				$("#join_game .help-inline").fadeIn();
				$("#join_game").addClass("error");
				//Réactiver le bouton
				$("#join_game input[type='button']").attr("disabled", false);
			}
			if (data.success == 'Success'){
				//On redirige l'utilisateur vers la page de salon
				$(location).attr("href", "http://screwy_bootstrap.eu01.aws.af.cm/chat.php?idsalon="+data.id_salon+"");				
			}
		},
		'json' //On veut recevoir un message de type json
	);
	
}