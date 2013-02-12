<?php
	session_start();
	
	//On récupère nos valeurs POST pour plus de clarté
	$post_new_password = $_POST["my_new_password"];
	$post_new_password_again = $_POST["my_new_password_check"];
	$post_current_password = $_POST["my_password"];
	//On récupère l'id de l'utilisateur via la variable de session
	$id_user = $_SESSION['id_user_logged'];
	
	$array = array('error_empty_new'=>'',
					'error_empty_newagain'=>'',
					'error_empty_password'=>'',
					'error_bad_password'=>'',
					'error_bad_match'=>'',
					'success'=>''
			);
	
	//On lance notre vérification "côté client"
	//Si un des champs est vide
	if ((empty($post_new_password)) || (empty($post_new_password_again)) || (empty($post_current_password))) {

		//Si le nouveau mdp est vide
		if (empty($post_new_password)){
			$array['error_empty_new']='New_Vide';
		}
		
		//Si le nouveau mdp again est vide
		if (empty($post_new_password_again)){
			$array['error_empty_newagain']='Newagain_Vide';
		}
		
		//Si le mdp actuel est vide
		if (empty($post_current_password)){
			$array['error_empty_password']='Password_Vide';
		}
	}
	//Sinon si les 2 champs nouveau mdp ne correspondent pas et qu'ils ne sont pas vides
	elseif (((isset($post_new_password)) && (isset($post_new_password_again))) && ($post_new_password != $post_new_password_again)){
		//Si l'email entrée n'est pas une adresse email
		if ($post_new_password != $post_new_password_again){
			$array['error_bad_match']='Erreur_Match';
		}
	}
	//Sinon, on fait notre vérification côté bdd
	else {
		//Connexion à la bdd
		include("connect.php");
		
		//On prépare notre requête 1 : sélectionner le champ password de l'utilisateur
		$select_password = $connexion->prepare("SELECT password FROM Users WHERE user_id = :user_id");
		//On lie notre variable
		$select_password->bindValue('user_id', $id_user, PDO::PARAM_INT);
		//On exécute
		$select_password->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$result_password = $select_password->fetch();
		//Clore la requête préparée
		$select_password->closeCursor();
		$select_password = NULL;
		//On récupère le mdp associé à l'id
		$password_user = $result_password['password'];
		
		//On crypte le mdp entré par l'utilisateur
		$encrypted_current_password = sha1($post_current_password);
		
		//Si le mdp associé à l'id de l'utilisateur est le même que celui qu'il rentre, alors on peut le changer
		if (($password_user == $encrypted_current_password)) {
		
			//On crypte le nouveau mdp de l'utilisateur
			$encrypted_new_password = sha1($post_new_password);
			
			//On prépare notre requête : mettre à jour le mdp de l'utilisateur avec le nouveau qu'il a entré
			$update_password = $connexion->prepare("UPDATE Users SET password=:password WHERE user_id=:user_id");
			//On lie nos variables
			$update_password->bindValue('password', $encrypted_new_password, PDO::PARAM_STR);
			$update_password->bindValue('user_id', $id_user, PDO::PARAM_INT);
			//On exécute
			$update_password->execute();
			//Clore la requête préparée
			$update_password->closeCursor();
			$update_password = NULL;
			
			/*//On prépare notre requête : on met à jour nos variables de session avec ce qu'on vient de modifier
			$update_session = $connexion->prepare("SELECT password FROM Users WHERE user_id = :user_id");
			//On lie nos variables
			$update_session->bindValue('user_id', $id_user, PDO::PARAM_INT);
			//On exécute
			$update_session->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result_session = $update_session->fetch();
			//Clore la requête préparée
			$update_session->closeCursor();
			$update_session = NULL;*/
			
			//On stocke le nouveau mdp dans notre variable de session
			$_SESSION['password_user_logged'] = $encrypted_new_password;
			//Et on met à jour notre cookie
			setcookie('hdr_password', $post_new_password, time() + 365*12*3600, '/HDRDaily', null, false, true);
			
			
			//On renvoit success via json
			$array['success']='Success';
		}
		//Sinon c'est que ce n'est pas le bon mdp, donc erreur
		else {
			$array['error_bad_password']='Erreur_Password';
		}
	}
	
	echo json_encode($array);
?>