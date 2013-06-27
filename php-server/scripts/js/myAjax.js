/** myAjax.js ****************/
/*
 * Ajax functions for Screwy
 * Copyright 2012-2013 Parisot Joffrey alias Joottle
 * Released under the MIT and GPL licenses.
 */

function mySignin(){
	console.log("Signin Ajax");

	//On cache tous les messages d'erreur et on les vide
	$("#signin_form .help-inline").fadeOut().html("");	
	//On vire la classe error de tous les control-group
	$("#signin_form .control-group").removeClass("error");
	
	//Récupération des champs
	var inputPseudoSign = $("#inputPseudoSign");
	console.log(inputPseudoSign.val());
	var inputEmailSign = $("#inputEmailSign");
	console.log(inputEmailSign.val());
	var inputConfirmEmailSign = $("#inputConfirmEmailSign");
	console.log(inputConfirmEmailSign.val());
	var inputPasswordSign = $("#inputPasswordSign")
	console.log(inputPasswordSign.val());
	var inputConfirmPasswordSign = $("#inputConfirmPasswordSign");
	console.log(inputConfirmPasswordSign.val());
	
		
	//On récupère les données passées dans le formulaire
	console.log($("#signin_form"));
	var signin_form =  $("#signin_form").serialize();
	console.log(signin_form);
	//Ne fonctionne pas, bizarre...
	
	$.post(
		'scripts/php/signin.php', //Script ciblé
		//signin_form,
		{
		inputPseudoSign : inputPseudoSign.val(),
		inputEmailSign : inputEmailSign.val(),
		inputConfirmEmailSign : inputConfirmEmailSign.val(),
		inputPasswordSign : inputPasswordSign.val(),
		inputConfirmPasswordSign: inputConfirmPasswordSign.val()
		},
		function(data){ //Fonction de retour de la requête
			console.log(data.error_empty_pseudo);
			console.log(data.error_empty_email);
			console.log(data.error_empty_password);
			console.log(data.error_empty_check_email);
			console.log(data.error_empty_check_password);
			console.log(data.error_invalid_email);
			console.log(data.error_check_email);
			console.log(data.error_check_password);
			console.log(data.error_pseudo);
			console.log(data.error_email);
			console.log(data.error_success);
			
			if (data.error_empty_pseudo == 'Pseudo_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_pseudo .help-inline").html("Veuillez entrer un pseudo");
				$("#signin_pseudo .help-inline").fadeIn();
				$("#signin_pseudo").addClass("error");
			}
			if (data.error_empty_email == 'Email_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_email .help-inline").html("Veuillez entrer une adresse email");
				$("#signin_email .help-inline").fadeIn();
				$("#signin_email").addClass("error");
			}
			if (data.error_empty_password == 'Password_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_password .help-inline").html("Veuillez entrer un mot de passe");
				$("#signin_password .help-inline").fadeIn();
				$("#signin_password").addClass("error");
			}
			if (data.error_empty_check_email == 'Check_Email_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_confirm_email .help-inline").html("Veuillez confirmer votre adresse email");
				$("#signin_confirm_email .help-inline").fadeIn();
				$("#signin_confirm_email").addClass("error");
			}
			if (data.error_empty_check_password == 'Check_Password_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_confirm_password .help-inline").html("Veuillez confirmer votre mot de passe");
				$("#signin_confirm_password .help-inline").fadeIn();
				$("#signin_confirm_password").addClass("error");
				
			}
			if (data.error_invalid_email == 'Email_Invalide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_email .help-inline").html("Ce n'est pas une adresse email valide");
				$("#signin_email .help-inline").fadeIn();
				$("#signin_email").addClass("error");
			}
			if (data.error_check_email == 'Error_Check_Email'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_confirm_email .help-inline").html("Les emails ne correspondent pas, veuillez recommencer");
				$("#signin_confirm_email .help-inline").fadeIn();
				$("#signin_confirm_email").addClass("error");
			}
			if (data.error_check_password == 'Error_Check_Password'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_confirm_password .help-inline").html("Les mots de passe ne correspondent pas, veuillez recommencer");
				$("#signin_confirm_password .help-inline").fadeIn();
				$("#signin_confirm_password").addClass("error");
			}
			if (data.error_pseudo == 'Erreur_Pseudo'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_pseudo .help-inline").html("Le pseudo existe déjà, veuillez en choisir un autre");
				$("#signin_pseudo .help-inline").fadeIn();
				$("#signin_pseudo").addClass("error");
			}
			if (data.error_email == 'Erreur_Email'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#signin_email .help-inline").html("L'adresse email existe déjà, veuillez en choisir une autre");
				$("#signin_email .help-inline").fadeIn();
				$("#signin_email").addClass("error");
			}
			if (data.success == 'Success'){
				//On efface les données du formulaire
				inputPseudoSign.val('');
				inputEmailSign.val('');
				inputConfirmEmailSign.val('');
				inputPasswordSign.val('');
				inputConfirmPasswordSign.val('');
				
				//On affiche un message de succès
				$("#signin_success .help-inline").html("Inscription réussie ! Vous allez être redirigé dans 5 secondes...");
				$("#signin_success .help-inline").fadeIn();
				$("#signin_success").addClass("success");
				
				//Et enfin on redirige l'utilisateur vers la page de salon au bout de 5s
				setTimeout(
			  		function(){
			  			//On cache la modal box
						$('#myModal').modal('hide');
						//On cache le message de succès
						$("#signin_success .help-inline").fadeOut().html("");	
						//On vire la classe succes de tous les control-group
						$("#signin_success .control-group").removeClass("success");
						//On redirige
						$(location).attr("href", "http://screwy_bootstrap.eu01.aws.af.cm/chat.php");
					}, 2500
				);
				
				//$("#signin_success").html("Inscription réussie.");
				//$("#signin_success").fadeIn();
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

function myLogin(){

	console.log("Dans login ajax");
	
	//On cache tous les messages d'erreur et on les vide
	$("#login_form .help-inline").fadeOut().html("");	
	//On vire la classe error de tous les control-group
	$("#login_form .control-group").removeClass("error");
	
	//Récupération des champs
	var login_pseudo = $("#inputPseudoLog");
	var login_password = $("#inputPasswordLog");
	
	//On initialise la checkbox
	var checkboxChecked = 0;
	
	//On vérifie si la check box est checkée ou pas
	if ($("#check").is(':checked') == true) {
		checkboxChecked = 1;
		console.log("Checkbox cochée");
	}
	else {
		checkboxChecked = 0;
		console.log("Checkbox pas cochée");
	}

	//Récupération des données du formulaire
	//var login_form = $("#login_form").serialize();
	//console.log(login_form);
	
	console.log(checkboxChecked);
	
	$.post(
		'scripts/php/login.php', //Script ciblé
		{
		login_pseudo : login_pseudo.val(),
		login_password : login_password.val(),
		check : checkboxChecked
		},
		function(data){ //Fonction de retour de la requête
			console.log(data.error_empty_pseudo);
			console.log(data.error_empty_password);
			console.log(data.error_pseudo);
			console.log(data.error_password);
			
			if (data.error_empty_pseudo == 'Pseudo_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#login_pseudo .help-inline").html("Veuillez entrer un pseudo");
				$("#login_pseudo .help-inline").fadeIn();
				$("#login_pseudo").addClass("error");
			}
			if (data.error_empty_password == 'Password_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#login_password .help-inline").html("Veuillez entrer un mot de passe");
				$("#login_password .help-inline").fadeIn();
				$("#login_password").addClass("error");
			}
			if (data.error_pseudo == 'Erreur_Pseudo'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#login_pseudo .help-inline").html("Ce pseudo n'existe pas");
				$("#login_pseudo .help-inline").fadeIn();
				$("#login_pseudo").addClass("error");
			}
			if (data.error_password == 'Erreur_Password'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#login_password .help-inline").html("Mauvais mot de passe, veuillez réessayer");
				$("#login_password .help-inline").fadeIn();
				$("#login_password").addClass("error");
			}
			if (data.success == 'Success'){
				//On efface les données du formulaire
				login_pseudo.val('');
				login_password.val('');
				
				//On affiche un message de succès
				$("#login_success .help-inline").html("Connexion réussie ! Vous allez être redirigé dans quelques secondes...");
				$("#login_success .help-inline").fadeIn();
				$("#login_success").addClass("success");
				
				//Et enfin on redirige l'utilisateur vers la page de salon au bout de 5s
				setTimeout(
			  		function(){
			  			//On cache la modal box
						$('#myModal').modal('hide');
						//On cache le message de succès
						$("#login_success .help-inline").fadeOut().html("");	
						//On vire la classe succes de tous les control-group
						$("#login_success .control-group").removeClass("success");
						//On redirige	
						$(location).attr("href", "http://screwy_bootstrap.eu01.aws.af.cm/salon.php");
					}, 2500
				);		
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

function myLogout(){
	
	//On récupère l'url de la page où on se trouve
	var myUrl = $(location).attr('href');
	//Si l'URL est celle d'une page avec restriction (account/usr-favorites/upload/album.php), on renvoit index.php
	/*if ((myUrl == 'http://www.joottle.com/HDRDaily/account.php') || (myUrl == 'http://www.joottle.com/HDRDaily/usr-favorites.php') || (myUrl == 'http://www.joottle.com/HDRDaily/upload.php') || (myUrl == 'http://www.joottle.com/HDRDaily/album.php')) {
		myUrl = "index.php";
	}*/
	
	$.post(
		'php/logout.php', //Script ciblé
		//Fonction de retour de la requête
		function(data){
			console.log("data du retour :"+data);
			console.log(data.logout);
			
			if (data.logout == 'Logout_OK'){
				//On recharge la page après un fadeOut()
				$("body").fadeOut(600, function() {
					$(location).attr("href", myUrl);
				});
			}
		},
		'json' //On veut recevoir un message de type json
	);

}

function createGame(id_createur){
	console.log("Dans createGame ajax + id = "+id_createur);
	
	//On cache tous les messages d'erreur et on les vide
	$("#create_form .help-inline").fadeOut().html("");	
	//On vire la classe error de tous les control-group
	$("#create_form .control-group").removeClass("error");
	
	//On récupère l'id du créateur de la partie
	var idCreateur = id_createur;
	//On récupère le nom de la partie
	var nomPartie = $("#inputNomPartie");
	//On récupère le set de carte choisi
	var nombreJoueurs = $("#inputNombreJoueurs").val();

	console.log(nombreJoueurs);
	
	$.post(
		'scripts/php/createGame.php', //Script ciblé
		{
		idCreateur : idCreateur,
		nomPartie : nomPartie.val(),
		nombreJoueurs : nombreJoueurs
		},
		function(data){ //Fonction de retour de la requête
			console.log(data.error_empty_nom);
			console.log(data.error_nom);
			console.log(data.success);
			console.log(data.id_salon);
			
			if (data.error_empty_nom == 'Nom_Vide'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#nom_create .help-inline").html("Veuillez entrer un nom pour la partie");
				$("#nom_create .help-inline").fadeIn();
				$("#nom_create").addClass("error");
			}
			if (data.error_nom == 'Erreur_Nom'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#nom_create .help-inline").html("Cette partie existe déjà, veuillez choisir un autre nom");
				$("#nom_create .help-inline").fadeIn();
				$("#nom_create").addClass("error");
			}
			if (data.success == 'Success'){
				//On efface les données du formulaire
				nomPartie.val('');
				
				//On affiche un message de succès
				$("#create_success .help-inline").html("La partie va être créée ! Vous allez être redirigé dans quelques secondes...");
				$("#create_success .help-inline").fadeIn();
				$("#create_success").addClass("success");
				
				//Et enfin on redirige l'utilisateur vers la page de salon au bout de 2.5s
				setTimeout(
			  		function(){
						//On cache le message de succès
						$("#create_success .help-inline").fadeOut().html("");	
						//On vire la classe succes de tous les control-group
						$("#create_success .control-group").removeClass("success");
						//On redirige	
						$(location).attr("href", "http://screwy_bootstrap.eu01.aws.af.cm/chat.php?idsalon="+data.id_salon+"");
					}, 2500
				);
					
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

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
				$("#join_game .help-inline").html("Cette partie n'existe plus.");
				$("#join_game .help-inline").fadeIn();
				$("#join_game .control-group").addClass("error");
				//Réactiver le bouton
				$("#join_game input[type='button']").attr("disabled", false);
			}
			if(data.no_game == 'Erreur_Pas_Partie'){
				//On affiche un message d'erreur et on met l'input en mode erreur
				$("#join_game .help-inline").html("Veuillez sélectionner une partie.");
				$("#join_game .help-inline").fadeIn();
				$("#join_game .control-group").addClass("error");
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