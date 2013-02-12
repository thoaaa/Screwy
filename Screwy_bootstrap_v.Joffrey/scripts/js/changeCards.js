/** changeCards.js ****************/
/*
 * Ajax functions for Screwy
 * Copyright 2012-2013 Parisot Joffrey alias Joottle
 * Released under the MIT and GPL licenses.
 */


function setCards(numero){
	console.log("Dans setCards, nombre choisi : "+numero);
	
	var num = numero;
	
	//On vire la class ""carte_choice" de toutes les cartes
	$(".li_carte").removeClass("carte_choice");
	
	//Suivant le nombre de joueur choisi on affiche certaines cartes ainsi que leur nombre
	switch(numero){
		case "5":
			console.log("Cas "+numero+" joueurs");
			//On garde 4 innocents et 1 psychopathe
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x4");
			$("#li_psychopathe .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice"
			$(".carte_choice").fadeIn(400);
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "6":
			console.log("Cas "+numero+" joueurs");
			//On garde 4 innocents et 2 psychopathes
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x4");
			$("#li_psychopathe .nombre_carte").html("x2");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice"
			$(".carte_choice").fadeIn(400);
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "7":
			console.log("Cas "+numero+" joueurs");
			//On garde 4 innocents et 2 psychopathes et 1 hérétique
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_heretique").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x4");
			$("#li_psychopathe .nombre_carte").html("x2");
			$("#li_heretique .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "8":
			console.log("Cas "+numero+" joueurs");
			//On garde 4 innocents et 3 psychopathes et 1 ninja
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_ninja").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x4");
			$("#li_psychopathe .nombre_carte").html("x3");
			$("#li_ninja .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "9":
			console.log("Cas "+numero+" joueurs");
			//On garde 4 innocents et 3 psychopathes et 1 mentaliste et 1 miracule
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x4");
			$("#li_psychopathe .nombre_carte").html("x3");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "10":
			console.log("Cas "+numero+" joueurs");
			//On garde 3 innocents et 4 psychopathes et 1 mentaliste et 1 miracule et 1 zombie
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			$("#li_zombie").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x3");
			$("#li_psychopathe .nombre_carte").html("x4");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			$("#li_zombie .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "11":
			console.log("Cas "+numero+" joueurs");
			//On garde 3 innocents et 4 psychopathes et 1 mentaliste et 1 miracule et 1 zombie et 1 sage
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			$("#li_zombie").addClass("carte_choice");
			$("#li_sage").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x3");
			$("#li_psychopathe .nombre_carte").html("x4");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			$("#li_zombie .nombre_carte").html("x1");
			$("#li_sage .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "12":
			console.log("Cas "+numero+" joueurs");
			//On garde 3 innocents et 4 psychopathes et 1 mentaliste et 1 miracule et 1 zombie et 1 sage et 1 telekinesiste
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			$("#li_zombie").addClass("carte_choice");
			$("#li_sage").addClass("carte_choice");
			$("#li_telekinesiste").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x3");
			$("#li_psychopathe .nombre_carte").html("x4");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			$("#li_zombie .nombre_carte").html("x1");
			$("#li_sage .nombre_carte").html("x1");
			$("#li_telekinesiste .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "13":
			console.log("Cas "+numero+" joueurs");
			//On garde 2 innocents et 5 psychopathes et 1 mentaliste et 1 miracule et 1 zombie et 1 sage et 1 telekinesiste et 1 heretique
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			$("#li_zombie").addClass("carte_choice");
			$("#li_sage").addClass("carte_choice");
			$("#li_telekinesiste").addClass("carte_choice");
			$("#li_heretique").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x2");
			$("#li_psychopathe .nombre_carte").html("x5");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			$("#li_zombie .nombre_carte").html("x1");
			$("#li_sage .nombre_carte").html("x1");
			$("#li_telekinesiste .nombre_carte").html("x1");
			$("#li_heretique .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "14":
			console.log("Cas "+numero+" joueurs");
			//On garde 2 innocents et 5 psychopathes et 1 mentaliste et 1 miracule et 1 zombie et 1 sage et 1 telekinesiste et 1 heretique et 1 tentateur
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			$("#li_zombie").addClass("carte_choice");
			$("#li_sage").addClass("carte_choice");
			$("#li_telekinesiste").addClass("carte_choice");
			$("#li_heretique").addClass("carte_choice");
			$("#li_tentateur").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x2");
			$("#li_psychopathe .nombre_carte").html("x5");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			$("#li_zombie .nombre_carte").html("x1");
			$("#li_sage .nombre_carte").html("x1");
			$("#li_telekinesiste .nombre_carte").html("x1");
			$("#li_heretique .nombre_carte").html("x1");
			$("#li_tentateur .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
		case "15":
			console.log("Cas "+numero+" joueurs");
			//On garde 1 innocent et 6 psychopathes et 1 mentaliste et 1 miracule et 1 zombie et 1 ninja et 1 boitier et 1 heretique et 1 tentateur et 1 theohazard
			
			//On ajoute la classe "carte_choice" à ces cartes
			$("#li_innocent").addClass("carte_choice");
			$("#li_psychopathe").addClass("carte_choice");
			$("#li_mentalist").addClass("carte_choice");
			$("#li_miracule").addClass("carte_choice");
			$("#li_zombie").addClass("carte_choice");
			$("#li_ninja").addClass("carte_choice");
			$("#li_boitier").addClass("carte_choice");
			$("#li_heretique").addClass("carte_choice");
			$("#li_tentateur").addClass("carte_choice");
			$("#li_theo").addClass("carte_choice");
			
			//On met à jour la valeur du nombre de cartes
			$("#li_innocent .nombre_carte").html("x2");
			$("#li_psychopathe .nombre_carte").html("x6");
			$("#li_mentalist .nombre_carte").html("x1");
			$("#li_miracule .nombre_carte").html("x1");
			$("#li_zombie .nombre_carte").html("x1");
			$("#li_ninja .nombre_carte").html("x1");
			$("#li_boitier .nombre_carte").html("x1");
			$("#li_heretique .nombre_carte").html("x1");
			$("#li_tentateur .nombre_carte").html("x1");
			$("#li_theo .nombre_carte").html("x1");
			
			//On affiche toutes les cartes qui ont la classe "carte_choice" et qui ne sont pas affichées (classe carte_show)
			$(".carte_choice:not(.carte_show)").fadeIn(400).addClass("carte_show");
			
			//On cache toutes les cartes sauf celles qui ont la classe "carte_choice"
			$(".li_carte:not(.carte_choice)").fadeOut(400,function(){
				//On vide le nombre des cartes cachées
				$(".li_carte:not(.carte_choice) .nombre_carte").html("");
			}).removeClass("carte_show");
			break;
	}
}