<?php
	session_start();
	
	//On récupère nos valeurs POST pour plus de clarté
	$post_pseudo = $_POST["login_pseudo"];
	$post_password = $_POST["login_password"];
	$post_checked = $_POST["check"];
	
	setcookie('screwy_pseudo', '', time() + 365*12*3600, '/', null, false, true);
	setcookie('screwy_password', '', time() + 365*12*3600, '/', null, false, true);
	
	$array = array('error_empty_pseudo'=>'',
					'error_empty_password'=>'',
					'error_pseudo'=>'',
					'error_password'=>'',
					'success'=>''
			);
	
	//On lance notre vérification "côté client"
	//Si un des champs est vide
	if ((empty($post_pseudo)) || (empty($post_password))) {

		//Si le pseudo est vide
		if (empty($post_pseudo)){
			$array['error_empty_pseudo']='Pseudo_Vide';
		}
		
		//Si le password est vide
		if (empty($post_password)){
			$array['error_empty_password']='Password_Vide';
		}

	}
	//Sinon, on fait notre vérification côté bdd
	else {
		//Connexion à la bdd
		include("connect.php");
		
		//On prépare notre requête		
		$select_pseudo_password = $connexion->prepare("SELECT COUNT(*) pseudo FROM Joueur WHERE pseudo = :pseudo");
		//On lie nos variables
		$select_pseudo_password->bindValue('pseudo', $post_pseudo, PDO::PARAM_STR);
		//On exécute
		$select_pseudo_password->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$result = $select_pseudo_password->fetch();
		//Clore la requête préparée
		$select_pseudo_password->closeCursor();
		$select_pseudo_password = NULL;
		
		//On teste si c'est égal à 0, alors le pseudo n'existe pas et on obtient une erreur
		if ($result['pseudo'] == 0) {
			$array['error_pseudo']='Erreur_Pseudo';
		}
		//Si c'est égal à 1, alors le pseudo existe et on vérifie que le mdp renseigné correspond au pseudo
		if ($result['pseudo'] == 1) {
			//On crypte le mdp envoyé par le client
			$encrypted_password = sha1($post_password);
			
			//On prépare notre requête
			$check_user_password = $connexion->prepare("SELECT mdp FROM Joueur WHERE pseudo = :pseudo");
			//On lie nos variables
			$check_user_password->bindValue('pseudo', $post_pseudo, PDO::PARAM_STR);
			//On exécute
			$check_user_password->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result = $check_user_password->fetch();
			//Clore la requête préparée
			$check_user_password->closeCursor();
			$check_user_password = NULL;
			
			//On compare le mdp retourné avec celui crypté
			if ($result['mdp'] != $encrypted_password){
				$array['error_password']='Erreur_Password';
			}
			//Si c'est le même, on connecte l'utilisateur, c'est-à-dire on créé des variables de session
			else{
				//On a des variables de session que l'on peut utiliser partout sur le site (ne pas oublier de mettre session_start() sur chaque page)
				//On prépare notre requête
				$the_user_logged = $connexion->prepare("SELECT * FROM Joueur WHERE pseudo = :pseudo AND mdp = :password");
				//On lie nos variables
				$the_user_logged->bindValue('pseudo', $post_pseudo, PDO::PARAM_STR);
				$the_user_logged->bindValue('password', $encrypted_password, PDO::PARAM_STR);
				//On exécute
				$the_user_logged->execute();
				//On récupère le résultat dans un tableau $result['clé']=valeur
				$result = $the_user_logged->fetch();
				//Clore la requête préparée
				$the_user_logged->closeCursor();
				$the_user_logged = NULL;
				
				//On stocke tout dans nos variables de session
				$_SESSION['islogged'] = true;
				$_SESSION['id_user_logged'] = $result['id_joueur'];
				$_SESSION['pseudo_user_logged'] = $result['pseudo'];
				$_SESSION['password_user_logged'] = $result['mdp'];
				$_SESSION['email_user_logged'] = $result['email'];
				$_SESSION['date_inscription_user_logged'] = $result['date_inscription'];
				$_SESSION['avatar_user_logged'] = $result['avatar'];
				$_SESSION['date_last_connexion_user_logged'] = $result['date_last_connexion'];
				$_SESSION['nombre_parties_user_logged'] = $result['nombre_parties'];
				$_SESSION['nombre_points_user_logged'] = $result['nombre_points'];
				$_SESSION['id_salon_user_logged'] = $result['id_salon'];
				$_SESSION['cle_salon_user_logged'] = $result['cle_salon'];
				
				//Si remember est coché, on créé 2 cookies valables 6 mois
				if ($post_checked == 1){
					setcookie('screwy_pseudo', $post_pseudo, time() + 365*12*3600, '/', null, false, true);
					//On ne stocke pas le mdp crypté, sinon la vérification du mdp plus haute échoue lors d'une autre tentative de connexion
					setcookie('screwy_password', $post_password, time() + 365*12*3600, '/', null, false, true);
				}
				//Sinon efface les cookies s'ils existent déjà
				else {
					if (isset($_COOKIE['screwy_pseudo']) && isset($_COOKIE['screwy_password'])) {
						// Utilisation de la date courante, moins une heure
						setcookie ('screwy_pseudo', '', time() - 3600, '/', null, false, true);
						setcookie ('screwy_password', '', time() - 3600, '/', null, false, true);
					}
				}
				
				$array['success']='Success';
			}
		}
	}
	
	echo json_encode($array);
?>