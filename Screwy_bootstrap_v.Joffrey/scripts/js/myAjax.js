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
					}, 5000
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

function updateMe(){

	//On efface tous les messages d'erreur et on les vide
	$("#update_me_empty_pseudo").fadeOut().html("");
	$("#update_me_empty_email").fadeOut().html("");
	$("#update_me_invalid_email").fadeOut().html("");
	$("#update_me_error_pseudo").fadeOut().html("");
	$("#update_me_error_email").fadeOut().html("");
	$("#update_me_success").fadeOut().html("");
	
	//On récupère toutes les valeurs du formulaire
	var updateMeForm = $("#me_form").serialize();
	
	$.post(
		'php/updateMe.php', //Script ciblé
		//Valeurs passées au script php via la sérialisation de mon formulaire
		updateMeForm,
		function(data){ //Fonction de retour de la requête
			console.log("data du retour :"+data);
			console.log(data.error_empty_pseudo);
			console.log(data.error_empty_email);
			console.log(data.error_invalid_email);
			console.log(data.error_pseudo);
			console.log(data.error_email);
			console.log(data.success);
			//console.log("mon id : "+data.id);

			if (data.error_empty_pseudo == 'Pseudo_Vide'){
				//On affiche un message d'erreur
				$("#update_me_empty_pseudo").html("Veuillez entrer un pseudo.");
				$("#update_me_empty_pseudo").fadeIn();
			}
			if (data.error_empty_email == 'Email_Vide'){
				//On affiche un message d'erreur
				$("#update_me_empty_email").html("Veuillez entrer une adresse e-mail.");
				$("#update_me_empty_email").fadeIn();
			}
			if (data.error_invalid_email == 'Email_Invalide'){
				//On affiche un message d'erreur
				$("#update_me_invalid_email").html("Ceci n'est pas une adresse e-mail !");
				$("#update_me_invalid_email").fadeIn();
			}			
			if (data.error_pseudo == 'Erreur_Pseudo'){
				//On affiche un message d'erreur
				$("#update_me_error_pseudo").html("Le pseudo existe déjà, veuillez en choisir un autre.");
				$("#update_me_error_pseudo").fadeIn();
			}
			if (data.error_email == 'Erreur_Email'){
				//On affiche un message d'erreur
				$("#update_me_error_email").html("L'adresse e-mail existe déjà, veuillez en choisir une autre.");
				$("#update_me_error_email").fadeIn();
			}
			if (data.success == 'Success'){
				//On met à jour le formulaire
				$("#update_me_success").html("Update done !");
				$("#update_me_success").fadeIn();
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

function updatePassword(){

	//On efface tous les messages d'erreur et on les vide
	$("#update_password_empty_new").fadeOut().html("");
	$("#update_password_empty_newagain").fadeOut().html("");
	$("#update_password_empty_password").fadeOut().html("");
	$("#update_password_bad_password").fadeOut().html("");
	$("#update_password_bad_match").fadeOut().html("");
	$("#update_password_success").fadeOut().html("");
	
	//On récupère toutes les valeurs du formulaire
	var updateMeForm = $("#new_password_form").serialize();
	
	$.post(
		'php/updatePassword.php', //Script ciblé
		//Valeurs passées au script php via la sérialisation de mon formulaire
		updateMeForm,
		function(data){ //Fonction de retour de la requête
			console.log("data du retour :"+data);
			console.log(data.error_empty_new);
			console.log(data.error_empty_newagain);
			console.log(data.error_empty_password);
			console.log(data.error_bad_password);
			console.log(data.error_bad_match);
			console.log(data.success);

			if (data.error_empty_new == 'New_Vide'){
				//On affiche un message d'erreur
				$("#update_password_empty_new").html("Please enter a new password.");
				$("#update_password_empty_new").fadeIn();
			}
			if (data.error_empty_newagain == 'Newagain_Vide'){
				//On affiche un message d'erreur
				$("#update_password_empty_newagain").html("Required field.");
				$("#update_password_empty_newagain").fadeIn();
			}
			if (data.error_empty_password == 'Password_Vide'){
				//On affiche un message d'erreur
				$("#update_password_empty_password").html("Please enter your current password.");
				$("#update_password_empty_password").fadeIn();
			}			
			if (data.error_bad_password == 'Erreur_Password'){
				//On affiche un message d'erreur
				$("#update_password_bad_password").html("Wrong password, please try again.");
				$("#update_password_bad_password").fadeIn();
			}
			if (data.error_bad_match == 'Erreur_Match'){
				//On affiche un message d'erreur
				$("#update_password_bad_match").html("Passwords don't match.");
				$("#update_password_bad_match").fadeIn();
			}
			if (data.success == 'Success'){
				//On met à jour le formulaire
				$("#update_password_success").html("Update done !");
				$("#update_password_success").fadeIn();
				//Et on vide tous les champs
				$("#my_new_password").val('');
				$("#my_new_password_check").val('');
				$("#my_password").val('');
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

function updateStuff(){

	//On efface tous les messages d'erreur et on les vide
	$("#update_stuff_error").fadeOut().html("");
	$("#update_stuff_success").fadeOut().html("");
	
	//On récupère toutes les valeurs du formulaire
	var updateStuffForm = $("#my_stuff_form").serialize();
	
	$.post(
		'php/updateStuff.php', //Script ciblé
		//Valeurs passées au script php via la sérialisation de mon formulaire
		updateStuffForm,
		function(data){ //Fonction de retour de la requête
			console.log("data du retour :"+data);
			console.log(data.error_stuff);
			console.log(data.success);

			if (data.error_stuff == 'Nothing_Update'){
				//On affiche un message d'erreur
				$("#update_stuff_error").html("Nothing to update !");
				$("#update_stuff_error").fadeIn();
			}
			if (data.success == 'Success'){
				//On met à jour le formulaire
				$("#update_stuff_success").html("Update done !");
				$("#update_stuff_success").fadeIn();
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

function updateSocial(){

	//On efface tous les messages d'erreur et on les vide
	$("#update_social_error_website").fadeOut().html("");
	$("#update_social_error_twitter").fadeOut().html("");
	$("#update_social_error_facebook").fadeOut().html("");
	$("#update_social_error_google").fadeOut().html("");
	$("#update_social_error_tumblr").fadeOut().html("");
	$("#update_social_error_flickr").fadeOut().html("");
	$("#update_social_error_blog").fadeOut().html("");
	$("#update_social_error").fadeOut().html("");
	$("#update_social_success").fadeOut().html("");
	
	//On récupère toutes les valeurs du formulaire
	var updateStuffForm = $("#my_social_form").serialize();
	
	$.post(
		'php/updateSocial.php', //Script ciblé
		//Valeurs passées au script php via la sérialisation de mon formulaire
		updateStuffForm,
		function(data){ //Fonction de retour de la requête
			console.log("data du retour :"+data);
			console.log(data.error_website);
			console.log(data.error_twitter);
			console.log(data.error_facebook);
			console.log(data.error_google);
			console.log(data.error_tumblr);
			console.log(data.error_flickr);
			console.log(data.error_blog);
			console.log(data.error_update);
			console.log(data.success);

			if (data.error_website == 'Error_Website'){
				//On affiche un message d'erreur
				$("#update_social_error_website").html("This website already exists !");
				$("#update_social_error_website").fadeIn();
			}
			if (data.error_twitter == 'Error_Twitter'){
				//On affiche un message d'erreur
				$("#update_social_error_twitter").html("This Twitter already exists !");
				$("#update_social_error_twitter").fadeIn();
			}
			if (data.error_facebook == 'Error_Facebook'){
				//On affiche un message d'erreur
				$("#update_social_error_facebook").html("This Facebook already exists !");
				$("#update_social_error_facebook").fadeIn();
			}
			if (data.error_google == 'Error_Google'){
				//On affiche un message d'erreur
				$("#update_social_error_google").html("This Google+ already exists !");
				$("#update_social_error_google").fadeIn();
			}
			if (data.error_tumblr == 'Error_Tumblr'){
				//On affiche un message d'erreur
				$("#update_social_error_tumblr").html("This Tumblr already exists !");
				$("#update_social_error_tumblr").fadeIn();
			}
			if (data.error_flickr == 'Error_Flickr'){
				//On affiche un message d'erreur
				$("#update_social_error_flickr").html("This Flickr already exists !");
				$("#update_social_error_flickr").fadeIn();
			}
			if (data.error_blog == 'Error_Blog'){
				//On affiche un message d'erreur
				$("#update_social_error_blog").html("This blog already exists !");
				$("#update_social_error_blog").fadeIn();
			}
			if (data.error_update == 'Error_Update'){
				//On affiche un message d'erreur
				$("#update_social_error").html("Nothing to update !");
				$("#update_social_error").fadeIn();
			}
			if (data.success == 'Success'){
				//On met à jour le formulaire
				$("#update_social_success").html("Update done !");
				$("#update_social_success").fadeIn();
			}
		},
		'json' //On veut recevoir un message de type json
	);
}

function uploadHDR(){

	//On cache tous les messages d'erreur et on les vide
	$("#upload_error").fadeOut().html("");
	$("#upload_error_not_img").fadeOut().html("");
	$("#upload_error_size").fadeOut().html("");
	$("#upload_error_extension").fadeOut().html("");
	$("#upload_error_nothing").fadeOut().html("");
	$("#upload_success").fadeOut().html("");
	
	//On récupère nos valeurs du formulaire
	var uploadForm = $("#fileupload").serialize();
	var photo_title = $("#photo_title");
	var photo_description = $("#photo_description");
	var photo_category = $("#photo_category");
	var photo_date_taken = $("#photo_date_taken");
	var photo_camera = $("#photo_camera");
	var photo_lens = $("#photo_lens");
	var photo_focal = $("#photo_focal");
	var photo_shutter = $("#photo_shutter");
	var photo_aperture = $("#photo_aperture");
	var photo_iso = $("#photo_iso");
	
	var upload_HDR_input = document.getElementById("upload_HDR_input"), 
		formdata = false;
	
	if (window.FormData) {
		formdata = new FormData();
	}
	
	//On affiche notre loader le temps de l'upload
	$("#loader_HDR").fadeIn(600);

	//Déclaration des variables
	var len = upload_HDR_input.files.length, img, reader, file;
	
	file = upload_HDR_input.files[0];
	
	if (!!file.type.match(/image.*/)) {
		if ( window.FileReader ) {
			reader = new FileReader();
			reader.onloadend = function (e) { 
				//blah
			};
			reader.readAsDataURL(file);
		}
		if (formdata) {
			formdata.append("upload_HDR_input[]", file);
		}
	}
	
	if (formdata) {
		console.log("ajax !");
		console.log(formdata);
		console.log(file);
		$.ajax({
			url: "php/uploadHDR.php",
			type: "POST",
			data: formdata,
			processData: false,
			contentType: false,
			success: function (data) {
				//On cache le loader
				$("#upload_avatar_loader").fadeOut(600);
				
				//$("#upload_error_not_img").html(data).fadeIn(600);
				
				if (data == 'Error_Upload'){
					//On affiche un message d'erreur
					$("#upload_error").html("Uploading failed, please try again.");
					$("#upload_error").fadeIn();
				}
				if (data == 'Error_Size'){
					//On affiche un message d'erreur
					$("#upload_error_size").html("Max size : 20 Mo.");
					$("#upload_error_size").fadeIn();
				}
				if (data == 'Error_Not_Img'){
					//On affiche un message d'erreur
					$("#upload_error_not_img").html("This is not an image.");
					$("#upload_error_not_img").fadeIn();
				}
				if (data == 'Error_Extension'){
					//On affiche un message d'erreur
					$("#upload_error_extension").html("Only .jpg, .jpeg, .png and .gif are accepted.");
					$("#upload_error_extension").fadeIn();
				}
				if (data == 'Error_Nothing'){
					//On affiche un message d'erreur
					$("#upload_error_nothing").html("Nothing to update.");
					$("#upload_error_nothing").fadeIn();
				}
				if (data == 'Success'){
					//On affiche ok
					$("#upload_success").html("Upload done !");
					$("#upload_success").fadeIn();
				}
				
				//Et on vide le input
				$("#upload_avatar_input").val('');
				
				/*//On cache le loader
				$("#upload_avatar_loader").fadeOut(600);
				//On montre le message
				$("#upload_success").html(data).fadeIn(600);
				//Et on vide le input
				//input.val('');*/
			}
		});
	}
}

function addComment(){

	//On récupère nos valeurs
	var comment = $("#text_comment").val();
	var idUser = $("#id_user").val();
	var idPicture = $("#id_picture").val();
	var pseudoAuthor = $("#id_pseudo").val();
	
	//Si le commentaire n'est pas vide
	if(comment != ''){

		//On ajoute le commentaire
		$.post(
			'php/postComment.php', //Script ciblé
			{
			//Valeurs passées au script php via la sérialisation de mon formulaire, équivalent à (1)
			comment : comment,
			idUser : idUser,
			idPicture : idPicture,
			pseudoAuthor : pseudoAuthor
			},
			function(data){ //Fonction de retour de la requête
				//On rempli la div
				$("#all_comments").prepend(data).fadeIn(600);
				//Et on vide le textarea
				$("#text_comment").val('');
			}
		);
		
	}
}